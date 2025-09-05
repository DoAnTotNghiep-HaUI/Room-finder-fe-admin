import React from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { BiBuilding } from "react-icons/bi";
import { LuDoorOpen } from "react-icons/lu";
import BuildingManagement from "../Building/buiding-management";
import RoomManagement from "./room-management";
const Properties = () => {
  return (
    <div className="w-full p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Property Management</h1>
      </motion.div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-100 p-1 mb-6">
          <Tab
            className={({
              selected,
            }) => `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800"
              } flex items-center justify-center gap-2`}
          >
            <BiBuilding size={18} />
            Buildings
          </Tab>
          <Tab
            className={({
              selected,
            }) => `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800"
              } flex items-center justify-center gap-2`}
          >
            <LuDoorOpen size={18} />
            Rooms
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <BuildingManagement />
          </Tab.Panel>
          <Tab.Panel>
            <RoomManagement />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
export default Properties;
