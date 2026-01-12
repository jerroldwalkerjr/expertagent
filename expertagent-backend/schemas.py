# schemas.py
from typing import List, Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatResponse(BaseModel):
    reply: str
    resources_used: List[str]


class DocumentFolderBase(BaseModel):
    name: str


class DocumentFolderCreate(DocumentFolderBase):
    pass


class DocumentFolderUpdate(BaseModel):
    name: str


class DocumentFolderOut(DocumentFolderBase):
    id: int

    class Config:
        orm_mode = True


class DocumentBase(BaseModel):
    name: str
    status: Optional[str] = None
    updated: Optional[str] = None
    folder_id: Optional[int] = None
    data_url: Optional[str] = None
    mime_type: Optional[str] = None


class DocumentCreate(DocumentBase):
    name: str


class DocumentUpdate(DocumentBase):
    pass


class DocumentOut(DocumentBase):
    id: int
    folder_id: int

    class Config:
        orm_mode = True
