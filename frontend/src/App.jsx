
import './App.css'

import { useState } from "react"
import DashboardPage from "./pages/DashboardPage"
import ChatPage from "./pages/ChatPage"
import IntelligencePage from "./pages/IntelligencePage"

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedConversationId, setSelectedConversationId] = useState(null)

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id)
    setCurrentPage("chat")
  }

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard")
    setSelectedConversationId(null)
  }

  const handleGoToIntelligence = () => {
    setCurrentPage("intelligence")
  }

  return (
    <div className="h-screen w-screen">
      {currentPage === "dashboard" && (
        <DashboardPage onSelectConversation={handleSelectConversation} onGoToIntelligence={handleGoToIntelligence} />
      )}
      {currentPage === "chat" && selectedConversationId && (
        <ChatPage
          conversationId={selectedConversationId}
          onBack={handleBackToDashboard}
          onStartNew={handleBackToDashboard}
        />
      )}
      {currentPage === "intelligence" && <IntelligencePage onBack={handleBackToDashboard} />}
    </div>
  )
}
