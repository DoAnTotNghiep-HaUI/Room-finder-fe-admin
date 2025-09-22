import { IFile } from "./file";
import { IRoom } from "./room";
import { IUser } from "./user";

export interface IRentalContract {
  id: string;
  contract_number: string;
  contract_file: IFile;
  id_card: string;
  tenant: IUser;
  tenant_dateofbirth: string;
  tenant_phone: string;
  tenant_permanent_address: string;
  citizen_id_issue_date: string;
  citizen_id_issue_place: string;
  room: IRoom;
  contract_start_date: string;
  contract_end_date: string;
  contract_duration: number;
  deposit: number;
  monthly_rental: number;
  status: "active" | "expired" | "terminated";
  landlord: IUser;
  created_at: string;
  updated_at: string;
  electric_price: string;
  water_price: string;
  wifi_price: string;
  general_service_price?: string;
  security_price?: string;
  parking_price?: string;
  washing_price?: string;
  elevator_price?: string;
  gas_price?: string;
}
