import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FiFileText } from "react-icons/fi";
import ContractForm from "./contracts-form";
import ContractList from "./contracts-list";
import Select from "@/components/Input/selectAi";
const ContractManagement = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [contractStatus, setContractStatus] = useState<string>("active");
  const buildings = [
    {
      id: "all",
      name: "All Buildings",
    },
    {
      id: "building1",
      name: "Sunset Apartments",
    },
    {
      id: "building2",
      name: "Ocean View Complex",
    },
    {
      id: "building3",
      name: "City Center Residences",
    },
  ];
  const statuses = [
    {
      value: "active",
      label: "Active",
    },
    {
      value: "expiring",
      label: "Expiring Soon",
    },
    {
      value: "expired",
      label: "Expired",
    },
    {
      value: "terminated",
      label: "Terminated",
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
        <h1 className="text-2xl font-bold mb-6">Properties Management</h1>
      </motion.div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FaBuilding
                className="text-gray-400"
                size={20}
              />
              <Select options={buildings} />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <IoMdAdd size={18} />
              <span>New Contract</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FiFileText
                className="text-gray-400"
                size={20}
              />
              <Select options={statuses} />
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <ContractForm onClose={() => setShowForm(false)} />
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <ContractList
                building={selectedBuilding}
                status={contractStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ContractManagement;
