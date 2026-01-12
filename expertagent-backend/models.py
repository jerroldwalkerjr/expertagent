# models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey

from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    progress = Column(String, default="Not started")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    topic = Column(String)
    content = Column(String)
    relevance_tag = Column(Integer, default=0)
    difficulty = Column(String)
    url = Column(String)


class DocumentFolder(Base):
    __tablename__ = "document_folders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="Uploaded")
    updated = Column(String, default="Just now")
    folder_id = Column(Integer, ForeignKey("document_folders.id"), nullable=False)
    data_url = Column(Text, nullable=True)
    mime_type = Column(String, nullable=True)
