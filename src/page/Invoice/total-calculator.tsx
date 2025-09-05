import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FiDollarSign } from "react-icons/fi";

export default function TotalCalculator() {
  const { setValue, watch } = useFormContext();

  const roomPrice = watch("roomPrice") || 0;
  const numberOfDays = watch("numberOfDays") || 0;
  const electricityTotal = watch("electricityTotal") || 0;
  const waterTotal = watch("waterTotal") || 0;
  const services = watch("services") || [];

  // Calculate grand total when any value changes
  useEffect(() => {
    // Calculate room fee based on days
    const roomFee = (roomPrice / 30) * numberOfDays;

    // Calculate services total
    const servicesTotal = services.reduce((total, service) => {
      return total + (service.total || 0);
    }, 0);

    // Calculate grand total
    const grandTotal = roomFee + electricityTotal + waterTotal + servicesTotal;

    setValue("grandTotal", grandTotal);
  }, [
    roomPrice,
    numberOfDays,
    electricityTotal,
    waterTotal,
    services,
    setValue,
  ]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
        <FiDollarSign className="mr-2" />
        Invoice Summary
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Room Fee:</span>
          <span className="font-medium">
            {Math.round((roomPrice / 30) * numberOfDays).toLocaleString()} VND
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Electricity:</span>
          <span className="font-medium">
            {electricityTotal.toLocaleString()} VND
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Water:</span>
          <span className="font-medium">{waterTotal.toLocaleString()} VND</span>
        </div>

        {services
          .filter((s) => s.quantity > 0)
          .map((service, index) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <span className="text-gray-600">
                {service.name} (x{service.quantity}):
              </span>
              <span className="font-medium">
                {service.total.toLocaleString()} VND
              </span>
            </div>
          ))}

        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total:</span>
            <span className="text-blue-600">
              {watch("grandTotal")?.toLocaleString() || "0"} VND
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
