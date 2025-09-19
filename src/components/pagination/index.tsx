import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-200 p-2 disabled:opacity-50 dark:border-gray-700"
      >
        <BiChevronLeft className="h-5 w-5" />
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`h-10 w-10 rounded-lg border ${
            currentPage === i + 1
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          } `}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-200 p-2 disabled:opacity-50 dark:border-gray-700"
      >
        <BiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
