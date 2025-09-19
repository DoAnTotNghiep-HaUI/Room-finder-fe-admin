import { IBuilding } from "@/types/building";
import directus from "@/utils/directus";
import { createItem, deleteItem, readItems, updateItem } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListBuilding = createAsyncThunk(
  "building/getListBuilding",
  async (landlordId: string) => {
    try {
      const response = await directus.request<IBuilding[]>(
        readItems("building", {
          fields: [
            "*",
            "building_image.*",
            "landlord.*",
            "district.*",
            "landlord.avatar.*",
          ],
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
export const updateBuilding = createAsyncThunk(
  "building/updateBuilding",
  async ({ buildingId, data }: { buildingId: string; data: any }) => {
    try {
      const response = await directus.request(
        updateItem("building", buildingId, data)
      );
      return response;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

export const createBuilding = createAsyncThunk(
  "building/createBuilding",
  async (data: any) => {
    try {
      const response = await directus.request(createItem("building", data));
      return response;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);
export const deleteBuilding = createAsyncThunk(
  "building/deleteBuilding",
  async (buildingId: string) => {
    try {
      const response = await directus.request(
        deleteItem("building", buildingId)
      );
      return response;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);
