import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { FiDroplet } from "react-icons/fi";

export default function WaterCalculator() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const waterCalculationMethod = watch("waterCalculationMethod");
  const waterPrevious = watch("waterPrevious");
  const waterCurrent = watch("waterCurrent");
  const waterRate = watch("waterRate");
  const numberOfPeople = watch("numberOfPeople");

  // Calculate water usage and total when inputs change
  useEffect(() => {
    if (waterCalculationMethod === "meter") {
      if (waterPrevious !== undefined && waterCurrent !== undefined) {
        const usage = Math.max(0, waterCurrent - waterPrevious);
        setValue("waterUsage", usage);

        const total = usage * waterRate;
        setValue("waterTotal", total);
      }
    } else if (waterCalculationMethod === "people") {
      if (numberOfPeople !== undefined) {
        setValue("waterUsage", numberOfPeople);

        const total = numberOfPeople * waterRate;
        setValue("waterTotal", total);
      }
    }
  }, [
    waterCalculationMethod,
    waterPrevious,
    waterCurrent,
    waterRate,
    numberOfPeople,
    setValue,
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <FiDroplet className="mr-2" />
        Water
      </h2>

      <div className="space-y-4">
        <RadioGroup
          value={waterCalculationMethod}
          onChange={(value) => setValue("waterCalculationMethod", value)}
          className="space-y-2"
        >
          <RadioGroup.Label className="text-sm font-medium text-gray-700">
            Calculation Method
          </RadioGroup.Label>

          <div className="flex space-x-4">
            <RadioGroup.Option
              value="meter"
              className={({ checked }) => `
                ${
                  checked
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300"
                }
                relative border rounded-md px-4 py-2 cursor-pointer focus:outline-none
              `}
            >
              {({ checked }) => (
                <div className="flex items-center">
                  <div
                    className={`rounded-full w-4 h-4 border ${
                      checked ? "border-blue-600" : "border-gray-300"
                    } flex items-center justify-center mr-2`}
                  >
                    {checked && (
                      <div className="rounded-full w-2 h-2 bg-blue-600"></div>
                    )}
                  </div>
                  <RadioGroup.Label
                    as="p"
                    className="text-sm font-medium text-gray-900"
                  >
                    Calculate by Meter
                  </RadioGroup.Label>
                </div>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option
              value="people"
              className={({ checked }) => `
                ${
                  checked
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300"
                }
                relative border rounded-md px-4 py-2 cursor-pointer focus:outline-none
              `}
            >
              {({ checked }) => (
                <div className="flex items-center">
                  <div
                    className={`rounded-full w-4 h-4 border ${
                      checked ? "border-blue-600" : "border-gray-300"
                    } flex items-center justify-center mr-2`}
                  >
                    {checked && (
                      <div className="rounded-full w-2 h-2 bg-blue-600"></div>
                    )}
                  </div>
                  <RadioGroup.Label
                    as="p"
                    className="text-sm font-medium text-gray-900"
                  >
                    Calculate by People
                  </RadioGroup.Label>
                </div>
              )}
            </RadioGroup.Option>
          </div>
        </RadioGroup>

        {waterCalculationMethod === "meter" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Reading
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("waterPrevious", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    setValue(
                      "waterPrevious",
                      Number.parseFloat(e.target.value) || 0
                    );
                  },
                })}
              />
              {errors.waterPrevious && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.waterPrevious.message as string}
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
                {...register("waterCurrent", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    setValue(
                      "waterCurrent",
                      Number.parseFloat(e.target.value) || 0
                    );
                  },
                })}
              />
              {errors.waterCurrent && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.waterCurrent.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage (m³)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
                disabled
                {...register("waterUsage")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (VND/m³)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("waterRate", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    setValue(
                      "waterRate",
                      Number.parseFloat(e.target.value) || 0
                    );
                  },
                })}
              />
              {errors.waterRate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.waterRate.message as string}
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
                value={watch("waterTotal")?.toLocaleString() || "0"}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of People
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("numberOfPeople", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    setValue(
                      "numberOfPeople",
                      Number.parseFloat(e.target.value) || 0
                    );
                  },
                })}
              />
              {errors.numberOfPeople && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.numberOfPeople.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (VND/person)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("waterRate", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    setValue(
                      "waterRate",
                      Number.parseFloat(e.target.value) || 0
                    );
                  },
                })}
              />
              {errors.waterRate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.waterRate.message as string}
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
                value={watch("waterTotal")?.toLocaleString() || "0"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
