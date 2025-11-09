
import { MessageSquare, Clock, CheckCircle } from "lucide-react"

export default function ConversationCard({ conversation, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: new Date(dateString).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }

  const messageCount = conversation.message_count || 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <MessageSquare size={18} className="text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text truncate">{conversation.title}</h3>
            <p className="text-xs text-text-muted">
              {messageCount} {messageCount === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {conversation.status === "ended" ? (
            <CheckCircle size={18} className="text-green-500" title="Ended" />
          ) : (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
        </div>
      </div>

      {conversation.summary && <p className="text-sm text-text-muted mb-3 line-clamp-2">{conversation.summary}</p>}

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          {formatDate(conversation.created_at)}
        </div>
        <span
          className={`px-2 py-1 rounded ${
            conversation.status === "ended" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {conversation.status === "ended" ? "Ended" : "Active"}
        </span>
      </div>
    </button>
  )
}
