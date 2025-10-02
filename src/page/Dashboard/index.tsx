"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ChartsSection from "./charts-section";
import RecentActivities from "./recent-activiites";
import AdditionalCharts from "./additional-charts";
import StatsCards from "./stats-card";
import RecentMessages from "./recent-messages";
import NewRoomListings from "./new-room-listings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import { getListConversationByUserId } from "@/redux/conversation/action";
import { getRecentActivitiesByLandlord } from "@/redux/recent-activities/action";
import { IconType } from "react-icons";
import { FiCheck, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";
import { URL_IMAGE } from "@/constants";
export default function Dashboard() {
  dayjs.extend(relativeTime);
  const { roomList } = useSelector((state: AppState) => state.room);
  const { conversations } = useSelector(
    (state: AppState) => state.conversation
  );

  const { activities } = useSelector(
    (state: AppState) => state.recentActivities
  );
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  console.log("activities", activities);

  useEffect(() => {
    dispatch(getListConversationByUserId(userInfo?.id));
    dispatch(getRecentActivitiesByLandlord(userInfo?.id));
  }, [userInfo]);
  const newRooms = roomList
    ?.slice()
    ?.sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    )
    .slice(0, 3);
  const totalRooms = roomList?.length;
  const occupiedRooms = roomList?.filter(
    (room) => Array.isArray(room.contract) && room.contract.length > 0
  ).length;
  const unreadMessages = conversations
    ? conversations.filter((c) => c.unread_count).length
    : 0;
  const data = {
    totalRooms,
    occupiedRooms,
    unreadMessages,
  };
  const activitiesList = activities?.map((item) => {
    let icon: IconType = FiCheck;
    let color = "text-green-400";
    let message = item.message;

    if (item.type === "maintenance") {
      icon = FiAlertCircle;
      color = "text-yellow-400";
      message = item.message || "Yêu cầu sửa chữa";
    } else if (item.type === "contract") {
      icon = FiCheck;
      color = "text-green-400";
      message = item.message || "Hợp đồng mới đã được ký";
    } else if (item.type === "invoice") {
      icon = FiDollarSign;
      color = "text-blue-400";
      message = item.message || "Đã tạo hóa đơn mới";
    }
    return {
      id: String(item.id),
      type: item.type,
      message,
      time: dayjs(item.date_created).fromNow(),
      icon,
      color,
    };
  });

  const recentUnreadConversations = conversations
    ?.filter((c) => c.unread_count)
    .sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    )
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      tenant:
        `${
          c.participants?.find((p) => p?.directus_users_id?.id !== userInfo?.id)
            ?.directus_users_id?.first_name
        } ${
          c.participants?.find((p) => p?.directus_users_id?.id !== userInfo?.id)
            ?.directus_users_id?.last_name
        }` || "Khách",
      message:
        c.last_message.type === "text"
          ? c.last_message.content
          : "Đã gửi một tệp",
      time: dayjs(c.last_message.date_created).fromNow(),
      unread: !!c.unread_count,
      avatar:
        `${URL_IMAGE}/${
          c.participants.find((p) => p?.id !== userInfo?.id)?.avatar?.id
        }/${
          c.participants.find((p) => p?.id !== userInfo?.id)?.avatar
            ?.filename_download
        }` || "/placeholder.svg",
    }));
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Tổng quan hệ thống quản lý nhà trọ
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <StatsCards data={data} />

        <ChartsSection />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentMessages conversations={recentUnreadConversations} />

          <NewRoomListings rooms={newRooms} />

          <RecentActivities activities={activitiesList} />
        </div>
      </div>
    </div>
  );
}
