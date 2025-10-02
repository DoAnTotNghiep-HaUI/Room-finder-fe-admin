"use client";

import {
  FiCheck,
  FiDollarSign,
  FiAlertCircle,
  FiUsers,
  FiClock,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useSelector } from "react-redux";
import { AppState } from "@/redux";
import { useState } from "react";

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: IconType;
  color: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const data = activities.slice(0, 3) || [];
  const allActivities = activities || [];
  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Hoạt động gần đây
          </h3>
          <FiClock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {data.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3"
            >
              <div className={`p-2 rounded-lg bg-muted/50 ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowActivitiesModal(true)}
          className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium"
        >
          Xem tất cả hoạt động
        </button>
      </div>
      {showActivitiesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Tất cả hoạt động
              </h2>
              <button
                onClick={() => setShowActivitiesModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {allActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg bg-muted/50 ${activity.color}`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
