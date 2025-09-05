import { Conversation, User } from "@/types/message";
import type React from "react";

import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  BiImage,
  BiPaperclip,
  BiPhone,
  BiSmile,
  BiVideo,
} from "react-icons/bi";
import { FaInfo, FaThumbsUp } from "react-icons/fa";
import ChatMessage from "./chat-message";
import { LuInfo } from "react-icons/lu";
import { IoIosInformation } from "react-icons/io";

interface ChatWindowProps {
  conversation: Conversation;
  participant: User;
  onSendMessage: (content: string) => void;
  onToggleInfoPanel: () => void;
}

interface MessageFormData {
  message: string;
}

export default function ChatWindow({
  conversation,
  participant,
  onSendMessage,
  onToggleInfoPanel,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, watch } = useForm<MessageFormData>({
    defaultValues: {
      message: "",
    },
  });

  const messageValue = watch("message");

  const onSubmit = (data: MessageFormData) => {
    if (data.message.trim()) {
      onSendMessage(data.message);
      reset();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onToggleInfoPanel}
        >
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              src={participant.avatar || "/placeholder.svg?height=40&width=40"}
              alt={participant.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{participant.name}</p>
            <p className="text-xs text-gray-400">
              {participant.isActive ? "Active now" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="text-white rounded-full bg-blue-600"
            onClick={onToggleInfoPanel}
          >
            <IoIosInformation size={20} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversation.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === "current-user"}
            participant={participant}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-3 border-t border-gray-200 flex items-center gap-2"
      >
        <div className="flex gap-1">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <BiPaperclip size={20} />
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <BiImage size={20} />
          </button>
        </div>

        <div className="flex-1 relative items-center">
          <textarea
            {...register("message")}
            placeholder="Aa"
            className="w-full rounded-full bg-gray-200 border-0 resize-none py-2 px-4 focus:outline-none min-h-[40px] max-h-[120px]"
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>

        <button
          type="submit"
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
          disabled={!messageValue.trim()}
        >
          {messageValue.trim() ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-blue-500"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          ) : (
            <FaThumbsUp
              size={20}
              className="text-blue-500"
            />
          )}
        </button>
      </form>
    </div>
  );
}
