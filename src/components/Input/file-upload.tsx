"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiEye,
  FiTrash2,
  FiImage,
  FiVideo,
  FiFile,
} from "react-icons/fi";
import { URL_IMAGE } from "@/constants";
import { BiX } from "react-icons/bi";
import { IFile } from "@/types/file";

export interface FileUploadProps {
  maxFiles?: number;
  minFiles?: number;
  acceptedTypes?: string[];
  onImagesChange?: (images: IFile[]) => void;
  onVideoChange?: (video: IFile | null) => void;
  existingImages?: IFile[];
  existingVideo?: IFile | null;
  title?: string;
  description?: string;
  allowVideo?: boolean;
}

export default function FileUpload({
  maxFiles = 5,
  minFiles = 1,
  acceptedTypes = ["image/*", "video/*"],
  onImagesChange,
  onVideoChange,
  existingImages = [],
  existingVideo = null,
  title = "Hình ảnh và Video",
  description = "Nhận hoặc thả hình ảnh và video để upload",
  allowVideo = true,
}: FileUploadProps) {
  const [images, setImages] = useState<IFile[]>(existingImages);
  const [video, setVideo] = useState<IFile | null>(existingVideo);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<IFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (fileType: string): "image" | "video" | "other" => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";
    return "other";
  };

  const formatFileSize = (filesize: string): string => {
    const bytes = Number.parseInt(filesize);
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleFiles = useCallback(
    (newFiles: FileList) => {
      const fileArray = Array.from(newFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      const videoFiles = fileArray.filter((file) =>
        file.type.startsWith("video/")
      );

      if (imageFiles.length > 0) {
        const remainingSlots = maxFiles - images.length;
        const imagesToAdd = imageFiles.slice(0, remainingSlots);

        const uploadedImages: IFile[] = imagesToAdd.map((file) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          storage: "local",
          filename_disk: file.name,
          filename_download: file.name,
          title: file.name.split(".")[0],
          type: file.type,
          folder: "uploads",
          uploaded_by: "user",
          uploaded_on: new Date().toISOString(),
          modified_by: "user",
          modified_on: new Date().toISOString(),
          charset: null,
          filesize: file.size.toString(),
          width: 0,
          height: 0,
          duration: null,
          embed: null,
          description: null,
          location: null,
          tags: null,
          metadata: { url: URL.createObjectURL(file) },
          focal_point_x: null,
          focal_point_y: null,
        }));

        const updatedImages = [...images, ...uploadedImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      }

      if (videoFiles.length > 0 && allowVideo && !video) {
        const videoFile = videoFiles[0];
        const uploadedVideo: IFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          storage: "local",
          filename_disk: videoFile.name,
          filename_download: videoFile.name,
          title: videoFile.name.split(".")[0],
          type: videoFile.type,
          folder: "uploads",
          uploaded_by: "user",
          uploaded_on: new Date().toISOString(),
          modified_by: "user",
          modified_on: new Date().toISOString(),
          charset: null,
          filesize: videoFile.size.toString(),
          width: 0,
          height: 0,
          duration: null,
          embed: null,
          description: null,
          location: null,
          tags: null,
          metadata: { url: URL.createObjectURL(videoFile) },
          focal_point_x: null,
          focal_point_y: null,
        };

        setVideo(uploadedVideo);
        onVideoChange?.(uploadedVideo);
      }
    },
    [images, video, maxFiles, onImagesChange, onVideoChange, allowVideo]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (fileId: string) => {
      const updatedImages = images.filter((file) => file.id !== fileId);
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    },
    [images, onImagesChange]
  );

  const removeVideo = useCallback(() => {
    setVideo(null);
    onVideoChange?.(null);
  }, [onVideoChange]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const canAddMoreImages = images.length < maxFiles;
  const canAddVideo = allowVideo && !video;

  const allFiles = [...images, ...(video ? [video] : [])];

  const getFileUrl = (file: IFile): string => {
    if (
      file.metadata &&
      typeof file.metadata === "object" &&
      "url" in file.metadata
    ) {
      return (file.metadata as any).url;
    }
    return `${URL_IMAGE}/${file.id}/${file.filename_download}`;
  };

  return (
    <div className="w-full space-y-4">
      {allFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {allFiles.map((file) => {
              const fileType = getFileType(file.type);
              const fileUrl = getFileUrl(file);
              const isVideo = fileType === "video";

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group bg-white border-2 border-gray-200 rounded-lg overflow-hidden aspect-square"
                >
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    {fileType === "image" ? (
                      <img
                        src={fileUrl || "/placeholder.svg"}
                        alt={file.title}
                        className="w-full h-full object-cover"
                      />
                    ) : fileType === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={fileUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center">
                          <FiVideo className="w-3 h-3 mr-1" />
                          Video
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {/* {fileType === "image" && (
                          <FiImage className="w-4 h-4" />
                        )} */}
                        {/* {fileType === "video" && ( */}
                        <FiVideo className="w-4 h-4" />
                        {/* )}
                        {fileType === "other" && <FiFile className="w-4 h-4" />} */}
                        <span className="text-xs mt-1 text-center px-2 truncate">
                          {file.filename_download}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e: React.MouseEvent) => {
                          setPreviewFile(file);
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        className="p-2 bg-[#1E88E5] text-white rounded-full hover:bg-[#1565C0] transition-colors"
                        title="Xem"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          isVideo ? removeVideo() : removeImage(file.id);
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Xóa"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="flex items-center text-white text-xs">
                      {fileType === "image" ? (
                        <FiImage className="w-4 h-4" />
                      ) : fileType === "video" ? (
                        <FiVideo className="w-4 h-4" />
                      ) : (
                        <FiFile className="w-4 h-4" />
                      )}
                      <span className="ml-1 truncate">{file.title}</span>
                    </div>
                    <div className="text-white text-xs opacity-75">
                      {formatFileSize(file.filesize)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {(canAddMoreImages || canAddVideo) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${
              isDragOver
                ? "border-[#1E88E5] bg-blue-50"
                : "border-gray-300 hover:border-[#1E88E5] hover:bg-gray-50"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <FiUpload className="w-8 h-8 text-gray-400" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                {title}
              </h3>
              <p className="text-gray-500 mb-2">{description}</p>
              <p className="text-sm text-gray-400">
                Hình ảnh: tối đa {maxFiles} ảnh{" "}
                {allowVideo && "| Video: tối đa 1 video"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Đã tải lên: {images.length} ảnh
                {allowVideo && `, ${video ? 1 : 0} video`}
              </p>
            </div>

            <button
              type="button"
              className="px-6 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
            >
              Chọn file
            </button>
          </div>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />

      {allFiles.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Đã chọn: {images.length} ảnh
            {allowVideo && `, ${video ? 1 : 0} video`}
          </span>
          {images.length >= maxFiles && (
            <span className="text-orange-500">Đã đạt giới hạn ảnh tối đa</span>
          )}
          {video && allowVideo && (
            <span className="text-blue-500">Đã có video</span>
          )}
          {images.length < minFiles && (
            <span className="text-red-500">Tối thiểu {minFiles} ảnh</span>
          )}
        </div>
      )}

      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-medium truncate">
                  {previewFile.title}
                </h3>
                <button
                  type="button"
                  onClick={(e: React.MouseEvent) => {
                    setPreviewFile(null);
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {getFileType(previewFile.type) === "image" ? (
                  <img
                    src={getFileUrl(previewFile) || "/placeholder.svg"}
                    alt={previewFile.title}
                    className="max-w-full max-h-96 object-contain mx-auto"
                  />
                ) : getFileType(previewFile.type) === "video" ? (
                  <video
                    src={getFileUrl(previewFile)}
                    controls
                    className="max-w-full max-h-96 mx-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    {getFileType(previewFile.type) === "image" ? (
                      <FiImage className="w-5 h-5" />
                    ) : getFileType(previewFile.type) === "video" ? (
                      <FiVideo className="w-5 h-5" />
                    ) : (
                      <FiFile className="w-5 h-5" />
                    )}
                    <p className="mt-2 text-gray-600">
                      {previewFile.filename_download}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(previewFile.filesize)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
