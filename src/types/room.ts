export interface Room {
  id: string;
  number: string;
  buildingId: string;
  buildingName: string;
  type: "studio" | "single" | "double" | "suite";
  floor: number;
  status: "available" | "occupied" | "maintenance";
  baseRent: number;
  area: number;
  amenities: string[];
}
