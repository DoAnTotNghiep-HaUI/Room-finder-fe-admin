"use client";

import { IFile } from "@/types/file";
import { ILandlordVerification } from "@/types/landlord-verification";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEdit2, FiDownload, FiFileText, FiImage } from "react-icons/fi";

interface LandlordVerificationViewProps {
  verification: ILandlordVerification;
  onClose: () => void;
  onEdit: () => void;
}

export default function LandlordVerificationView({
  verification,
  onClose,
  onEdit,
}: LandlordVerificationViewProps) {
  const getFileUrl = (file: IFile) => {
    if (
      file.metadata &&
      typeof file.metadata === "object" &&
      "url" in file.metadata
    ) {
      return (file.metadata as any).url;
    }
    return `/${file.filename_disk}`;
  };

  const getFileIcon = (file: IFile) => {
    if (file.type.startsWith("image/")) {
      return <FiImage className="w-5 h-5" />;
    }
    return <FiFileText className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Thông tin xác thực
            </h2>
            <div className="flex items-center gap-2">
              {verification.status === "approved" && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-6">
            {/* ID Card Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin căn cước công dân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Số căn cước</p>
                  <p className="font-medium text-gray-900">
                    {verification.id_card_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày cấp</p>
                  <p className="font-medium text-gray-900">
                    {new Date(
                      verification.id_card_issue_date
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Nơi cấp</p>
                  <p className="font-medium text-gray-900">
                    {verification.id_card_issue_place}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Mặt trước CCCD</p>
                  <img
                    src={
                      getFileUrl(verification.id_card_front) ||
                      "/placeholder.svg"
                    }
                    alt="ID Card Front"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Mặt sau CCCD</p>
                  <img
                    src={
                      getFileUrl(verification.id_card_back) ||
                      "/placeholder.svg"
                    }
                    alt="ID Card Back"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Business License */}
            {verification.business_license_number && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Giấy phép kinh doanh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Số giấy phép</p>
                    <p className="font-medium text-gray-900">
                      {verification.business_license_number}
                    </p>
                  </div>
                  {verification.business_license_issue_date && (
                    <div>
                      <p className="text-sm text-gray-600">Ngày cấp</p>
                      <p className="font-medium text-gray-900">
                        {new Date(
                          verification.business_license_issue_date
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  )}
                  {verification.tax_code && (
                    <div>
                      <p className="text-sm text-gray-600">Mã số thuế</p>
                      <p className="font-medium text-gray-900">
                        {verification.tax_code}
                      </p>
                    </div>
                  )}
                </div>

                {verification.business_license_file && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    {getFileIcon(verification.business_license_file)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {verification.business_license_file.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {verification.business_license_file.filename_download}
                      </p>
                    </div>
                    <a
                      href={getFileUrl(verification.business_license_file)}
                      download
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiDownload className="w-5 h-5 text-[#1E88E5]" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Property Ownership */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Giấy tờ chứng minh quyền sở hữu (
                {verification.property_ownership_files.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verification.property_ownership_files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    {getFileIcon(file)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.title}</p>
                      <p className="text-sm text-gray-600">
                        {file.filename_download}
                      </p>
                    </div>
                    <a
                      href={getFileUrl(file)}
                      download
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiDownload className="w-5 h-5 text-[#1E88E5]" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Documents */}
            {verification.additional_documents &&
              verification.additional_documents.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tài liệu bổ sung ({verification.additional_documents.length}
                    )
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verification.additional_documents.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        {getFileIcon(file)}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {file.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {file.filename_download}
                          </p>
                        </div>
                        <a
                          href={getFileUrl(file)}
                          download
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FiDownload className="w-5 h-5 text-[#1E88E5]" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Notes */}
            {verification.notes && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ghi chú
                </h3>
                <p className="text-gray-700">{verification.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
