import { useState } from "react"
import { useConversations } from "../hooks/useConversations"
import ConversationCard from "../components/ConversationCard"
import { Search, Plus, Sparkles } from "lucide-react"

export default function DashboardPage({ onSelectConversation, onGoToIntelligence }) {
  const { conversations, loading, error, searchTerm, setSearchTerm, createConversation } = useConversations()
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const handleCreateConversation = async () => {
    if (!newTitle.trim()) return

    try {
      setIsCreating(true)
      const conversation = await createConversation(newTitle)
      onSelectConversation(conversation.id)
      setNewTitle("")
    } catch (error) {
      alert("Error creating conversation: " + error.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Chat Portal 💬</h1>
              <p className="text-gray-500 mt-1 text-sm">Manage your AI conversations smartly</p>
            </div>
            <button
              onClick={onGoToIntelligence}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              <Sparkles size={18} />
              <span className="hidden sm:inline font-medium">Intelligence</span>
            </button>
          </div>

          {/* New Conversation Section */}
          <div className="flex gap-2 items-center mb-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateConversation()}
              placeholder="✨ Start a new conversation..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleCreateConversation}
              disabled={isCreating || !newTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              <span className="hidden sm:inline font-medium">Start</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your conversations..."
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Conversations List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading conversations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p className="font-medium">Error: {error}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-semibold">No conversations yet</p>
              <p className="text-sm mt-2">Create one to get started 🚀</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className="cursor-pointer transform hover:scale-[1.02] transition-transform"
                >
                  <ConversationCard conversation={conversation} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
