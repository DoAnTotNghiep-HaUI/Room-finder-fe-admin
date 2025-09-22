import { Service } from "@/constants/api";
import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FiPackage, FiPlus, FiMinus } from "react-icons/fi";

interface ServicesTableProps {
  availableServices: Service[];
}

export default function ServicesTable({
  availableServices,
}: ServicesTableProps) {
  const { control, register, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  // Initialize services when available services change
  useEffect(() => {
    if (availableServices.length > 0 && fields.length === 0) {
      // Add default services with quantity 0
      availableServices.forEach((service) => {
        append({
          id: service.id,
          name: service.name,
          quantity: 0,
          unitPrice: service.price,
          total: 0,
        });
      });
    }
  }, [availableServices, append, fields.length]);

  // Calculate service totals when quantities change
  useEffect(() => {
    const services = watch("services") || [];

    services.forEach((service, index) => {
      if (service.quantity !== undefined && service.unitPrice !== undefined) {
        const total = service.quantity * service.unitPrice;
        setValue(`services.${index}.total`, total);
      }
    });
  }, [watch, setValue]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <FiPackage className="mr-2" />
        Additional Services
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Service
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Unit Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {field?.name}
                  <input
                    type="hidden"
                    {...register(`services.${index}.id`)}
                  />
                  <input
                    type="hidden"
                    {...register(`services.${index}.name`)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        const currentQuantity =
                          watch(`services.${index}.quantity`) || 0;
                        if (currentQuantity > 0) {
                          setValue(
                            `services.${index}.quantity`,
                            currentQuantity - 1
                          );
                        }
                      }}
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      className="mx-2 w-16 text-center px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      {...register(`services.${index}.quantity`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          setValue(
                            `services.${index}.quantity`,
                            Number.parseInt(e.target.value) || 0
                          );
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        const currentQuantity =
                          watch(`services.${index}.quantity`) || 0;
                        setValue(
                          `services.${index}.quantity`,
                          currentQuantity + 1
                        );
                      }}
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    {...register(`services.${index}.unitPrice`, {
                      valueAsNumber: true,
                      onChange: (e) => {
                        setValue(
                          `services.${index}.unitPrice`,
                          Number.parseFloat(e.target.value) || 0
                        );
                      },
                    })}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {watch(`services.${index}.total`)?.toLocaleString() || "0"}{" "}
                  VND
                  <input
                    type="hidden"
                    {...register(`services.${index}.total`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
