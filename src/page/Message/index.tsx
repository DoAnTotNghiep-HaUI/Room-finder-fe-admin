import { mockConversations, mockUsers } from "@/constants/mockData";
import { Conversation, Message } from "@/types/message";
import { useState } from "react";
import ChatSidebar from "./chat-sidebar";
import ChatWindow from "./chat-window";
import ChatInfoPanel from "./chat-info-panel";

export default function MessengerPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(mockConversations[0]?.id || null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const selectedUser = selectedConversation
    ? mockUsers.find((user) => user.id === selectedConversation.participantId)
    : null;

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      content,
      timestamp: new Date(),
      status: "sent",
      type: "text",
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, newMessage],
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : conversation
      )
    );
  };

  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel);
  };

  return (
    <div className="flex h-screen text-black overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      {selectedConversation && selectedUser ? (
        <ChatWindow
          conversation={selectedConversation}
          participant={selectedUser}
          onSendMessage={handleSendMessage}
          onToggleInfoPanel={toggleInfoPanel}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">
            Select a conversation to start chatting
          </p>
        </div>
      )}

      {selectedConversation && selectedUser && showInfoPanel && (
        <ChatInfoPanel user={selectedUser} />
      )}
    </div>
  );
}
