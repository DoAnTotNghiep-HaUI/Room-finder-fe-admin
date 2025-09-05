import React from "react";
import { motion } from "framer-motion";
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  index: number;
}
const StatCard = ({ title, value, icon, color, index }: StatCardProps) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-6 ${color} border-l-4`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border-", "bg-")
            .replace("-600", "-100")}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};
export default StatCard;
