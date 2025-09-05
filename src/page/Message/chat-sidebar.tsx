"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Conversation } from "@/types/message";
import { mockUsers } from "@/constants/mockData";
import { BiEdit, BiSearch } from "react-icons/bi";
import { cn } from "@/utils/utils";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ChatSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) => {
    const user = mockUsers.find(
      (user) => user.id === conversation.participantId
    );
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If within a week, show day name
    const diffDays = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: "short" });
    }

    // Otherwise show date
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chats</h1>
        {/* <div className="flex gap-2">
          <button className="p-2 rounded-full bg-blue-600">
            <BiEdit size={20} />
          </button>
        </div> */}
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <BiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search Messenger"
            className="w-full pl-10 py-2 bg-gray-200 border-0 rounded-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200">
          <Tab
            className={({ selected }) =>
              cn(
                "flex-1 py-2 text-sm font-medium focus:outline-none",
                selected
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              )
            }
          >
            Inbox
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "flex-1 py-2 text-sm font-medium focus:outline-none",
                selected
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              )
            }
          >
            Communities
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel className="overflow-y-auto h-[calc(100vh-140px)]">
            {filteredConversations.map((conversation) => {
              const user = mockUsers.find(
                (user) => user.id === conversation.participantId
              );
              if (!user) return null;

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer rounded-lg m-2",
                    selectedConversationId === conversation.id && "bg-[#ebf5ff]"
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={
                          user.avatar || "/placeholder.svg?height=48&width=48"
                        }
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {user.isActive && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{user.name}</p>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                      {/* {conversation.unreadCount} */}
                    </div>
                  )}
                </div>
              );
            })}
          </Tab.Panel>

          <Tab.Panel>
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">No communities yet</p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
