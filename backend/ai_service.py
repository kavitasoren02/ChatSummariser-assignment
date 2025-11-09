import google.generativeai as genai
from config import settings
from typing import List

class AIService:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.5-pro')
    
    async def get_chat_response(self, messages: List[dict]) -> str:
        """Get AI response for chat"""
        # Format messages for Gemini
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                "role": "user" if msg["role"] == "user" else "model",
                "parts": msg["content"]
            })
        
        try:
            chat = self.model.start_chat(history=formatted_messages[:-1] if len(formatted_messages) > 1 else [])
            response = chat.send_message(formatted_messages[-1]["parts"])
            return response.text
        except Exception as e:
            return f"Error getting response: {str(e)}"
    
    def generate_summary(self, conversation_text: str) -> str:
        """Generate AI summary of conversation"""
        prompt = f"""Please provide a concise summary of the following conversation. 
        Include main topics, key points, and any important decisions or actions discussed.
        
        Conversation:
        {conversation_text}
        
        Summary:"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating summary: {str(e)}"
    
    async def query_conversations(self, query: str, context: str) -> str:
        """Query AI about past conversations"""
        prompt = f"""Based on the following conversation history, please answer this query: {query}
        
        Conversation History:
        {context}
        
        Please provide a relevant answer based on the conversation history."""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error querying conversations: {str(e)}"
