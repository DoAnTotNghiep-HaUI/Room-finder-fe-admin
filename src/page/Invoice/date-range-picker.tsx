import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FiCalendar } from "react-icons/fi";
import { differenceInDays, format } from "date-fns";

export default function DateRangePicker() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  // Calculate number of days when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      const days = differenceInDays(new Date(toDate), new Date(fromDate)) + 1; // Include both start and end dates
      setValue("numberOfDays", days);
    }
  }, [fromDate, toDate, setValue]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Invoice Period</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              From Date
            </div>
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const date = e.target.value
                ? new Date(e.target.value)
                : new Date();
              setValue("fromDate", date);
            }}
            defaultValue={format(new Date(), "yyyy-MM-dd")}
          />
          {errors.fromDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fromDate.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              To Date
            </div>
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const date = e.target.value
                ? new Date(e.target.value)
                : new Date();
              setValue("toDate", date);
            }}
            defaultValue={format(
              new Date(new Date().setMonth(new Date().getMonth() + 1)),
              "yyyy-MM-dd"
            )}
          />
          {errors.toDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.toDate.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Days
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
