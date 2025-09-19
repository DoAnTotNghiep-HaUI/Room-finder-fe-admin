"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiHome,
  FiLayers,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import BuildingView from "./building-view";
import BuildingForm from "./building-form";
import { IBuilding } from "@/types/building";
import { URL_IMAGE } from "@/constants";
import { uploadFilesToDirectus } from "@/utils/upload-file";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { getListBuilding, updateBuilding } from "@/redux/building/action";

interface BuildingCardProps {
  building: IBuilding;
  onView?: (building: IBuilding) => void;
  onEdit?: (building: IBuilding) => void;
  onDelete?: (buildingId: string) => void;
}

export default function BuildingManagement({
  building,
  onView,
  onEdit,
  onDelete,
}: BuildingCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleView = () => {
    setShowDetailModal(true);
    onView?.(building);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedBuilding: IBuilding) => {
    onEdit?.({ ...updatedBuilding, id: building.id });
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete?.(building.id);
    setShowDeleteDialog(false);
  };

  const fullAddress = `${building.specific_address}, ${building.ward}, ${building.district.name}, ${building.city}`;

  return (
    <>
      <div className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white rounded-lg overflow-hidden">
        <div className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={`${URL_IMAGE}/${building.building_image?.id}/${building.building_image?.filename_download}`}
              alt={building.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-[#1E88E5] text-white px-2 py-1 rounded-md text-xs font-medium">
                {building.year_constructions}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                {building.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                <FiMapPin className="inline w-4 h-4 mr-1" />
                {fullAddress}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FiHome className="w-4 h-4 text-[#1E88E5]" />
                <span className="text-gray-600">Phòng:</span>
                <span className="font-medium text-gray-900">
                  {building.total_rooms}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiLayers className="w-4 h-4 text-[#1E88E5]" />
                <span className="text-gray-600">Tầng:</span>
                <span className="font-medium text-gray-900">
                  {building.total_floors}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <FiUser className="w-4 h-4 text-[#1E88E5]" />
              <span className="text-gray-600">Chủ nhà:</span>
              <span className="font-medium text-gray-900">
                {building.landlord.first_name} {building.landlord.last_name}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleView}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md border border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <FiEye className="w-4 h-4" />
                Xem
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <FiEdit2 className="w-4 h-4" />
                Sửa
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <FiTrash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <BuildingView
        building={building}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <BuildingForm
        building={building}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <Transition
        appear
        show={showDeleteDialog}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setShowDeleteDialog}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-2"
                  >
                    Xác nhận xóa tòa nhà
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa tòa nhà "{building.name}" không?
                      Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu
                      liên quan đến tòa nhà này.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Xóa tòa nhà
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
