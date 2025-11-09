import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { Copy } from "lucide-react"

export default function MessageBubble({ message }) {
  const isUser = message.sender === "user"

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false)
    const match = /language-(\w+)/.exec(className || "")

    const getTextFromChildren = (child) => {
      if (typeof child === "string") return child
      if (Array.isArray(child)) return child.map(getTextFromChildren).join("")
      if (child?.props?.children) return getTextFromChildren(child.props.children)
      return ""
    }

    const handleCopy = (children) => {
      const textToCopy = getTextFromChildren(children)
      if (!textToCopy.trim()) return
      navigator.clipboard.writeText(textToCopy.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return !inline && match ? (
      <div className="relative group">
        <pre className="rounded-lg overflow-auto text-xs sm:text-sm bg-gray-900 text-gray-100 p-3">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
        <button
          onClick={() => handleCopy(children)}
          className="absolute top-1 right-2 flex items-center gap-1 text-gray-300 text-xs bg-gray-800/70 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
        >
          <Copy size={12} /> {copied ? "Copied" : "Copy"}
        </button>
      </div>
    ) : (
      <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className={`flex w-full px-3 py-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-full md:max-w-[85%] px-4 py-3 rounded-2xl shadow-md transition-all duration-200
        ${isUser
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none border border-gray-300"
          }`}
      >
        <div className="prose prose-sm sm:prose-base max-w-none break-words leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: CodeBlock,
              a: ({ href, children }) => (
                <a
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-400 pl-3 italic my-2">
                  {children}
                </blockquote>
              ),
              h1: ({ children }) => (
                <h1 className="text-base sm:text-lg font-bold mt-2 mb-1">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm sm:text-base font-semibold mt-2 mb-1">{children}</h2>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside ml-2 my-1 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside ml-2 my-1 space-y-1">{children}</ol>
              ),
              p: ({ children }) => <p className="my-1">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic opacity-90">{children}</em>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <span
          className={`text-[10px] sm:text-xs mt-2 block text-right ${isUser ? "text-blue-100" : "text-gray-500"
            }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}
