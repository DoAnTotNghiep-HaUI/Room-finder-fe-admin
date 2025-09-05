import { cn } from "@/utils/utils";
import React, { useEffect, useState, useRef, forwardRef } from "react";
import { BiCheck, BiChevronDown, BiSearch, BiX } from "react-icons/bi";
import { IoIosArrowUp } from "react-icons/io";

export interface SelectOption {
  label: string;
  value: string;
}
export interface SelectProps {
  options: any[];
  value?: string | string[] | number | number[];
  onChange?: (value: string | string[] | number | number[]) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      label,
      error,
      helperText,
      placeholder = "Select option",
      disabled = false,
      multiple = false,
      searchable = false,
      size = "md",
      fullWidth = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOptions = multiple
      ? options.filter((option) => (value as string[])?.includes(option.value))
      : options.find((option) => option.value === value);
    const filteredOptions = options.filter((option) =>
      option?.label?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
    const sizeClasses = {
      sm: "h-8 text-sm",
      md: "h-10",
      lg: "h-12 text-lg",
    };
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleOptionClick = (optionValue: string) => {
      if (multiple) {
        const newValue = (value as string[]) || [];
        const updatedValue = newValue.includes(optionValue)
          ? newValue.filter((v) => v !== optionValue)
          : [...newValue, optionValue];
        onChange?.(updatedValue);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };
    return (
      <div
        ref={containerRef}
        className={cn("relative", {
          "w-full": fullWidth,
        })}
      >
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <div
          ref={ref}
          className={cn(
            "relative cursor-pointer rounded-lg border bg-white dark:bg-gray-800",
            {
              "border-red-300 dark:border-red-600": error,
              "border-gray-300 dark:border-gray-600": !error,
              "cursor-not-allowed opacity-50": disabled,
            },
            sizeClasses[size]
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between pl-3 pr-2">
            <div className="flex flex-wrap gap-1 py-2">
              {multiple ? (
                selectedOptions?.length ? (
                  selectedOptions.map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {option.label}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOptionClick(option.value);
                        }}
                      >
                        <BiX className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    {placeholder}
                  </span>
                )
              ) : (
                <span
                  className={cn({
                    "text-gray-500 dark:text-gray-400": !selectedOptions,
                    "text-gray-900 dark:text-gray-100": selectedOptions,
                  })}
                >
                  {selectedOptions?.label || placeholder}
                </span>
              )}
            </div>
            <span
              className={cn(
                isOpen ? "ml-3 rotate-180 duration-300" : "ml-3 rotate-0"
              )}
            >
              <IoIosArrowUp />
            </span>
          </div>
          {isOpen && (
            <div
              className={cn(
                "absolute left-0 right-0 top-full z-10 mt-1 max-h-60 min-w-36 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800"
                // isOpen
                //   ? "translate-y-0 opacity-100"
                //   : "pointer-events-none -translate-y-2 opacity-0"
              )}
            >
              {searchable && (
                <div className="sticky top-0 border-b bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative">
                    <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-200 bg-transparent py-1.5 pl-9 pr-4 text-sm dark:border-gray-700"
                      placeholder="Search options..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700",
                    {
                      "bg-gray-50 dark:bg-gray-700/50": multiple
                        ? (value as string[])?.includes(option.value)
                        : value === option.value,
                    }
                  )}
                  onClick={() => handleOptionClick(option.value)}
                >
                  <span className="w-full text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                  {multiple
                    ? (value as string[])?.includes(option.value) && (
                        <BiCheck className="h-4 w-4 text-blue-600" />
                      )
                    : value === option.value && (
                        <BiCheck className="h-4 w-4 text-blue-600" />
                      )}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
export default Select;
