"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle } from "react-icons/fi";
import FileUpload, { IFile } from "./file-upload";
import {
  ILandlord,
  ILandlordVerification,
} from "@/types/landlord-verification";

interface LandlordVerificationFormProps {
  landlord: ILandlord;
  existingVerification?: ILandlordVerification;
  onClose: () => void;
  onSubmit: (verification: ILandlordVerification) => void;
}

export default function LandlordVerificationForm({
  landlord,
  existingVerification,
  onClose,
  onSubmit,
}: LandlordVerificationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id_card_number: existingVerification?.id_card_number || "",
    id_card_issue_date: existingVerification?.id_card_issue_date || "",
    id_card_issue_place: existingVerification?.id_card_issue_place || "",
    business_license_number:
      existingVerification?.business_license_number || "",
    business_license_issue_date:
      existingVerification?.business_license_issue_date || "",
    tax_code: existingVerification?.tax_code || "",
    notes: existingVerification?.notes || "",
  });

  const [idCardFront, setIdCardFront] = useState<IFile[]>(
    existingVerification?.id_card_front
      ? [existingVerification.id_card_front]
      : []
  );
  const [idCardBack, setIdCardBack] = useState<IFile[]>(
    existingVerification?.id_card_back
      ? [existingVerification.id_card_back]
      : []
  );
  const [businessLicense, setBusinessLicense] = useState<IFile[]>(
    existingVerification?.business_license_file
      ? [existingVerification.business_license_file]
      : []
  );
  const [taxRegistration, setTaxRegistration] = useState<IFile[]>(
    existingVerification?.tax_registration_file
      ? [existingVerification.tax_registration_file]
      : []
  );
  const [propertyOwnership, setPropertyOwnership] = useState<IFile[]>(
    existingVerification?.property_ownership_files || []
  );
  const [additionalDocs, setAdditionalDocs] = useState<IFile[]>(
    existingVerification?.additional_documents || []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!idCardFront[0] || !idCardBack[0] || !formData.id_card_number) {
      alert("Vui lòng điền đầy đủ thông tin căn cước công dân");
      return;
    }

    if (propertyOwnership.length === 0) {
      alert(
        "Vui lòng tải lên ít nhất một giấy tờ chứng minh quyền sở hữu tài sản"
      );
      return;
    }

    const verification: ILandlordVerification = {
      id: existingVerification?.id || Date.now().toString(),
      landlord_id: landlord.id,
      status: "pending",
      submitted_date: new Date().toISOString(),
      id_card_number: formData.id_card_number,
      id_card_front: idCardFront[0],
      id_card_back: idCardBack[0],
      id_card_issue_date: formData.id_card_issue_date,
      id_card_issue_place: formData.id_card_issue_place,
      business_license_number: formData.business_license_number || undefined,
      business_license_file: businessLicense[0] || undefined,
      business_license_issue_date:
        formData.business_license_issue_date || undefined,
      tax_code: formData.tax_code || undefined,
      tax_registration_file: taxRegistration[0] || undefined,
      property_ownership_files: propertyOwnership,
      additional_documents:
        additionalDocs.length > 0 ? additionalDocs : undefined,
      notes: formData.notes || undefined,
    };

    onSubmit(verification);
  };

  const steps = [
    { number: 1, title: "Căn cước công dân" },
    { number: 2, title: "Giấy phép kinh doanh" },
    { number: 3, title: "Giấy tờ sở hữu" },
    { number: 4, title: "Xác nhận" },
  ];

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
              Xác thực tài khoản chủ nhà
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex items-center flex-1"
                >
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        currentStep >= step.number
                          ? "bg-[#1E88E5] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <FiCheckCircle className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <p
                      className={`text-sm mt-2 text-center ${
                        currentStep >= step.number
                          ? "text-[#1E88E5] font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-colors ${
                        currentStep > step.number
                          ? "bg-[#1E88E5]"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
            {/* Step 1: ID Card */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin căn cước công dân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số căn cước <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="id_card_number"
                        value={formData.id_card_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        placeholder="Nhập số căn cước"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày cấp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="id_card_issue_date"
                        value={formData.id_card_issue_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nơi cấp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="id_card_issue_place"
                        value={formData.id_card_issue_place}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        placeholder="Nhập nơi cấp"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh mặt trước CCCD <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    maxFiles={1}
                    minFiles={1}
                    acceptedTypes={["image/*"]}
                    onImagesChange={setIdCardFront}
                    existingImages={idCardFront}
                    title="Tải lên ảnh mặt trước"
                    description="Chọn hoặc kéo thả ảnh mặt trước CCCD"
                    allowVideo={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh mặt sau CCCD <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    maxFiles={1}
                    minFiles={1}
                    acceptedTypes={["image/*"]}
                    onImagesChange={setIdCardBack}
                    existingImages={idCardBack}
                    title="Tải lên ảnh mặt sau"
                    description="Chọn hoặc kéo thả ảnh mặt sau CCCD"
                    allowVideo={false}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Business License */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Giấy phép kinh doanh
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Thông tin này không bắt buộc nếu bạn là chủ nhà cá nhân
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số giấy phép kinh doanh
                      </label>
                      <input
                        type="text"
                        name="business_license_number"
                        value={formData.business_license_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        placeholder="Nhập số giấy phép"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày cấp
                      </label>
                      <input
                        type="date"
                        name="business_license_issue_date"
                        value={formData.business_license_issue_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã số thuế
                      </label>
                      <input
                        type="text"
                        name="tax_code"
                        value={formData.tax_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        placeholder="Nhập mã số thuế"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh giấy phép kinh doanh
                  </label>
                  <FileUpload
                    maxFiles={1}
                    acceptedTypes={["image/*", "application/pdf"]}
                    onImagesChange={setBusinessLicense}
                    existingImages={businessLicense}
                    title="Tải lên giấy phép kinh doanh"
                    description="Chọn hoặc kéo thả file giấy phép"
                    allowVideo={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giấy đăng ký thuế
                  </label>
                  <FileUpload
                    maxFiles={1}
                    acceptedTypes={["image/*", "application/pdf"]}
                    onImagesChange={setTaxRegistration}
                    existingImages={taxRegistration}
                    title="Tải lên giấy đăng ký thuế"
                    description="Chọn hoặc kéo thả file giấy đăng ký thuế"
                    allowVideo={false}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Property Ownership */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Giấy tờ chứng minh quyền sở hữu
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tải lên sổ đỏ, sổ hồng hoặc các giấy tờ chứng minh quyền sở
                    hữu tài sản
                  </p>
                  <FileUpload
                    maxFiles={10}
                    minFiles={1}
                    acceptedTypes={["image/*", "application/pdf"]}
                    onImagesChange={setPropertyOwnership}
                    existingImages={propertyOwnership}
                    title="Tải lên giấy tờ sở hữu"
                    description="Chọn hoặc kéo thả các file giấy tờ"
                    allowVideo={false}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tài liệu bổ sung
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Các tài liệu khác hỗ trợ cho việc xác thực (không bắt buộc)
                  </p>
                  <FileUpload
                    maxFiles={5}
                    acceptedTypes={["image/*", "application/pdf"]}
                    onImagesChange={setAdditionalDocs}
                    existingImages={additionalDocs}
                    title="Tải lên tài liệu bổ sung"
                    description="Chọn hoặc kéo thả các file tài liệu"
                    allowVideo={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                    placeholder="Thêm ghi chú nếu cần..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Xác nhận thông tin
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vui lòng kiểm tra lại thông tin trước khi gửi hồ sơ xác thực
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Số căn cước</p>
                    <p className="font-medium text-gray-900">
                      {formData.id_card_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ảnh CCCD</p>
                    <p className="font-medium text-gray-900">
                      {idCardFront.length > 0 && idCardBack.length > 0
                        ? "Đã tải lên đầy đủ"
                        : "Chưa đầy đủ"}
                    </p>
                  </div>
                  {formData.business_license_number && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Giấy phép kinh doanh
                      </p>
                      <p className="font-medium text-gray-900">
                        {formData.business_license_number}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Giấy tờ sở hữu</p>
                    <p className="font-medium text-gray-900">
                      {propertyOwnership.length} tài liệu
                    </p>
                  </div>
                  {additionalDocs.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Tài liệu bổ sung</p>
                      <p className="font-medium text-gray-900">
                        {additionalDocs.length} tài liệu
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Sau khi gửi hồ sơ, chúng tôi sẽ xem xét và phản hồi trong
                    vòng 2-3 ngày làm việc.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quay lại
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  className="px-6 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Gửi hồ sơ
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
