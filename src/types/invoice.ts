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
}
