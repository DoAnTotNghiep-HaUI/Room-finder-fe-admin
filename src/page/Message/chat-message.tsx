import { URL_IMAGE } from "@/constants";
import { IMessage } from "@/types/message";
import { IUser } from "@/types/user";
import { cn } from "@/utils/utils";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";

interface ChatMessageProps {
  message: IMessage;
  isCurrentUser: boolean;
  participant: IUser;
}

const ChatMessage = React.memo(
  ({ message, isCurrentUser, participant }: ChatMessageProps) => {
    const getGridClass = (count: number) => {
      if (count === 1) return "grid-cols-1";
      if (count === 2) return "grid-cols-2";
      if (count === 3) return "grid-cols-2";
      return "grid-cols-2";
    };
    const formattedTime = message?.date_created
      ? format(new Date(message.date_created), "HH:mm dd/MM/yyyy", {
          // locale: vi,
        })
      : "";
    return (
      <div
        className={cn(
          "flex gap-2 max-w-[80%]",
          isCurrentUser ? "ml-auto flex-row-reverse" : ""
        )}
      >
        {!isCurrentUser && (
          <div className="h-8 w-8 rounded-full overflow-hidden mt-1">
            <img
              src={
                participant?.avatar
                  ? `${URL_IMAGE}/${participant?.avatar?.id}/${participant.avatar?.filename_download}`
                  : "/placeholder.svg?height=32&width=32"
              }
              alt={participant?.last_name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 group relative">
          {message?.content && (
            <div
              className={cn(
                "inline-block max-w-xs rounded-2xl px-3 py-2 break-words relative",
                isCurrentUser
                  ? "bg-blue-500 text-white rounded-full self-end"
                  : "bg-gray-200 text-black rounded-full self-start"
              )}
            >
              {message?.content}
              <span
                className={cn(
                  "absolute opacity-0 group-hover:opacity-100 transition text-xs text-gray-500 whitespace-nowrap",
                  isCurrentUser
                    ? "-left-[100px] bottom-[10px]"
                    : "-right-[100px] bottom-[10px]"
                )}
              >
                {formattedTime}
              </span>
            </div>
          )}

          {message.attachments && message.attachments.length > 0 && (
            <div
              className={cn(
                `grid ${getGridClass(
                  message.attachments.length
                )} gap-1 relative group`,
                isCurrentUser ? "self-end" : "self-start"
              )}
            >
              {message.attachments.map((file: any, index) => (
                <div
                  key={file.id}
                  className={`relative ${
                    message.attachments.length === 3 && index === 0
                      ? "row-span-2"
                      : ""
                  }`}
                >
                  <img
                    src={`${URL_IMAGE}/${file?.id}/${file?.filename_download}`}
                    alt={`Attachment ${index + 1}`}
                    className="max-h-[180px] max-w-[180px] rounded object-cover"
                    loading="lazy"
                  />
                </div>
              ))}

              {/* Tooltip khi hover ảnh */}
              <span
                className={cn(
                  "absolute opacity-0 group-hover:opacity-100 transition text-xs text-gray-500 whitespace-nowrap",
                  isCurrentUser
                    ? "-left-[100px] bottom-[10px]"
                    : "-right-[100px] bottom-[10px]"
                )}
              >
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
export default ChatMessage;
