from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class MessageCreate(BaseModel):
    content: str
    sender: str

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    content: str
    sender: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: str

class ConversationResponse(BaseModel):
    id: int
    title: str
    status: str
    summary: Optional[str]
    created_at: datetime
    ended_at: Optional[datetime]
    message_count: int

    class Config:
        from_attributes = True

class ConversationDetail(ConversationResponse):
    messages: List[MessageResponse]

class QueryRequest(BaseModel):
    query: str
    conversation_ids: Optional[List[int]] = None
