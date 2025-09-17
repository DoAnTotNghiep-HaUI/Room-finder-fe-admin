import { IFile } from "./file";
import { IUser } from "./user";

export interface BuildingParams {
  isLoading: boolean;
  errorMessage: string;
  buildingList: IBuilding[] | null;
}
export interface IBuilding {
  id: string;
  landlord: IUser;
  year_constructions: string;
  total_rooms: number;
  total_floors: number;
  name: string;
  area: string;
  city: string;
  district: IDistrict;
  ward: string;
  specific_address: string;
  building_image: IFile;
  description: string;
  google_map_link: string;
  lat: number;
  lng: number;
}
export interface IDistrict {
  id: string;
  name: string;
  photo: IFile;
}
