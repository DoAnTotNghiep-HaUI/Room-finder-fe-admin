import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaTrashRestoreAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import PreviewVideo from "./previewVideo";
import { REGEX_URL, URL_IMAGE } from "@/constants";

const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
const audioExtensions = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"];

interface FileItem {
  id: string;
  type: "file" | "url";
  url: string;
  file?: File;
  isVideo?: boolean;
  isImage?: boolean;
  isAudio?: boolean;
  isPDF?: boolean;
  isDOCX?: boolean;
  isServerUrl?: boolean; // Thêm để phân biệt link server
}

interface DragAndDropInputProps {
  links?: string[]; // link từ server (edit)
  onChange?: (files: (File | string)[]) => void;
  onRemove?: (index: number) => void;
  inputAccept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

function DragAndDropInput({
  links = [],
  onChange,
  onRemove,
  inputAccept,
  multiple = false,
  maxFiles = 10,
}: DragAndDropInputProps) {
  // Chỉ khởi tạo fileItems từ links khi mount hoặc khi links thực sự thay đổi (edit)
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  // const [externalLink, setExternalLink] = useState(links);

  useEffect(() => {
    if (links.length > 0) {
      // Nếu là link server (edit), tạo preview đúng link server
      const urlItems: FileItem[] = links.map((link) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "url",
        url: link,
        isServerUrl: true,
        isVideo:
          videoExtensions.some((ext) => link.toLowerCase().endsWith(ext)) ||
          link.includes("video"),
        isImage: imageExtensions.some((ext) =>
          link.toLowerCase().endsWith(ext)
        ),
        isAudio: audioExtensions.some((ext) =>
          link.toLowerCase().endsWith(ext)
        ),
        isPDF: link.endsWith(".pdf"),
        isDOCX: link.endsWith(".docx"),
      }));
      setFileItems(urlItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(links)]); // Chỉ chạy khi links thực sự thay đổi

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    handleFileChange(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFileChange = (files: FileList) => {
    if (files && files.length > 0) {
      const newFileItems: FileItem[] = [];

      for (let i = 0; i < files.length; i++) {
        if (fileItems.length + newFileItems.length >= maxFiles) break;

        const file = files[i];
        const url = URL.createObjectURL(file);

        newFileItems.push({
          id: Math.random().toString(36).substr(2, 9),
          type: "file",
          url,
          file,
          isVideo: file.type.startsWith("video/"),
          isAudio: file.type.startsWith("audio/"),
          isImage: file.type.startsWith("image/"),
          isPDF: file.type === "application/pdf",
          isDOCX: file.name.endsWith(".docx"),
          isServerUrl: false,
        });
      }

      const updatedItems = multiple
        ? [...fileItems, ...newFileItems]
        : newFileItems;
      setFileItems(updatedItems);

      // Gọi callback với cả files và URLs
      if (onChange) {
        const filesToSend = updatedItems.map((item) =>
          item.type === "file" ? item.file! : item.url
        );
        onChange(filesToSend);
      }
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.accept =
      inputAccept || "image/*,video/*,audio/*,application/pdf,.docx";
    input.onchange = (event: any) => {
      const files = event.target.files;
      handleFileChange(files);
    };
    input.click();
  };

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newItems = fileItems.filter((_, i) => i !== index);
    setFileItems(newItems);

    // Gọi callback với items còn lại
    if (onChange) {
      const filesToSend = newItems.map((item) =>
        item.type === "file" ? item.file! : item.url
      );
      onChange(filesToSend);
    }

    onRemove?.(index);
  };

  const [showPopover, setShowPopover] = useState(false);
  const [popoverInput, setPopoverInput] = useState("");

  const handleAddLink = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && popoverInput.trim()) {
      const url = popoverInput.trim();
      console.log("url");

      if (REGEX_URL.test(url)) {
        const newItem: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: "url",
          url,
          isServerUrl: false,
          isVideo:
            videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
            url.includes("video"),
          isImage: imageExtensions.some((ext) =>
            url.toLowerCase().endsWith(ext)
          ),
          isAudio: audioExtensions.some((ext) =>
            url.toLowerCase().endsWith(ext)
          ),
          isPDF: url.endsWith(".pdf"),
          isDOCX: url.endsWith(".docx"),
        };

        const updatedItems = multiple ? [...fileItems, newItem] : [newItem];
        setFileItems(updatedItems);

        if (onChange) {
          const filesToSend = updatedItems.map((item) =>
            item.type === "file" ? item.file! : item.url
          );
          onChange(filesToSend);
        }

        setPopoverInput("");
        setShowPopover(false);
      }
    }
  };

  const renderPreview = (item: FileItem, index: number) => {
    const previewUrl =
      item.isServerUrl && item.url
        ? item.url
        : item.type === "file"
        ? item.url
        : item.url;

    if (item.isVideo) {
      return (
        <PreviewVideo
          preview={previewUrl}
          src={previewUrl}
        />
      );
    } else if (item.isPDF) {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-full border-none"
          title={`PDF Preview ${index}`}
        />
      );
    } else if (item.isDOCX) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${previewUrl}&embedded=true`}
          className="w-full h-full border-none"
          title={`DOCX Preview ${index}`}
        />
      );
    } else if (item.isImage || item.url.startsWith("blob:")) {
      return (
        <img
          src={previewUrl}
          alt={`Preview ${index}`}
          className="w-full h-full object-cover"
        />
      );
    } else if (item.isAudio) {
      return (
        <audio
          src={previewUrl}
          controls
          className="w-full"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-full border border-gray-400 rounded px-4 py-2 flex items-center gap-2 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <FaLink size={16} />
            <span className="truncate">{previewUrl}</span>
          </a>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          w-full min-h-[200px] border-2 border-dashed rounded-lg
          flex flex-wrap items-center justify-center cursor-pointer transition-colors
          overflow-hidden bg-white p-4 gap-4
          hover:bg-blue-50 hover:border-blue-500
          ${fileItems.length === 0 ? "aspect-video max-h-[400px]" : ""}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        // onClick={() => fileItems.length === 0 && handleClick()}
      >
        {fileItems.map((item, index) => (
          <div
            key={item.id}
            className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden group"
          >
            <div className="w-full h-full">{renderPreview(item, index)}</div>
            <button
              type="button"
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              onClick={(e) => handleRemove(index, e)}
            >
              <FaTrashRestoreAlt size={14} />
            </button>
          </div>
        ))}

        {fileItems.length < maxFiles && (
          <div
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50"
            onClick={handleClick}
          >
            <FaCloudUploadAlt
              size={24}
              className="text-gray-400 mb-2"
            />
            <span className="text-sm text-gray-500 text-center">Add File</span>
          </div>
        )}

        {/* {fileItems.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row justify-center gap-4 mb-4">
              <button
                type="button"
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <FaCloudUploadAlt
                  size={24}
                  color="grey"
                />
              </button>
              <button
                type="button"
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopover(true);
                }}
              >
                <FaLink
                  size={24}
                  color="grey"
                />
              </button>
            </div>
            <div className="text-lg text-gray-500 mb-1 text-center">
              Drag and drop files here, or click to select files
            </div>
            <div className="text-sm text-gray-400 text-center">
              Supported: Image, Video, PDF, DOCX, Audio
              {multiple && ` (Max ${maxFiles} files)`}
            </div>
          </div>
        )} */}
      </div>

      {showPopover && (
        <div className="absolute z-50 bg-white border border-gray-300 rounded shadow-md p-4 mt-2 left-1/2 -translate-x-1/2 w-72">
          <input
            type="text"
            value={popoverInput}
            onChange={(e) => setPopoverInput(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            placeholder="Paste link and press Enter"
            onKeyDown={handleAddLink}
            autoFocus
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Press Enter to add</span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-700"
              onClick={() => {
                setShowPopover(false);
                setPopoverInput("");
              }}
            >
              <IoCloseCircleOutline size={20} />
            </button>
          </div>
        </div>
      )}

      {fileItems.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          {fileItems.length} file{fileItems.length !== 1 ? "s" : ""} selected
          {maxFiles && ` (Max ${maxFiles})`}
        </div>
      )}
    </div>
  );
}

export { DragAndDropInput };
