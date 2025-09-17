import { IAmenity, IRoom, IRoomType } from "@/types/room";
import directus from "@/utils/directus";
import { readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListAmenities = createAsyncThunk(
  "amenities/getListAmenities",
  async () => {
    try {
      const response = await directus.request<IAmenity>(
        readItems("amenities", {
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
