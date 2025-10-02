"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiDownload } from "react-icons/fi";
import { IInvoice } from "@/types/invoice";
import PDFDownloadButton from "./pdf-download-button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDFDocument from "./pdf-download-document";
import MDEditor from "@uiw/react-md-editor";

interface InvoicePDFProps {
  invoice: IInvoice;
  onClose: () => void;
}

export default function InvoicePDF({ invoice, onClose }: InvoicePDFProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getCurrentMonth = () => {
    const date = new Date(invoice.from_date);
    return `Tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, you would use react-pdf to generate and download the PDF
    // For now, we'll just trigger the print dialog
    window.print();
  };
  console.log("invoice", invoice);

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header Controls */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 print:hidden">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Hóa đơn {invoice.invoice_number}
                  </Dialog.Title>
                  <div className="flex gap-2">
                    <PDFDownloadLink
                      document={<InvoicePDFDocument invoice={invoice} />}
                      fileName={`hoa-don-${invoice.invoice_number}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          "Đang tạo PDF..."
                        ) : (
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <FiDownload className="text-sm" />
                            Tải PDF
                          </button>
                        )
                      }
                    </PDFDownloadLink>

                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiX className="text-xl text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Invoice Content */}
                <div
                  className="p-8 bg-white"
                  id="invoice-content"
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      THÔNG BÁO HÓA ĐƠN
                    </h1>
                    <h2 className="text-lg font-semibold text-gray-700">
                      {getCurrentMonth()}
                    </h2>
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <div>
                        <span>Từ ngày </span>
                        <span className="font-semibold">
                          {formatDate(invoice.from_date)}
                        </span>
                        <span> Đến ngày </span>
                        <span className="font-semibold">
                          {formatDate(invoice.to_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="mb-2">
                          <span>Họ và tên khách hàng </span>
                          <span className="font-bold text-lg">
                            {invoice.contract.tenant.id}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span>Nhà </span>
                            <span className="font-semibold border border-gray-400 px-2 py-1">
                              {invoice.contract.room.building.name}
                            </span>
                          </div>
                          <div>
                            <span>Số phòng </span>
                            <span className="font-semibold border border-gray-400 px-2 py-1">
                              {invoice.contract.room.number_room}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span>Mã hợp đồng </span>
                          <span className="font-semibold">
                            {invoice.contract.contract_number}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-yellow-200 px-4 py-2 inline-block">
                          <div className="font-bold text-lg">
                            {invoice.invoice_number}
                          </div>
                          <div className="text-sm">
                            {formatDate(invoice.date_created)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Table */}
                  <div className="border-2 border-gray-800 mb-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-800">
                          <th className="border-r border-gray-800 p-2 text-center font-bold">
                            STT
                          </th>
                          <th className="border-r border-gray-800 p-2 text-center font-bold">
                            Khoản
                          </th>
                          <th className="border-r border-gray-800 p-2 text-center font-bold">
                            Chi tiết
                          </th>
                          <th className="p-2 text-center font-bold">
                            Thành Tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Room Rent */}
                        <tr className="border-b border-gray-800">
                          <td className="border-r border-gray-800 p-2 text-center">
                            1
                          </td>
                          <td className="border-r border-gray-800 p-2">
                            Tiền phòng
                          </td>
                          <td className="border-r border-gray-800 p-2">
                            <em>Từ ngày</em> {formatDate(invoice.from_date)}{" "}
                            <em>Đến ngày</em> {formatDate(invoice.to_date)}{" "}
                            <em>Số ngày</em>{" "}
                            {/* <span className="font-bold">
                              {invoice.days_count}
                            </span> */}
                          </td>
                          <td className="p-2 text-right font-semibold">
                            {formatCurrency(invoice.contract.room.room_price)}
                          </td>
                        </tr>

                        {/* Electricity */}
                        <tr className="border-b border-gray-800">
                          <td className="border-r border-gray-800 p-2 text-center">
                            2
                          </td>
                          <td className="border-r border-gray-800 p-2">
                            DV Điện
                          </td>
                          <td className="border-r border-gray-800 p-2">
                            <em>CS cũ</em>{" "}
                            <span className="font-bold">
                              {invoice.electricity_old_index}
                            </span>{" "}
                            <em>CS Mới</em>{" "}
                            <span className="font-bold">
                              {invoice.electricity_new_index}
                            </span>{" "}
                            <em>Số sử dụng</em>{" "}
                            <span className="font-bold">
                              {invoice.electricity_usage}
                            </span>
                          </td>
                          <td className="p-2 text-right font-semibold">
                            {formatCurrency(invoice.electricity_total)}
                          </td>
                        </tr>

                        {/* Water */}
                        <tr className="border-b border-gray-800">
                          <td className="border-r border-gray-800 p-2 text-center">
                            3
                          </td>
                          <td className="border-r border-gray-800 p-2">
                            DV Nước
                          </td>
                          <td className="border-r border-gray-800 p-2">
                            {invoice.water_calculation_type === "meter" ? (
                              <>
                                <em>CS cũ</em>{" "}
                                <span className="font-bold">
                                  {invoice.water_old_index}
                                </span>{" "}
                                <em>CS Mới</em>{" "}
                                <span className="font-bold">
                                  {invoice.water_new_index}
                                </span>{" "}
                                <em>Số sử dụng</em>{" "}
                                <span className="font-bold">
                                  {invoice?.water_usage}
                                </span>
                              </>
                            ) : (
                              <>
                                <em>Số người</em>{" "}
                                <span className="font-bold">
                                  {invoice.water_people_count}
                                </span>{" "}
                                <em>Đơn giá</em>{" "}
                                <span className="font-bold">
                                  {formatCurrency(invoice?.water_price)}
                                </span>
                              </>
                            )}
                          </td>
                          <td className="p-2 text-right font-semibold">
                            {formatCurrency(invoice.water_total)}
                          </td>
                        </tr>

                        {/* Services */}
                        {invoice?.services?.map((service, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-800"
                          >
                            <td className="border-r border-gray-800 p-2 text-center">
                              {4 + index}
                            </td>
                            <td className="border-r border-gray-800 p-2">
                              {service.name}
                            </td>
                            <td className="border-r border-gray-800 p-2">
                              <em>Số lượng</em>{" "}
                              <span className="font-bold">
                                {service.quantity}
                              </span>{" "}
                              <em>Đơn giá</em>{" "}
                              <span className="font-bold">
                                {formatCurrency(service.unit_price)}
                              </span>
                            </td>
                            <td className="p-2 text-right font-semibold">
                              {formatCurrency(
                                service.quantity * service.unit_price
                              )}
                            </td>
                          </tr>
                        ))}

                        {/* Empty rows to match the template */}
                        {Array.from({
                          length: Math.max(
                            0,
                            11 - (3 + invoice.services.length)
                          ),
                        }).map((_, index) => (
                          <tr
                            key={`empty-${index}`}
                            className="border-b border-gray-800"
                          >
                            <td className="border-r border-gray-800 p-2 text-center">
                              {4 + invoice.services.length + index}
                            </td>
                            <td className="border-r border-gray-800 p-2"></td>
                            <td className="border-r border-gray-800 p-2"></td>
                            <td className="p-2 text-right">-</td>
                          </tr>
                        ))}

                        {/* Total */}
                        <tr className="border-b-2 border-gray-800 bg-gray-50">
                          <td
                            className="border-r border-gray-800 p-2 text-center font-bold"
                            colSpan={3}
                          >
                            Cộng:
                          </td>
                          <td className="p-2 text-right font-bold text-lg">
                            {formatCurrency(invoice.total_amount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Footer */}
                  {invoice.payment_info && (
                    <div className="space-y-4 text-sm">
                      {/* <MDEditor
                      value={invoice.description}
                      preview="preview"
                      
                    /> */}
                      <p className="text-center">
                        <span>Quy khách vui lòng chuyển khoản </span>
                        <span className="font-bold">ĐÚNG</span>
                        <span> số tiền </span>
                        <span className="font-bold">ĐÚNG</span>
                        <span> nội dung và </span>
                        <span className="font-bold">
                          ĐÚNG SỐ TÀI KHOẢN BAN QUẢN LÝ ĐÃ CUNG CẤP
                        </span>
                        <span>. BAN QUẢN LÝ SẼ </span>
                        <span className="font-bold">
                          KHÔNG CHỊU TRÁCH NHIỆM NẾU QUY KHÁCH CHUYỂN TIỀN VÀO
                          SỐ TÀI KHOẢN KHÁC!
                        </span>
                      </p>

                      <div className="text-center">
                        <span>Nội dung chuyển khoản: </span>
                        <span className="font-bold text-red-600">
                          {invoice.payment_info.payment_content}
                        </span>
                        <span className="ml-4">Ngân hàng thụ hưởng </span>
                        <span className="font-bold text-red-600">
                          {invoice.payment_info.bank_account}
                        </span>
                        <span className="ml-4 font-bold text-red-600">
                          {invoice.payment_info.bank_owner}
                        </span>
                        <span className="ml-4 font-bold text-red-600">
                          {invoice.payment_info.bank_name}
                        </span>
                      </div>

                      <div className="text-center">
                        <span>Trong đó: </span>
                        <span className="font-bold">
                          {invoice.contract.room.building.name}
                        </span>
                        <span> là tòa nhà </span>
                        <span className="font-bold">
                          {invoice.contract.room.number_room}
                        </span>
                        <span> là số phòng </span>
                        <span className="font-bold">{getCurrentMonth()}</span>
                        <span> là tháng thanh toán</span>
                      </div>

                      {/* <div className="text-center font-bold">
                      BAN QUẢN LÝ XIN TRAO TẶNG 10.000.000 CHO MỖI TRƯỜNG HỢP
                      PHÁT HIỆN SAI PHẠM TRONG THU TIỀN KHÁCH HÀNG CỦA QUẢN LÝ
                      TÒA NHÀ.
                    </div> */}

                      <div className="text-center">
                        <span>Phản ánh và thắc mắc xin liên hệ: Hotline: </span>
                        <span className="font-bold">
                          {invoice.payment_info.hotline}
                        </span>
                      </div>

                      <div className="flex justify-between mt-8">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">
                            BAN QUẢN LÝ{" "}
                            {invoice.contract.room.building.name.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">
                            KHÁCH HÀNG
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
