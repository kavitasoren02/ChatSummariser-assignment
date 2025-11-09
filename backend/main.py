from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import Conversation, Message
from schemas import (
    ConversationCreate, ConversationResponse, ConversationDetail,
    MessageCreate, MessageResponse, QueryRequest
)
from datetime import datetime
from ai_service import AIService
from sqlalchemy import func
from sqlalchemy.orm import aliased

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Chat Portal API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Service
ai_service = AIService()

# ==================== CONVERSATION ENDPOINTS ====================

@app.post("/api/conversations", response_model=ConversationResponse)
def create_conversation(conversation: ConversationCreate, db: Session = Depends(get_db)):
    """Create a new conversation"""
    db_conversation = Conversation(title=conversation.title)
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return {
        "id": db_conversation.id,
        "title": db_conversation.title,
        "status": db_conversation.status,
        "summary": db_conversation.summary,
        "created_at": db_conversation.created_at,
        "ended_at": db_conversation.ended_at,
        "message_count": 0, 
    }

@app.get("/api/conversations", response_model=list[ConversationResponse])
def get_all_conversations(db: Session = Depends(get_db)):
    """Get all conversations with message count"""
    results = (
        db.query(
            Conversation,
            func.count(Message.id).label("message_count")
        )
        .outerjoin(Message)
        .group_by(Conversation.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    return [
        {
            "id": conv.id,
            "title": conv.title,
            "status": conv.status,
            "summary": conv.summary,
            "created_at": conv.created_at,
            "ended_at": conv.ended_at,
            "message_count": message_count,
        }
        for conv, message_count in results
    ]

@app.get("/api/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation_detail(conversation_id: int, db: Session = Depends(get_db)):
    """Get a specific conversation with full message history and message count"""
    # Get conversation with messages
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Count messages for this conversation
    message_count = (
        db.query(func.count(Message.id))
        .filter(Message.conversation_id == conversation_id)
        .scalar()
    )

    # Attach count for response
    return {
        "id": conversation.id,
        "title": conversation.title,
        "status": conversation.status,
        "summary": conversation.summary,
        "created_at": conversation.created_at,
        "ended_at": conversation.ended_at,
        "messages": conversation.messages,
        "message_count": message_count,
    }

# ==================== MESSAGE ENDPOINTS ====================

@app.post("/api/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    # Verify conversation exists
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation.status != "active":
        raise HTTPException(status_code=400, detail="Conversation is not active")
    
    # Save user message
    user_msg = Message(conversation_id=conversation_id, content=message.content, sender="user")
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)
    
    # Get AI response
    all_messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    messages_for_ai = [{"role": m.sender, "content": m.content} for m in all_messages]
    
    ai_response = await ai_service.get_chat_response(messages_for_ai)
    
    # Save AI message
    ai_msg = Message(conversation_id=conversation_id, content=ai_response, sender="ai")
    db.add(ai_msg)
    db.commit()
    
    return ai_msg

@app.get("/api/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_messages(conversation_id: int, db: Session = Depends(get_db)):
    """Get all messages for a conversation"""
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    return messages

# ==================== CONVERSATION CONTROL ENDPOINTS ====================

@app.post("/api/conversations/{conversation_id}/end")
def end_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """End conversation and generate summary"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation.status != "active":
        raise HTTPException(status_code=400, detail="Conversation is already ended")
    
    # Get all messages
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    messages_text = "\n".join([f"{m.sender}: {m.content}" for m in messages])
    
    # Generate summary
    summary = ai_service.generate_summary(messages_text)
    
    conversation.status = "ended"
    conversation.ended_at = datetime.utcnow()
    conversation.summary = summary
    db.commit()
    db.refresh(conversation)
    
    return {"status": "ended", "summary": summary}

# ==================== INTELLIGENT QUERY ENDPOINTS ====================

@app.post("/api/query")
async def query_conversations(query_request: QueryRequest, db: Session = Depends(get_db)):
    """Query AI about past conversations"""
    # Get conversations to search
    if query_request.conversation_ids:
        conversations = db.query(Conversation).filter(
            Conversation.id.in_(query_request.conversation_ids)
        ).all()
    else:
        conversations = db.query(Conversation).filter(Conversation.status == "ended").all()
    
    # Build context from conversations
    context = ""
    for conv in conversations:
        if conv.summary:
            context += f"\n\nConversation: {conv.title}\nSummary: {conv.summary}\n"
            for msg in conv.messages:
                context += f"{msg.sender}: {msg.content}\n"
    
    # Query AI with context
    response = await ai_service.query_conversations(query_request.query, context)
    
    return {"response": response, "searched_conversations": len(conversations)}

# ==================== HEALTH CHECK ====================

@app.get("/health")
def health_check():
    return {"status": "ok"}
