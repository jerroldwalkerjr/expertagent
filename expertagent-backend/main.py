# main.py
from typing import List
import re

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from ai_service import client
from database import Base, SessionLocal, engine, ensure_learning_resource_columns
from models import LearningResource, Student, DocumentFolder, Document
from schemas import (
    ChatRequest,
    ChatResponse,
    DocumentFolderCreate,
    DocumentFolderOut,
    DocumentFolderUpdate,
    DocumentCreate,
    DocumentUpdate,
    DocumentOut,
)

app = FastAPI()


Base.metadata.create_all(bind=engine)
ensure_learning_resource_columns()


def ensure_default_document_folder():
    db = SessionLocal()
    try:
        existing = (
            db.query(DocumentFolder)
            .filter(DocumentFolder.name == "General")
            .first()
        )
        if not existing:
            db.add(DocumentFolder(name="General"))
            db.commit()
    finally:
        db.close()


ensure_default_document_folder()


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


def get_default_folder_id(db: Session) -> int:
    folder = (
        db.query(DocumentFolder).filter(DocumentFolder.name == "General").first()
    )
    if not folder:
        folder = DocumentFolder(name="General")
        db.add(folder)
        db.commit()
        db.refresh(folder)
    return folder.id


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


@app.get("/document-folders", response_model=List[DocumentFolderOut])
def list_document_folders(db: Session = Depends(get_db)):
    return db.query(DocumentFolder).order_by(DocumentFolder.id.asc()).all()


@app.post("/document-folders", response_model=DocumentFolderOut)
def create_document_folder(
    payload: DocumentFolderCreate, db: Session = Depends(get_db)
):
    existing = (
        db.query(DocumentFolder)
        .filter(DocumentFolder.name == payload.name)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Folder name already exists.")
    folder = DocumentFolder(name=payload.name)
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder


@app.put("/document-folders/{folder_id}", response_model=DocumentFolderOut)
def update_document_folder(
    folder_id: int, payload: DocumentFolderUpdate, db: Session = Depends(get_db)
):
    folder = db.query(DocumentFolder).filter(DocumentFolder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found.")
    if folder.name == "General":
        raise HTTPException(status_code=400, detail="Cannot rename default folder.")
    folder.name = payload.name
    db.commit()
    db.refresh(folder)
    return folder


@app.delete("/document-folders/{folder_id}")
def delete_document_folder(folder_id: int, db: Session = Depends(get_db)):
    folder = db.query(DocumentFolder).filter(DocumentFolder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found.")
    if folder.name == "General":
        raise HTTPException(status_code=400, detail="Cannot delete default folder.")
    default_folder_id = get_default_folder_id(db)
    db.query(Document).filter(Document.folder_id == folder_id).update(
        {Document.folder_id: default_folder_id}
    )
    db.delete(folder)
    db.commit()
    return {"status": "ok"}


@app.get("/documents", response_model=List[DocumentOut])
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.id.desc()).all()


@app.post("/documents", response_model=DocumentOut)
def create_document(payload: DocumentCreate, db: Session = Depends(get_db)):
    folder_id = payload.folder_id or get_default_folder_id(db)
    folder = db.query(DocumentFolder).filter(DocumentFolder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=400, detail="Folder not found.")
    document = Document(
        name=payload.name,
        status=payload.status or "Uploaded",
        updated=payload.updated or "Just now",
        folder_id=folder_id,
        data_url=payload.data_url,
        mime_type=payload.mime_type,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@app.put("/documents/{document_id}", response_model=DocumentOut)
def update_document(
    document_id: int, payload: DocumentUpdate, db: Session = Depends(get_db)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")
    if payload.folder_id is not None:
        folder = (
            db.query(DocumentFolder)
            .filter(DocumentFolder.id == payload.folder_id)
            .first()
        )
        if not folder:
            raise HTTPException(status_code=400, detail="Folder not found.")
        document.folder_id = payload.folder_id
    if payload.name is not None:
        document.name = payload.name
    if payload.status is not None:
        document.status = payload.status
    if payload.updated is not None:
        document.updated = payload.updated
    if payload.data_url is not None:
        document.data_url = payload.data_url
    if payload.mime_type is not None:
        document.mime_type = payload.mime_type
    db.commit()
    db.refresh(document)
    return document


@app.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")
    db.delete(document)
    db.commit()
    return {"status": "ok"}
