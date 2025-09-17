import { IFurniture, IRoom, IRoomType } from "@/types/room";
import directus from "@/utils/directus";
import { readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListFurnitures = createAsyncThunk(
  "furnitures/getListFurnitures",
  async () => {
    try {
      const response = await directus.request<IFurniture>(
        readItems("furnitures", {
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
