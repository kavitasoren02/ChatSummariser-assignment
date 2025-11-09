import { useState } from "react"
import { queryApi } from "../services/api"
import { Sparkles, Search, ArrowLeft } from "lucide-react"

export default function IntelligencePage({ onBack }) {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleQuery = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    try {
      const result = await queryApi.queryConversations(query)
      setResponse(result.data)
    } catch (err) {
      setError(err.message || "Failed to query conversations")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-100 rounded-full transition-all duration-200"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={26} className="text-blue-600 animate-pulse" />
              Conversation Intelligence
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Ask AI insightful questions about your past chats ✨
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-6">
          {/* Query Form */}
          <form onSubmit={handleQuery} className="mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💭 Ask a question about your conversations
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'What did I discuss about project deadlines?' or 'Summarize my technical chats'"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
                rows={4}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:scale-105 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={18} />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">
                  Analyzing your conversations...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6 shadow-sm">
              <p className="font-semibold">⚠️ Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Response Section */}
          {response && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  🧠 AI Response
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {response.response}
                  </p>
                </div>
                {response.searched_conversations > 0 && (
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                    🔍 Searched {response.searched_conversations} conversation
                    {response.searched_conversations !== 1 ? "s" : ""} to answer
                    your question
                  </p>
                )}
              </div>

              {/* Suggested Queries */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">
                  💡 Suggested Questions
                </h3>
                <div className="grid gap-2">
                  {[
                    "What were the main topics discussed?",
                    "Can you extract key decisions?",
                    "What are the action items?",
                    "Summarize all completed tasks",
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(suggestion)
                        setResponse(null)
                      }}
                      className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-sm text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!response && !loading && !error && (
            <div className="text-center py-16 text-gray-500">
              <Sparkles
                size={50}
                className="mx-auto mb-4 text-blue-500 animate-pulse"
              />
              <p className="text-lg font-medium">
                Start exploring your chat intelligence ✨
              </p>
              <p className="text-sm mt-2 text-gray-400">
                Ask a question to gain insights from your previous conversations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
