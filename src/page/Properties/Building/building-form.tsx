"use client";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";
import MDEditor from "@uiw/react-md-editor";
import Select from "@/components/Input/selectAi";
import { getDistrict } from "@/utils/utils";
import { IBuilding, IDistrict } from "@/types/building";
import { Controller, useForm } from "react-hook-form";
import { DragAndDropInput } from "@/components/Input/file-upload-multiple";
import { URL_IMAGE } from "@/constants";

interface BuildingFormProps {
  building?: IBuilding;
  isOpen: boolean;
  onClose: () => void;
  onSave: (building: IBuilding) => void;
  mode: "add" | "edit";
}

export default function BuildingForm({
  building,
  isOpen,
  onClose,
  onSave,
  mode,
}: BuildingFormProps) {
  const [districts, setDistrict] = useState<IDistrict[]>([]);
  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: building
      ? building
      : {
          name: "",
          total_rooms: 0,
          total_floors: 0,
          year_constructions: "",
          specific_address: "",
          ward: "",
          city: "",
          area: "",
          description: "",
          lat: 0,
          lng: 0,
          google_map_link: "",
          district: {
            id: "",
            name: "",
          },
          building_image: null,
        },
  });

  const district = watch("district");
  const city = watch("city");

  useEffect(() => {
    if (mode === "edit" && building) {
      reset(building);
    } else if (mode === "add") {
      reset();
    }
  }, [building, mode, reset]);

  useEffect(() => {
    getDistrict().then((data) => {
      const result = data?.districts?.map((district) => ({
        id: district?.codename,
        name: district?.name,
      }));
      setDistrict(result);
    });
    // eslint-disable-next-line
  }, []);

  const districtsOptions = districts.map((district: any) => ({
    value: district.id,
    label: district.name,
  }));

  const onSubmit = (data: IBuilding) => {
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    onClose();
    if (mode === "add") reset();
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
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
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium text-gray-900"
                    >
                      {mode === "add"
                        ? "Thêm tòa nhà mới"
                        : "Chỉnh sửa tòa nhà"}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên tòa nhà
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                        </div>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="total_rooms"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tổng số phòng
                            </label>
                            <input
                              {...field}
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                      <Controller
                        name="total_floors"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tổng số tầng
                            </label>
                            <input
                              {...field}
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="year_constructions"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Năm xây dựng
                            </label>
                            <input
                              {...field}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                      <Controller
                        name="area"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Diện tích
                            </label>
                            <input
                              {...field}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="ward"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phường/Xã
                            </label>
                            <input
                              {...field}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                      <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Select
                              label="Quận/Huyện"
                              placeholder="Chọn quận/huyện"
                              options={districtsOptions}
                              value={field.value?.id || ""}
                              onChange={(value) => {
                                const selectedDistrict = districts.find(
                                  (district: any) => district.id === value
                                );
                                field.onChange(selectedDistrict || null);
                              }}
                            />
                          </div>
                        )}
                      />
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Thành phố
                            </label>
                            <input
                              {...field}
                              type="text"
                              value="Hà Nội"
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                    </div>

                    <Controller
                      name="specific_address"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ cụ thể
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                          </label>
                          <MDEditor
                            value={field.value}
                            onChange={field.onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                        </div>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="lat"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vĩ độ
                            </label>
                            <input
                              {...field}
                              type="number"
                              step="any"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                      <Controller
                        name="lng"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Kinh độ
                            </label>
                            <input
                              {...field}
                              type="number"
                              step="any"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                            />
                          </div>
                        )}
                      />
                    </div>

                    <Controller
                      name="google_map_link"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link Google Maps
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Ảnh
                    </label>

                    <Controller
                      name="building_image"
                      control={control}
                      render={({ field }) => {
                        const photoLink =
                          field.value && field.value.id
                            ? `${URL_IMAGE}/${field.value.id}/${field.value.filename_download}`
                            : undefined;
                        return (
                          <DragAndDropInput
                            onChange={(file) => {
                              field.onChange(file);
                            }}
                            maxFiles={1}
                            multiple
                            links={photoLink ? [photoLink] : []}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#1E88E5] rounded-md hover:bg-[#1976D2] transition-colors duration-200"
                    >
                      {mode === "add" ? "Thêm tòa nhà" : "Lưu thay đổi"}
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
}
