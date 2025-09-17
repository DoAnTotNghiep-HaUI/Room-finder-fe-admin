import { IAmenity, IRoom, IRoomType, IService } from "@/types/room";
import directus from "@/utils/directus";
import { readItems, updateItem, updateItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListServices = createAsyncThunk(
  "services/getListServices",
  async () => {
    try {
      const response = await directus.request<IService[]>(
        readItems("service", {
          fields: ["*", "icon.*"],
        })
      );

      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
export const updateServices = createAsyncThunk(
  "services/updateServices",
  async ({ id, data }: { id: string; data: any }) => {
    try {
      const response = await directus.request<IService[]>(
        updateItem("room_service", id, data)
      );
      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
