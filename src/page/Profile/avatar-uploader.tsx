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
import { FaUser } from "react-icons/fa";
import { BiUpload, BiX } from "react-icons/bi";

interface AvatarUploaderProps {
  avatar: File | null;
  setAvatar: (file: File | null) => void;
  avatarPreview: string | null;
  setAvatarPreview: (preview: string | null) => void;
}

export default function AvatarUploader({
  avatar,
  setAvatar,
  avatarPreview,
  setAvatarPreview,
}: AvatarUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
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
    if (
      !file.type.match("image/jpeg") &&
      !file.type.match("image/png") &&
      !file.type.match("image/jpg")
    ) {
      alert("Please upload a valid image file (JPEG, JPG, or PNG)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }

    setAvatar(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex flex-col items-center">
        <div
          className={`relative w-40 h-40 rounded-full overflow-hidden border-2 ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } flex items-center justify-center cursor-pointer`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
          />

          {avatarPreview ? (
            <img
              src={avatarPreview || "/placeholder.svg"}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <FaUser className="h-16 w-16 text-gray-400" />
              <p className="text-sm text-gray-500 text-center mt-2">
                Drag & drop or click to upload
              </p>
            </div>
          )}

          {isDragging && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
              <BiUpload className="h-12 w-12 text-white" />
            </div>
          )}
        </div>

        {avatarPreview && (
          <button
            type="button"
            onClick={removeAvatar}
            className="mt-2 flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <BiX className="h-4 w-4 mr-1" />
            Remove photo
          </button>
        )}

        <p className="mt-2 text-xs text-gray-500 text-center">
          Supported formats: JPG, PNG. Max size: 5MB
        </p>
      </div>
    </DndContext>
  );
}
