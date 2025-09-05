import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface Message {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  preview: string;
  timestamp: string;
  content: string;
}
const MessagePanel = () => {
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);
  // Sample data
  const messages: Message[] = [
    {
      id: 1,
      user: {
        name: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      preview: "I'm interested in the apartment on 5th Avenue.",
      timestamp: "10:30 AM",
      content:
        "Hello, I saw your listing for the apartment on 5th Avenue and I'm very interested in scheduling a viewing. Is it still available for next weekend?",
    },
    {
      id: 2,
      user: {
        name: "Emma Wilson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      preview: "When can I schedule a viewing?",
      timestamp: "Yesterday",
      content:
        "Hi there! I'd like to schedule a viewing for the downtown loft as soon as possible. I'm available any day after 5pm. Please let me know what works for you.",
    },
    {
      id: 3,
      user: {
        name: "Michael Brown",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      preview: "Is the property pet-friendly?",
      timestamp: "2 days ago",
      content:
        "Hello, I'm wondering if the property on Oak Street is pet-friendly? I have a small dog that's well-behaved and house-trained. Thank you!",
    },
  ];
  const toggleMessage = (id: number) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Latest Messages</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            className="border border-gray-100 rounded-lg overflow-hidden"
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
            }}
            onClick={() => toggleMessage(message.id)}
          >
            <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={message.user.avatar}
                  alt={message.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{message.user.name}</h3>
                  <span className="text-xs text-gray-500">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {message.preview}
                </p>
              </div>
            </div>
            <AnimatePresence>
              {expandedMessage === message.id && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="border-t border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-sm text-gray-700">{message.content}</p>
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                      Reply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default MessagePanel;
