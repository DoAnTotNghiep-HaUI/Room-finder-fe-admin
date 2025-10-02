import { createAsyncThunk } from "@reduxjs/toolkit";
import { createItem, deleteItem, updateItem } from "@directus/sdk";
import directus from "@/utils/directus";

import { readItems } from "@directus/sdk";

export const getBookingsByLandlord = createAsyncThunk(
  "booking/getBookingsByLandlord",
  async (landlord_id: string, { rejectWithValue }) => {
    try {
      const response = await directus.request(
        readItems("booking", {
          filter: { landlord_id: { _eq: landlord_id } },
          fields: [
            "*",
            "room_id.*",
            "landlord_id.*",
            "tenant_id.*",
            "room_id.building.*",
            "room_id.building.district.*",
          ],
          sort: ["-scheduled_date"],
        })
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Không lấy được danh sách lịch");
    }
  }
);
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      await directus.request(deleteItem("booking", bookingId));
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Xoá lịch thất bại");
    }
  }
);
export const updateBookingStatus = createAsyncThunk(
  "booking/updateBookingStatus",
  async (
    payload: { bookingId: string; status: string; reject_reason?: string },
    { rejectWithValue }
  ) => {
    try {
      await directus.request(
        updateItem("booking", payload.bookingId, {
          status: payload.status,
          reject_reason: payload.reject_reason,
        })
      );
      return payload;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Cập nhật trạng thái thất bại");
    }
  }
);
