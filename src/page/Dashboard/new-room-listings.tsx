"use client";

import { URL_IMAGE } from "@/constants";
import { IRoom } from "@/types/room";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  title: string;
  building: string;
  price: number;
  area: number;
  status: "pending" | "approved";
  postedTime: string;
  image: string;
}

interface NewRoomListingsProps {
  rooms?: IRoom[];
}

export default function NewRoomListings({ rooms }: NewRoomListingsProps) {
  const navigate = useNavigate();
  const data = rooms || [];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Phòng mới đăng
        </h3>
        <FiEye className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {data.map((room) => (
          <div
            key={room.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"
          >
            <img
              src={
                `${URL_IMAGE}/${room.photos[0].id}/${room.photos[0].filename_download}` ||
                "/placeholder.svg"
              }
              alt={room.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {room.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {room.building.name} • {room.acreage}m²
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-semibold text-primary">
                  {room.room_price.toLocaleString("vi-VN")}đ
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    room.status === "available"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {room.status === "available" ? "Có sẵn" : "Đã thuê"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium"
        onClick={() => navigate("/properties")}
      >
        Xem tất cả phòng
      </button>
    </div>
  );
}
