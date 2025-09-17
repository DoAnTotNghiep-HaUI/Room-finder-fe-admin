import { IRoom } from "@/types/room";
import directus from "@/utils/directus";
import { readItem } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getRoomDetail = createAsyncThunk(
  "roomDetail/getRoomDetail",
  async (id: string) => {
    try {
      const data = await directus.request<IRoom>(
        readItem("room", id, {
          fields: [
            "*",
            "room_type.*",
            "building.*",
            "building.building_image.*",
            "building.landlord.*",
            "building.landlord.avatar.*",
            "building.landlord.landlord_verification.*",
            "photos.*",
            "video.*",
            "services.*",
            "services.service_id.*",
            "services.service_id.icon.*",
            "furnitures.*",
            "furnitures.furnitures_id.*",
            "furnitures.furnitures_id.icon.*",
            "amenities.*",
            "amenities.amenities_id.*",
            "amenities.amenities_id.icon.*",
          ],
        })
      );
      const response: IRoom = {
        ...data,
        services: data.services.map((s: any) => s.service_id),
        furnitures: data.furnitures.map((f: any) => f.furnitures_id),
        amenities: data.amenities.map((a: any) => a.amenities_id),
      };
      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
