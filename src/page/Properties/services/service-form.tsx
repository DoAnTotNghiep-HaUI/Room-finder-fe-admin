"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BiX } from "react-icons/bi";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface ServiceFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: ServiceFormData) => void;
  initialData?: any;
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
  name: string;
  index?: number;
}

interface ServiceFormData {
  id?: string;
  custome_price: number;
  custome_unit: string;
}

export default function ServiceForm({
  isOpen = true,
  onClose,
  onSubmit,
  initialData,
  setValue,
  watch,
  name,
  index,
}: ServiceFormProps) {
  const formServices = watch ? watch(name) || [] : [];
  const currentService = index !== undefined ? formServices[index] : null;

  // Sử dụng state local để lưu giá trị tạm thời
  const [tempFormData, setTempFormData] = useState<ServiceFormData>({
    custome_price:
      currentService?.custome_price || currentService?.default_price || 0,
    custome_unit: currentService?.custome_unit || currentService?.unit || "",
  });

  // Cập nhật state local khi initialData thay đổi
  useEffect(() => {
    if (currentService) {
      setTempFormData({
        custome_price:
          currentService.custome_price || currentService.default_price || 0,
        custome_unit: currentService.custome_unit || currentService.unit || "",
      });
    }
  }, [currentService]);

  const handleInputChange = (
    field: keyof ServiceFormData,
    value: string | number
  ) => {
    setTempFormData((prev) => ({
      ...prev,
      [field]: field === "custome_price" ? Number(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!tempFormData.custome_unit.trim()) {
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (validateForm() && setValue && index !== undefined) {
      // Cập nhật giá trị trong form chính
      const updatedServices = [...formServices];
      updatedServices[index] = {
        ...updatedServices[index],
        custome_price: tempFormData.custome_price,
        custome_unit: tempFormData.custome_unit,
      };

      setValue(name, updatedServices, { shouldValidate: true });

      // Gọi callback onSubmit nếu có
      if (onSubmit) {
        onSubmit(tempFormData);
      }

      // Đóng form
      if (onClose) {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa dịch vụ
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Service Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500">*</span> Phí dịch vụ
            </label>
            <input
              type="number"
              value={tempFormData.custome_price}
              onChange={(e) =>
                handleInputChange("custome_price", e.target.value)
              }
              placeholder="Nhập phí dịch vụ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500">*</span> Đơn vị đo
            </label>
            <input
              type="text"
              value={tempFormData.custome_unit}
              onChange={(e) =>
                handleInputChange("custome_unit", e.target.value)
              }
              placeholder="Nhập đơn vị đo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
            />
            {!tempFormData.custome_unit.trim() && (
              <p className="text-red-500 text-sm mt-1">
                Vui lòng nhập đơn vị đo
              </p>
            )}
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-full bg-[#1E88E5] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1565C0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:ring-offset-2"
          >
            CẬP NHẬT DỊCH VỤ
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
