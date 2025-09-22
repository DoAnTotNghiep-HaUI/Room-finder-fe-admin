import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FiBatteryCharging } from "react-icons/fi";

export default function ElectricityCalculator() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const electricityPrevious = watch("electricityPrevious");
  const electricityCurrent = watch("electricityCurrent");
  const electricityRate = watch("electricityRate");

  // Calculate electricity usage and total when inputs change
  useEffect(() => {
    if (electricityPrevious !== undefined && electricityCurrent !== undefined) {
      const usage = Math.max(0, electricityCurrent - electricityPrevious);
      setValue("electricityUsage", usage);

      const total = usage * electricityRate;
      setValue("electricityTotal", total);
    }
  }, [electricityPrevious, electricityCurrent, electricityRate, setValue]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <FiBatteryCharging className="mr-2" />
        Electricity
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Previous Reading
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register("electricityPrevious", {
              valueAsNumber: true,
              onChange: (e) => {
                setValue(
                  "electricityPrevious",
                  Number.parseFloat(e.target.value) || 0
                );
              },
            })}
          />
          {errors.electricityPrevious && (
            <p className="mt-1 text-sm text-red-600">
              {errors.electricityPrevious.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Reading
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register("electricityCurrent", {
              valueAsNumber: true,
              onChange: (e) => {
                setValue(
                  "electricityCurrent",
                  Number.parseFloat(e.target.value) || 0
                );
              },
            })}
          />
          {errors.electricityCurrent && (
            <p className="mt-1 text-sm text-red-600">
              {errors.electricityCurrent.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage (kWh)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
            disabled
            {...register("electricityUsage")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rate (VND/kWh)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register("electricityRate", {
              valueAsNumber: true,
              onChange: (e) => {
                setValue(
                  "electricityRate",
                  Number.parseFloat(e.target.value) || 0
                );
              },
            })}
          />
          {errors.electricityRate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.electricityRate.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total (VND)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
            disabled
            value={watch("electricityTotal")?.toLocaleString() || "0"}
          />
        </div>
      </div>
    </div>
  );
}
