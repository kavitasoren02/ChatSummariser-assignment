import { useState, useEffect, useRef } from "react"
import { useConversation } from "../hooks/useConversation"
import MessageBubble from "../components/MessageBubble"
import ChatInput from "../components/ChatInput"
import { Plus, LogOut, ArrowLeft } from "lucide-react"

export default function ChatPage({ conversationId, onBack, onStartNew }) {
  const {
    conversation,
    messages,
    loading,
    error,
    sendMessage,
    endConversation,
    waitingAI,
  } = useConversation(conversationId)
  const [isEnding, setIsEnding] = useState(false)
  const messagesEndRef = useRef(null)

  const handleEndConversation = async () => {
    if (window.confirm("Are you sure you want to end this conversation?")) {
      try {
        setIsEnding(true)
        await endConversation()
        alert("Conversation ended and summary generated!")
        onBack()
      } catch {
        alert("Error ending conversation")
      } finally {
        setIsEnding(false)
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, waitingAI])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-100 rounded-full transition-all"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-xs">
              {conversation?.title || "Loading..."}
            </h1>
            <p className="text-xs text-gray-500">
              Status: {conversation?.status || "loading"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onStartNew}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-sm shadow-sm"
          >
            <Plus size={16} /> New Chat
          </button>
          {conversation?.status === "active" && (
            <button
              onClick={handleEndConversation}
              disabled={isEnding}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform shadow-sm disabled:opacity-50 text-sm"
            >
              <LogOut size={16} />{" "}
              <span className="hidden sm:inline">End Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm sm:text-base font-medium">
                Loading messages...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p className="font-medium text-sm sm:text-base">Error: {error}</p>
              <button
                onClick={onBack}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-sm text-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-sm sm:text-base font-medium">
                No messages yet — start the conversation ✨
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* AI Thinking / Typing Indicator */}
            {waitingAI && (
              <div className="flex items-center space-x-2 bg-blue-100/70 text-blue-700 rounded-2xl py-2 px-4 w-fit ml-3 animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                </div>
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-inner sticky bottom-0">
        <ChatInput
          onSendMessage={sendMessage}
          disabled={!conversation || conversation.status !== "active"}
        />
      </div>
    </div>
  )
}
