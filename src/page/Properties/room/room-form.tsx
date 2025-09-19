import ReusableCategorySelector from "@/components/category/category-selector";
import FileUpload from "@/components/Input/file-upload";
import { AppDispatch, AppState } from "@/redux";
import { getListAmenities } from "@/redux/amenities/action";
import { getListFurnitures } from "@/redux/furnitures/action";
import { IAmenity, IRoom, IRoomService, IService } from "@/types/room";
import {
  contractDurationOptions,
  limitPeople,
  rentalObject,
  roomStatus,
} from "@/utils/data";
import { MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { IoVideocamOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import ServiceForm from "../services/service-form";
import ServiceCardGrid from "../services/service-card";
import { getListServices, updateServices } from "@/redux/services/action";
import { URL_IMAGE } from "@/constants";
import { IFile } from "@/types/file";
import MDEditor from "@uiw/react-md-editor";
import Radio from "@/components/Input/radio";
import { DragAndDropInput } from "@/components/Input/file-upload-multiple";
import { uploadFilesToDirectus } from "@/utils/upload-file";
import {
  createRoom,
  getListRoomByLandlord,
  updateRoom,
} from "@/redux/room/action";

interface RoomFormProps {
  room?: IRoom | null;
  onClose: () => void;
}
interface FileWithPreview extends File {
  preview: string;
  id: string;
}
interface SortableImageProps {
  image: FileWithPreview;
  index: number;
}
const RoomForm = ({ room, onClose }: RoomFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchParam } = useSelector((state: AppState) => state.room);
  const { buildingList } = useSelector((state: AppState) => state.building);
  const { roomTypeList } = useSelector((state: AppState) => state.roomType);
  const { amenitiesList } = useSelector((state: AppState) => state.amenities);
  const { servicesList } = useSelector((state: AppState) => state.services);
  const { accessToken } = useSelector((state: AppState) => state.auth);
  const { furnituresList } = useSelector((state: AppState) => state.furnitures);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null
  );
  const extractIdFromUrl = (url: string) => {
    const match = url.match(/assets\/([^/]+)/);
    return match ? match[1] : null;
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      number_room: 0,
      building: "",
      room_type: "",
      floor: 1,
      status: "available",
      title: "",
      acreage: 0,
      services: [],
      amenities: [],
      furnitures: [],
      deposit: 0,
      room_price: 0,
      rental_object: "all",
      limit_people: 2,
      description: "",
      contract_duration: "1_year",
      photos: [],
      video: null,
    },
  });

  useEffect(() => {
    if (room) {
      reset({
        number_room: room.number_room || 0,
        building: room.building?.id || "",
        room_type: room.room_type?.id || "",
        floor: room.floor || 1,
        status: room.status || "available",
        title: room.title || "",
        acreage: room.acreage || 0,
        services: room?.services || [],
        amenities:
          room?.amenities?.map((a: any) => ({
            id: a?.id,
            room_category_id: a?.room_category_id,
          })) || [],
        furnitures:
          room?.furnitures?.map((f: any) => ({
            id: f?.id,
            room_category_id: f?.room_category_id,
          })) || [],
        deposit: room.deposit || 0,
        room_price: room.room_price || 0,
        rental_object: room.rental_object || "all",
        limit_people: room.limit_people || 2,
        description: room.description || "",
        contract_duration: room.contract_duration || "1_year",
        photos: room?.photos || [],
        video: room?.video || null,
      });
    }
  }, [room, reset]);
  const floor = watch("floor");
  const room_price = watch("room_price");
  const acreage = watch("acreage");
  const description = watch("description");
  const rental_object = watch("rental_object");
  const limit_people = watch("limit_people");
  const deposit = watch("deposit");
  const contract_duration = watch("contract_duration");
  const number_room = watch("number_room");
  const title = watch("title");
  const photos = watch("photos");
  const video = watch("video");

  useEffect(() => {
    dispatch(getListAmenities());
    dispatch(getListFurnitures());
  }, []);
  const onSubmit = async (data: any) => {
    try {
      const photoFiles: File[] = [];
      const photoIds: string[] = [];

      for (const photo of data.photos || []) {
        if (photo instanceof File) {
          photoFiles.push(photo);
        } else if (typeof photo === "string") {
          const id = extractIdFromUrl(photo);
          if (id) photoIds.push(id);
        } else if (photo && photo.id) {
          photoIds.push(photo.id);
        }
      }

      let uploadedPhotoIds: string[] = [];
      if (photoFiles.length > 0) {
        const uploadedPhotos = await uploadFilesToDirectus(photoFiles);
        uploadedPhotoIds = uploadedPhotos.map((f) => f.id);
      }

      let videoId: string | null = null;
      let imageFile = data.video;

      // Nếu là mảng (DragAndDropInput thường trả về mảng)
      if (Array.isArray(imageFile)) {
        imageFile = imageFile[0];
      }

      if (imageFile instanceof File) {
        const uploaded = await uploadFilesToDirectus([imageFile]);
        videoId = uploaded[0]?.id;
      } else if (typeof imageFile === "string") {
        videoId = extractIdFromUrl(imageFile);
      } else if (imageFile && imageFile.id) {
        videoId = imageFile.id;
      } else {
        videoId = null;
      }

      const submitData = {
        ...data,
        photos: [...photoIds, ...uploadedPhotoIds],
        video: videoId, // id video
      };
      console.log("servicescreate", submitData.services);

      if (room && room.id) {
        const existingServices = room.services || [];
        const submittedServices = submitData.services || [];

        const servicesUpdate = submittedServices
          .map((s: any) => {
            if (!s.room_service_id) return null;
            const existing = existingServices.find(
              (e: any) => e.room_service_id === s.room_service_id
            );
            if (!existing) return null;
            if (
              (s.custome_price ?? null) !== (existing.custome_price ?? null) ||
              (s.custome_unit ?? null) !== (existing.custome_unit ?? null)
            ) {
              return {
                id: s.room_service_id,
                custom_price: s.custome_price ?? null,
                custome_unit: s.custome_unit ?? null,
              };
            }
            return null;
          })
          .filter(Boolean); // loại bỏ null

        // Services create: những service mới chưa có room_service_id
        const servicesCreate = submittedServices
          .filter((s: any) => !s.room_service_id)
          .map((s: any) => ({
            room_id: room.id,
            service_id: s.id,
            custom_price: s.custome_price ?? null,
            custome_unit: s.custome_unit ?? null,
          }));

        // Services delete: những service cũ bị bỏ khỏi submit
        const servicesDelete = existingServices
          .filter(
            (e: any) =>
              !submittedServices.some(
                (s: any) => s.room_service_id === e.room_service_id
              )
          )
          .map((e: any) => e.room_service_id);
        const existingAmenities = room.amenities || [];
        const existingFurnitures = room.furnitures || [];
        const submittedAmenities = submitData.amenities || [];
        const submittedFurnitures = submitData.furnitures || [];
        // const amenitiesUpdate = submittedAmenities
        //   .filter((a: any) => a.room_category_id)
        //   .map((a: any) => ({
        //     id: a.room_category_id,
        //     amenities_id: a.id,
        //   }));

        const amenitiesCreate = submittedAmenities
          .filter((a: any) => !a.room_category_id)
          .map((a: any) => ({
            amenities_id: a.id,
            room_id: room.id,
          }));

        const amenitiesDelete = existingAmenities
          .filter(
            (a: any) => !submittedAmenities.some((sa: any) => sa.id === a.id)
          )
          .map((a: any) => a.room_category_id);
        const furnitureCreate = submittedFurnitures
          .filter((a: any) => !a.room_category_id)
          .map((a: any) => ({
            furnitures_id: a.id,
            room_id: room.id,
          }));

        const furnitureDelete = existingFurnitures
          .filter(
            (a: any) => !submittedFurnitures.some((sa: any) => sa.id === a.id)
          )
          .map((a: any) => a.room_category_id);

        await dispatch(
          updateRoom({
            roomId: room.id,
            data: {
              ...submitData,
              services: {
                update: servicesUpdate,
                create: servicesCreate,
                delete: servicesDelete,
              },
              amenities: {
                create: amenitiesCreate,
                delete: amenitiesDelete,
              },
              furnitures: { create: furnitureCreate, delete: furnitureDelete },
            },
          })
        );
      } else {
        const servicesCreate = submitData.services.map((service: any) => ({
          service_id: service.id,
          custome_price: service.custome_price || null,
          custome_unit: service.custome_unit || null,
        }));
        console.log("servicesCreate", servicesCreate);
        const amenitiesCreate = submitData.amenities.map((amenity: any) => ({
          amenities_id: amenity.id,
        }));
        const furnituresCreate = submitData.furnitures.map(
          (furniture: any) => ({
            furnitures_id: furniture.id,
          })
        );
        const data = {
          ...submitData,
          services: {
            create: servicesCreate,
          },
          amenities: {
            create: amenitiesCreate,
          },
          furnitures: {
            create: furnituresCreate,
          },
        };
        console.log("Data create", data);

        await dispatch(
          createRoom({
            data: data,
          })
        );
      }

      await dispatch(
        getListRoomByLandlord({
          ...searchParam,
          page: 1,
          limit: 10,
          currentUserId: userInfo?.id,
        })
      );
      console.log("Submit data:", submitData);

      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      // Hiển thị thông báo lỗi nếu cần
    }
  };
  const handleServiceSubmit = (serviceData) => {
    setEditingServiceIndex(null);
  };
  const handleServiceEdit = (service: IService, index: number) => {
    setEditingServiceIndex(index);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">
          {room ? "Edit Room" : "Add New Room"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BiX size={20} />
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-6"
      >
        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                value={title || ""}
                onChange={(e) => setValue("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">
                  Tiêu đề không được để trống
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng số
              </label>
              <input
                type="text"
                value={number_room || ""}
                onChange={(e) =>
                  setValue("number_room", parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              />
              {errors.number_room && (
                <p className="text-red-500 text-sm">Hãy nhập số phòng</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building
              </label>
              <select
                // value={formData.building}
                // onChange={(e) =>
                //   setValue("bui")
                // }
                {...register("building", { required: true })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              >
                <option value="">Select Building</option>
                {buildingList.map((building) => (
                  <option
                    key={building?.id}
                    value={building?.id}
                  >
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng đơn
              </label>
              <select
                {...register("room_type", { required: true })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              >
                {roomTypeList?.map((type) => (
                  <option
                    key={type?.id}
                    value={type?.id}
                  >
                    {type?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              >
                {roomStatus.map((status) => (
                  <option
                    key={status?.value}
                    value={status?.value}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tầng
              </label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setValue("floor", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá thuê (đ/Tháng)
              </label>
              <input
                type="number"
                value={room_price}
                onChange={(e) =>
                  setValue("room_price", parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiền cọc (đ/Tháng)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setValue("deposit", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diện tích (m²)
              </label>
              <input
                type="number"
                value={acreage}
                onChange={(e) => setValue("acreage", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số người tối đa
              </label>
              <Radio
                name="limitPeople"
                options={limitPeople}
                value={limit_people}
                onChange={(value) => setValue("limit_people", value)}
                // gridCols={2}
                layout="horizontal"
                // title="Số người tối đa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đối tượng thuê
              </label>
              <Radio
                name="rentalObject"
                options={rentalObject}
                value={rental_object}
                onChange={(value) => setValue("rental_object", value)}
                // gridCols={}
                layout="horizontal"
                // title="Số người tối đa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời hạn hợp đồng
              </label>
              <Radio
                name="contractDuration"
                options={contractDurationOptions}
                value={contract_duration}
                onChange={(value) => setValue("contract_duration", value)}
                // gridCols={}
                layout="horizontal"
                // title="Số người tối đa"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dịch vụ
              </label>
              {/* <div className="grid  gap-2"> */}
              <div>
                <ServiceCardGrid
                  setValue={setValue}
                  watch={watch}
                  name="services"
                  servicesList={servicesList}
                  // services={services}
                  onEdit={handleServiceEdit}
                  onAdd={(s) => setValue("services", [...watch("services"), s])}
                  onDelete={(id) =>
                    setValue(
                      "services",
                      watch("services").filter((s) => s.id !== id)
                    )
                  }
                />
              </div>
              <ServiceForm
                isOpen={editingServiceIndex !== null}
                onClose={() => setEditingServiceIndex(null)}
                onSubmit={handleServiceSubmit}
                initialData={
                  editingServiceIndex !== null
                    ? watch("services")[editingServiceIndex]
                    : null
                }
                setValue={setValue}
                watch={watch}
                name="services"
                index={editingServiceIndex}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiện nghi
              </label>
              {/* <div className="grid  gap-2"> */}
              <ReusableCategorySelector
                name="amenities"
                cols={4}
                watch={watch}
                setValue={setValue}
                categories={amenitiesList}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội thất
              </label>

              <ReusableCategorySelector
                name="furnitures"
                cols={4}
                watch={watch}
                setValue={setValue}
                categories={furnituresList}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Ảnh
            </label>

            <Controller
              name="photos"
              control={control}
              render={({ field }) => {
                return (
                  <DragAndDropInput
                    onChange={(file) => {
                      field.onChange(file);
                    }}
                    multiple
                    maxFiles={5}
                    links={
                      field.value
                        ? field.value
                            .map((photo: any) => {
                              if (typeof photo === "string") {
                                return photo;
                              } else if (
                                photo &&
                                photo.id &&
                                photo.filename_download
                              ) {
                                // Nếu là object từ server
                                return `${URL_IMAGE}/${photo.id}/${photo.filename_download}`;
                              } else if (photo instanceof File) {
                                // Nếu là file mới
                                return URL.createObjectURL(photo);
                              }
                              return null;
                            })
                            .filter(Boolean)
                        : []
                    }
                  />
                );
              }}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Video
            </label>
            <Controller
              name="video"
              control={control}
              render={({ field }) => {
                const videoLink =
                  field.value &&
                  typeof field.value === "object" &&
                  field.value.id
                    ? `${URL_IMAGE}/${field.value.id}/${field.value.filename_download}`
                    : undefined;
                return (
                  <>
                    <DragAndDropInput
                      onChange={(file) => {
                        field.onChange(file);
                      }}
                      multiple
                      maxFiles={1}
                      links={videoLink ? [videoLink] : []}
                    />
                  </>
                );
              }}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <MDEditor
              value={description}
              onChange={(value) => setValue("description", value || "")}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#1E88E5] text-white rounded-md hover:bg-[#1A73E8]"
          >
            {room ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default RoomForm;
