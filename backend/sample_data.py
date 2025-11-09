"""Script to populate database with sample conversations for testing"""
from database import SessionLocal
from models import Conversation, Message
from datetime import datetime, timedelta

def seed_sample_data():
    db = SessionLocal()
    
    # Clear existing data
    db.query(Message).delete()
    db.query(Conversation).delete()
    
    # Sample conversations
    conversations_data = [
        {
            "title": "Planning a Trip to Japan",
            "status": "ended",
            "messages": [
                {"content": "I want to plan a trip to Japan. What should I visit?", "sender": "user"},
                {"content": "Japan is amazing! I'd recommend visiting Tokyo, Kyoto, and Osaka. Tokyo has vibrant culture and technology, Kyoto has temples and gardens, and Osaka is known for food. What's your budget and timeframe?", "sender": "ai"},
                {"content": "I have 2 weeks and a budget of $3000. What's the best time to visit?", "sender": "user"},
                {"content": "Spring (March-May) and Fall (September-November) are the best times. Spring has cherry blossoms and mild weather, while fall has comfortable temperatures and beautiful foliage. I'd suggest: Tokyo (4 days) -> Kyoto (3 days) -> Osaka (2 days) -> Mount Fuji area (2 days) -> back to Tokyo (1 day)", "sender": "ai"},
            ],
            "summary": "User discussed a 2-week trip to Japan with a $3000 budget. Recommended visiting Tokyo, Kyoto, and Osaka during spring or fall seasons. Suggested itinerary includes exploring temples, cultural sites, food scenes, and Mount Fuji."
        },
        {
            "title": "Learning Python for Data Science",
            "status": "ended",
            "messages": [
                {"content": "What are the best resources to learn Python for data science?", "sender": "user"},
                {"content": "Great question! Here are the best resources: 1) Free: Codecademy, freeCodeCamp, DataCamp free tier 2) Paid: DataCamp, Coursera specializations, Udemy courses 3) Libraries to learn: NumPy, Pandas, Matplotlib, Scikit-learn. Start with Python basics, then move to data structures.", "sender": "ai"},
                {"content": "How long does it typically take to become proficient?", "sender": "user"},
                {"content": "Timeline: Python basics (2-4 weeks) -> Data structures and OOP (2-3 weeks) -> Pandas and NumPy (2-3 weeks) -> Visualization (1-2 weeks) -> Machine Learning (4-6 weeks). Total: 2-4 months for solid foundation. Practice daily!", "sender": "ai"},
            ],
            "summary": "Discussed learning Python for data science. Covered resource recommendations (free and paid), essential libraries (NumPy, Pandas, Matplotlib, Scikit-learn), and typical learning timeline of 2-4 months from basics to ML."
        },
        {
            "title": "Web Development Best Practices",
            "status": "active",
            "messages": [
                {"content": "What are the current best practices for web development in 2024?", "sender": "user"},
                {"content": "Key best practices in 2024: 1) Frontend: Use modern frameworks (React, Vue, Svelte), TypeScript for type safety, Tailwind for styling 2) Backend: API-first design, microservices, containerization with Docker 3) Security: HTTPS, environment variables, input validation 4) Performance: Code splitting, lazy loading, CDN usage", "sender": "ai"},
            ],
            "summary": None
        }
    ]
    
    # Add conversations to database
    for conv_data in conversations_data:
        conversation = Conversation(
            title=conv_data["title"],
            status=conv_data["status"],
            summary=conv_data["summary"],
            created_at=datetime.utcnow() - timedelta(days=len(conversations_data)*2),
            ended_at=datetime.utcnow() - timedelta(days=len(conversations_data)*1) if conv_data["status"] == "ended" else None
        )
        db.add(conversation)
        db.flush()
        
        # Add messages
        for i, msg_data in enumerate(conv_data["messages"]):
            message = Message(
                conversation_id=conversation.id,
                content=msg_data["content"],
                sender=msg_data["sender"],
                created_at=datetime.utcnow() - timedelta(days=len(conversations_data)*2 - i*100)
            )
            db.add(message)
    
    db.commit()
    print("Sample data seeded successfully!")

if __name__ == "__main__":
    seed_sample_data()
