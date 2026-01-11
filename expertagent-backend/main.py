# main.py
from typing import List
import re

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from ai_service import client
from database import Base, SessionLocal, engine, ensure_learning_resource_columns
from models import LearningResource, Student
from schemas import ChatRequest, ChatResponse

app = FastAPI()


Base.metadata.create_all(bind=engine)
ensure_learning_resource_columns()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def detect_resource_trigger(ai_output: str) -> List[str]:
    """
    If the model flags that resources are needed,
    extract keywords located after the marker.
    Example AI response:
    '... RESOURCE_REQUESTED: arrays recursion pointers'
    """
    match = re.search(r"RESOURCE_REQUESTED:(.*)", ai_output, re.DOTALL)
    if not match:
        return []

    segment = match.group(1).strip()
    return segment.split()


def rank_resources(resources, keywords: List[str]):
    scored = []
    for r in resources:
        score = 0
        topic_text = (r.topic or "").lower()
        content_text = (r.content or "").lower()
        for k in keywords:
            keyword = k.lower()
            if keyword in topic_text or keyword in content_text:
                score += 1
        score += r.relevance_tag if hasattr(r, "relevance_tag") else 0
        scored.append((score, r))

    return sorted(scored, key=lambda x: x[0], reverse=True)


@app.get("/")
def read_root():
    return {"message": "Welcome to ExpertAgent API!"}


@app.get("/students")
def list_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return students


@app.get("/student/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        return {"error": "Student not found"}

    return student


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)):
    ai_resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are ExpertAgent."},
            {"role": "user", "content": req.message},
        ],
    )

    raw_ai = ai_resp.choices[0].message.content

    keywords = detect_resource_trigger(raw_ai)

    resources_used: List[str] = []
    final_reply = raw_ai
    if keywords:
        query = db.query(LearningResource).all()
        ranked = rank_resources(query, keywords)

        final_reply = raw_ai.split("RESOURCE_REQUESTED:")[0].strip()
        # include difficulty/url inline for the UI
        for (_, res) in ranked[:3]:
            label_parts = [res.title]
            details = []
            if res.difficulty:
                details.append(res.difficulty)
            if res.url:
                details.append(res.url)
            if details:
                label_parts.append(f"({' | '.join(details)})")
            resources_used.append(" ".join(label_parts))

    return ChatResponse(reply=final_reply, resources_used=resources_used)
