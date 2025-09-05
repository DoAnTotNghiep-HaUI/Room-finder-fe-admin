export interface Building {
  id: string;
  name: string;
  address: string;
  description: string;
  totalRooms: number;
  notes?: string;
  defaultServices: {
    electricity: number;
    water: number;
    internet: number;
  };
}
