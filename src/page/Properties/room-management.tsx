import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Room } from "@/types/room";
import { BiX } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
import { LuDoorOpen } from "react-icons/lu";
import RoomForm from "./room-form";

const RoomManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Sample data
  const rooms: Room[] = [
    {
      id: "1",
      number: "101",
      buildingId: "1",
      buildingName: "Sunset Apartments",
      type: "studio",
      floor: 1,
      status: "available",
      baseRent: 1200,
      area: 45,
      amenities: ["Air Conditioning", "Balcony", "Built-in Wardrobe"],
    },
    {
      id: "2",
      number: "202",
      buildingId: "1",
      buildingName: "Sunset Apartments",
      type: "single",
      floor: 2,
      status: "occupied",
      baseRent: 1500,
      area: 55,
      amenities: ["Air Conditioning", "Built-in Wardrobe", "City View"],
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <BiX
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
        </div>
        <button
          onClick={() => {
            setSelectedRoom(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <IoAdd size={18} />
          <span>Add Room</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms
          .filter(
            (room) =>
              room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
              room.buildingName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
          .map((room) => (
            <motion.div
              key={room.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <LuDoorOpen
                      className="text-indigo-600"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Room {room.number}
                    </h3>
                    <p className="text-sm text-gray-500">{room.buildingName}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    room.status
                  )}`}
                >
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Type:{" "}
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </span>
                  <span>Floor: {room.floor}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-600">Area: {room.area}m²</span>
                  <span className="font-medium text-gray-900">
                    ${room.baseRent}/mo
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {room.amenities.slice(0, 2).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{room.amenities.length - 2} more
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowForm(true);
                  }}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit Details
                </button>
              </div>
            </motion.div>
          ))}
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{
                scale: 0.95,
              }}
              animate={{
                scale: 1,
              }}
              exit={{
                scale: 0.95,
              }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <RoomForm
                room={selectedRoom}
                onClose={() => {
                  setShowForm(false);
                  setSelectedRoom(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default RoomManagement;
