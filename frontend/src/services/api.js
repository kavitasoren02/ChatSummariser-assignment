import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Conversation APIs
export const conversationApi = {
  getAll: () => apiClient.get("/conversations"),
  getById: (id) => apiClient.get(`/conversations/${id}`),
  create: (title) => apiClient.post("/conversations", { title }),
  end: (id) => apiClient.post(`/conversations/${id}/end`),
  getMessages: (id) => apiClient.get(`/conversations/${id}/messages`),
  sendMessage: (id, content) =>
    apiClient.post(`/conversations/${id}/messages`, {
      content,
      sender: "user",
    }),
}

// Query APIs
export const queryApi = {
  queryConversations: (query, conversationIds = null) =>
    apiClient.post("/query", {
      query,
      conversation_ids: conversationIds,
    }),
}

export default apiClient
