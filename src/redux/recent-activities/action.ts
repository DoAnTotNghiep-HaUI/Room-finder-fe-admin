import directus from "@/utils/directus";
import { createItem, readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";
interface Activity {
  id: string;
  type: string;
  message: string;
  date_created: string;
  landlord: string;
}
interface CreateActivityPayload {
  type: string;
  message: string;
  landlord: string;
}
export const getRecentActivitiesByLandlord = createAsyncThunk(
  "recentActivities/getByLandlord",
  async (landlordId: string, { rejectWithValue }) => {
    try {
      const result = await directus.request<Activity[]>(
        readItems("recent_activities", {
          filter: {
            landlord: { _eq: landlordId },
          },
          sort: ["-date_created"],
        })
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lấy hoạt động thất bại");
    }
  }
);
export const createRecentActivity = createAsyncThunk(
  "recentActivities/create",
  async (payload: CreateActivityPayload, { rejectWithValue }) => {
    try {
      const result = await directus.request(
        createItem("recent_activities", payload)
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Tạo hoạt động thất bại");
    }
  }
);
