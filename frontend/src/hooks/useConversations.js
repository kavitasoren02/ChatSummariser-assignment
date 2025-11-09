
import { useState, useEffect } from "react"
import { conversationApi } from "../services/api"

export const useConversations = () => {
  const [conversations, setConversations] = useState([])
  const [filteredConversations, setFilteredConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await conversationApi.getAll()
      setConversations(response.data)
      setFilteredConversations(response.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (title) => {
    try {
      const response = await conversationApi.create(title)
      setConversations([response.data, ...conversations])
      setFilteredConversations([response.data, ...filteredConversations])
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    const filtered = conversations.filter((conv) => conv.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredConversations(filtered)
  }, [searchTerm, conversations])

  return {
    conversations: filteredConversations,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createConversation,
    fetchConversations,
  }
}
