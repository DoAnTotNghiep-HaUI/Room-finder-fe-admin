import { IRentalContract } from "./contract";
import { IRoom } from "./room";

export interface InvoiceData {
  // Room & Contract Information
  roomId: string;
  roomNumber: string;
  roomPrice: number;
  tenantName: string;
  contractCode: string;
  buildingCode: string;

  // Invoice Date Range
  fromDate: Date;
  toDate: Date;
  numberOfDays: number;

  // Electricity
  electricityPrevious: number;
  electricityCurrent: number;
  electricityUsage: number;
  electricityRate: number;
  electricityTotal: number;

  // Water
  waterCalculationMethod: "meter" | "people";
  waterPrevious?: number;
  waterCurrent?: number;
  waterUsage: number;
  waterRate: number;
  numberOfPeople?: number;
  waterTotal: number;

  // Services
  services: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];

  // Notes
  notes?: string;

  // Grand Total
  grandTotal: number;
  payment_info?: IPaymentInfo;
}

export interface IInvoice {
  id: string;
  invoice_number: string;
  // room: IRoom;
  contract: IRentalContract;
  from_date: string;
  to_date: string;
  // days_count: number;
  // room_price: number;
  // period: number;
  electricity_old_index: number;
  electricity_new_index: number;
  electricity_usage: number;
  electricity_price: number;
  electricity_total: number;
  water_calculation_type: "meter" | "per_person";
  water_old_index: number;
  water_new_index: number;
  water_usage: number;
  water_price: number;
  water_people_count?: number;
  water_total: number;
  services: IInvoiceService[];
  description?: string;
  total_amount: number;
  status: "paid" | "unpaid" | "overdue";
  date_created: string;
  date_updated: string;
  payment_info?: IPaymentInfo;
}

export interface IInvoiceService {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  unit: string;
}
export interface IPaymentInfo {
  bank_account: string;
  bank_owner: string;
  bank_name: string;
  payment_content: string;
  hotline: string;
}
