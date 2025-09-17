import { RoomStatus } from "@/constants";
import { IBuilding } from "./building";
import { IFile } from "./file";

export interface RoomParams {
  isLoading: boolean;
  errorMessage: string;
  searchParam: SearchParams | null;
  roomList: IRoom[] | null;
  roomNewPost: IRoom[] | null;
  roomCheapPrice: IRoom[] | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
export interface SearchParams {
  city?: string;
  specific_address: string;
  ward?: string;
  roomType?: [string];
  district?: string;
  price?: [number, number];
  area?: [number, number];
  limitPeople?: number;
  contractsDuration?: string;
  sortBy?: string;
  title?: string;
  amenities?: string[];
  furnitures?: string[];
}
export interface RoomDetailParams {
  isLoading: boolean;
  errorMessage: string;
  roomDetail: IRoom | null;
}
export interface IRoom {
  id: string;
  title: string;
  room_type: IRoomType;
  deposit: number;
  services: IService[];
  furnitures: IFurniture[] | string[];
  amenities: IAmenity[] | string[];
  video: IFile;
  photos: IFile[];
  rental_object: string;
  limit_people: number;
  description: string;
  contract_duration: string;
  contract?: any;
  number_room: number;
  floor: number;
  room_price: number;
  acreage: number;
  viewCount?: number;
  building: IBuilding;
  review: any;
  date_created: string;
  status: RoomStatus;
}
export interface IRoomType {
  id: string;
  name: string;
}
export interface IService {
  id: string;
  name: string;
  default_price: number;
  unit: string;
  icon: IFile;
  is_default: boolean;
}
export interface IRoomService {
  id: string;
  custome_price: number;
  custome_unit: string;
  room_id: string;
  service_id: string;
}
export interface ServiceParams {
  isLoading: boolean;
  errorMessage: string;
  servicesList: IService[];
}
export interface IFurniture {
  id: string;
  name: string;
  icon: IFile;
}
export interface IAmenity {
  id: string;
  name: string;
  icon: IFile;
}
