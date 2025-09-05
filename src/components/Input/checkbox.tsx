import { cn } from "@/utils/utils";
import React, { forwardRef } from "react";
import { BiCheck, BiMinus } from "react-icons/bi";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate = false, className, ...props }, ref) => {
    const checkboxClasses = cn(
      "h-5 w-5 rounded border",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      {
        "border-red-300 dark:border-red-600": error,
        "border-gray-300 dark:border-gray-600": !error,
      },
      className
    );
    return (
      <div className="flex items-start">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={cn(checkboxClasses, "hidden")}
            {...props}
          />
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded border transition-colors",
              props.checked || indeterminate
                ? "border-blue-600 bg-blue-600"
                : "border-gray-300 dark:border-gray-600",
              props.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {indeterminate ? (
              <BiMinus className="h-3 w-3 text-white" />
            ) : props.checked ? (
              <BiCheck className="h-3 w-3 text-white" />
            ) : null}
          </div>
        </div>
        {label && (
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
      </div>
    );
  }
);
export default Checkbox;
