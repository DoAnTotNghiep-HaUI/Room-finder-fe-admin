"use client";

import type React from "react";

import { Disclosure } from "@headlessui/react";
import { User } from "@/types/message";
import { LuChevronDown } from "react-icons/lu";

interface ChatInfoPanelProps {
  user: User;
}

export default function ChatInfoPanel({ user }: ChatInfoPanelProps) {
  return (
    <div className="w-80 border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
          <img
            src={user.avatar || "/placeholder.svg?height=96&width=96"}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {user.isActive ? "Active now" : "Inactive"}
        </p>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <InfoSection title="Chat Info">
          <div className="space-y-2 text-sm">
            <p>Created on {new Date().toLocaleDateString()}</p>
            <p>You're friends on Facebook</p>
          </div>
        </InfoSection>

        <InfoSection title="Media and files">
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gray-700 rounded-md"
                style={{
                  backgroundImage: `url(/placeholder.svg?height=80&width=80)`,
                  backgroundSize: "cover",
                }}
              ></div>
            ))}
          </div>
          <button className="w-full mt-2 py-1 text-blue-400 hover:bg-gray-200 rounded-md text-sm">
            See all
          </button>
        </InfoSection>

        <InfoSection title="Privacy and support">
          <div className="space-y-3">
            {/* <button className="w-full py-1 text-left text-sm hover:bg-gray-200 rounded-md">
              Mute notifications
            </button> */}
            <button className="w-full py-1 text-left text-sm hover:bg-gray-200 rounded-md">
              Block
            </button>
            <button className="w-full py-1 text-left text-sm hover:bg-gray-200 rounded-md">
              Report
            </button>
          </div>
        </InfoSection>
      </div>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="border-t border-gray-200 pt-2">
          <Disclosure.Button className="flex w-full items-center justify-between py-2">
            <h3 className="font-medium">{title}</h3>
            <LuChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="py-2">{children}</Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
