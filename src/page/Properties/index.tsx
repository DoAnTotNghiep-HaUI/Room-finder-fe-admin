import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { BiBuilding, BiSearch } from "react-icons/bi";
import { LuDoorOpen } from "react-icons/lu";
import BuildingManagement from "./Building/buiding-management";
import RoomManagement from "./room/room-management";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import BuildingCard from "./Building/buiding-management";
import { FiPlus } from "react-icons/fi";
import BuildingForm from "./Building/building-form";
import { uploadFilesToDirectus } from "@/utils/upload-file";
import {
  createBuilding,
  deleteBuilding,
  getListBuilding,
  updateBuilding,
} from "@/redux/building/action";

const Properties = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { buildingList } = useSelector((state: AppState) => state.building);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const [showAddBuildingForm, setShowAddBuildingForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const extractIdFromUrl = (url: string) => {
    const match = url.match(/assets\/([^/]+)/);
    return match ? match[1] : null;
  };
  useEffect(() => {
    dispatch(getListBuilding(userInfo?.id));
  }, [userInfo]);
  const handleBuildingView = (building: any) => {
    console.log("View building:", building);
  };

  const handleBuildingEdit = async (building: any) => {
    try {
      let buildingImageId: string | null = null;
      let imageFile = building.building_image;

      if (Array.isArray(imageFile)) {
        imageFile = imageFile[0];
      }

      if (imageFile instanceof File) {
        const uploaded = await uploadFilesToDirectus([imageFile]);
        buildingImageId = uploaded[0]?.id;
      } else if (typeof imageFile === "string") {
        buildingImageId = extractIdFromUrl(imageFile);
      } else if (imageFile && imageFile.id) {
        buildingImageId = imageFile.id;
      } else {
        buildingImageId = null;
      }
      const submitData = {
        ...building,
        building_image: buildingImageId,
        district: building.district.id,
        landlord: userInfo?.id,
      };
      await dispatch(
        updateBuilding({ buildingId: building.id, data: submitData })
      );
      await dispatch(getListBuilding(userInfo.id));
      console.log("Edit building:", building);
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  const handleBuildingDelete = async (buildingId: string) => {
    await dispatch(deleteBuilding(buildingId));
    await dispatch(getListBuilding(userInfo.id));
    console.log("Delete building:", buildingId);
    // setBuildings((prev) => prev.filter((b) => b.id !== buildingId));
  };

  const handleAddBuilding = async (newBuilding: any) => {
    let buildingImageId: string | null = null;
    let imageFile = newBuilding.building_image;

    if (Array.isArray(imageFile)) {
      imageFile = imageFile[0];
    }

    if (imageFile instanceof File) {
      const uploaded = await uploadFilesToDirectus([imageFile]);
      buildingImageId = uploaded[0]?.id;
    } else if (typeof imageFile === "string") {
      buildingImageId = extractIdFromUrl(imageFile);
    } else if (imageFile && imageFile.id) {
      buildingImageId = imageFile.id;
    } else {
      buildingImageId = null;
    }
    const submitData = {
      ...newBuilding,
      building_image: buildingImageId,
      district: newBuilding.district.id,
      landlord: userInfo?.id,
      city: "Hà Nội",
    };
    await dispatch(createBuilding(submitData));
    await dispatch(getListBuilding(userInfo.id));
    console.log("Add building:", newBuilding);
  };
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
        <h1 className="text-2xl font-bold mb-6">Quản lý phòng</h1>
      </motion.div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-sky-200 p-1 mb-6">
          <Tab
            className={({
              selected,
            }) => `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-primary shadow"
                  : "text-blue-400 hover:bg-white/[0.12] hover:text-blue-600"
              } flex items-center justify-center gap-2`}
          >
            <BiBuilding size={18} />
            Toà nhà
          </Tab>
          <Tab
            className={({
              selected,
            }) => `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? "bg-white text-primary shadow"
                  : "text-blue-400 hover:bg-white/[0.12] hover:text-blue-600"
              } flex items-center justify-center gap-2`}
          >
            <LuDoorOpen size={18} />
            Phòng
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm phòng..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <BiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <button
                onClick={() => setShowAddBuildingForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1976D2] transition-colors duration-200 font-medium"
              >
                <FiPlus className="w-4 h-4" />
                Thêm tòa nhà mới
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buildingList?.map((building) => (
                <BuildingManagement
                  key={building.id}
                  building={building}
                  onView={handleBuildingView}
                  onEdit={handleBuildingEdit}
                  onDelete={handleBuildingDelete}
                />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <RoomManagement />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <BuildingForm
        isOpen={showAddBuildingForm}
        onClose={() => setShowAddBuildingForm(false)}
        onSave={handleAddBuilding}
        mode="add"
      />
    </div>
  );
};
export default Properties;
