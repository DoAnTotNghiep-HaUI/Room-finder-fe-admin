"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useFormContext } from "react-hook-form";
import { BiUpload, BiX } from "react-icons/bi";
import { FiFile } from "react-icons/fi";

interface DragAndDropUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
  acceptedFileTypes: string[];
  maxSizeMB: number;
  fieldName: string;
}

export default function DragAndDropUploader({
  file,
  setFile,
  filePreview,
  setFilePreview,
  acceptedFileTypes,
  maxSizeMB,
  fieldName,
}: DragAndDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];

    // Validate file type
    const fileType = file.type;
    if (!acceptedFileTypes.includes(fileType)) {
      alert(
        `Please upload a valid file type: ${acceptedFileTypes
          .map((type) => type.split("/")[1].toUpperCase())
          .join(", ")}`
      );
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setFile(file);
    setValue(fieldName, file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setValue(fieldName, undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="w-full">
        {!file ? (
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
              ref={fileInputRef}
              className="hidden"
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileChange}
            />
            <BiUpload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 text-center">
              Drag & drop your file here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats:{" "}
              {acceptedFileTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}
              . Max size: {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center">
              {filePreview ? (
                <div className="w-16 h-16 rounded overflow-hidden mr-4">
                  <img
                    src={filePreview || "/placeholder.svg"}
                    alt="File preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center mr-4">
                  <FiFile className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="ml-4 flex-shrink-0 text-red-600 hover:text-red-800"
              >
                <BiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
