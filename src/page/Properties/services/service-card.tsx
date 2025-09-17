import { URL_IMAGE } from "@/constants";
import { AppDispatch, AppState } from "@/redux";
import { IService } from "@/types/room";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { BiEdit, BiCheck, BiX, BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
type SelectedService = IService & {
  custome_price?: number;
  custome_unit?: string;
};
interface ServiceCardProps {
  service: any;
  onEdit: (service: IService, index: number) => void;
  onDelete: (serviceId: string) => void;
  index: number;
}

interface ServiceCardGridProps {
  servicesList: IService[];
  // services: IService[];
  onEdit: (service: IService, index: number) => void;
  onAdd: (service: IService) => void;
  onDelete: (serviceId: string) => void;
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
  name: string;
}

function ServiceCard({ service, onEdit, onDelete, index }: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Edit Button */}
      <button
        onClick={(e: React.MouseEvent) => {
          onEdit(service, index);
          e.stopPropagation();
          e.preventDefault();
        }}
        className="absolute top-3 right-10 p-1.5 text-gray-400 hover:text-[#1E88E5] hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Chỉnh sửa dịch vụ"
      >
        <BiEdit className="w-4 h-4" />
      </button>

      <button
        onClick={() => onDelete(service?.id)}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        aria-label="Xóa dịch vụ"
      >
        <BiX className="w-4 h-4" />
      </button>

      {/* Service Icon */}
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <img
            src={`${URL_IMAGE}/${service?.icon?.id}/${service?.icon?.filename_download}`}
            alt={service.name}
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      {/* Service Name */}
      <h3 className="text-center text-gray-800 font-medium mb-2">
        {service.name}
      </h3>

      {/* Service Price */}
      <p className="text-center text-orange-500 font-semibold text-lg">
        {formatPrice(
          service.custome_price != null
            ? Number(service.custome_price)
            : Number(service.default_price)
        )}{" "}
        đ/ {service.custome_unit || service.unit}
      </p>
    </motion.div>
  );
}

function ServiceSelectionModal({
  isOpen,
  onClose,
  onSelectService,
  selectedServiceIds,
  servicesList,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: IService) => void;
  selectedServiceIds: string[];
  servicesList: IService[];
}) {
  if (!isOpen) return null;
  // const { servicesList } = useSelector((state: AppState) => state.services);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
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
          className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Chọn dịch vụ
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <BiX className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {servicesList?.map((service) => {
              const isSelected = selectedServiceIds?.includes(service?.id);
              const isDisabled = isSelected;

              return (
                <motion.button
                  key={service.id}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  onClick={() => !isDisabled && onSelectService(service)}
                  disabled={isDisabled}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                    isDisabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-200 hover:border-[#1E88E5] hover:bg-blue-50 cursor-pointer"
                  }`}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#1E88E5] rounded-full flex items-center justify-center">
                      <BiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Service Icon */}
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10  rounded-full flex items-center justify-center">
                      <img
                        src={`${URL_IMAGE}/${service?.icon?.id}/${service?.icon?.filename_download}`}
                        alt={service?.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>

                  {/* Service Name */}
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    {service?.name}
                  </h4>

                  {/* Service Price */}
                  <p className="text-xs text-orange-500 font-semibold">
                    {formatPrice(service?.default_price)}đ/{service?.unit}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AddServiceCard({ onAdd }: { onAdd: (e: React.MouseEvent) => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#1E88E5] hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px]"
    >
      <div className="w-12 h-12 bg-[#1E88E5] rounded-full flex items-center justify-center mb-3">
        <BiPlus className="w-6 h-6 text-white" />
      </div>
      <span className="text-gray-600 font-medium">Thêm dịch vụ</span>
    </motion.button>
  );
}

export default function ServiceCardGrid({
  servicesList,
  // services,
  onEdit,
  onAdd,
  onDelete,
  name,
  setValue,
  watch,
}: ServiceCardGridProps) {
  const formServices: SelectedService[] = watch ? watch(name) || [] : [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddService = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };
  const handleSelectService = (service: IService) => {
    const newService: SelectedService = {
      ...service,
      custome_price: null,
      custome_unit: null,
    };

    onAdd(service);
    if (setValue) {
      setValue(name, [...formServices, newService], { shouldValidate: true });
    }
    setIsModalOpen(false);
  };

  const handleDeleteService = (serviceId: string) => {
    onDelete(serviceId);

    if (setValue) {
      setValue(
        name,
        formServices.filter((s) => s.id !== serviceId),
        { shouldValidate: true }
      );
    }
  };

  // Lọc danh sách services từ form để hiển thị
  // const selectedServices = servicesList.filter((s) =>
  //   formServiceIds.includes(s.id)
  // );

  // const selectedServiceIds = services.map((service) => service.id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index} // Truyền index
            onEdit={onEdit}
            onDelete={handleDeleteService}
          />
        ))}
        <AddServiceCard onAdd={handleAddService} />
      </div>

      <ServiceSelectionModal
        servicesList={servicesList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectService={handleSelectService}
        selectedServiceIds={formServices.map((s) => s.id)}
      />
    </div>
  );
}
