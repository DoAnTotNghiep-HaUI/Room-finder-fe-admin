import React from "react";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { CiClock1, CiStar } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import StatCard from "./stat-card";
import RentalListings from "./rental-listing";
import MessagePanel from "./message-panel";
const Dashboard = () => {
  const stats = [
    {
      title: "Total Properties",
      value: 124,
      icon: (
        <FaHome
          size={20}
          className="text-indigo-600"
        />
      ),
      color: "border-indigo-600",
    },
    {
      title: "Pending Approvals",
      value: 8,
      icon: (
        <CiClock1
          size={20}
          className="text-amber-600"
        />
      ),
      color: "border-amber-600",
    },
    {
      title: "Total Favorites",
      value: 563,
      icon: (
        <CiStar
          size={20}
          className="text-rose-600"
        />
      ),
      color: "border-rose-600",
    },
    {
      title: "User Reviews",
      value: 294,
      icon: (
        <FaRegMessage
          size={20}
          className="text-emerald-600"
        />
      ),
      color: "border-emerald-600",
    },
  ];
  return (
    <div className="w-full p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RentalListings />
        </div>
        <div className="lg:col-span-1">
          <MessagePanel />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
