import { Conversation, User } from "@/types/message";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Hà Văn Minh",
    avatar: "/placeholder.svg?height=200&width=200",
    isActive: true,
  },
  {
    id: "user-2",
    name: "Nguyễn Nhung",
    avatar: "/placeholder.svg?height=200&width=200",
    isActive: true,
  },
  {
    id: "user-3",
    name: "Trang Vy",
    avatar: "/placeholder.svg?height=200&width=200",
    isActive: false,
  },
  {
    id: "user-4",
    name: "The Anh",
    avatar: "/placeholder.svg?height=200&width=200",
    isActive: true,
  },
  {
    id: "user-5",
    name: "Hihi",
    avatar: "/placeholder.svg?height=200&width=200",
    isActive: false,
  },
  {
    id: "user-6",
    name: "Lê Toàn",
    avatar: "/placeholder.svg?height=200&width=200",
    isActive: false,
  },
];

// Helper to create a date in the past
const getDateInPast = (daysAgo: number, hoursAgo = 0, minutesAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date;
};

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantId: "user-1",
    lastMessage: "Chết đỡ hh",
    lastMessageTime: getDateInPast(0, 1),
    unreadCount: 0,
    messages: [
      {
        id: "msg-1-1",
        senderId: "user-1",
        content: "Dạ a",
        timestamp: getDateInPast(0, 2),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-2",
        senderId: "current-user",
        content: "Tên với người nước gì th pk a",
        timestamp: getDateInPast(0, 1, 50),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-3",
        senderId: "user-1",
        content: "Oci a",
        timestamp: getDateInPast(0, 1, 40),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-4",
        senderId: "user-1",
        content: "Còn btap gì nữa kh nhỉ a",
        timestamp: getDateInPast(0, 1, 30),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-5",
        senderId: "current-user",
        content: "Trong sách có đoạn như thế à cũng không biết ở đâu",
        timestamp: getDateInPast(0, 1, 20),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-6",
        senderId: "current-user",
        content: "Viết về các bạn ở trong lớp đó",
        timestamp: getDateInPast(0, 1, 15),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-7",
        senderId: "current-user",
        content: "Hình như hết rồi à cũng không biết nữa:))",
        timestamp: getDateInPast(0, 1, 10),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-8",
        senderId: "current-user",
        content: "Không làm bị sảy thời đúng sơ",
        timestamp: getDateInPast(0, 1, 5),
        status: "read",
        type: "text",
      },
      {
        id: "msg-1-9",
        senderId: "user-1",
        content: "Chết đỡ hh",
        timestamp: getDateInPast(0, 1),
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "conv-2",
    participantId: "user-2",
    lastMessage: "Oki nhá",
    lastMessageTime: getDateInPast(1),
    unreadCount: 0,
    messages: [
      {
        id: "msg-2-1",
        senderId: "user-2",
        content: "Oki nhá",
        timestamp: getDateInPast(1),
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "conv-3",
    participantId: "user-3",
    lastMessage: "Cty yêu cầu kk",
    lastMessageTime: getDateInPast(1),
    unreadCount: 1,
    messages: [
      {
        id: "msg-3-1",
        senderId: "user-3",
        content: "Cty yêu cầu kk",
        timestamp: getDateInPast(1),
        status: "delivered",
        type: "text",
      },
    ],
  },
  {
    id: "conv-4",
    participantId: "user-4",
    lastMessage: "Xem có chỗ nào khác truyền dạy không",
    lastMessageTime: getDateInPast(1),
    unreadCount: 1,
    messages: [
      {
        id: "msg-4-1",
        senderId: "user-4",
        content: "Xem có chỗ nào khác truyền dạy không",
        timestamp: getDateInPast(1),
        status: "delivered",
        type: "text",
      },
    ],
  },
  {
    id: "conv-5",
    participantId: "user-5",
    lastMessage: "Vô Tốt rồi",
    lastMessageTime: getDateInPast(1),
    unreadCount: 0,
    messages: [
      {
        id: "msg-5-1",
        senderId: "user-5",
        content: "Vô Tốt rồi",
        timestamp: getDateInPast(1),
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "conv-6",
    participantId: "user-6",
    lastMessage: "You called Lê",
    lastMessageTime: getDateInPast(2),
    unreadCount: 0,
    messages: [
      {
        id: "msg-6-1",
        senderId: "current-user",
        content: JSON.stringify({
          type: "audio",
          status: "completed",
          duration: "1:23",
        }),
        timestamp: getDateInPast(2),
        status: "read",
        type: "call",
      },
    ],
  },
];
