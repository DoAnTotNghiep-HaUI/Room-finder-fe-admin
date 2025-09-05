import { cn } from "@/utils/utils";
import React, { forwardRef } from "react";
export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export interface RadioGroupProps {
  name: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  direction?: "horizontal" | "vertical";
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, ...props }, ref) => {
    const radioClasses = cn(
      "h-5 w-5 rounded-full border",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      {
        "border-red-300 dark:border-red-600": error,
        "border-gray-300 dark:border-gray-600": !error,
      },
      className
    );
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          className={radioClasses}
          {...props}
        />
        {label && (
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
      </div>
    );
  }
);
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error,
  direction = "vertical",
}) => {
  return (
    <div
      className={cn("flex", {
        "flex-col space-y-2": direction === "vertical",
        "space-x-4": direction === "horizontal",
      })}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          checked={value === option.value}
          onChange={(e) => onChange?.(e.target.value)}
          error={error}
        />
      ))}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
