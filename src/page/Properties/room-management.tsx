import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiX } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
import { LuDoorOpen } from "react-icons/lu";
import RoomForm from "./room-form";
import Select from "@/components/Input/selectAi";
import AdminRoomCard from "./room-card-admin";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { getListRoom, getListRoomByLandlord } from "@/redux/room/action";
import { IRoom } from "@/types/room";
import { getListRoomType } from "@/redux/room-type/action";
import { getListServices } from "@/redux/services/action";
import RoomDetail from "./room-view/room-detail";
const statuses = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "expiring",
    label: "Expiring Soon",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "terminated",
    label: "Terminated",
  },
];
const RoomManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const { roomList } = useSelector((state: AppState) => state.room);
  const [showRoomDetail, setShowRoomDetail] = useState(false);

  console.log("roomList", roomList);

  useEffect(() => {
    dispatch(getListRoomByLandlord(userInfo?.id));
  }, [userInfo?.id]);
  useEffect(() => {
    dispatch(getListRoomType());
    dispatch(getListServices());
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
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
  const handleRoomView = (room: IRoom) => {
    console.log("View room:", room);
    setSelectedRoom(room);
    setShowRoomDetail(true);
  };

  const handleRoomEdit = (room: IRoom) => {
    console.log("Edit room:", room);
  };

  const handleRoomDelete = (roomId: string) => {
    console.log("Delete room:", roomId);
  };
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select options={statuses}></Select>
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <BiSearch
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
      <div className="grid grid-cols-2 gap-6">
        {roomList?.map((room: IRoom) => (
          <AdminRoomCard
            key={room?.id}
            room={room}
            onEdit={handleRoomEdit}
            onView={handleRoomView}
            onDelete={handleRoomDelete}
            setShowForm={setShowForm}
            setSelectedRoom={setSelectedRoom}
          />
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
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
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
      {selectedRoom && (
        <RoomDetail
          room={selectedRoom}
          isOpen={showRoomDetail}
          onClose={() => {
            setShowRoomDetail(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};
export default RoomManagement;
