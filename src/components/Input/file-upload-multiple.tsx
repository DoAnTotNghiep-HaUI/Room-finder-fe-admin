import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useController, Control } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { BiX } from "react-icons/bi";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoAlertCircleOutline, IoImageOutline } from "react-icons/io5";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { LuGrip } from "react-icons/lu";
interface FileUploadProps {
  name: string;
  control: Control<any>;
  defaultImageUrls?: string[];
  multiple?: boolean;
  onDelete?: (index: number) => void;
  onChange?: (files: File[]) => void;
  maxSize?: number;
  accept?: string[];
  className?: string;
  maxFiles?: number;
}
interface ImageItemProps {
  src: string;
  id: string;
  onDelete: () => void;
}
const SortableImage = ({ src, id, onDelete }: ImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square"
    >
      <img
        src={src}
        alt="Uploaded preview"
        className="w-full h-full object-cover rounded-lg border border-gray-200"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <BiX size={14} />
      </button>
      <button
        {...attributes}
        {...listeners}
        className="absolute bottom-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
      >
        <LuGrip
          size={14}
          className="text-gray-500"
        />
      </button>
    </motion.div>
  );
};
const FileUploadMultiple = ({
  name,
  control,
  defaultImageUrls = [],
  multiple = false,
  onDelete,
  onChange,
  maxSize = 5 * 1024 * 1024,
  accept = [".png", ".jpg", ".jpeg", ".gif"],
  className,
  maxFiles = 10,
}: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );
  const {
    field: { value, onChange: fieldOnChange },
  } = useController({
    name,
    control,
    defaultValue: defaultImageUrls,
  });
  const handleDragStart = (event: DragEndEvent) => {
    setDraggedId(event.active.id as string);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((item: string) => item === active.id);
      const newIndex = value.findIndex((item: string) => item === over.id);
      const newValue = arrayMove(value, oldIndex, newIndex);
      fieldOnChange(newValue);
    }
  };
  const handleFiles = (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    if (multiple && value.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    const invalidFile = fileArray.find((file) => {
      if (!accept.some((type) => file.name.toLowerCase().endsWith(type))) {
        setError("Invalid file type");
        return true;
      }
      if (file.size > maxSize) {
        setError(
          `File size should be less than ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return true;
      }
      return false;
    });
    if (invalidFile) return;
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (multiple) {
          fieldOnChange([...value, result]);
        } else {
          fieldOnChange([result]);
        }
        onChange?.(multiple ? fileArray : [fileArray[0]]);
      };
      reader.readAsDataURL(file);
    });
  };
  const handleDelete = (index: number) => {
    const newValue = value.filter((_: string, i: number) => i !== index);
    fieldOnChange(newValue);
    onDelete?.(index);
  };
  const dropzoneClassName = twMerge(
    "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors",
    isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300",
    error && "border-red-500",
    className
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="space-y-4">
        <div
          className={dropzoneClassName}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept={accept.join(",")}
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
              }
            }}
            multiple={multiple}
            className="hidden"
            id={`file-upload-${name}`}
          />
          <label
            htmlFor={`file-upload-${name}`}
            className="flex flex-col items-center text-center cursor-pointer"
          >
            {isDragging ? (
              <MdOutlineFileUpload className="w-12 h-12 text-indigo-500 mb-4" />
            ) : (
              <IoImageOutline className="w-12 h-12 text-gray-400 mb-4" />
            )}
            <p className="text-sm text-gray-600">
              {isDragging
                ? "Drop files here"
                : `Drag & drop ${
                    multiple ? "images" : "an image"
                  }, or click to select`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
              {multiple && ` (Max ${maxFiles} files)`}
            </p>
          </label>
        </div>
        {value?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <SortableContext
              items={value}
              strategy={rectSortingStrategy}
            >
              {value.map((src: string, index: number) => (
                <SortableImage
                  key={src}
                  id={src}
                  src={src}
                  onDelete={() => handleDelete(index)}
                />
              ))}
            </SortableContext>
          </div>
        )}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="flex items-center gap-2 text-red-500 text-sm"
            >
              <IoAlertCircleOutline size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <DragOverlay>
          {draggedId && (
            <img
              src={draggedId}
              alt="Dragging preview"
              className="w-32 h-32 object-cover rounded-lg shadow-lg opacity-80"
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
export default FileUploadMultiple;
