"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiX,
  FiUser,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";
import { IRentalContract } from "@/types/contract";
import { URL_IMAGE } from "@/constants";

interface ContractViewProps {
  contract: IRentalContract | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContractView: React.FC<ContractViewProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Còn hạn", className: "bg-green-100 text-green-800" },
      expired: { label: "Hết hạn", className: "bg-red-100 text-red-800" },
      terminated: {
        label: "Đã chấm dứt",
        className: "bg-gray-100 text-gray-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={React.Fragment}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-6 flex items-center justify-between"
                >
                  Chi tiết hợp đồng {contract?.contract_number}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </Dialog.Title>

                {contract && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tenant Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiUser className="text-[#1E88E5]" />
                        Thông tin người thuê
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="text-sm text-gray-600">
                            Người thuê
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.tenant.first_name}{" "}
                            {contract.tenant.last_name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Ngày sinh
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatDate(contract.tenant_dateofbirth)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Số điện thoại
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.tenant_phone}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            CCCD/CMND
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.id_card}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Ngày cấp
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatDate(contract.citizen_id_issue_date)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Nơi cấp
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.citizen_id_issue_place}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Hộ khẩu thường trú
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.tenant_permanent_address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Landlord Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiHome className="text-[#1E88E5]" />
                        Thông tin chủ nhà
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="text-sm text-gray-600">
                            Chủ nhà
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.landlord.first_name}{" "}
                            {contract.landlord.last_name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Số điện thoại
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.landlord.phone_number}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Property Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiMapPin className="text-[#1E88E5]" />
                        Thông tin phòng
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div>
                          <p className="font-medium text-gray-900">
                            Phòng {contract.room.number_room} - Tầng{" "}
                            {contract.room.floor} -{" "}
                            {contract.room.building.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Địa chỉ toà nhà
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.room.building.specific_address},{" "}
                            {contract.room.building.ward},{" "}
                            {contract.room.building.district.name},{" "}
                            {contract.room.building.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contract Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiCalendar className="text-[#1E88E5]" />
                        Thông tin hợp đồng
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="text-sm text-gray-600">
                            Ngày bắt đầu
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatDate(contract.contract_start_date)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Ngày kết thúc
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatDate(contract.contract_end_date)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Thời hạn
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.contract_duration} tháng
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Trạng thái
                          </label>
                          <div className="mt-1">
                            {getStatusBadge(contract.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiCreditCard className="text-[#1E88E5]" />
                        Thông tin tài chính
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pl-6">
                        <div>
                          <label className="text-sm text-gray-600">
                            Tiền thuê hàng tháng
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(contract.monthly_rental)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Tiền đặt cọc
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(contract.deposit)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Giá điện
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.electric_price}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Giá nước (VNĐ/m³)
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.water_price}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Phí wifi
                          </label>
                          <p className="font-medium text-gray-900">
                            {contract.wifi_price}
                          </p>
                        </div>
                        {contract.general_service_price && (
                          <div>
                            <label className="text-sm text-gray-600">
                              Phí dịch vụ chung
                            </label>
                            <p className="font-medium text-gray-900">
                              {contract.general_service_price}
                            </p>
                          </div>
                        )}
                        {contract.security_price && (
                          <div>
                            <label className="text-sm text-gray-600">
                              Phí bảo vệ
                            </label>
                            <p className="font-medium text-gray-900">
                              {contract.security_price}
                            </p>
                          </div>
                        )}
                        {contract.parking_price && (
                          <div>
                            <label className="text-sm text-gray-600">
                              Phí gửi xe
                            </label>
                            <p className="font-medium text-gray-900">
                              {contract.parking_price}
                            </p>
                          </div>
                        )}
                        {contract.washing_price && (
                          <div>
                            <label className="text-sm text-gray-600">
                              Phí giặt ủi
                            </label>
                            <p className="font-medium text-gray-900">
                              {contract.washing_price}
                            </p>
                          </div>
                        )}
                        {contract.elevator_price && (
                          <div>
                            <label className="text-sm text-gray-600">
                              Phí thang máy
                            </label>
                            <p className="font-medium text-gray-900">
                              {contract.elevator_price}
                            </p>
                          </div>
                        )}
                        {contract.gas_price && (
                          <div>
                            <label className="text-sm text-gray-600">
                              Phí gas
                            </label>
                            <p className="font-medium text-gray-900">
                              {contract.gas_price}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiCreditCard className="text-[#1E88E5]" />
                        Hợp đồng thuê nhà
                      </h4>
                      <iframe
                        src={`${URL_IMAGE}/${contract.contract_file.id}/${contract.contract_file.filename_download}`}
                        className="w-full h-[600px] border"
                      ></iframe>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContractView;
