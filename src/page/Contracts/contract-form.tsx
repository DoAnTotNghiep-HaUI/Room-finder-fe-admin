"use client";

import React, { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { IRentalContract } from "@/types/contract";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { getListBuilding } from "@/redux/building/action";
import { getListRoomByBuilding } from "@/redux/room/action";
import { DragAndDropInput } from "@/components/Input/file-upload-multiple";
import { URL_IMAGE } from "@/constants";
import { uploadFilesToDirectus } from "@/utils/upload-file";
import {
  createContract,
  getListContractsByLandlord,
  updateContract,
} from "@/redux/contracts/action";
import { createRecentActivity } from "@/redux/recent-activities/action";
import dayjs from "dayjs";

interface ContractFormProps {
  contract: IRentalContract | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IRentalContract) => void;
  mode: "add" | "edit";
}

const ContractForm: React.FC<ContractFormProps> = ({
  contract,
  isOpen,
  onClose,
  onSubmit,
  mode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { buildingList } = useSelector((state: AppState) => state.building);
  const { roomByBuilding } = useSelector((state: AppState) => state.room);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const extractIdFromUrl = (url: string) => {
    const match = url.match(/assets\/([^/]+)/);
    return match ? match[1] : null;
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: contract || {
      contract_number: "",
      id_card: "",
      contract_file: null,
      tenant: null,
      tenant_dateofbirth: "",
      tenant_phone: "",
      tenant_permanent_address: "",
      citizen_id_issue_date: "",
      citizen_id_issue_place: "",
      room: null,
      contract_start_date: "",
      contract_end_date: "",
      contract_duration: 12,
      deposit: 0,
      monthly_rental: 0,
      status: "active",
      landlord: null,
      electric_price: "",
      water_price: "",
      wifi_price: "",
      general_service_price: "",
      security_price: "",
      parking_price: "",
      washing_price: "",
      elevator_price: "",
      gas_price: "",
    },
  });
  console.log("contract", contract);
  const selectedBuildingId = mode === "add" ? watch("room.building.id") : null;
  if (mode === "add") {
    useEffect(() => {
      if (isOpen) {
        dispatch(getListBuilding(userInfo?.id));
      }
    }, [isOpen, dispatch]);

    // Lấy danh sách phòng khi chọn tòa nhà
    useEffect(() => {
      if (selectedBuildingId) {
        dispatch(getListRoomByBuilding(selectedBuildingId as string));
        // Reset phòng khi đổi tòa nhà
        setValue("room.id", null);
      }
    }, [selectedBuildingId, dispatch, setValue]);
  }

  useEffect(() => {
    if (contract && mode === "edit") {
      setValue("tenant.id", contract.tenant.id);
      // setValue("contract_start_date", contract.contract_start_date);
      // setValue("contract_end_date", contract.contract_end_date);
      // setValue("tenant_dateofbirth", contract.tenant_dateofbirth);
      // setValue("citizen_issued_date", contract.citizen_issued_date);
      reset(contract);
    } else if (mode === "add") {
      reset({
        contract_number: "",
        id_card: "",
        tenant: null,
        tenant_dateofbirth: "",
        tenant_phone: "",
        tenant_permanent_address: "",
        citizen_id_issue_date: "",
        citizen_id_issue_place: "",
        room: null,
        contract_start_date: "",
        contract_end_date: "",
        contract_duration: 12,
        deposit: 0,
        monthly_rental: 0,
        status: "active",
        landlord: null,
        electric_price: "3800đ/kWh",
        water_price: "10000đ/Người",
        wifi_price: "100000đ/tháng",
        general_service_price: "0đ/tháng",
        security_price: "0đ/tháng",
        parking_price: "0đ/tháng",
        washing_price: "0đ/tháng",
        elevator_price: "0đ/tháng",
        gas_price: "0đ/tháng",
      });
    }
  }, [contract, mode, reset]);
  const tenantId = watch("tenant.id");
  const handleFormSubmit = async (data) => {
    let contractFileId: string | null = null;
    let imageFile = data.contract_file;
    if (Array.isArray(imageFile)) {
      imageFile = imageFile[0];
    }

    if (imageFile instanceof File) {
      const uploaded = await uploadFilesToDirectus([imageFile]);
      contractFileId = uploaded[0]?.id;
    } else if (typeof imageFile === "string") {
      contractFileId = extractIdFromUrl(imageFile);
    } else if (imageFile && imageFile.id) {
      contractFileId = imageFile.id;
    } else {
      contractFileId = null;
    }

    const formDataSubmit = {
      ...data,
      contract_file: contractFileId,
      room: data.room.id,
      landlord: contract?.landlord.id || userInfo?.id,
      tenant: data.tenant?.id,
    };
    if (mode === "edit") {
      await dispatch(
        updateContract({
          contractId: contract?.id,
          data: formDataSubmit,
        })
      );
      await dispatch(
        createRecentActivity({
          type: "contract",
          message: `Hợp đồng ${formDataSubmit.contract_number} đã được cập nhật`,
          landlord: userInfo.id,
        })
      );
    }
    if (mode === "add") {
      const today = dayjs().format("DDMMYY");
      const roomNumber = data.room?.number_room || data.room?.id || "";
      const contractNumber = `HD${today}${roomNumber}`;

      await dispatch(
        createContract({ ...formDataSubmit, contract_number: contractNumber })
      );
      await dispatch(
        createRecentActivity({
          type: "contract",
          message: `Hợp đồng ${contractNumber} đã được tạo`,
          landlord: userInfo.id,
        })
      );
    }
    await dispatch(getListContractsByLandlord(userInfo?.id));
    onSubmit(formDataSubmit);
    console.log("form data", formDataSubmit);

    reset();
    onClose();
    toast.success(
      mode === "add"
        ? "Đã thêm hợp đồng thành công"
        : "Đã cập nhật hợp đồng thành công"
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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-6 flex items-center justify-between"
                >
                  {mode === "add" ? "Thêm hợp đồng mới" : "Chỉnh sửa hợp đồng"}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contract Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Thông tin hợp đồng
                      </h4>
                      <div className="space-y-3">
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số hợp đồng *
                          </label>
                          <input
                            {...register("contract_number", {
                              required: "Số hợp đồng là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.contract_number && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contract_number.message}
                            </p>
                          )}
                        </div> */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày bắt đầu *
                          </label>
                          <input
                            type="date"
                            {...register("contract_start_date", {
                              required: "Ngày bắt đầu là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.contract_start_date && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contract_start_date.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày kết thúc *
                          </label>
                          <input
                            type="date"
                            {...register("contract_end_date", {
                              required: "Ngày kết thúc là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.contract_end_date && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contract_end_date.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời hạn (tháng) *
                          </label>
                          <input
                            type="number"
                            {...register("contract_duration", {
                              required: "Thời hạn là bắt buộc",
                              min: 1,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.contract_duration && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contract_duration.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            File hợp đồng
                          </label>
                          <Controller
                            name="contract_file"
                            control={control}
                            render={({ field }) => {
                              const fileLink =
                                field.value &&
                                typeof field.value === "object" &&
                                field.value.id
                                  ? `${URL_IMAGE}/${field.value.id}/${field.value.filename_download}`
                                  : undefined;
                              return (
                                <>
                                  <DragAndDropInput
                                    onChange={(file) => {
                                      field.onChange(file);
                                    }}
                                    multiple
                                    maxFiles={1}
                                    links={fileLink ? [fileLink] : []}
                                  />
                                </>
                              );
                            }}
                          />
                          {errors.contract_duration && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contract_duration.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tenant Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Thông tin người thuê
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Người thuê *
                          </label>
                          <input
                            {...register("tenant.id", {
                              required: "Thông tin người thuê là bắt buộc",
                            })}
                            value={tenantId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {/* {errors.tenant && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.tenant.message}
                            </p>
                          )} */}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày sinh *
                          </label>
                          <input
                            type="date"
                            {...register("tenant_dateofbirth", {
                              required: "Ngày sinh là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.tenant_dateofbirth && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.tenant_dateofbirth.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại *
                          </label>
                          <input
                            {...register("tenant_phone", {
                              required: "Số điện thoại là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.tenant_phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.tenant_phone.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CCCD/CMND *
                          </label>
                          <input
                            {...register("id_card", {
                              required: "CCCD/CMND là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.id_card && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.id_card.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày cấp *
                          </label>
                          <input
                            type="date"
                            {...register("citizen_id_issue_date", {
                              required: "Ngày cấp là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.citizen_id_issue_date && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.citizen_id_issue_date.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nơi cấp *
                          </label>
                          <input
                            {...register("citizen_id_issue_place", {
                              required: "Nơi cấp là bắt buộc",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.citizen_id_issue_place && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.citizen_id_issue_place.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hộ khẩu thường trú *
                          </label>
                          <textarea
                            {...register("tenant_permanent_address", {
                              required: "Hộ khẩu thường trú là bắt buộc",
                            })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {errors.tenant_permanent_address && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.tenant_permanent_address.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Landlord Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Thông tin chủ nhà
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chủ nhà *
                          </label>
                          <input
                            value={
                              contract
                                ? `${contract?.landlord?.first_name} ${contract?.landlord?.last_name}`
                                : `${userInfo?.first_name} ${userInfo?.last_name}`
                            }
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                          {/* {errors.landlord && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.landlord.message}
                            </p>
                          )} */}
                        </div>
                      </div>
                    </div>

                    {/* Property Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Thông tin phòng
                      </h4>
                      {mode === "edit" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phòng *
                            </label>
                            <input
                              value={`${contract?.room?.number_room} - ${contract?.room?.building?.name}`}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                            {/* {errors.room && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.room.message}
                            </p>
                          )} */}
                          </div>
                        </div>
                      )}
                      {mode === "add" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tòa nhà *
                            </label>
                            <Controller
                              name="room.building.id"
                              control={control}
                              rules={{ required: "Vui lòng chọn tòa nhà" }}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  <option value="">Chọn tòa nhà</option>
                                  {buildingList?.map((b: any) => (
                                    <option
                                      key={b.id}
                                      value={b.id}
                                    >
                                      {b.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phòng *
                            </label>
                            <Controller
                              name="room.id"
                              control={control}
                              rules={{ required: "Vui lòng chọn phòng" }}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  disabled={!selectedBuildingId}
                                >
                                  <option value="">Chọn phòng</option>
                                  {roomByBuilding?.map((room: any) => (
                                    <option
                                      key={room.id}
                                      value={room.id}
                                    >
                                      {room.number_room}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Thông tin giá thuê và phí dịch vụ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiền thuê hàng tháng (VNĐ) *
                        </label>
                        <input
                          type="number"
                          {...register("monthly_rental", {
                            required: "Tiền thuê là bắt buộc",
                            min: 0,
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                        {errors.monthly_rental && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.monthly_rental.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiền đặt cọc
                        </label>
                        <input
                          type="number"
                          {...register("deposit", {
                            required: "Tiền đặt cọc là bắt buộc",
                            min: 0,
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                        {errors.deposit && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.deposit.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá điện
                        </label>
                        <input
                          type="text"
                          {...register("electric_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá nước
                        </label>
                        <input
                          type="text"
                          {...register("water_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí wifi
                        </label>
                        <input
                          type="text"
                          {...register("wifi_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí dịch vụ chung
                        </label>
                        <input
                          type="text"
                          {...register("general_service_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí bảo vệ
                        </label>
                        <input
                          type="text"
                          {...register("security_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí gửi xe
                        </label>
                        <input
                          type="text"
                          {...register("parking_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí giặt ủi
                        </label>
                        <input
                          type="text"
                          {...register("washing_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí thang máy
                        </label>
                        <input
                          type="text"
                          {...register("elevator_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phí gas
                        </label>
                        <input
                          type="text"
                          {...register("gas_price")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái
                        </label>
                        <select
                          {...register("status")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                        >
                          <option value="active">Còn hạn</option>
                          <option value="expired">Hết hạn</option>
                          <option value="terminated">Đã chấm dứt</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded-lg transition-colors"
                    >
                      {mode === "add" ? "Thêm hợp đồng" : "Cập nhật hợp đồng"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContractForm;
