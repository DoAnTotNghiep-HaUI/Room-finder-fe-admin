import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FiX,
  FiSave,
  FiCalendar,
  FiZap,
  FiDroplet,
  FiSettings,
  FiPlus,
  FiMinus,
  FiFileText,
} from "react-icons/fi";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { IRoom, IService } from "@/types/room";
import { IInvoice, IInvoiceService } from "@/types/invoice";
import App from "@/App";
import { AppDispatch, AppState } from "@/redux";
import { useDispatch, useSelector } from "react-redux";
import { getListServices } from "@/redux/services/action";

interface InvoiceFormProps {
  room: IRoom;
  invoice?: IInvoice | null;
  onSave: (invoiceData: Partial<IInvoice>) => void;
  onClose: () => void;
}

interface FormData {
  from_date: string;
  to_date: string;
  electricity_old_index: number;
  electricity_new_index: number;
  electricity_price: number;
  water_calculation_type: "meter" | "per_person";
  water_old_index: number;
  water_new_index: number;
  water_price: number;
  water_people_count: number;
  services: {
    service_id: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  description: string;
}

// const mockServices: IService[] = [
//   { id: "1", name: "Wifi", default_price: 100000, unit: "tháng" },
//   { id: "2", name: "Giặt đồ", default_price: 50000, unit: "lần" },
//   { id: "3", name: "Xe máy", default_price: 100000, unit: "xe" },
//   { id: "4", name: "Xe đạp", default_price: 50000, unit: "xe" },
//   { id: "5", name: "Xe điện", default_price: 150000, unit: "xe" },
//   { id: "6", name: "Dịch vụ chung", default_price: 300000, unit: "người" },
//   { id: "7", name: "Bảo vệ", default_price: 100000, unit: "tháng" },
// ];

export default function InvoiceForm({
  room,
  invoice,
  onSave,
  onClose,
}: InvoiceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { servicesList } = useSelector((state: AppState) => state.services);
  const { invoices } = useSelector((state: AppState) => state.invoice);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedServices, setSelectedServices] = useState<IInvoiceService[]>(
    []
  );
  console.log("room", room);
  const getElectricService = () =>
    room.services.find((service) => service.name.toLowerCase() === "điện");
  const getWaterService = () =>
    room.services.find((service) => service.name.toLowerCase() === "nước");

  const electricService = getElectricService();
  const waterService = getWaterService();

  const defaultElectricPrice =
    electricService?.custome_price ?? electricService?.default_price ?? 0;

  const defaultWaterPrice =
    waterService?.custome_price ?? waterService?.default_price ?? 0;

