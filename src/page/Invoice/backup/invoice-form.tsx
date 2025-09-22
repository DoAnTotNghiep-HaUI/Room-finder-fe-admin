import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InvoiceData } from "@/types/invoice";
import { fetchRooms, fetchServices, Room, Service } from "@/constants/api";
import RoomSelection from "./room-selection";
import DateRangePicker from "./date-range-picker";
import ElectricityCalculator from "./electricity-calculator";
import WaterCalculator from "./water-calculator";
import NotesEditor from "./notes-editor";
import ServicesTable from "./services-table";
import TotalCalculator from "./total-calculator";

// Define the form schema with zod
const invoiceSchema = z.object({
  // Room & Contract Information
  roomId: z.string().min(1, "Room selection is required"),
  roomNumber: z.string(),
  roomPrice: z.number(),
  tenantName: z.string(),
  contractCode: z.string(),
  buildingCode: z.string(),

  // Invoice Date Range
  fromDate: z.date(),
  toDate: z.date(),
  numberOfDays: z.number(),

  // Electricity
  electricityPrevious: z.number(),
  electricityCurrent: z.number(),
  electricityUsage: z.number(),
  electricityRate: z.number(),
  electricityTotal: z.number(),

  // Water
  waterCalculationMethod: z.enum(["meter", "people"]),
  waterPrevious: z.number().optional(),
  waterCurrent: z.number().optional(),
  waterUsage: z.number(),
  waterRate: z.number(),
  numberOfPeople: z.number().optional(),
  waterTotal: z.number(),

  // Services
  services: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      total: z.number(),
    })
  ),

  // Notes
  notes: z.string().optional(),

  // Grand Total
  grandTotal: z.number(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      roomId: "",
      roomNumber: "",
      roomPrice: 0,
      tenantName: "",
      contractCode: "",
      buildingCode: "",

      fromDate: new Date(),
      toDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      numberOfDays: 30,

      electricityPrevious: 0,
      electricityCurrent: 0,
      electricityUsage: 0,
      electricityRate: 3500, // Default rate
      electricityTotal: 0,

      waterCalculationMethod: "meter",
      waterPrevious: 0,
      waterCurrent: 0,
      waterUsage: 0,
      waterRate: 15000, // Default rate
      numberOfPeople: 1,
      waterTotal: 0,

      services: [],

      notes: "",

      grandTotal: 0,
    },
  });

  // Fetch rooms and services data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [roomsData, servicesData] = await Promise.all([
          fetchRooms(),
          fetchServices(),
        ]);

        setRooms(roomsData);
        setAvailableServices(servicesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFormSubmit = (data: InvoiceFormValues) => {
    onSubmit(data as InvoiceData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <RoomSelection rooms={rooms} />
            <DateRangePicker />
            <ElectricityCalculator />
            <WaterCalculator />
          </div>

          <div className="space-y-6">
            <ServicesTable availableServices={availableServices} />
            <NotesEditor />
          </div>
        </div>

        <TotalCalculator />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
