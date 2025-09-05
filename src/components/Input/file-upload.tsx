"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useController, type Control } from "react-hook-form";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CiFileOn, CiVideoOn } from "react-icons/ci";
import { FaImage, FaUpload } from "react-icons/fa6";
import { LuRefreshCw } from "react-icons/lu";
import { BiX } from "react-icons/bi";

type FileType = "image" | "video" | "all";

interface FileUploadFieldProps {
  name: string;
  control: Control<any>;
  defaultFileUrl?: string;
  accept?: FileType;
  maxSizeMB?: number;
  label?: string;
  multiple?: boolean;
  onDelete?: () => void;
  onChange?: (files: File[]) => void;
}

export default function FileUploadField({
  name,
  control,
  defaultFileUrl,
  accept = "image",
  maxSizeMB = 5,
  label = "Upload File",
  multiple = false,
  onDelete,
  onChange,
}: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultFileUrl || null);
  const [fileType, setFileType] = useState<string | null>(null);
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
    defaultValue: null,
  });

  // Update preview when default URL changes
  useEffect(() => {
    if (defaultFileUrl) {
      setPreview(defaultFileUrl);
      // Try to determine file type from URL
      if (defaultFileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
        setFileType("image");
      } else if (defaultFileUrl.match(/\.(mp4|webm|ogg)$/i)) {
        setFileType("video");
      }
    }
  }, [defaultFileUrl]);

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
    const files: File[] = multiple ? Array.from(fileList) : [fileList[0]];

    // Validate file types
    const invalidFiles = files.filter(
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
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Update form value
    fieldOnChange(multiple ? files : files[0]);

    // Call onChange callback if provided
    if (onChange) {
      onChange(files);
    }

    // Create preview for the first file
    const file = files[0];
    setFileType(file.type);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setPreview(videoUrl);
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const handleRemove = () => {
    setPreview(null);
    setFileType(null);
    fieldOnChange(multiple ? [] : null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onDelete) {
      onDelete();
    }
  };

  // Replace file
  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  // Render file preview based on type
  const renderPreview = () => {
    if (!preview) return null;

    if (
      fileType?.startsWith("image/") ||
      (!fileType && preview.match(/\.(jpeg|jpg|png|gif|webp)$/i))
    ) {
      return (
        <img
          src={preview || "/placeholder.svg"}
          alt="File preview"
          className="w-full h-full object-cover rounded-md"
        />
      );
    }

    if (
      fileType?.startsWith("video/") ||
      (!fileType && preview.match(/\.(mp4|webm|ogg)$/i))
    ) {
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
        <CiFileOn className="h-16 w-16 text-gray-400" />
      </div>
    );
  };

  // Get icon based on accepted file type
  const getTypeIcon = () => {
    switch (accept) {
      case "image":
        return <FaImage className="h-10 w-10 text-gray-400 mb-3" />;
      case "video":
        return <CiVideoOn className="h-10 w-10 text-gray-400 mb-3" />;
      default:
        return <FaUpload className="h-10 w-10 text-gray-400 mb-3" />;
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

        {!preview ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
              multiple={multiple}
            />

            {getTypeIcon()}

            <p className="text-sm text-gray-600 text-center">
              Drag & drop your {accept} here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats:{" "}
              {acceptedTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}
            </p>
            <p className="text-xs text-gray-500">Max size: {maxSizeMB}MB</p>
          </div>
        ) : (
          <div className="relative border rounded-lg overflow-hidden bg-gray-50">
            <div className="aspect-video">{renderPreview()}</div>

            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                type="button"
                onClick={handleReplace}
                className="p-1.5 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-colors"
                aria-label="Replace file"
              >
                <LuRefreshCw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-red-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-colors"
                aria-label="Remove file"
              >
                <BiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    </DndContext>
  );
}
