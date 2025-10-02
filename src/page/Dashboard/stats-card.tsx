"use client";

import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

interface StatsData {
  totalRooms: number;
  occupiedRooms: number;
  //   monthlyRevenue: string;
  unreadMessages: number;
}

interface StatsCardsProps {
  data?: StatsData;
}

export default function StatsCards({ data }: StatsCardsProps) {
  const defaultData: StatsData = {
    totalRooms: 245,
    occupiedRooms: 220,
    unreadMessages: 12,
  };

  const stats = data || defaultData;
  const occupancyRate = (
    (stats.occupiedRooms / stats.totalRooms) *
    100
  ).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tổng số phòng</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalRooms}
            </p>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <FiTrendingUp className="w-3 h-3 mr-1" />
              +12% so với tháng trước
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <FiHome className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Phòng đã thuê</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.occupiedRooms}
            </p>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <FiTrendingUp className="w-3 h-3 mr-1" />
              {occupancyRate}% tỷ lệ lấp đầy
            </p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg">
            <FiUsers className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Doanh thu tháng</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.monthlyRevenue}
            </p>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <FiTrendingUp className="w-3 h-3 mr-1" />
              +15.3% so với tháng trước
            </p>
          </div>
          <div className="bg-yellow-500/10 p-3 rounded-lg">
            <FiDollarSign className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div> */}

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tin nhắn chưa đọc</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.unreadMessages}
            </p>
            <p className="text-xs text-red-400 flex items-center mt-1">
              <FiTrendingDown className="w-3 h-3 mr-1" />
              Cần phản hồi sớm
            </p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg">
            <FiMessageSquare className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
