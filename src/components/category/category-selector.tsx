import { URL_IMAGE } from "@/constants";
import { IFile } from "@/types/file";
import { useEffect, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Category {
  id: string;
  name: string;
  icon: IFile;
}

interface ReusableCategorySelectorProps {
  categories: Category[];
  onSelectionChange?: (selectedCategories: string[]) => void;
  maxSelections?: number;
  cols?: number;
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
  name: string;
}

export default function ReusableCategorySelector({
  categories,
  onSelectionChange,
  maxSelections,
  cols = 4,
  setValue,
  watch,
  name,
}: ReusableCategorySelectorProps) {
  const formValue = watch ? watch(name) : undefined;
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    formValue || []
  );

  useEffect(() => {
    if (formValue !== undefined) {
      setSelectedCategories(formValue);
    }
  }, [formValue]);

  const toggleCategory = (categoryId: string) => {
    let newSelection: string[];

    if (selectedCategories.includes(categoryId)) {
      // Bỏ chọn
      newSelection = selectedCategories.filter((id) => id !== categoryId);
    } else {
      if (maxSelections && selectedCategories.length >= maxSelections) {
        return;
      }
      newSelection = [...selectedCategories, categoryId];
    }

    // Cập nhật local state
    setSelectedCategories(newSelection);

    // Cập nhật form value nếu có setValue
    if (setValue) {
      setValue(name, newSelection);
    }

    // Gọi callback nếu có
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className={`grid grid-cols-2 gap-3 md:grid-cols-${cols}`}>
        {categories?.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          const isDisabled =
            !isSelected &&
            maxSelections &&
            selectedCategories.length >= maxSelections;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              disabled={isDisabled}
              className={`flex items-center justify-center gap-3 rounded-full border-2 p-4 transition-all duration-200 ${
                isSelected
                  ? "border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]"
                  : isDisabled
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#1E88E5]/50 hover:bg-[#1E88E5]/5"
              } `}
            >
              {category.icon && (
                <img
                  className="inline-block h-8 w-8"
                  src={`${URL_IMAGE}/${category?.icon.id}/${category?.icon.filename_download}`}
                  alt=""
                />
              )}
              <span className="text-sm font-medium">{category?.name}</span>
            </button>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-4 rounded-lg bg-[#1E88E5]/10 p-3">
          <p className="text-sm font-medium text-[#1E88E5]">
            Đã chọn: {selectedCategories.length} danh mục
            {maxSelections && ` (tối đa ${maxSelections})`}
          </p>
        </div>
      )}
    </div>
  );
}
