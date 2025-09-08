import { useEffect, useState } from "react";
import ChatSidebar from "./chat-sidebar";
import ChatWindow from "./chat-window";
import ChatInfoPanel from "./chat-info-panel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { useChat } from "@/hooks/useChat";
import { setConversationId } from "@/redux/conversation/store";

export default function MessengerPage() {
  // const [conversations, setConversations] =
  //   useState<Conversation[]>(mockConversations);

  const dispatch = useDispatch<AppDispatch>();
  const {
    joinConversation,
    markConversationAsRead,
    getConversationPartner,
    fetchConversations,
  } = useChat();
  const { conversations, currentConversationId } = useSelector(
    (state: AppState) => state.conversation
  );
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const selectedConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId
  );
  console.log("userInfor", userInfo);

  useEffect(() => {
    fetchConversations();
  }, [userInfo?.id]);
  const partner = getConversationPartner(selectedConversation);
  const handleSelectConversation = async (conversationId: string) => {
    if (conversationId === currentConversationId) return;
    await joinConversation(conversationId);
    markConversationAsRead(conversationId);
    dispatch(setConversationId(conversationId));
  };

  const handleSendMessage = (content: string) => {
    // if (!selectedConversationId || !content.trim()) return;
    // const newMessage: Message = {
    //   id: `msg-${Date.now()}`,
    //   senderId: "current-user",
    //   content,
    //   timestamp: new Date(),
    //   status: "sent",
    //   type: "text",
    // };
    // setConversations((prev) =>
    //   prev.map((conversation) =>
    //     conversation.id === selectedConversationId
    //       ? {
    //           ...conversation,
    //           messages: [...conversation.messages, newMessage],
    //           lastMessage: content,
    //           lastMessageTime: new Date(),
    //         }
    //       : conversation
    //   )
    // );
  };

  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel);
  };

  return (
    <div className="flex h-screen text-black overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        selectedConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
      />

      {selectedConversation && partner ? (
        <ChatWindow
          conversation={selectedConversation}
          participant={partner}
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

      {selectedConversation && partner && showInfoPanel && (
        <ChatInfoPanel user={partner} />
      )}
    </div>
  );
}
