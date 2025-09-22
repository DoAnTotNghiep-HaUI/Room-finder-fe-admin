"use client";

import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiPlus,
  FiEye,
  FiTrash2,
  FiFileText,
  FiX,
} from "react-icons/fi";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import InvoiceForm from "./invoice-form";
import { IBuilding } from "@/types/building";
import { IInvoice } from "@/types/invoice";
import { IRoom } from "@/types/room";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { getListBuilding } from "@/redux/building/action";
import {
  getListRoomByBuilding,
  getListRoomByLandlord,
} from "@/redux/room/action";
import InvoiceView from "./invoice-view";
import { getInvoicesByBuilding } from "@/redux/invoice/action";

export default function InvoiceManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { buildingList } = useSelector((state: AppState) => state.building);
  const { roomList, roomByBuilding, searchParam } = useSelector(
    (state: AppState) => state.room
  );
  const { invoices } = useSelector((state: AppState) => state.invoice);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );
  const [allInvoices, setAllInvoices] = useState<IInvoice[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<IInvoice | null>(null);
  console.log("allInvoices", allInvoices);

  useEffect(() => {
    dispatch(getListBuilding(userInfo?.id));
  }, [userInfo]);
  useEffect(() => {
    dispatch(getListRoomByBuilding(selectedBuilding?.id));
    dispatch(getInvoicesByBuilding(selectedBuilding?.id));
  }, [selectedBuilding]);
  useEffect(() => {
    setAllInvoices(invoices);
  }, [invoices]);
  const filteredRooms = selectedBuilding
    ? roomList?.filter((room) => room.building.id === selectedBuilding.id)
    : [];

  const getRoomInvoices = (roomId: string) => {
    return allInvoices?.filter(
      (invoice) => invoice.contract.room.id === roomId
    );
  };

  const handleCreateInvoice = (room: IRoom) => {
    setSelectedRoom(room);
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleViewInvoices = (room: IRoom) => {
    setSelectedRoom(room);
    setShowInvoiceView(true);
  };

  const handleEditInvoice = (invoice: IInvoice) => {
    setEditingInvoice(invoice);
    setSelectedRoom(invoice.contract.room);
    setShowInvoiceForm(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
      setAllInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
      toast.success("Đã xóa hóa đơn thành công");
    }
  };
  const handleSaveInvoice = (invoiceData: any) => {
    if (editingInvoice) {
      setAllInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id ? { ...inv, ...invoiceData } : inv
        )
      );
      toast.success("Đã cập nhật hóa đơn thành công");
    } else {
      const newInvoice = {
        // id: Date.now().toString(),
        // invoice_number: `HD${Date.now()}`,
        // room: selectedRoom!,
        // status: "unpaid",
        // total_amount: invoiceData.total_amount || selectedRoom!.room_price,
        // created_at: new Date().toISOString(),
        // period: invoiceData.period,
        // // electricity_old: invoiceData.electricity_old,
        // // electricity_new: invoiceData.electricity_new,
        // // water_old: invoiceData.water_old,
        // // water_new: invoiceData.water_new,
        // // room_rent: invoiceData.room_rent,
        // electricity_price: invoiceData.electricity_price,
        // water_price: invoiceData.water_price,
        // other_services: invoiceData.other_services,
        // electricity_usage: invoiceData.electricity_usage,
        // water_usage: invoiceData.water_usage,
        // electricity_cost: invoiceData.electricity_cost,
        // water_cost: invoiceData.water_cost,
      };
      // setAllInvoices((prev) => [...prev, newInvoice]);
      toast.success("Đã tạo hóa đơn thành công");
    }
    setShowInvoiceForm(false);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "overdue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "unpaid":
        return "Chưa thanh toán";
      case "overdue":
        return "Quá hạn";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="bg-white p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý hóa đơn tiền nhà
          </h1>
          <p className="text-muted-foreground">
            Tạo và quản lý hóa đơn tiền nhà cho từng phòng trọ
          </p>
        </div>

        {/* Building Selection */}
        <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
          <div className="flex items-center gap-4">
            <FiHome className="text-[#1E88E5] text-xl" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Chọn tòa nhà
              </label>
              <Listbox
                value={selectedBuilding}
                onChange={setSelectedBuilding}
              >
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-input py-3 pl-4 pr-10 text-left shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-[#1E88E5]">
                    <span className="block truncate text-foreground">
                      {selectedBuilding
                        ? selectedBuilding.name
                        : "Chọn tòa nhà..."}
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-border focus:outline-none z-10">
                      {buildingList?.map((building) => (
                        <Listbox.Option
                          key={building.id}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                              active
                                ? "bg-[#1E88E5] text-white"
                                : "text-popover-foreground"
                            }`
                          }
                          value={building}
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {building.name} - {building.specific_address}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {selectedBuilding && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomByBuilding?.map((room) => {
              const roomInvoices = getRoomInvoices(room.id);

              return (
                <div
                  key={room.id}
                  className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1E88E5]/10 rounded-lg">
                        <FiHome className="text-[#1E88E5] text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Phòng {room.number_room}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(room.room_price)}/tháng
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === "rented"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {room.status === "rented" ? "Đã thuê" : "Trống"}
                    </span>
                  </div>

                  {/* Room Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diện tích:</span>
                      <span className="text-foreground">{room.acreage}m²</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tầng:</span>
                      <span className="text-foreground">{room.floor}</span>
                    </div>
                    {room.contract && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Khách thuê:
                        </span>
                        <span className="text-foreground">
                          {room?.contract?.tenant?.first_name}{" "}
                          {room?.contract?.tenant?.last_name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Invoice Summary */}
                  {/* {roomInvoices.length > 0 && (
                    <div className="bg-muted rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiFileText className="text-[#1E88E5] text-sm" />
                        <span className="text-sm font-medium text-foreground">
                          Hóa đơn ({roomInvoices.length})
                        </span>
                      </div>
                      {roomInvoices.slice(0, 2).map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-xs text-muted-foreground">
                            {invoice.invoice_number}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              {getStatusText(invoice.status)}
                            </span>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )} */}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCreateInvoice(room)}
                      disabled={
                        room?.status !== "rented" &&
                        room?.contract?.status !== "active"
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1E88E5] text-white px-4 py-2 rounded-lg hover:bg-[#1976D2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="text-sm" />
                      <span className="text-sm font-medium">Tạo hóa đơn</span>
                    </button>
                    <button
                      onClick={() => handleViewInvoices(room)}
                      className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <FiEye className="text-sm" />
                      <span className="text-sm font-medium">Xem</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!selectedBuilding && (
          <div className="text-center py-12">
            <FiHome className="mx-auto text-6xl text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Chọn tòa nhà để bắt đầu
            </h3>
            <p className="text-muted-foreground">
              Vui lòng chọn một tòa nhà để xem danh sách phòng và quản lý hóa
              đơn
            </p>
          </div>
        )}

        {selectedBuilding && roomByBuilding.length === 0 && (
          <div className="text-center py-12">
            <FiHome className="mx-auto text-6xl text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Không có phòng nào
            </h3>
            <p className="text-muted-foreground">
              Tòa nhà này chưa có phòng nào được tạo
            </p>
          </div>
        )}
        <AnimatePresence>
          {showInvoiceForm && selectedRoom && (
            // <Dialog
            //   as={motion.div}
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            //   exit={{ opacity: 0 }}
            //   open={showInvoiceForm}
            //   onClose={() => setShowInvoiceForm(false)}
            //   className="relative z-50"
            // >
            //   <div className="fixed inset-0 bg-black/25" />
            //   <div className="fixed inset-0 overflow-y-auto">
            //     <div className="flex min-h-full items-center justify-center p-4">
            //       <Dialog.Panel
            //         as={motion.div}
            //         initial={{ scale: 0.95, opacity: 0 }}
            //         animate={{ scale: 1, opacity: 1 }}
            //         exit={{ scale: 0.95, opacity: 0 }}
            //         className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-border"
            //       >
            //         {/* <div className="flex items-center justify-between mb-6">
            //           <Dialog.Title className="text-lg font-medium text-foreground">
            //             {editingInvoice
            //               ? "Chỉnh sửa hóa đơn"
            //               : "Tạo hóa đơn mới"}
            //           </Dialog.Title>
            //           <button
            //             onClick={() => setShowInvoiceForm(false)}
            //             className="p-2 hover:bg-muted rounded-lg transition-colors"
            //           >
            //             <FiX className="text-muted-foreground" />
            //           </button>
            //         </div> */}

            <InvoiceForm
              room={selectedRoom}
              invoice={editingInvoice}
              onClose={() => setShowInvoiceForm(false)}
              onSave={handleSaveInvoice}
              // onCancel={() => setShowInvoiceForm(false)}
            />
            //       </Dialog.Panel>
            //     </div>
            //   </div>
            // </Dialog>
          )}
        </AnimatePresence>

        {/* Invoice View Modal */}
        <AnimatePresence>
          {showInvoiceView && selectedRoom && (
            // <Dialog
            //   as={motion.div}
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            //   exit={{ opacity: 0 }}
            //   open={showInvoiceView}
            //   onClose={() => setShowInvoiceView(false)}
            //   className="relative z-50"
            // >
            //   <div className="fixed inset-0 bg-black/25" />
            //   <div className="fixed inset-0 overflow-y-auto">
            //     <div className="flex min-h-full items-center justify-center p-4">
            //       <Dialog.Panel
            //         as={motion.div}
            //         initial={{ scale: 0.95, opacity: 0 }}
            //         animate={{ scale: 1, opacity: 1 }}
            //         exit={{ scale: 0.95, opacity: 0 }}
            //         className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-card p-6 shadow-xl transition-all border border-border"
            //       >
            //         <div className="flex items-center justify-between mb-6">
            //           <Dialog.Title className="text-lg font-medium text-foreground">
            //             Hóa đơn phòng {selectedRoom.number_room}
            //           </Dialog.Title>
            //           <button
            //             onClick={() => setShowInvoiceView(false)}
            //             className="p-2 hover:bg-muted rounded-lg transition-colors"
            //           >
            //             <FiX className="text-muted-foreground" />
            //           </button>
            //         </div>

            <InvoiceView
              room={selectedRoom}
              invoices={getRoomInvoices(selectedRoom.id)}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onClose={() => setShowInvoiceView(false)}
            />
            //       </Dialog.Panel>
            //     </div>
            //   </div>
            // </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
