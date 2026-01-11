# database.py
from sqlalchemy import create_engine, text
from sqlalchemy import inspect
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./expertagent.db"

# DATABASE_URL = "postgresql://username:password@localhost/expertagent"
# when ready to switch to postgre, use this^:

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


def ensure_learning_resource_columns():
    """
    Light-weight migration helper to add new columns when missing.
    """
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if "learning_resources" not in tables:
        return

    columns = {col["name"] for col in inspector.get_columns("learning_resources")}

    with engine.begin() as conn:
        if "relevance_tag" not in columns:
            conn.execute(
                text(
                    "ALTER TABLE learning_resources "
                    "ADD COLUMN relevance_tag INTEGER DEFAULT 0"
                )
            )
        if "difficulty" not in columns:
            conn.execute(
                text("ALTER TABLE learning_resources ADD COLUMN difficulty VARCHAR")
            )
        if "url" not in columns:
            conn.execute(text("ALTER TABLE learning_resources ADD COLUMN url VARCHAR"))
