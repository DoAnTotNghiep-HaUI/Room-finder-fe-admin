import { URL_IMAGE } from "@/constants";
import { IBuilding } from "@/types/building";
import { IFile } from "@/types/file";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiX, FiMap } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import ReactMark from "react-markdown";

interface BuildingViewProps {
  building: IBuilding;
  isOpen: boolean;
  onClose: () => void;
}

export default function BuildingView({
  building,
  isOpen,
  onClose,
}: BuildingViewProps) {
  const fullAddress = `${building.specific_address}, ${building.ward}, ${building.district.name}, ${building.city}`;

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold text-gray-900"
                  >
                    {building.name}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img
                      src={`${URL_IMAGE}/${building.building_image?.id}/${building.building_image?.filename_download}`}
                      alt={building.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Địa chỉ
                        </label>
                        <p className="text-gray-900">{fullAddress}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Tổng số phòng
                          </label>
                          <p className="text-gray-900 font-medium">
                            {building.total_rooms} phòng
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Tổng số tầng
                          </label>
                          <p className="text-gray-900 font-medium">
                            {building.total_floors} tầng
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Năm xây dựng
                        </label>
                        <p className="text-gray-900 font-medium">
                          {building.year_constructions}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Chủ nhà
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        {building.landlord.avatar && (
                          <img
                            src={`${URL_IMAGE}/${building.landlord.avatar?.id}/${building.landlord.avatar?.filename_download}`}
                            alt={`${building.landlord.first_name} ${building.landlord.last_name}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {building.landlord.first_name}{" "}
                            {building.landlord.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {building.landlord.email}
                          </p>
                          {building.landlord.phone && (
                            <p className="text-sm text-gray-600">
                              {building.landlord.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Mô tả
                      </label>
                      <ReactMarkdown>{building.description}</ReactMarkdown>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Vị trí
                      </label>
                      <div className="space-y-2 mt-1">
                        <p className="text-sm text-gray-900">
                          <strong>Diện tích :</strong> {building.area}m2
                        </p>
                        <p className="text-sm text-gray-900">
                          <strong>Tọa độ:</strong> {building.lat},{" "}
                          {building.lng}
                        </p>
                        {building.google_map_link && (
                          <button
                            onClick={() =>
                              window.open(building.google_map_link, "_blank")
                            }
                            className="mt-2 px-3 py-2 text-sm font-medium rounded-md border border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white transition-colors duration-200 flex items-center gap-2"
                          >
                            <FiMap className="w-4 h-4" />
                            Xem trên Google Maps
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
