import { RadioOption } from "@/components/Input/radio";
export const contractDurationOptions: RadioOption[] = [
  { label: "3 tháng", value: "3_months" },
  { label: "6 tháng", value: "6_months" },
  { label: "1 năm", value: "1_year" },
  { label: "2 năm", value: "2_years" },
];
export const roomStatus = [
  { label: "Có sẵn", value: "available" },
  { label: "Đã thuê", value: "rented" },
  { label: "Bảo trì", value: "maintenance" },
  { label: "Chờ duyệt", value: "pending" },
];
export const limitPeople: RadioOption[] = [
  { label: "1 ", value: 1 },
  { label: "2 ", value: 2 },
  { label: "3 ", value: 3 },
  { label: "4 ", value: 4 },
];
export const rentalObject: RadioOption[] = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Tất cả", value: "all" },
];
const serviceCategories = [
  {
    id: "meter",
    name: "Theo chỉ số đồng hồ",
    description: "Dịch vụ có chỉ số đầu cuối (Điện, nước...)",
  },
  {
    id: "person",
    name: "Người hoặc Số lượng",
    description:
      "Tính theo số người hoặc số lượng (Vệ sinh 15.000đ/Người/Tháng...)",
  },
  {
    id: "room",
    name: "Phòng",
    description: "Tính theo phòng (Tháng máy 200.000đ/Phòng/Tháng...)",
  },
  {
    id: "usage",
    name: "Số lần sử dụng",
    description: "Tính số lần (Giặt là 10.000đ/Lần...)",
  },
];
