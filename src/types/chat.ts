import { IMessage } from "./message";
import { IUser } from "./user";

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isLandlord?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  reactions?: Reaction[];
}

export interface Reaction {
  userId: string;
  type: "👍" | "❤️" | "😂" | "😮" | "😢" | "😡";
}

export interface IConversation {
  id: string;
  participants: any;
  last_message?: IMessage;
  unread_count: number;
  last_message_time?: Date;
  isTyping?: boolean;
  user_created?: string | Date;
  date_created?: string | Date;
}
export interface ConversationParam {
  isLoading: boolean;
  conversations: IConversation[] | null;
  error: string | null;
  currentConversationId?: string | null;
  tempConversation: {
    partnerId: string | null;
    isOpen: boolean;
  };
}
export interface ConversationDetailParam {
  isLoading: boolean;
  conversation: IConversation;
  error: string | null;
}
export interface ChatState {
  conversations: IConversation[];
  activeConversations: string[];
  messages: Record<string, Message[]>;
  users: Record<string, User>;
  currentUser: User;
  isLoading?: boolean;
  error?: string | null;
}
export interface MessageState {
  messageList: IMessage[];
  isLoading: boolean;
  error: string | null;
}
export interface ChatWindowState {
  conversationId: number;
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isLoading: boolean;
}
