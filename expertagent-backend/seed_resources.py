from database import Base, SessionLocal, engine, ensure_learning_resource_columns
from models import LearningResource


Base.metadata.create_all(bind=engine)
ensure_learning_resource_columns()


def seed():
    db = SessionLocal()
    try:
        sample_resources = [
            LearningResource(
                title="Binary Search Tutorial",
                topic="binary search",
                content="...",
                relevance_tag=2,
                difficulty="beginner",
                url="https://example.com/binary-search",
            ),
            LearningResource(
                title="Pointer Introduction",
                topic="pointers",
                content="...",
                relevance_tag=1,
                difficulty="intermediate",
                url="https://example.com/pointers",
            ),
        ]

        db.add_all(sample_resources)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
