import { useState, useEffect } from "react"
import { conversationApi } from "../services/api"

export const useConversation = (conversationId) => {
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [waitingAI, setWaitingAI] = useState(false)
  const [error, setError] = useState(null)

  const fetchConversation = async () => {
    setLoading(true)
    try {
      const response = await conversationApi.getById(conversationId)
      setConversation(response.data)
      setMessages(response.data.messages || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content) => {
    if (!content.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: "user",
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    setWaitingAI(true)
    try {
      const response = await conversationApi.sendMessage(conversationId, content)

      const aiMessage = {
        id: response.data.id || Date.now() + 1,
        sender: "ai",
        content: response.data.content,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])

      setError(null)
      return response.data
    } catch (err) {
      setError(err.message)
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
      throw err
    } finally {
      setWaitingAI(false)
    }
  }

  const endConversation = async () => {
    try {
      const response = await conversationApi.end(conversationId)
      setConversation({
        ...conversation,
        status: "ended",
        summary: response.data.summary,
      })
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    if (conversationId) {
      fetchConversation()
    }
  }, [conversationId])

  return {
    conversation,
    messages,
    loading,
    waitingAI,
    error,
    sendMessage,
    endConversation,
    fetchConversation,
  }
}
