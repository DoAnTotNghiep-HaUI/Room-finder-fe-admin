import FileUpload from "@/components/Input/file-upload-multiple";
import { Room } from "@/types/room";
import { MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { IoVideocamOutline } from "react-icons/io5";

interface RoomFormProps {
  room?: Room | null;
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
  const [formData, setFormData] = useState({
    number: room?.number || "",
    buildingId: room?.buildingId || "",
    type: room?.type || "studio",
    floor: room?.floor || 1,
    status: room?.status || "available",
    baseRent: room?.baseRent || 0,
    area: room?.area || 0,
    amenities: room?.amenities || [],
  });
  const buildings = [
    {
      id: "1",
      name: "Sunset Apartments",
    },
    {
      id: "2",
      name: "Ocean View Complex",
    },
  ];
  const roomTypes = ["studio", "single", "double", "suite"];
  const roomStatuses = ["available", "occupied", "maintenance"];
  const availableAmenities = [
    "Air Conditioning",
    "Balcony",
    "Built-in Wardrobe",
    "City View",
    "Furnished",
    "High Floor",
    "Parking Space",
    "Pet Friendly",
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };
  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [video, setVideo] = useState<FileWithPreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleDragEnd = (event: any) => {
    setIsDragging(false);
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
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
            setImages((prev) => [...prev, fileWithPreview]);
          } else {
            setVideo(fileWithPreview);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );
  const removeImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };
  const removeVideo = () => {
    setVideo(null);
  };
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
  const { control } = useForm({
    defaultValues: {
      roomImage: "",
      // ... other form fields
    },
  });
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
        onSubmit={handleSubmit}
        className="p-6 space-y-6"
      >
        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building
              </label>
              <select
                value={formData.buildingId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buildingId: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option
                    key={building.id}
                    value={building.id}
                  >
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Room["type"],
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {roomTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Room["status"],
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {roomStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    floor: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Rent ($/month)
              </label>
              <input
                type="number"
                value={formData.baseRent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    baseRent: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (m²)
              </label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    area: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-2 rounded border ${
                      formData.amenities.includes(amenity)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    } cursor-pointer hover:bg-gray-50`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Room Images
            </label>
            <FileUpload
              name="roomImages"
              control={control}
              multiple={true}
              maxFiles={5}
              onChange={(files) => {
                // Handle multiple files
                console.log("Files changed:", files);
              }}
              onDelete={(index) => {
                // Handle image deletion
                console.log("Image deleted at index:", index);
              }}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Room Video (Optional)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleFileDrop(e, "video")}
            >
              <div className="flex flex-col items-center">
                <IoVideocamOutline className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">
                  Drag and drop a video here, or click to select file
                </p>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onDrop([e.target.files[0]], "video");
                    }
                  }}
                  id="video-upload"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("video-upload")?.click()
                  }
                  className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                >
                  Select Video
                </button>
              </div>
            </div>
            {video && (
              <div className="relative">
                <video
                  src={video.preview}
                  className="w-full rounded-lg"
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
                >
                  <BiX
                    size={16}
                    className="text-gray-500"
                  />
                </button>
              </div>
            )}
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
            {room ? "Update Room" : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default RoomForm;
