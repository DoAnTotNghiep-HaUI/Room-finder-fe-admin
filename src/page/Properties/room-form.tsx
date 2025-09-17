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
import ServiceForm from "./services/service-form";
import ServiceCardGrid from "./services/service-card";
import { getListServices } from "@/redux/services/action";
import { URL_IMAGE } from "@/constants";
import { IFile } from "@/types/file";
import MDEditor from "@uiw/react-md-editor";
import Radio from "@/components/Input/radio";
import { DragAndDropInput } from "@/components/Input/file-upload-multiple";

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
  const { buildingList } = useSelector((state: AppState) => state.building);
  const { roomTypeList } = useSelector((state: AppState) => state.roomType);
  const { amenitiesList } = useSelector((state: AppState) => state.amenities);
  const { servicesList } = useSelector((state: AppState) => state.services);
  const { accessToken } = useSelector((state: AppState) => state.auth);
  const { furnituresList } = useSelector((state: AppState) => state.furnitures);
  const [images, setImages] = useState<FileWithPreview[]>([]);
  // const [video, setVideo] = useState<FileWithPreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [showServiceForm, setShowServiceForm] = useState(false);

  const defaultServices = room
    ? room?.services
    : servicesList?.filter((service) => service?.is_default === true);

  const [services, setServices] = useState<IService[]>(defaultServices);
  const [editingService, setEditingService] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);
  const defaultRoomImage = room ? room?.photos : [];

  const [roomPhotos, setRoomPhotos] = useState<IFile[]>(defaultRoomImage);
  console.log("defaultServices", room?.services);
  const defaultRoomVideo = room ? room?.video : null;
  const externalLink = `${URL_IMAGE}/${room.video?.id}/${room.video?.filename_download}`;
  const [previewVideo, setPreviewVideo] = useState<string>(
    externalLink || null
  );
  console.log("images", images);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null
  );
  // const [formData, setFormData] = useState({
  //   number: room?.number_room || "",
  //   building: room?.building?.id || "",
  //   room_type: room?.room_type?.id || 1,
  //   floor: room?.floor || 1,
  //   status: room?.status || "available",
  //   title: room?.title || "",
  //   acreage: room?.acreage || 0,
  //   services: room?.services || [],
  //   amenities: room?.amenities || [],
  //   furnitures: room?.furnitures || [],
  //   deposit: room?.deposit || "",
  //   room_price: room?.room_price || "",
  //   rental_object: room?.rental_object || "all",
  //   limit_people: room?.limit_people || 2,
  //   description: room?.description || "",
  //   contract_duration: room?.contract_duration || "1_year",
  //   photos: [],
  // });

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
      number: 0,
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
        number: room.number_room || 0,
        building: room.building?.id || "",
        room_type: room.room_type?.id || "",
        floor: room.floor || 1,
        status: room.status || "available",
        title: room.title || "",
        acreage: room.acreage || 0,
        services: room?.services || [],
        amenities: room?.amenities?.map((a: any) => a.id) || [],
        furnitures: room?.furnitures?.map((f: any) => f.id) || [],
        deposit: room.deposit || 0,
        room_price: room.room_price || 0,
        rental_object: room.rental_object || "all",
        limit_people: room.limit_people || 2,
        description: room.description || "",
        contract_duration: room.contract_duration || "1_year",
        photos: room?.photos || [],
        video: room?.video || null,
      });
      // if (room.photos?.length) {
      //   const urls = room.photos.map(
      //     (photo: any) => `${URL_IMAGE}/${photo.id}/${photo.filename_download}`
      //   );
      //   setValue("photos", urls);
      // }
      // if (room.video) {
      //   console.log("video", room.video);

      //   const videoUrl = `${URL_IMAGE}/${room.video.id}/${room.video.filename_download}`;
      //   setVideo({
      //     preview: videoUrl,
      //     id: room.video.id,
      //   } as FileWithPreview);
      // }
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
  const photos = watch("photos");
  const video = watch("video");
  console.log("video", video);

  console.log(
    "amenities",
    room?.amenities?.map((a: any) => a.amenities_id)
  );

  useEffect(() => {
    dispatch(getListAmenities());
    dispatch(getListFurnitures());
  }, []);
  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    onClose();
  };
  useEffect(() => {
    fetch(externalLink, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the video");
        }
        return response.blob();
      })
      .then((blob) => {
        setPreviewVideo(URL.createObjectURL(blob));
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
        setPreviewVideo(null);
      });
  }, [room]);
  const onDrop = useCallback(
    (acceptedFiles: File[], fileType: "image" | "video") => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileWithPreview = Object.assign(file, {
            preview: reader.result as string,
            id: Math.random().toString(36).substring(7),
          });

          if (fileType === "image") {
            setImages((prev) => {
              const updated = [...prev, fileWithPreview];
              setValue("photos", updated);
              return updated;
            });
          } else {
            // setVideo(fileWithPreview);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [setValue]
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue("photos", updated);
      return updated;
    });
  };
  // const removeVideo = () => {
  //   setVideo(null);
  // };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleFileDrop = (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const acceptedFiles = files.filter((file) => {
      if (type === "image") {
        return file.type.startsWith("image/");
      } else {
        return file.type.startsWith("video/");
      }
    });
    onDrop(acceptedFiles, type);
  };
  // const { control } = useForm({
  //   defaultValues: {
  //     photos: "",
  //     // ... other form fields
  //   },
  // });
  const handleServiceSubmit = (serviceData) => {
    console.log("Service data:", serviceData);

    setEditingServiceIndex(null);
  };
  console.log("serviceEdit", editingService);
  const handleServiceEdit = (service: IService, index: number) => {
    console.log("serviceEdit", service);

    setEditingServiceIndex(index);
  };

  const handleAddService = (service: IService) => {
    setServices((prev) => [...prev, service]);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  const handleFilesChange = (files: IFile[]) => {
    setUploadedFiles(files);
    console.log("Uploaded files:", files);
  };

  const handleRoomPhotosChange = (files: IFile[]) => {
    setRoomPhotos(files);
    console.log("Room files:", files);
  };
  // const handleRoomVideoChange = (files: IFile) => {
  //   setRoomVideo(files);
  //   console.log("Room files:", files);
  // };
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
                value={room?.description || ""}
                onChange={(e) => setValue("description", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              />
              {errors.description && (
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
                value={room?.number_room || ""}
                onChange={(e) => setValue("number", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              />
              {errors.number && (
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
                // value={formData.room_type}
                // onChange={(e) =>
                //   setFormData({
                //     ...formData,
                //     room_type: e.target.value,
                //   })
                // }
                {...register("room_type", { required: true })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                required
              >
                {roomTypeList.map((type) => (
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
                // value={formData?.status}
                // onChange={(e) =>
                //   setFormData({
                //     ...formData,
                //     status: e.target.value,
                //   })
                // }
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
                onChange={(value) => setValue("rental_object", value)}
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
            {/* <FileUpload
              defaultImageUrls={
                room?.photos?.map(
                  (p: any) => `${URL_IMAGE}/${p.id}/${p.filename_download}`
                ) || []
              }
              multiple
              onChange={(files) => {
                // files gồm cả string (ảnh cũ) và File (ảnh mới)
                setValue("photos", files);
              }}
            /> */}
            {/* <FileUpload
              maxFiles={5}
              minFiles={1}
              existingImages={roomPhotos}
              onImagesChange={handleRoomPhotosChange}
              title="Quản lý hình ảnh phòng"
              description="Xem và chỉnh sửa hình ảnh phòng trọ"
            /> */}
            <Controller
              name="photos"
              control={control}
              render={({ field }) => {
                console.log("field", field);

                return (
                  <>
                    <DragAndDropInput
                      onChange={(file) => {
                        field.onChange(file);
                      }}
                      multiple
                      maxFiles={5}
                      links={
                        photos?.map(
                          (photo: any) =>
                            `${URL_IMAGE}/${photo.id}/${photo.filename_download}`
                        ) || []
                      }
                    />
                  </>
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
                console.log("field", field);
                console.log(
                  "video",
                  `${URL_IMAGE}/${video?.id}/${video?.filename_download}`
                );
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
