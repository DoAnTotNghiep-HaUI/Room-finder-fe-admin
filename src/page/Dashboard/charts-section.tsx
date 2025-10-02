"use client";

import { FiMoreHorizontal } from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AdditionalCharts from "./additional-charts";
import { useSelector } from "react-redux";
import { AppState } from "@/redux";
import dayjs from "dayjs";
import Appointments from "./appointments";

interface ChartData {
  month: string;
  occupied: number;
  available: number;
  revenue: number;
  target: number;
}

interface ChartsSectionProps {
  occupancyData?: ChartData[];
  revenueData?: ChartData[];
}

export default function ChartsSection({
  occupancyData,
  revenueData,
}: ChartsSectionProps) {
  const { roomList } = useSelector((state: AppState) => state.room);
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().subtract(11 - i, "month");
    return {
      label: d.format("MM/YYYY"),
      month: d.month() + 1,
      year: d.year(),
      key: d.format("YYYY-MM"),
    };
  });

  const totalRooms = roomList?.length;

  const occupancyRateByMonth = months.map((m) => {
    let occupied = 0;
    roomList?.forEach((room) => {
      // Kiểm tra nếu có contract nào hoạt động trong tháng này
      const hasActiveContract =
        Array.isArray(room?.contract) &&
        room.contract.some((ct) => {
          const start = dayjs(ct.contract_start_date);
          const end = dayjs(ct.contract_end_date);
          // Nếu hợp đồng có hiệu lực trong tháng này
          return (
            start.isBefore(dayjs(`${m.year}-${m.month}-31`).endOf("month")) &&
            end.isAfter(dayjs(`${m.year}-${m.month}-01`).startOf("month"))
          );
        });
      if (hasActiveContract) occupied += 1;
    });
    const rate =
      totalRooms > 0 ? Math.round((occupied / totalRooms) * 1000) / 10 : 0;
    return {
      month: m.label,
      occupied,
      available: totalRooms - occupied,
      occupancyRate: rate,
    };
  });
  console.log("Tổng số phòng:", totalRooms);

  return (
    <div>
      {/* Occupancy Chart - full width */}
      <div className="bg-card border border-border rounded-lg p-6 col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Tỷ lệ lấp đầy
          </h3>
          <button className="text-muted-foreground hover:text-foreground">
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={occupancyRateByMonth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333333"
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
              />
              <YAxis stroke="#888888" />
              <Area
                type="monotone"
                dataKey="occupied"
                stackId="1"
                stroke="#1E88E5"
                fill="#1E88E5"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="available"
                stackId="1"
                stroke="#333333"
                fill="#333333"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        <AdditionalCharts />
        <Appointments />
      </div>
    </div>
  );
}
