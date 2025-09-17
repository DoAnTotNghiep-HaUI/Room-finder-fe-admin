import { IBuilding } from "@/types/building";
import directus from "@/utils/directus";
import { readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListBuilding = createAsyncThunk(
  "building/getListBuilding",
  async (landlordId: string) => {
    try {
      const response = await directus.request<IBuilding[]>(
        readItems("building", {
          fields: ["*"],
          filter: {
            landlord: {
              _eq: landlordId,
            },
          },
        })
      );

      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
