"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaRulerCombined,
  FaCalendarAlt,
  FaDollarSign,
  FaTimes,
  FaPlay,
  FaWifi,
  FaBolt,
  FaWater,
  FaCog,
  FaCouch,
  FaStar,
  FaFileContract,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IRoom } from "@/types/room";
import { IFile } from "@/types/file";
import { URL_IMAGE } from "@/constants";
import { VideoPlayer } from "./video-player";
import ReactMarkdown from "react-markdown";

interface RoomDetailProps {
  room: IRoom;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDetail({ room, isOpen, onClose }: RoomDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getFileUrl = (file: IFile): string => {
    return `${URL_IMAGE}/${file.id}/${file.filename_download}`;
  };
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.photos.length) % room.photos.length
    );
  };

  //   const getServiceIcon = (serviceName: string) => {
  //     const name = serviceName.toLowerCase();
  //     if (name.includes("điện"))
  //       return <FaBolt className="w-5 h-5 text-yellow-500" />;
  //     if (name.includes("nước"))
  //       return <FaWater className="w-5 h-5 text-blue-500" />;
  //     if (name.includes("wifi") || name.includes("mạng"))
  //       return <FaWifi className="w-5 h-5 text-green-500" />;
  //     return <FaCog className="w-5 h-5 text-gray-500" />;
  //   };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex-1 mr-4">
                {room.title}
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-[#1E88E5]">
                  {formatPrice(room.room_price)} VNĐ
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Image Gallery */}
              {room.photos && room.photos.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={
                          getFileUrl(room.photos[currentImageIndex]) ||
                          "/placeholder.svg"
                        }
                        alt={
                          room.photos[currentImageIndex].title ||
                          `Room image ${currentImageIndex + 1}`
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {room.photos.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                          <FaChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                          <FaChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {room.photos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {room.photos.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {room.photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? "border-[#1E88E5]"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={getFileUrl(photo) || "/placeholder.svg"}
                            alt={photo.title || `Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video Section */}
              {room.video && (
                <VideoPlayer
                  id={room.video.id}
                  filename_download={room.video.filename_download}
                  title="Video"
                />
              )}

              {/* Basic Information */}

              {/* Building Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FaBuilding className="w-5 h-5 text-[#1E88E5]" />
                  Thông tin phòng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">Tòa nhà:</span>
                    <p className="text-gray-900">{room.building.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">Tầng:</span>
                    <p className="text-gray-900">Tầng {room.floor}</p>
                  </div>
                  <div className="flex gap-2 col-span-12">
                    <span className="font-medium text-gray-700">Địa chỉ:</span>
                    <p className="text-gray-900">
                      {room.building.specific_address} {room.building.ward}{" "}
                      {room.building.district.name} {room.building.city}
                    </p>
                  </div>
                  <div className="flex gap-2 col-span-12">
                    <span className="font-medium text-gray-700">
                      Thời hạn hợp đồng:
                    </span>
                    <p className="text-gray-900">
                      {room.contract_duration === "1_year" && "1 năm"}
                      {room.contract_duration === "3_months" && "3 tháng"}
                      {room.contract_duration === "6_months" && "6 tháng"}
                      {room.contract_duration === "2_years" && "2 năm"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaHome className="w-5 h-5 text-[#1E88E5]" />
                      <span className="font-medium text-gray-700">
                        Loại phòng
                      </span>
                    </div>
                    <p className="text-gray-900">{room.room_type.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaRulerCombined className="w-5 h-5 text-[#1E88E5]" />
                      <span className="font-medium text-gray-700">
                        Diện tích
                      </span>
                    </div>
                    <p className="text-gray-900">{room.acreage}m²</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUsers className="w-5 h-5 text-[#1E88E5]" />
                      <span className="font-medium text-gray-700">Tối đa</span>
                    </div>
                    <p className="text-gray-900">{room.limit_people} người</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaDollarSign className="w-5 h-5 text-[#1E88E5]" />
                      <span className="font-medium text-gray-700">
                        Tiền cọc
                      </span>
                    </div>
                    <p className="text-gray-900">
                      {formatPrice(room.deposit)} VNĐ
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              {room.services && room.services.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Dịch vụ</h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    {room?.services.map((service: any, index) => (
                      <div
                        key={index}
                        className="gap-2 text-center"
                      >
                        <img
                          className="inline-block h-8 w-8"
                          src={`${URL_IMAGE}/${service?.icon.id}/${service?.icon.filename_download}`}
                          alt=""
                        />
                        <p className="pt-2 text-gray-500">{service?.name}</p>
                        <p className="pt-2 font-semibold">
                          {formatPrice(
                            service.custome_price != null
                              ? Number(service.custome_price)
                              : Number(service.default_price)
                          )}
                          đ/
                          {!service.custome_unit
                            ? service.unit
                            : service.custome_unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {room?.amenities && room?.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tiện ích</h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {room?.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="gap-2 text-center"
                      >
                        <img
                          className="inline-block h-8 w-8"
                          src={`${URL_IMAGE}/${amenity?.icon.id}/${amenity?.icon.filename_download}`}
                          alt=""
                        />
                        <p className="pt-2">{amenity?.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Furniture */}
              {room.furnitures && room.furnitures.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    Nội thất
                  </h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {room?.furnitures.map((furniture, index) => (
                      <div
                        key={index}
                        className="gap-2 text-center"
                      >
                        {/* <span className="inline-block text-gray-600">{`${URL_IMAGE}/${amenity?.icon.id}/${amenity?.icon.filename_download}`}</span> */}
                        <img
                          className="inline-block h-8 w-8"
                          src={`${URL_IMAGE}/${furniture?.icon.id}/${furniture?.icon.filename_download}`}
                          alt=""
                        />
                        <p className="pt-2">{furniture?.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {room.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Mô tả</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ReactMarkdown className="px-6">
                      {room?.description}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="w-5 h-5 text-[#1E88E5]" />
                    <span className="font-medium text-gray-700">Ngày đăng</span>
                  </div>
                  <p className="text-gray-900">
                    {formatDate(room.date_created)}
                  </p>
                </div> */}
              </div>
            </div>
          </motion.div>

          {/* Video Modal */}
          <AnimatePresence>
            {showVideoModal && room.video && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-80 z-60 flex items-center justify-center p-4"
                onClick={() => setShowVideoModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative max-w-4xl w-full aspect-video"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    src={getFileUrl(room.video)}
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                  />
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
