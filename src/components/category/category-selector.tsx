import { URL_IMAGE } from "@/constants";
import { IFile } from "@/types/file";
import { useEffect, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Category {
  id: string | number;
  name: string;
  icon?: IFile;
  room_category_id: string | number;
}

interface ReusableCategorySelectorProps {
  categories: Category[];
  onSelectionChange?: (
    selectedCategories: {
      room_category_id: string | number;
      id: string | number;
    }[]
  ) => void;
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
  const [selectedCategories, setSelectedCategories] = useState<
    { room_category_id: string | number; id: string | number }[]
  >([]);

  // ✅ Đồng bộ dữ liệu khi edit (update mode)
  useEffect(() => {
    if (formValue && Array.isArray(formValue)) {
      setSelectedCategories(formValue);
    }
  }, [formValue]);

  const toggleCategory = (category: Category) => {
    let newSelection: {
      id: string | number;
      room_category_id: string | number;
    }[];
    console.log("Category clicked:", selectedCategories);
    console.log("formValue", formValue);

    const exists = selectedCategories?.find((c) => c?.id === category?.id);

    if (exists) {
      newSelection = selectedCategories?.filter((c) => c?.id !== category?.id);
    } else {
      if (maxSelections && selectedCategories.length >= maxSelections) {
        return;
      }
      console.log("Adding category:", category);

      newSelection = [
        ...selectedCategories,
        { id: category?.id, room_category_id: category?.room_category_id },
      ];
    }
    console.log("New selection:", newSelection);

    setSelectedCategories(newSelection);

    if (setValue) {
      setValue(name, newSelection);
    }

    onSelectionChange?.(newSelection);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className={`grid grid-cols-2 gap-3 md:grid-cols-${cols}`}>
        {categories?.map((category) => {
          const isSelected = selectedCategories.some(
            (c) => c?.id === category?.id
          );

          const isDisabled =
            !isSelected &&
            maxSelections &&
            selectedCategories.length >= maxSelections;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => toggleCategory(category)}
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