  const defaultWaterType =
    waterService?.custome_unit?.toLowerCase() === "người"
      ? "per_person"
      : waterService?.custome_unit?.toLowerCase() === "m3"
      ? "meter"
      : "meter";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      from_date: invoice?.from_date || new Date().toISOString().split("T")[0],
      to_date: invoice?.to_date || new Date().toISOString().split("T")[0],
      electricity_old_index: invoice?.electricity_old_index || 0,
      electricity_new_index: invoice?.electricity_new_index || 0,
      electricity_price: invoice?.electricity_price ?? defaultElectricPrice,
      water_calculation_type:
        invoice?.water_calculation_type ?? defaultWaterType,
      water_old_index: invoice?.water_old_index || 0,
      water_new_index: invoice?.water_new_index || 0,
      water_price: invoice?.water_price ?? defaultWaterPrice,
      water_people_count: invoice?.water_people_count || 1,
      // services: invoice?.services || [],
      description: invoice?.description || "",
    },
  });

  const watchedValues = watch();
  useEffect(() => {
    dispatch(getListServices());
  }, []);
  const serviceOptions = servicesList?.filter(
    (service) =>
      service.name.toLowerCase() !== "điện" &&
      service.name.toLowerCase() !== "nước"
  );
  useEffect(() => {
    if (!invoice) {
      const defaultSelected = room.services
        .filter(
          (service) =>
            service.name.toLowerCase() !== "điện" &&
            service.name.toLowerCase() !== "nước"
        )
        .map((service) => ({
          id: service.id,
          quantity: 1,
          unit_price: service.custome_price ?? service.default_price ?? 0,
          name: service.name,
          unit: service.unit,
          total: service.custome_price ?? service.default_price ?? 0,
        }));
      setSelectedServices(defaultSelected);
    }
  }, [invoice, room.services]);
  console.log("selectedServices", selectedServices);
  // Calculate days between dates
  const calculateDays = (fromDate: string, toDate: string) => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Calculate electricity
  const calculateElectricity = () => {
    const usage = Math.max(
      0,
      watchedValues.electricity_new_index - watchedValues.electricity_old_index
    );
    return usage * watchedValues.electricity_price;
  };

  // Calculate water
  const calculateWater = () => {
    if (watchedValues.water_calculation_type === "meter") {
      const usage = Math.max(
        0,
        watchedValues.water_new_index - watchedValues.water_old_index
      );
      return usage * watchedValues.water_price;
    } else {
      return watchedValues.water_people_count * watchedValues.water_price;
    }
  };

  // Calculate services total
  const calculateServicesTotal = () => {
    return selectedServices.reduce(
      (total, service) => total + service.quantity * service.unit_price,
      0
    );
  };

  // Calculate room price based on days
  const calculateRoomPrice = () => {
    // const days = calculateDays(watchedValues.from_date, watchedValues.to_date);
    const monthlyPrice = room.room_price;
    return Math.round(monthlyPrice);
  };

  // Calculate total
  const calculateTotal = () => {
    return (
      calculateRoomPrice() +
      calculateElectricity() +
      calculateWater() +
      calculateServicesTotal()
    );
  };

  const addService = (service: IService) => {
    const existingService = selectedServices.find((s) => s.id === service.id);
    if (existingService) {
      setSelectedServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      );
    } else {
      setSelectedServices((prev) => [
        ...prev,
        {
          id: service.id,
          quantity: 1,
          unit_price: service.default_price,
          name: service.name,
          unit: service.unit,
          total: service.default_price,
        },
      ]);
    }
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    } else {
      setSelectedServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, quantity } : s))
      );
    }
  };

  const onSubmit = (data: FormData) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const invoiceOrder = invoices.length + 1;
    const invoiceData: Partial<IInvoice> = {
      ...data,
      // room,
      contract: room.contract!,
      invoice_number:
        invoice?.invoice_number || `HD${invoiceOrder}${month}${year}`,
      // days_count: calculateDays(data.from_date, data.to_date),
      // room_price: calculateRoomPrice(),
      electricity_usage: Math.max(
        0,
        data.electricity_new_index - data.electricity_old_index
      ),
      electricity_total: calculateElectricity(),
      water_usage:
        data.water_calculation_type === "meter"
          ? Math.max(0, data.water_new_index - data.water_old_index)
          : data.water_people_count,
      water_total: calculateWater(),
      services: selectedServices,
      total_amount: calculateTotal(),
      status: invoice?.status || "unpaid",
      date_updated: new Date().toISOString(),
    };
    console.log("invoiceSubmit", invoiceData);

    onSave(invoiceData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    if (invoice?.services) {
      setSelectedServices(invoice.services);
    }
  }, [invoice]);

  return (
    <Transition
      appear
      show={isOpen}
      as={React.Fragment}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={handleClose}
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-foreground">
                    {invoice ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn mới"}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-muted-foreground" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Room Info */}
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">
                      Thông tin phòng
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Phòng:</span>
                        <p className="font-medium text-foreground">
                          {room.number_room}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Khách thuê:
                        </span>
                        <p className="font-medium text-foreground">
                          {`${room.contract?.tenant?.first_name} ${room.contract?.tenant?.last_name}` ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Mã hợp đồng:
                        </span>
                        <p className="font-medium text-foreground">
                          {room.contract?.contract_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Giá phòng:
                        </span>
                        <p className="font-medium text-foreground">
                          {formatCurrency(room.room_price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FiCalendar className="text-primary" />
                      <h3 className="font-semibold text-foreground">
                        Thời gian
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Từ ngày
                        </label>
                        <Controller
                          name="from_date"
                          control={control}
                          rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        />
                        {errors.from_date && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.from_date.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Đến ngày
                        </label>
                        <Controller
                          name="to_date"
                          control={control}
                          rules={{ required: "Vui lòng chọn ngày kết thúc" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        />
                        {errors.to_date && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.to_date.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Số ngày
                        </label>
                        <div className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground">
                          {calculateDays(
                            watchedValues.from_date,
                            watchedValues.to_date
                          )}{" "}
                          ngày
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room Price */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-4">
                      Tiền phòng
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {formatCurrency(room.room_price)}/tháng × 30{" "}
                        {/* {calculateDays(
                          watchedValues.from_date,
                          watchedValues.to_date
                        )}{" "} */}
                        ngày
                      </span>
                      <span className="font-bold text-primary text-lg">
                        {formatCurrency(calculateRoomPrice())}
                      </span>
                    </div>
                  </div>

                  {/* Electricity */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FiZap className="text-yellow-500" />
                      <h3 className="font-semibold text-foreground">
                        Tiền điện
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Chỉ số cũ
                        </label>
                        <Controller
                          name="electricity_old_index"
                          control={control}
                          rules={{
                            required: "Vui lòng nhập chỉ số cũ",
                            min: 0,
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Chỉ số mới
                        </label>
                        <Controller
                          name="electricity_new_index"
                          control={control}
                          rules={{
                            required: "Vui lòng nhập chỉ số mới",
                            min: 0,
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Đơn giá (VNĐ/kWh)
                        </label>
                        <Controller
                          name="electricity_price"
                          control={control}
                          rules={{ required: "Vui lòng nhập đơn giá", min: 0 }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Thành tiền
                        </label>
                        <div className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground font-medium">
                          {formatCurrency(calculateElectricity())}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Số điện sử dụng:{" "}
                      {Math.max(
                        0,
                        watchedValues.electricity_new_index -
                          watchedValues.electricity_old_index
                      )}{" "}
                      kWh
                    </div>
                  </div>

                  {/* Water */}
                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FiDroplet className="text-blue-500" />
                      <h3 className="font-semibold text-foreground">
                        Tiền nước
                      </h3>
                    </div>

                    <div className="mb-4">
                      <Controller
                        name="water_calculation_type"
                        control={control}
                        render={({ field }) => (
                          <Listbox
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <div className="relative">
                              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-input py-2 pl-3 pr-10 text-left border border-border focus:outline-none focus:ring-2 focus:ring-ring">
                                <span className="block truncate text-foreground">
                                  {field.value === "meter"
                                    ? "Tính theo chỉ số"
                                    : "Tính theo đầu người"}
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-border focus:outline-none z-10">
                                  <Listbox.Option
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none py-2 pl-3 pr-4 rounded-sm ${
                                        active
                                          ? "bg-primary text-primary-foreground"
                                          : "text-popover-foreground"
                                      }`
                                    }
                                    value="meter"
                                  >
                                    Tính theo chỉ số
                                  </Listbox.Option>
                                  <Listbox.Option
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none py-2 pl-3 pr-4 rounded-sm ${
                                        active
                                          ? "bg-primary text-primary-foreground"
                                          : "text-popover-foreground"
                                      }`
                                    }
                                    value="per_person"
                                  >
                                    Tính theo đầu người
                                  </Listbox.Option>
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        )}
                      />
                    </div>

                    {watchedValues.water_calculation_type === "meter" ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Chỉ số cũ
                          </label>
                          <Controller
                            name="water_old_index"
                            control={control}
                            rules={{
                              required: "Vui lòng nhập chỉ số cũ",
                              min: 0,
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Chỉ số mới
                          </label>
                          <Controller
                            name="water_new_index"
                            control={control}
                            rules={{
                              required: "Vui lòng nhập chỉ số mới",
                              min: 0,
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Đơn giá (VNĐ/m³)
                          </label>
                          <Controller
                            name="water_price"
                            control={control}
                            rules={{
                              required: "Vui lòng nhập đơn giá",
                              min: 0,
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Thành tiền
                          </label>
                          <div className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground font-medium">
                            {formatCurrency(calculateWater())}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Số người
                          </label>
                          <Controller
                            name="water_people_count"
                            control={control}
                            rules={{
                              required: "Vui lòng nhập số người",
                              min: 1,
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Đơn giá (VNĐ/người)
                          </label>
                          <Controller
                            name="water_price"
                            control={control}
                            rules={{
                              required: "Vui lòng nhập đơn giá",
                              min: 0,
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Thành tiền
                          </label>
                          <div className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground font-medium">
                            {formatCurrency(calculateWater())}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FiSettings className="text-primary" />
                      <h3 className="font-semibold text-foreground">
                        Dịch vụ phát sinh
                      </h3>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Thêm dịch vụ
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {serviceOptions?.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => addService(service)}
                            className="p-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
                          >
                            <FiPlus className="inline mr-1" />
                            {service.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">
                          Dịch vụ đã chọn
                        </h4>
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <span className="text-foreground">
                              {service.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateServiceQuantity(
                                      service.id,
                                      service.quantity - 1
                                    )
                                  }
                                  className="p-1 hover:bg-background rounded"
                                >
                                  <FiMinus className="text-sm" />
                                </button>
                                <span className="w-8 text-center text-foreground">
                                  {service.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateServiceQuantity(
                                      service.id,
                                      service.quantity + 1
                                    )
                                  }
                                  className="p-1 hover:bg-background rounded"
                                >
                                  <FiPlus className="text-sm" />
                                </button>
                              </div>
                              <span className="text-foreground font-medium">
                                {formatCurrency(
                                  service.quantity * service.unit_price
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="font-medium text-foreground">
                            Tổng dịch vụ:
                          </span>
                          <span className="font-bold text-primary">
                            {formatCurrency(calculateServicesTotal())}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FiFileText className="text-primary" />
                      <h3 className="font-semibold text-foreground">Ghi chú</h3>
                    </div>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Nhập ghi chú cho hóa đơn..."
                          className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      )}
                    />
                  </div>

                  {/* Total */}
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-foreground">
                        Tổng cộng:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <FiSave />
                      {invoice ? "Cập nhật" : "Tạo hóa đơn"}
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
