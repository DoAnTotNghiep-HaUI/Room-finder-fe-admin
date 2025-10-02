"use client";

interface Conversation {
  id: string;
  tenant: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
}

interface RecentMessagesProps {
  conversations?: Conversation[];
}

export default function RecentMessages({ conversations }: RecentMessagesProps) {
  const data = conversations || [];
  const unreadCount = data.filter((c) => c.unread).length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Tin nhắn mới</h3>
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {unreadCount}
        </span>
      </div>
      <div className="space-y-4">
        {data.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
          >
            <img
              src={conversation.avatar || "/placeholder.svg"}
              alt={conversation.tenant}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {conversation.tenant}
                </p>
                {conversation.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {conversation.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {conversation.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
        Xem tất cả tin nhắn
      </button>
    </div>
  );
}
