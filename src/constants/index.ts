export type ViewMode = "grid" | "list";
export type SortOptionBlog = "newest" | "popular" | "rated";
export type SortOptionRoom = "latest" | "price_low" | "price_high" | "popular";
export type MessageType = "text" | "link" | "image";
export type RoomStatus = "Có sẵn" | "Đã thuê" | "Bảo trì" | "Chờ duyệt";
export const URL_IMAGE = `${import.meta.env.VITE_API_ENDPOINT}/assets`;
export const REGEX_URL =
  /((http|https):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?)/;
