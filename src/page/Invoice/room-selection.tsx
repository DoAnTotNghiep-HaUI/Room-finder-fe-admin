import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import {
  FiChevronDown,
  FiCheck,
  FiHome,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import { fetchContract, Room } from "@/constants/api";

interface RoomSelectionProps {
  rooms: Room[];
}

export default function RoomSelection({ rooms }: RoomSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const roomId = watch("roomId");
  const selectedRoom = rooms.find((room) => room.id === roomId);

  // Fetch contract when room changes
  useEffect(() => {
    if (!roomId) return;

    const loadContract = async () => {
      try {
        setIsLoading(true);
        const contract = await fetchContract(roomId);

        setValue("tenantName", contract.tenantName);
        setValue("contractCode", contract.contractCode);
        setValue("buildingCode", contract.buildingCode);
        setValue("roomNumber", selectedRoom?.roomNumber || "");
        setValue("roomPrice", selectedRoom?.price || 0);
      } catch (error) {
        console.error("Error loading contract:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContract();
  }, [roomId, selectedRoom, setValue]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Room & Contract Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Room
          </label>
          <Listbox
            value={roomId}
            onChange={(value) => setValue("roomId", value)}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                {({ open }) => (
                  <>
                    <span className="block truncate">
                      {selectedRoom
                        ? `${selectedRoom.roomNumber} - ${selectedRoom.buildingName}`
                        : "Select a room"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </>
                )}
              </Listbox.Button>
              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {rooms.map((room) => (
                    <Listbox.Option
                      key={room.id}
                      value={room.id}
                      className={({ active }) =>
                        `${active ? "text-white bg-blue-600" : "text-gray-900"}
    cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {room.roomNumber} - {room.buildingName}
                          </span>
                          {selected ? (
                            <span
                              className={`${
                                active ? "text-white" : "text-blue-600"
                              }
            absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <FiCheck
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          {errors.roomId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.roomId.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <FiUser className="mr-1" />
                Tenant Name
              </div>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled
              {...register("tenantName")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <FiFileText className="mr-1" />
                Contract Code
              </div>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled
              {...register("contractCode")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <FiHome className="mr-1" />
                Building Code
              </div>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled
              {...register("buildingCode")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <FiHome className="mr-1" />
                Room Price
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
                value={
                  selectedRoom
                    ? `${selectedRoom.price.toLocaleString()} VND`
                    : ""
                }
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
