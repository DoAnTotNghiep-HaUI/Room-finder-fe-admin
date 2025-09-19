import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHome,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaRulerCombined,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPause,
} from "react-icons/fa";
import RoomForm from "./room-form";
import { IRoom } from "@/types/room";
import { URL_IMAGE } from "@/constants";

interface AdminRoomCardProps {
  room: IRoom;
  onEdit?: (room: IRoom) => void;
  onDelete?: (roomId: string) => void;
  onView?: (room: IRoom) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRoom: React.Dispatch<React.SetStateAction<IRoom | null>>;
  className?: string;
}

const statusConfig = {
  available: {
    label: "Có sẵn",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: FaCheckCircle,
  },
  occupied: {
    label: "Đã thuê",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: FaTimesCircle,
  },
  maintenance: {
    label: "Bảo trì",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: FaPause,
  },
  pending: {
    label: "Chờ duyệt",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: FaClock,
  },
};

export default function AdminRoomCard({
  room,
  onEdit,
  onDelete,
  onView,
  setShowForm,
  setSelectedRoom,
  className = "",
}: AdminRoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  //   const statusInfo = statusConfig[room?.status];
  //   const StatusIcon = statusInfo?.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <>
      <motion.div
        className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex ${className}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-64 flex-shrink-0">
          {room.photos && (
            <div className="h-full bg-gray-200 overflow-hidden">
              <img
                src={
                  room
                    ? `${URL_IMAGE}/${room?.photos[0]?.id}/${room?.photos[0]?.filename_download}`
                    : ""
                }
                alt={room?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/* <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.bgColor} ${statusInfo?.color}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusInfo?.label}
          </span>
        </div> */}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Title and Price */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1 mr-4">
                {room.title}
              </h3>
              <div className="flex items-center text-[#1E88E5] font-bold text-xl flex-shrink-0">
                <FaDollarSign className="w-5 h-5 mr-1" />
                {formatPrice(room?.room_price)} VNĐ
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FaHome className="w-4 h-4 mr-2 text-[#1E88E5]" />
                <div>
                  <span className="font-medium block">Loại:</span>
                  <span>{room?.room_type?.name}</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FaRulerCombined className="w-4 h-4 mr-2 text-[#1E88E5]" />
                <div>
                  <span className="font-medium block">DT:</span>
                  <span>{room.acreage}m²</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FaUsers className="w-4 h-4 mr-2 text-[#1E88E5]" />
                <div>
                  <span className="font-medium block">Tối đa:</span>
                  <span>{room?.limit_people} người</span>
                </div>
              </div>
            </div>

            <div className=" mb-4 grid grid-cols gap-2">
              <div className="flex items-start text-sm text-gray-600">
                <FaBuilding className="w-4 h-4 mr-2 text-[#1E88E5] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Tòa nhà:</span>
                  <span className="ml-1">{room?.building?.name}</span>
                </div>
              </div>

              <div className="flex items-start text-sm text-gray-600">
                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#1E88E5] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Địa chỉ:</span>
                  <span className="ml-1">
                    {room?.building?.specific_address},{room?.building?.ward},
                    {room?.building?.district?.name},{room?.building?.city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendarAlt className="w-4 h-4 mr-2 text-[#1E88E5]" />
              <span className="font-medium">Đăng:</span>
              <span className="ml-1">{formatDate(room?.date_created)}</span>
            </div>

            <div className="flex gap-2">
              {onView && (
                <button
                  onClick={() => onView(room)}
                  style={{
                    backgroundColor: "#E5E7EB !important",
                    color: "#1F2937 !important",
                    border: "2px solid #9CA3AF !important",
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-opacity duration-200"
                >
                  <FaEye className="w-4 h-4" />
                  Xem
                </button>
              )}

              {onEdit && (
                <button
                  onClick={() => {
                    setShowForm(true);
                    setSelectedRoom(room);
                  }}
                  style={{
                    backgroundColor: "#DBEAFE !important",
                    color: "#1E3A8A !important",
                    border: "2px solid #3B82F6 !important",
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-opacity duration-200"
                >
                  <FaEdit className="w-4 h-4" />
                  Sửa
                </button>
              )}

              {onDelete && (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      backgroundColor: "#FEE2E2 !important",
                      color: "#991B1B !important",
                      border: "2px solid #EF4444 !important",
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-opacity duration-200"
                  >
                    <FaTrash className="w-4 h-4" />
                    Xóa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Bạn có chắc chắn muốn xoá phòng này?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                Huỷ
              </button>
              <button
                onClick={() => {
                  onDelete(room.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Sample data for demonstration
