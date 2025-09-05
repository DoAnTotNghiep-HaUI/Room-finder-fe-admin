import { useState } from "react";

import { Tab } from "@headlessui/react";
import ProfileForm from "./profile-form";

export default function LandlordProfilePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Toaster position="top-right" /> */}
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Landlord Profile
        </h1>

        <Tab.Group
          selectedIndex={activeTab}
          onChange={setActiveTab}
        >
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1 max-w-md mx-auto mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-600"
                }`
              }
            >
              Profile Information
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-600"
                }`
              }
            >
              Verification
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-600"
                }`
              }
            >
              Security
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel className="rounded-xl">
              <ProfileForm activeTab="profile" />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl">
              <ProfileForm activeTab="verification" />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl">
              <ProfileForm activeTab="security" />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
