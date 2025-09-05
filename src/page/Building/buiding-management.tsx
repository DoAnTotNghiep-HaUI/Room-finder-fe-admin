import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiBuilding, BiSearch } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
import BuildingForm from "./building-form";
import { Building } from "@/types/building";

const BuildingManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Sample data
  const buildings: Building[] = [
    {
      id: "1",
      name: "Sunset Apartments",
      address: "123 Main St, City",
      description: "Modern apartment complex with 24/7 security",
      totalRooms: 50,
      defaultServices: {
        electricity: 0.15,
        water: 2.5,
        internet: 30,
      },
    },
    {
      id: "2",
      name: "Ocean View Complex",
      address: "456 Beach Rd, Coast City",
      description: "Luxury beachfront apartments",
      totalRooms: 30,
      defaultServices: {
        electricity: 0.12,
        water: 2.0,
        internet: 35,
      },
    },
  ];
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <BiSearch
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
        </div>
        <button
          onClick={() => {
            setSelectedBuilding(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <IoAdd size={18} />
          <span>Add Building</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings
          .filter(
            (building) =>
              building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              building.address.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((building) => (
            <motion.div
              key={building.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <BiBuilding
                      className="text-indigo-600"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {building.name}
                    </h3>
                    <p className="text-sm text-gray-500">{building.address}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{building.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Total Rooms: {building.totalRooms}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBuilding(building);
                      setShowForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
      <AnimatePresence>
        {showForm && (
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{
                scale: 0.95,
              }}
              animate={{
                scale: 1,
              }}
              exit={{
                scale: 0.95,
              }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <BuildingForm
                building={selectedBuilding}
                onClose={() => {
                  setShowForm(false);
                  setSelectedBuilding(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default BuildingManagement;
