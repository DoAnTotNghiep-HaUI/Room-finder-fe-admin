import { IRoom } from "./room";
import { IUser } from "./user";

export interface IBooking {
  id: string;
  user_created?: string;
  date_created: string;
  user_updated?: string;
  date_updated?: string;
  room_id: IRoom;
  landlord_id: string;
  tenant_id: IUser;
  scheduled_date: string;
  status: "pending" | "confirmed" | "cancelled" | "rejected" | "completed";
  reject_reason?: string;
}
