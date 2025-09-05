"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useController, type Control } from "react-hook-form";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CiFileOn } from "react-icons/ci";
import { FaFileImage } from "react-icons/fa6";
import { BiUpload, BiVideo, BiX } from "react-icons/bi";

type FileType = "image" | "video" | "all";

interface MultiFileUploadFieldProps {
  name: string;
  control: Control<any>;
  defaultFileUrls?: string[];
  accept?: FileType;
  maxSizeMB?: number;
  maxFiles?: number;
  label?: string;
  onDelete?: (index: number) => void;
  onChange?: (files: File[]) => void;
}

export default function MultiFileUploadField({
  name,
  control,
  defaultFileUrls = [],
  accept = "image",
  maxSizeMB = 5,
  maxFiles = 5,
  label = "Upload Files",
  onDelete,
  onChange,
}: MultiFileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>(defaultFileUrls || []);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure accepted file types
  const getAcceptedTypes = (): string[] => {
    switch (accept) {
      case "image":
        return [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/webp",
        ];
      case "video":
        return ["video/mp4", "video/webm", "video/ogg"];
      case "all":
        return [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/webm",
          "video/ogg",
        ];
      default:
        return ["image/jpeg", "image/png", "image/jpg"];
    }
  };

  const acceptedTypes = getAcceptedTypes();
  const acceptString = acceptedTypes.join(",");

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // React Hook Form controller
  const {
    field: { value, onChange: fieldOnChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);

    // Check if adding these files would exceed the maximum
    if (value && value.length + newFiles.length > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} files`);
      return;
    }

    // Validate file types
    const invalidFiles = newFiles.filter(
      (file) => !acceptedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      alert(
        `Invalid file type(s). Accepted types: ${acceptedTypes
          .map((type) => type.split("/")[1].toUpperCase())
          .join(", ")}`
      );
      return;
    }

    // Validate file sizes
    const oversizedFiles = newFiles.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Update form value
    const updatedFiles = [...(value || []), ...newFiles];
    fieldOnChange(updatedFiles);

    // Call onChange callback if provided
    if (onChange) {
      onChange(updatedFiles);
    }

    // Create previews for new files
    const newPreviews: string[] = [];
    const newFileTypes: string[] = [];

    const previewPromises = newFiles.map((file) => {
      return new Promise<{ preview: string; type: string }>((resolve) => {
        newFileTypes.push(file.type);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              preview: reader.result as string,
              type: file.type,
            });
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith("video/")) {
          const videoUrl = URL.createObjectURL(file);
          resolve({
            preview: videoUrl,
            type: file.type,
          });
        } else {
          resolve({
            preview: "",
            type: file.type,
          });
        }
      });
    });

    Promise.all(previewPromises).then((results) => {
      const newPreviews = results.map((result) => result.preview);
      const newFileTypes = results.map((result) => result.type);

      setPreviews([...previews, ...newPreviews]);
      setFileTypes([...fileTypes, ...newFileTypes]);
    });
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file at specific index
  const handleRemove = (index: number) => {
    const updatedPreviews = [...previews];
    const updatedFileTypes = [...fileTypes];
    const updatedFiles = [...(value || [])];

    updatedPreviews.splice(index, 1);
    updatedFileTypes.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviews(updatedPreviews);
    setFileTypes(updatedFileTypes);
    fieldOnChange(updatedFiles);

    if (onDelete) {
      onDelete(index);
    }
  };

  // Render file preview based on type
  const renderPreview = (preview: string, type: string, index: number) => {
    if (!preview) {
      return (
        <div className="flex items-center justify-center h-full">
          <CiFileOn className="h-10 w-10 text-gray-400" />
        </div>
      );
    }

    if (
      type.startsWith("image/") ||
      preview.match(/\.(jpeg|jpg|png|gif|webp)$/i)
    ) {
      return (
        <img
          src={preview || "/placeholder.svg"}
          alt={`File preview ${index + 1}`}
          className="w-full h-full object-cover rounded-md"
        />
      );
    }

    if (type.startsWith("video/") || preview.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video
          src={preview}
          controls
          className="w-full h-full object-cover rounded-md"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <CiFileOn className="h-10 w-10 text-gray-400" />
      </div>
    );
  };

  // Get icon based on accepted file type
  const getTypeIcon = () => {
    switch (accept) {
      case "image":
        return <FaFileImage className="h-10 w-10 text-gray-400 mb-3" />;
      case "video":
        return <BiVideo className="h-10 w-10 text-gray-400 mb-3" />;
      default:
        return <BiUpload className="h-10 w-10 text-gray-400 mb-3" />;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden bg-gray-50"
            >
              <div className="aspect-video">
                {renderPreview(preview, fileTypes[index] || "", index)}
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-colors"
                aria-label="Remove file"
              >
                <BiX className="h-4 w-4" />
              </button>
            </div>
          ))}

          {(!value || value.length < maxFiles) && (
            <div
              className={`border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={(e) => {
                  // Connect both refs
                  ref(e);
                  fileInputRef.current = e;
                }}
                className="hidden"
                accept={acceptString}
                onChange={handleFileChange}
                multiple
              />

              {getTypeIcon()}

              <p className="text-sm text-gray-600 text-center">
                Add more {accept}s
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {value ? `${value.length}/${maxFiles}` : `0/${maxFiles}`} files
              </p>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    </DndContext>
  );
}
