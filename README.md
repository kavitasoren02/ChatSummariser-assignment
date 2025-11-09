# AI Chat Portal - Full Stack Application

A comprehensive full-stack application for intelligent chat management with AI integration. This project demonstrates real-time chat, conversation storage, AI-powered summarization, and intelligent conversation querying.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI Integration**: Google Gemini API
- **Web Server**: Uvicorn

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Features

### Core Features
- **Real-time Chat**: Seamless conversation with AI-powered responses
- **Conversation Management**: Create, store, and manage multiple conversations
- **AI Summarization**: Automatic summary generation when conversations end
- **Intelligent Querying**: Ask questions about past conversations using AI
- **Conversation Dashboard**: View and search all conversations
- **Message History**: Complete conversation history with timestamps

### UI Features
- Clean, modern chat interface similar to ChatGPT
- Responsive design optimized for mobile and desktop
- Real-time message updates
- Search functionality for conversations
- Status indicators (active/ended)
- Loading states and error handling

## Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic request/response schemas
│   ├── database.py            # Database configuration
│   ├── config.py              # Configuration management
│   ├── ai_service.py          # Gemini API integration
│   ├── init_db.py             # Database initialization
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── README.md              # Backend setup guide
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── ChatPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── IntelligencePage.jsx
│   │   ├── components/        # Reusable UI components
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── ConversationCard.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useConversation.js
│   │   │   └── useConversations.js
│   │   ├── services/          # API service
│   │   │   └── api.js
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Tailwind CSS
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── README.md              # Frontend setup guide
│
└── README.md                  # This file
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL database
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database URL and Gemini API key
```

5. **Initialize database**
```bash
python init_db.py
```

6. **Run development server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs will be available at http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Ensure VITE_API_URL points to your backend
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

## API Documentation

### Conversation Endpoints

#### Create Conversation
```
POST /api/conversations
{
  "title": "Planning a trip"
}
```

#### Get All Conversations
```
GET /api/conversations
```

#### Get Conversation Details
```
GET /api/conversations/{id}
```

#### Send Message
```
POST /api/conversations/{id}/messages
{
  "content": "User message",
  "sender": "user"
}
```

#### End Conversation
```
POST /api/conversations/{id}/end
```

#### Query Conversations
```
POST /api/query
{
  "query": "What did we discuss?",
  "conversation_ids": [1, 2, 3]
}
```

## Database Schema

### Conversations Table
- `id`: Primary key
- `title`: Conversation title
- `status`: 'active' or 'ended'
- `summary`: AI-generated summary
- `created_at`: Timestamp
- `ended_at`: Timestamp when conversation ended

### Messages Table
- `id`: Primary key
- `conversation_id`: Foreign key to conversations
- `content`: Message text
- `sender`: 'user' or 'ai'
- `created_at`: Timestamp

## Key Implementation Details

### AI Integration
- Uses Google Gemini API for chat responses
- Generates intelligent summaries of conversations
- Analyzes and answers questions about past conversations
- Maintains conversation context for coherent responses

### Frontend Patterns
- Custom hooks for data fetching and state management
- Component composition for reusability
- Tailwind CSS for styling (no custom classes)
- Environment variables for configuration

### Backend Patterns
- RESTful API architecture
- Pydantic models for request validation
- SQLAlchemy ORM for database operations
- Service layer for AI operations

## Bonus Features Implementation Ideas

- Real-time WebSocket support using FastAPI WebSockets
- Conversation export (PDF, JSON, Markdown)
- Voice input/output with Web Speech API
- Conversation threading and branching
- Message reactions and bookmarking
- Analytics dashboard with conversation trends
- Dark mode toggle
- Conversation sharing with unique links

## Error Handling

The application includes comprehensive error handling:
- Input validation using Pydantic
- Database operation error handling
- API error responses with appropriate status codes
- Frontend error states and user feedback
- Loading states for async operations

## Performance Considerations

- Message pagination for large conversations
- Efficient database queries with proper indexing
- Frontend component memoization
- Lazy loading for conversation lists
- API response caching where applicable

## Testing

To test the application:

1. Create a conversation
2. Send messages and receive AI responses
3. End conversation to generate summary
4. Query intelligence page with questions about conversations
5. Search conversations by title
6. Verify all UI elements are responsive


