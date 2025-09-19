import axios from "axios";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getDistrict = async () => {
  const response = await axios.get(
    "https://provinces.open-api.vn/api/v1/p/1?depth=2"
  );
  return response.data;
};
