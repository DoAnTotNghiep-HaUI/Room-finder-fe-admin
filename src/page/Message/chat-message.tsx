import { Message, User } from "@/types/message";
import { cn } from "@/utils/utils";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  participant: User;
}

export default function ChatMessage({
  message,
  isCurrentUser,
  participant,
}: ChatMessageProps) {
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    includeSeconds: true,
  });

  if (message.type === "system") {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-200 text-gray-400 text-xs rounded-full px-3 py-1">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.type === "call") {
    const callInfo = JSON.parse(message.content);
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-200 text-gray-400 text-sm rounded-lg px-4 py-2 flex items-center gap-2">
          {callInfo.type === "video" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>
            {callInfo.status === "missed"
              ? `Missed ${callInfo.type} call`
              : `${
                  callInfo.type.charAt(0).toUpperCase() + callInfo.type.slice(1)
                } call (${callInfo.duration})`}
          </span>
        </div>
      </div>
    );
  }

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
            src={participant.avatar || "/placeholder.svg?height=32&width=32"}
            alt={participant.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 break-words",
            isCurrentUser
              ? "bg-blue-500 text-white rounded-full"
              : "bg-gray-200 text-black rounded-full"
          )}
        >
          {message.content}
        </div>
        {/* <div
          className={cn(
            "text-xs text-gray-400 mt-1 opacity-0 hover",
            isCurrentUser ? "text-right" : "text-left"
          )}
        >
          {formattedTime}
        </div> */}
      </div>
    </div>
  );
}
