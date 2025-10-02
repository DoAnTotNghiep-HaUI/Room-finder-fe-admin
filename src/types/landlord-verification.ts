import { IFile } from "./file";
import { IUser } from "./user";

export interface ILandlordVerification {
  id: string;
  landlord_id: string;
  status: "pending" | "approved" | "rejected";
  submitted_date: string;
  approved_date?: string;
  rejected_date?: string;
  rejected_reason?: string;

  id_card_number: string;
  id_card_front: IFile;
  id_card_back: IFile;
  id_card_issue_date: string;
  id_card_issue_place: string;

  business_license_number?: string;
  business_license_file?: IFile;
  business_license_issue_date?: string;

  tax_code?: string;
  tax_registration_file?: IFile;

  property_ownership_files: IFile[];

  additional_documents?: IFile[];
  notes?: string;
}
export interface ILandlord extends IUser {
  verification?: ILandlordVerification;
  total_buildings?: number;
  total_rooms?: number;
  joined_date: string;
  address?: string;
  date_of_birth?: string;
}
