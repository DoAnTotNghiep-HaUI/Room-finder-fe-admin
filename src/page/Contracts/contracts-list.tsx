import React from "react";
import { motion } from "framer-motion";
import { FiEdit } from "react-icons/fi";
import { CiTrash } from "react-icons/ci";

interface Contract {
  id: string;
  tenant: {
    name: string;
    phone: string;
  };
  unit: string;
  startDate: string;
  endDate: string;
  rent: number;
  status: "active" | "expiring" | "expired" | "terminated";
  lastPayment: string;
  meterReadings: {
    electric: string;
    water: string;
  };
}
interface ContractListProps {
  building: string;
  status: string;
}
const ContractList = ({ building, status }: ContractListProps) => {
  // Sample data
  const contracts: Contract[] = [
    {
      id: "1",
      tenant: {
        name: "John Smith",
        phone: "+1 234 567 8900",
      },
      unit: "101",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      rent: 1500,
      status: "active",
      lastPayment: "2023-12-01",
      meterReadings: {
        electric: "45678",
        water: "12345",
      },
    },
    {
      id: "2",
      tenant: {
        name: "Sarah Johnson",
        phone: "+1 234 567 8901",
      },
      unit: "202",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      rent: 2000,
      status: "expiring",
      lastPayment: "2023-12-01",
      meterReadings: {
        electric: "78901",
        water: "23456",
      },
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expiring":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tenant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Readings
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.map((contract, index) => (
            <motion.tr
              key={contract.id}
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
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {contract.tenant.name}
                </div>
                <div className="text-sm text-gray-500">
                  {contract.tenant.phone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {contract.unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{new Date(contract.startDate).toLocaleDateString()}</div>
                <div>{new Date(contract.endDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${contract.rent}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    contract.status
                  )}`}
                >
                  {contract.status.charAt(0).toUpperCase() +
                    contract.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>Electric: {contract.meterReadings.electric}</div>
                <div>Water: {contract.meterReadings.water}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <FiEdit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <CiTrash size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ContractList;
