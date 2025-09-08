import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RxDashboard } from "react-icons/rx";
import { FaFacebookMessenger, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { IoHome, IoMenu } from "react-icons/io5";
import { FaFileContract, FaFileInvoiceDollar } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux";
import { logout } from "@/redux/auth/action";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarVariants = {
    open: {
      width: "240px",
    },
    closed: {
      width: "80px",
    },
  };

  const navItems = [
    { path: "/dashboard", icon: <RxDashboard size={20} />, text: "Dashboard" },
    { path: "/properties", icon: <IoHome size={20} />, text: "Phòng" },
    {
      path: "/contracts",
      icon: <FaFileContract size={20} />,
      text: "Hợp đồng",
    },
    {
      path: "/messages",
      icon: <FaFacebookMessenger size={20} />,
      text: "Tin nhắn",
    },
    { path: "/profile", icon: <FaUserCircle size={20} />, text: "Hồ sơ" },
    {
      path: "/invoice",
      icon: <FaFileInvoiceDollar size={20} />,
      text: "Hoá đơn",
    },
    // { path: "/logout", icon: <LuLogOut size={20} />, text: "Đăng xuất" },
  ];

  return (
    <motion.div
      className="bg-white shadow-lg h-full"
      initial="open"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 flex flex-col justify-between h-full">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-xl text-primary"
                >
                  RoomFinder Admin
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <MdKeyboardArrowLeft size={20} />
              ) : (
                <IoMenu size={20} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-md transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-primary"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="ml-3 whitespace-nowrap"
                        >
                          {item.text}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <NavLink
            to={"/login"}
            className={`flex items-center p-3 rounded-md transition-colors  bg-opacity-10 text-primary hover:bg-opacity-20`}
          >
            <span className="flex-shrink-0">{<LuLogOut size={20} />}</span>
            <AnimatePresence>
              {isOpen && (
                <motion.button
                  onClick={() => {
                    dispatch(logout());
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 whitespace-nowrap"
                >
                  Đăng xuất
                </motion.button>
              )}
            </AnimatePresence>
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
