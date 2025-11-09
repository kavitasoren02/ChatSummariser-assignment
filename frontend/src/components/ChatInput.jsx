import { useState } from "react"
import { Send } from "lucide-react"

export default function ChatInput({ onSendMessage, disabled = false }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || disabled || isLoading) return
    setIsLoading(true)
    try {
      setTimeout(() => setInput(""), 200)
      await onSendMessage(input)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-full p-2 sm:p-3 md:p-4 bg-white border-t border-gray-200"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled || isLoading}
        className="flex-1 w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={disabled || isLoading || !input.trim()}
        className="flex items-center justify-center py-1 px-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={30} />
      </button>
    </form>
  )
}
