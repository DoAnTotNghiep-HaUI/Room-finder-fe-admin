import { IRoom, IRoomType } from "@/types/room";
import directus from "@/utils/directus";
import { readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListRoomType = createAsyncThunk(
  "roomType/getListRoomType",
  async () => {
    try {
      const response = await directus.request<IRoomType>(
        readItems("room_type", {
          fields: ["*"],
        })
      );

      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
