"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { IBooking } from "@/types/booking";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import {
  getBookingsByLandlord,
  updateBookingStatus,
} from "@/redux/booking/action";

interface RoomTypeData {
  name: string;
  value: number;
  color: string;
}

interface AdditionalChartsProps {
  appointmentData?: IBooking[];
  roomTypeData?: RoomTypeData[];
}

export default function Appointments({}: AdditionalChartsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings } = useSelector((state: AppState) => state.booking);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string>("");
  const [rejectReason, setRejectReason] = useState("");

  const [appointments, setAppointments] = useState<IBooking[]>([]);
  useEffect(() => {
    dispatch(getBookingsByLandlord(userInfo?.id));
  }, [userInfo?.id]);
  useEffect(() => {
    setAppointments(bookings);
  }, [bookings]);
  const confirmAppointment = async (appointmentId: string) => {
    await dispatch(
      updateBookingStatus({ bookingId: appointmentId, status: "confirmed" })
    );
    await dispatch(getBookingsByLandlord(userInfo?.id));
  };

  const openRejectModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowRejectModal(true);
  };

  const rejectAppointment = async () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    await dispatch(
      updateBookingStatus({
        bookingId: selectedAppointmentId,
        status: "rejected",
        reject_reason: rejectReason,
      })
    );
    await dispatch(getBookingsByLandlord(userInfo?.id));

    setShowRejectModal(false);
    setRejectReason("");
    setSelectedAppointmentId("");
  };

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (diffHours < 24 && diffDays === 0) {
      return `${timeStr} - Hôm nay`;
    } else if (diffDays === 1) {
      return `${timeStr} - Ngày mai`;
    } else if (diffDays < 7) {
      const dayNames = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      return `${timeStr} - ${dayNames[date.getDay()]}`;
    } else {
      return `${timeStr} - ${date.toLocaleDateString("vi-VN")}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400 bg-green-400/10";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "completed":
        return "text-blue-400 bg-blue-400/10";
      case "rejected":
        return "text-red-400 bg-red-400/10";
      case "cancelled":
        return "text-gray-400 bg-gray-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn thành";
      case "rejected":
        return "Đã từ chối";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1  gap-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Đặt lịch xem phòng
            </h3>
            <div className="text-sm text-muted-foreground">
              Hôm nay:{" "}
              <span className="text-foreground font-semibold">
                {appointments.length}
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {appointments.slice(0, 4).map((appointment) => {
              const tenant = appointment.tenant_id;
              return (
                <div
                  key={appointment.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FiCalendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {tenant.first_name} {tenant.last_name}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <FiMapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {appointment.room_id.building.name} -{" "}
                          {appointment.room_id.number_room}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatScheduledDate(appointment.scheduled_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setShowAppointmentsModal(true)}
            className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium"
          >
            Xem tất cả lịch hẹn
          </button>
        </div>
      </div>

      {showAppointmentsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Tất cả lịch hẹn xem phòng
              </h2>
              <button
                onClick={() => setShowAppointmentsModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const tenant = appointment.tenant_id;
                  return (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FiCalendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-foreground">
                              {tenant.first_name} {tenant.last_name}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FiMapPin className="w-3 h-3" />
                              <span>
                                {appointment.room_id.building.name} -{" "}
                                {appointment.room_id.number_room}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              <span>
                                {formatScheduledDate(
                                  appointment.scheduled_date
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiUser className="w-3 h-3" />
                              <span>{tenant.phone_number}</span>
                            </div>
                          </div>
                          {appointment.reject_reason && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                              <span className="font-semibold">
                                Lý do từ chối:
                              </span>{" "}
                              {appointment.reject_reason}
                            </div>
                          )}
                        </div>
                      </div>
                      {appointment.status === "pending" && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => confirmAppointment(appointment.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <FiCheck className="w-4 h-4" />
                            Xác nhận
                          </button>
                          <button
                            onClick={() => openRejectModal(appointment.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white border border-border rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Từ chối lịch hẹn
              </h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedAppointmentId("");
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối lịch hẹn..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setSelectedAppointmentId("");
                  }}
                  className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={rejectAppointment}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
