import type React from "react";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
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
import { IConversation } from "@/types/chat";
import { IUser } from "@/types/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { URL_IMAGE } from "@/constants";
import { getMessagesByConversationId } from "@/redux/message/action";
import FileUploadDropzone from "./input-file-upload";
import { useChat } from "@/hooks/useChat";
import { date } from "zod";

interface ChatWindowProps {
  participant: IUser;
  // onSendMessage: (content: string) => void;
  onToggleInfoPanel: () => void;
}

interface MessageFormData {
  message: string;
}

export default function ChatWindow({
  participant,
  // onSendMessage,
  onToggleInfoPanel,
}: ChatWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const { messageList } = useSelector((state: AppState) => state.message);
  const { currentConversationId } = useSelector(
    (state: AppState) => state.conversation
  );
  const {
    hasMoreMessages,
    loadingMore,
    sendMediaMessage,
    sendMessage,
    messages,
    groupMessagesByDate,
    joinConversation,
    loadMoreMessages,
  } = useChat();
  const [files, setFiles] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState<{
    height: number;
    messageId: string;
  } | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<MessageFormData>({
    defaultValues: {
      message: "",
    },
  });
  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages]
  );
  useEffect(() => {
    dispatch(getMessagesByConversationId(currentConversationId));
  }, [currentConversationId]);
  useEffect(() => {
    if (currentConversationId) {
      joinConversation(currentConversationId);
    }
  }, [currentConversationId, joinConversation]);
  const messageValue = watch("message");

  // const onSubmit = (data: MessageFormData) => {
  //   if (data.message.trim()) {
  //     onSendMessage(data.message);
  //     reset();
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(handleSendMessage)();
    }
  };
  console.log("message", groupedMessages);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || loadingMore || !hasMoreMessages) return;

    // Lưu vị trí scroll và chiều cao của tin nhắn đầu tiên
    if (container.scrollTop < 100 && messages.length > 0) {
      const firstMessageElement = container.querySelector("[data-message-id]");
      if (firstMessageElement) {
        setScrollPosition({
          height: firstMessageElement.clientHeight,
          messageId: firstMessageElement.getAttribute("data-message-id") || "",
        });
      }

      const result = await loadMoreMessages(currentConversationId, messages);
      if (result) {
        // Sử dụng setTimeout để đảm bảo DOM đã cập nhật
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (!container) return;

          // Tìm lại vị trí tin nhắn cũ
          if (scrollPosition) {
            const messageElement = container.querySelector(
              `[data-message-id="${scrollPosition.messageId}"]`
            );
            if (messageElement) {
              // Tính toán vị trí scroll mới
              const newScrollTop =
                messageElement.getBoundingClientRect().top -
                container.getBoundingClientRect().top +
                container.scrollTop -
                scrollPosition.height * 2; // Giữ khoảng cách 2 tin nhắn

              container.scrollTop = newScrollTop;
            }
          }
          setScrollPosition(null);
        }, 0);
      }
    }
  }, [
    currentConversationId,
    loadMoreMessages,
    loadingMore,
    hasMoreMessages,
    messages,
    scrollPosition,
  ]);
  const handleSendMessage = async ({ message }: { message: string }) => {
    if (!message.trim() && files.length === 0) return;
    try {
      if (files.length > 0) {
        await sendMediaMessage(
          currentConversationId,
          participant?.id,
          files,
          message.trim()
        );
      } else {
        await sendMessage(
          currentConversationId,
          message.trim(),
          participant?.id
        );
      }

      // Reset form only if successful
      reset({ message: "" });
      setFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user
    }
  };
  const handleFilesChange = (newFiles: File[] | null) => {
    if (newFiles) {
      setFiles(newFiles);
    } else {
      setFiles([]);
    }
  };
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
              src={
                participant?.avatar
                  ? `${URL_IMAGE}/${participant?.avatar?.id}/${participant.avatar?.filename_download}`
                  : "/placeholder.svg?height=40&width=40"
              }
              alt={participant?.last_name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">
              {participant.first_name} {participant.last_name}
            </p>
            <p className="text-xs text-gray-400">
              {/* {participant.isActive ? "Active now" : "Inactive"} */}
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
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        ref={messagesContainerRef}
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        )}
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div
            key={date}
            className="message-group"
          >
            {/* Header ngày */}
            <div className="relative my-4 text-center">
              <span className="rounded-xl text-sm text-gray-500 px-2 py-1">
                {date}
              </span>
            </div>

            {/* Danh sách tin nhắn */}
            {messages?.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender === userInfo.id}
                participant={participant}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="p-3 border-t border-gray-200 flex items-center gap-2"
      >
        {/* <div className="flex gap-1">
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
        </div> */}

        {/* <div className="flex-1 relative items-center"> */}
        <FileUploadDropzone
          onFilesChange={handleFilesChange}
          files={files}
        >
          <textarea
            {...register("message")}
            placeholder="Aa"
            className="w-full rounded-full bg-gray-200 border-0 resize-none py-2 px-4 focus:outline-none min-h-[40px] max-h-[120px]"
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </FileUploadDropzone>
        {/* </div> */}

        <button
          type="submit"
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
          // disabled={!messageValue.trim()}
        >
          {messageValue.trim() || files.length > 0 ? (
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
