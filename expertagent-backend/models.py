# models.py
from sqlalchemy import Column, Integer, String

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
