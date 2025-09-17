import type React from "react";

export interface RadioOption {
  id?: string;
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ReusableRadioProps {
  options: RadioOption[];
  name: string;
  value?: string | number;
  onChange: (value: any) => void;
  layout?: "horizontal" | "vertical" | "grid";
  gridCols?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  title?: string;
  required?: boolean;
  disabled?: boolean;
}

const Radio: React.FC<ReusableRadioProps> = ({
  options,
  name,
  value,
  onChange,
  layout = "vertical",
  gridCols = 2,
  className = "",
  title,
  required = false,
  disabled = false,
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-wrap gap-6";
      case "grid":
        return `grid gap-4 ${
          gridCols === 2
            ? "grid-cols-2"
            : gridCols === 3
            ? "grid-cols-3"
            : gridCols === 4
            ? "grid-cols-4"
            : gridCols === 5
            ? "grid-cols-5"
            : "grid-cols-6"
        }`;
      case "vertical":
      default:
        return "flex flex-col gap-3";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <label className="mb-3 block text-sm font-semibold text-gray-900">
          {title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className={getLayoutClasses()}>
        {options.map((option) => (
          <label
            key={option.id}
            className={`group flex cursor-pointer items-center ${
              disabled || option.disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-50"
            } ${
              layout === "grid"
                ? "rounded-lg border border-gray-200 p-3 transition-all duration-200"
                : ""
            } ${
              value === option.value && layout === "grid"
                ? "border-[#1E88E5] bg-blue-50"
                : ""
            } `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
              className="h-4 w-4 border-gray-300 text-[#1E88E5] disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span
              className={`ml-3 text-sm font-medium ${
                value === option.value ? "text-[#1E88E5]" : "text-gray-700"
              } ${
                disabled || option.disabled
                  ? "text-gray-400"
                  : "group-hover:text-[#1E88E5]"
              } transition-colors duration-200`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
export default Radio;
