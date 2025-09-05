import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building } from "@/types/building";
import { BiX } from "react-icons/bi";

interface BuildingFormProps {
  building?: Building | null;
  onClose: () => void;
}
const BuildingForm = ({ building, onClose }: BuildingFormProps) => {
  const [formData, setFormData] = useState({
    name: building?.name || "",
    address: building?.address || "",
    description: building?.description || "",
    totalRooms: building?.totalRooms || 0,
    notes: building?.notes || "",
    defaultServices: {
      electricity: building?.defaultServices.electricity || 0,
      water: building?.defaultServices.water || 0,
      internet: building?.defaultServices.internet || 0,
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };
  return (
    <div className="w-full ">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">
          {building ? "Edit Building" : "Add New Building"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BiX size={20} />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[500px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Rooms
            </label>
            <input
              type="number"
              value={formData.totalRooms}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalRooms: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              min="1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Default Service Prices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Electricity (per kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultServices.electricity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultServices: {
                        ...formData.defaultServices,
                        electricity: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water (per m³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultServices.water}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultServices: {
                        ...formData.defaultServices,
                        water: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internet (flat rate)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultServices.internet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultServices: {
                        ...formData.defaultServices,
                        internet: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {building ? "Update Building" : "Add Building"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default BuildingForm;
