export interface User {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file" | "call" | "system";
}

export interface Conversation {
  id: string;
  participantId: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}
