"use client";

import { AppDispatch, AppState } from "@/redux";
import {
  getAllRoomByLandlord,
  getListRoomByLandlord,
} from "@/redux/room/action";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface RequestData {
  time: string;
  requests: number;
}

interface RoomTypeData {
  name: string;
  value: number;
  color: string;
}

interface AdditionalChartsProps {
  requestsData?: RequestData[];
  roomTypeData?: RoomTypeData[];
}

export default function AdditionalCharts({
  requestsData,
  roomTypeData,
}: AdditionalChartsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { roomList } = useSelector((state: AppState) => state.room);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  useEffect(() => {
    dispatch(getAllRoomByLandlord(userInfo?.id));
  }, [userInfo]);
  console.log("roomList", roomList);
  const roomTypeCount: Record<
    string,
    { name: string; value: number; color: string }
  > = {};
  const colorList = [
    "#1E88E5",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
    "#f43f5e",
  ];
  let colorIndex = 0;

  roomList?.forEach((room) => {
    const typeName = room.room_type?.name || "Khác";
    if (!roomTypeCount[typeName]) {
      roomTypeCount[typeName] = {
        name: typeName,
        value: 0,
        color: colorList[colorIndex % colorList.length],
      };
      colorIndex++;
    }
    roomTypeCount[typeName].value += 1;
  });
  const dynamicRoomTypeData = Object.values(roomTypeCount);

  const defaultRoomTypeData: RoomTypeData[] = [
    { name: "Phòng đơn", value: 45, color: "#1E88E5" },
    { name: "Phòng đôi", value: 30, color: "#10b981" },
    { name: "Studio", value: 15, color: "#f59e0b" },
    { name: "Căn hộ", value: 10, color: "#ef4444" },
  ];
  const roomTypes =
    dynamicRoomTypeData.length > 0 ? dynamicRoomTypeData : defaultRoomTypeData;
  return (
    <div className="grid grid-cols-1  gap-6">
      {/* Room Types Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Phân bố loại phòng
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={roomTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {roomTypes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {roomTypes.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-semibold text-foreground ml-auto">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
