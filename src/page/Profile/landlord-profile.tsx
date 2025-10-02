"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEdit2,
  FiHome,
  FiLayers,
} from "react-icons/fi";
import LandlordVerificationForm from "./landlord-verification-form";
import LandlordVerificationView from "./landlord-verification-view";
import { ILandlord } from "@/types/landlord-verification";
import { IFile } from "./file-upload";

interface LandlordProfileProps {
  landlord: ILandlord;
  onUpdate?: (landlord: ILandlord) => void;
}

export default function LandlordProfile({
  landlord,
  onUpdate,
}: LandlordProfileProps) {
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showVerificationView, setShowVerificationView] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const getAvatarUrl = (avatar?: IFile) => {
    if (!avatar) return "/diverse-user-avatars.png";
    if (
      avatar.metadata &&
      typeof avatar.metadata === "object" &&
      "url" in avatar.metadata
    ) {
      return (avatar.metadata as any).url;
    }
    return `/${avatar.filename_disk}`;
  };

  const getVerificationStatusBadge = () => {
    if (!landlord.verification) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          <FiXCircle className="w-4 h-4" />
          Chưa xác thực
        </div>
      );
    }

    switch (landlord.verification.status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <FiCheckCircle className="w-4 h-4" />
            Đã xác thực
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <FiClock className="w-4 h-4" />
            Đang chờ duyệt
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <FiXCircle className="w-4 h-4" />
            Bị từ chối
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-[#1E88E5] to-[#1565C0]" />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-16">
            <div className="flex-shrink-0">
              <img
                src={getAvatarUrl(landlord.avatar) || "/placeholder.svg"}
                alt={`${landlord.first_name} ${landlord.last_name}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            <div className="flex-1 mt-16 md:mt-20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {landlord.first_name} {landlord.last_name}
                  </h1>
                  <p className="text-gray-600 mt-1">Chủ nhà trọ</p>
                </div>
                <div className="flex items-center gap-3">
                  {getVerificationStatusBadge()}
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thông tin liên hệ
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-[#1E88E5]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{landlord.email}</p>
                </div>
              </div>

              {landlord.phone_number && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiPhone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium text-gray-900">
                      {landlord.phone_number}
                    </p>
                  </div>
                </div>
              )}

              {landlord.address && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-medium text-gray-900">
                      {landlord.address}
                    </p>
                  </div>
                </div>
              )}

              {landlord.date_of_birth && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày sinh</p>
                    <p className="font-medium text-gray-900">
                      {new Date(landlord.date_of_birth).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tham gia</p>
                  <p className="font-medium text-gray-900">
                    {new Date(landlord.joined_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Xác thực tài khoản
              </h2>
              {landlord.verification && (
                <button
                  onClick={() => setShowVerificationView(true)}
                  className="text-[#1E88E5] hover:text-[#1565C0] font-medium text-sm"
                >
                  Xem chi tiết
                </button>
              )}
            </div>

            {!landlord.verification ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiXCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tài khoản chưa được xác thực
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Xác thực tài khoản giúp tăng độ tin cậy và cho phép bạn sử
                  dụng đầy đủ các tính năng của hệ thống.
                </p>
                <button
                  onClick={() => setShowVerificationForm(true)}
                  className="px-6 py-3 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors font-medium"
                >
                  Xác thực ngay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <p className="font-medium text-gray-900">
                      {landlord.verification.status === "approved"
                        ? "Đã xác thực"
                        : landlord.verification.status === "pending"
                        ? "Đang chờ duyệt"
                        : "Bị từ chối"}
                    </p>
                  </div>
                  {getVerificationStatusBadge()}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ngày nộp hồ sơ</p>
                  <p className="font-medium text-gray-900">
                    {new Date(
                      landlord.verification.submitted_date
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                {landlord.verification.status === "approved" &&
                  landlord.verification.approved_date && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">Ngày phê duyệt</p>
                      <p className="font-medium text-green-900">
                        {new Date(
                          landlord.verification.approved_date
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  )}

                {landlord.verification.status === "rejected" && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700 mb-2">Lý do từ chối</p>
                    <p className="font-medium text-red-900">
                      {landlord.verification.rejected_reason}
                    </p>
                    <button
                      onClick={() => setShowVerificationForm(true)}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Nộp lại hồ sơ
                    </button>
                  </div>
                )}

                {landlord.verification.status === "approved" && (
                  <button
                    onClick={() => setShowVerificationForm(true)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cập nhật thông tin xác thực
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiHome className="w-5 h-5 text-[#1E88E5]" />
                  <p className="text-sm text-gray-600">Tổng số tòa nhà</p>
                </div>
                <p className="text-3xl font-bold text-[#1E88E5]">
                  {landlord.total_buildings || 0}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiLayers className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-gray-600">Tổng số phòng</p>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {landlord.total_rooms || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thao tác nhanh
            </h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Quản lý tòa nhà
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Quản lý phòng trọ
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Quản lý hợp đồng
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Quản lý hóa đơn
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verification Form Modal */}
      {showVerificationForm && (
        <LandlordVerificationForm
          landlord={landlord}
          existingVerification={landlord.verification}
          onClose={() => setShowVerificationForm(false)}
          onSubmit={(verification) => {
            const updatedLandlord = { ...landlord, verification };
            onUpdate?.(updatedLandlord);
            setShowVerificationForm(false);
          }}
        />
      )}

      {/* Verification View Modal */}
      {showVerificationView && landlord.verification && (
        <LandlordVerificationView
          verification={landlord.verification}
          onClose={() => setShowVerificationView(false)}
          onEdit={() => {
            setShowVerificationView(false);
            setShowVerificationForm(true);
          }}
        />
      )}
    </div>
  );
}
