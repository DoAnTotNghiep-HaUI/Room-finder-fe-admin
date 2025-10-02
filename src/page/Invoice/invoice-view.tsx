"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiEye,
  FiFileText,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Dialog, Transition } from "@headlessui/react";
import InvoicePDF from "./invoice-pdf";
import { IRoom } from "@/types/room";
import { IInvoice } from "@/types/invoice";
import MDEditor from "@uiw/react-md-editor";

interface InvoiceViewProps {
  room: IRoom;
  invoices: IInvoice[];
  onEdit: (invoice: IInvoice) => void;
  onDelete: (invoiceId: string) => void;
  onClose: () => void;
}

export default function InvoiceView({
  room,
  invoices,
  onEdit,
  onDelete,
  onClose,
}: InvoiceViewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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

  const handleViewDetail = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownloadPDF = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    setShowPDF(true);
  };

  return (
    <>
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
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-bold text-foreground">
                      Hóa đơn phòng {room.number_room}
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <FiX className="text-xl text-muted-foreground" />
                    </button>
                  </div>

                  {/* Room Info */}
                  <div className="bg-muted rounded-lg p-4 mb-6">
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
                          {`${room?.contract?.tenant?.first_name} ${room?.contract?.tenant?.last_name}` ||
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

                  {/* Invoices List */}
                  <div className="space-y-4">
                    {invoices.length === 0 ? (
                      <div className="text-center py-12">
                        <FiFileText className="mx-auto text-6xl text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Chưa có hóa đơn nào
                        </h3>
                        <p className="text-muted-foreground">
                          Phòng này chưa có hóa đơn nào được tạo
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 font-semibold text-foreground">
                                Mã hóa đơn
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-foreground">
                                Thời gian
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-foreground">
                                Tổng tiền
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-foreground">
                                Trạng thái
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-foreground">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((invoice) => (
                              <motion.tr
                                key={invoice.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-b border-border hover:bg-muted/50 transition-colors"
                              >
                                <td className="py-4 px-4">
                                  <div className="font-medium text-foreground">
                                    {invoice.invoice_number}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Tạo: {formatDate(invoice.date_created)}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-foreground">
                                    {formatDate(invoice.from_date)} -{" "}
                                    {formatDate(invoice.to_date)}
                                  </div>
                                  {/* <div className="text-sm text-muted-foreground">
                                    {invoice.days_count} ngày
                                  </div> */}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-bold text-primary text-lg">
                                    {formatCurrency(invoice.total_amount)}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                      invoice.status
                                    )}`}
                                  >
                                    {getStatusText(invoice.status)}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleViewDetail(invoice)}
                                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                      title="Xem chi tiết"
                                    >
                                      <FiEye className="text-sm" />
                                    </button>
                                    <button
                                      onClick={() => handleDownloadPDF(invoice)}
                                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                      title="Tải PDF"
                                    >
                                      <FiDownload className="text-sm" />
                                    </button>
                                    <button
                                      onClick={() => onEdit(invoice)}
                                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                      title="Chỉnh sửa"
                                    >
                                      <FiEdit2 className="text-sm" />
                                    </button>
                                    <button
                                      onClick={() => onDelete(invoice.id)}
                                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                      title="Xóa"
                                    >
                                      <FiTrash2 className="text-sm" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Invoice Detail Modal */}
      {selectedInvoice && !showPDF && (
        <Transition
          appear
          show={true}
          as={React.Fragment}
        >
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setSelectedInvoice(null)}
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
                        Chi tiết hóa đơn {selectedInvoice.invoice_number}
                      </Dialog.Title>
                      <button
                        onClick={() => setSelectedInvoice(null)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <FiX className="text-xl text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-muted rounded-lg p-4">
                          <h3 className="font-semibold text-foreground mb-3">
                            Thông tin cơ bản
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Mã hóa đơn:
                              </span>
                              <span className="text-foreground font-medium">
                                {selectedInvoice.invoice_number}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Từ ngày:
                              </span>
                              <span className="text-foreground">
                                {formatDate(selectedInvoice.from_date)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Đến ngày:
                              </span>
                              <span className="text-foreground">
                                {formatDate(selectedInvoice.to_date)}
                              </span>
                            </div>
                            {/* <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Số ngày:
                              </span>
                              <span className="text-foreground">
                                {selectedInvoice.days_count} ngày
                              </span>
                            </div> */}
                          </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4">
                          <h3 className="font-semibold text-foreground mb-3">
                            Chi phí
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Tiền phòng:
                              </span>
                              <span className="text-foreground font-medium">
                                {formatCurrency(
                                  selectedInvoice.contract.room.room_price
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Tiền điện:
                              </span>
                              <span className="text-foreground">
                                {formatCurrency(
                                  selectedInvoice.electricity_total
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Tiền nước:
                              </span>
                              <span className="text-foreground">
                                {formatCurrency(selectedInvoice.water_total)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Dịch vụ:
                              </span>
                              <span className="text-foreground">
                                {formatCurrency(
                                  selectedInvoice?.services?.reduce(
                                    (total, service) =>
                                      total +
                                      service.quantity * service.unit_price,
                                    0
                                  )
                                )}
                              </span>
                            </div>
                            <div className="border-t border-border pt-2 flex justify-between">
                              <span className="text-foreground font-semibold">
                                Tổng cộng:
                              </span>
                              <span className="text-primary font-bold text-lg">
                                {formatCurrency(selectedInvoice.total_amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Electricity Details */}
                      <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-3">
                          Chi tiết tiền điện
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Chỉ số cũ:
                            </span>
                            <p className="font-medium text-foreground">
                              {selectedInvoice.electricity_old_index}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Chỉ số mới:
                            </span>
                            <p className="font-medium text-foreground">
                              {selectedInvoice.electricity_new_index}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Sử dụng:
                            </span>
                            <p className="font-medium text-foreground">
                              {selectedInvoice.electricity_usage} kWh
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Đơn giá:
                            </span>
                            <p className="font-medium text-foreground">
                              {formatCurrency(
                                selectedInvoice.electricity_price
                              )}
                              /kWh
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Water Details */}
                      <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-3">
                          Chi tiết tiền nước
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Loại tính:
                            </span>
                            <p className="font-medium text-foreground">
                              {selectedInvoice.water_calculation_type ===
                              "meter"
                                ? "Theo chỉ số"
                                : "Theo đầu người"}
                            </p>
                          </div>
                          {selectedInvoice.water_calculation_type ===
                          "meter" ? (
                            <>
                              <div>
                                <span className="text-muted-foreground">
                                  Chỉ số cũ:
                                </span>
                                <p className="font-medium text-foreground">
                                  {selectedInvoice.water_old_index}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Chỉ số mới:
                                </span>
                                <p className="font-medium text-foreground">
                                  {selectedInvoice.water_new_index}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Sử dụng:
                                </span>
                                <p className="font-medium text-foreground">
                                  {selectedInvoice.water_usage} m³
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-muted-foreground">
                                  Số người:
                                </span>
                                <p className="font-medium text-foreground">
                                  {selectedInvoice.water_people_count}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Đơn giá:
                                </span>
                                <p className="font-medium text-foreground">
                                  {formatCurrency(selectedInvoice.water_price)}
                                  /người
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Services */}
                      {selectedInvoice.services.length > 0 && (
                        <div className="bg-card border border-border rounded-lg p-4">
                          <h3 className="font-semibold text-foreground mb-3">
                            Dịch vụ phát sinh
                          </h3>
                          <div className="space-y-2">
                            {selectedInvoice.services.map((service, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                              >
                                <span className="text-foreground">
                                  {service.name}
                                </span>
                                <div className="text-right">
                                  <div className="text-foreground">
                                    {service.quantity} ×{" "}
                                    {formatCurrency(service.unit_price)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    ={" "}
                                    {formatCurrency(
                                      service.quantity * service.unit_price
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {selectedInvoice.description && (
                        <div className="bg-card border border-border rounded-lg p-4">
                          <h3 className="font-semibold text-foreground mb-3">
                            Ghi chú
                          </h3>
                          <MDEditor
                            hideToolbar={true}
                            // height="auto"
                            style={{ border: "none" }}
                            preview="preview"
                            value={selectedInvoice.description}
                          />
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* PDF Modal */}
      {showPDF && selectedInvoice && (
        <InvoicePDF
          invoice={selectedInvoice}
          onClose={() => {
            setShowPDF(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </>
  );
}
