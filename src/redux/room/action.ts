import { IRoom, SearchParams } from "@/types/room";
import directus from "@/utils/directus";
import {
  aggregate,
  createItem,
  deleteItem,
  readItem,
  readItems,
  updateItem,
} from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListRoomByLandlord = createAsyncThunk(
  "room/getListRoomByLandlord",
  async (
    params?: SearchParams & {
      page?: number;
      limit?: number;
      currentUserId?: string;
    }
  ) => {
    try {
      const filter: any = {
        _and: [
          {
            building: {
              landlord: {
                _eq: params?.currentUserId,
              },
            },
          },
        ],
      };
      // ...
      if (params?.title) {
        filter._and.push({ title: { _icontains: params.title } });
      }
      if (params?.building) {
        filter._and.push({ building: { _eq: params.building } });
      }
      if (filter._and.length === 0) {
        delete filter._and;
      }
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const offset = (page - 1) * limit;
      const rawResponse = await directus.request<any>(
        readItems("room", {
          fields: [
            "*",
            "room_type.*",
            "building.*",
            "building.landlord.*",
            "building.district.*",
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
          filter,
          sort: ["date_created"],
          limit,
          offset,
          // limit: 9,
        })
      );
      const total_count = await directus.request(
        aggregate("room", {
          aggregate: { count: "*" },
        })
      );
      const response = rawResponse?.map((room) => ({
        ...room,
        services: room.services.map((s) => ({
          ...s.service_id,
          room_service_id: s.id,
          custome_unit: s.custome_unit,
          custome_price: s.custom_price,
        })),
        amenities: room.amenities.map((a) => ({
          ...a.amenities_id,
          room_category_id: a.id,
        })),
        furnitures: room.furnitures.map((f) => ({
          ...f.furnitures_id,
          room_category_id: f.id,
        })),
      }));

      return {
        data: response,
        total: total_count[0]?.count || 0,
        page,
        limit,
      };
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
// export const getListRoomByLandlord = createAsyncThunk(
//   "room/getListRoomByLandlord",
//   async (currentUserId: string) => {
//     try {
//       const rawResponse = await directus.request<any>(
//         readItems("room", {
//           fields: [
//             "*",
//             "room_type.*",
//             "building.*",
//             "building.landlord.*",
//             "building.district.*",
//             "photos.*",
//             "video.*",
//             "services.*",
//             "services.service_id.*",
//             "services.service_id.icon.*",
//             "furnitures.*",
//             "furnitures.furnitures_id.*",
//             "furnitures.furnitures_id.icon.*",
//             "amenities.*",
//             "amenities.amenities_id.*",
//             "amenities.amenities_id.icon.*",
//           ],
//           filter: {
//             building: {
//               landlord: {
//                 _eq: currentUserId,
//               },
//             },
//           },
//           sort: ["date_created"],
//           // limit: 9,
//         })
//       );
//       console.log("raw", rawResponse);

//       const response = rawResponse?.map((room) => ({
//         ...room,
//         services: room.services.map((s) => ({
//           ...s.service_id,
//           room_service_id: s.id,
//           custome_unit: s.custome_unit,
//           custome_price: s.custom_price,
//         })),
//         amenities: room.amenities.map((a) => ({
//           ...a.amenities_id,
//           room_category_id: a.id,
//         })),
//         furnitures: room.furnitures.map((f) => ({
//           ...f.furnitures_id,
//           room_category_id: f.id,
//         })),
//       }));
//       return response;
//     } catch (error) {
//       //   return rejectWithValue(error);
//       console.log("error", error);
//     }
//   }
// );
export const getRoomNewPost = createAsyncThunk(
  "room/getRoomNewPost",
  async (roomType: string) => {
    try {
      const response: any = await directus.request(
        readItems("room", {
          fields: [
            "*",
            "room_type.*",
            "building.*",
            "building.landlord.*",
            "building.district.*",

            "photos.*",
          ],
          filter: {
            room_type: {
              _eq: roomType,
            },
          },
          sort: ["-date_created"],
          limit: 9,
        })
      );
      console.log("room list data", response);

      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
export const getRoomCheapPrice = createAsyncThunk(
  "room/getRoomCheapPrice",
  async () => {
    try {
      const response: any = await directus.request(
        readItems("room", {
          fields: [
            "*",
            "room_type.*",
            "building.*",
            "building.landlord.*",
            "building.district.*",

            "photos.*",
          ],
          filter: {
            room_price: {
              _lte: 3000000,
            },
          },
          sort: ["-date_created"],
          limit: 9,
        })
      );

      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
export const updateRoom = createAsyncThunk(
  "room/updateRoom",
  async ({ roomId, data }: { roomId: string; data: Partial<IRoom> }) => {
    try {
      console.log("data request update room", data);

      const response = await directus.request(updateItem("room", roomId, data));
      return response;
    } catch (error) {
      console.error("Update room error:", error);
      throw error;
    }
  }
);
export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (data: any) => {
    try {
      console.log("data request create room", data);

      const response = await directus.request(createItem("room", data.data));
      return response;
    } catch (error) {
      console.error("Create room error:", error);
      throw error;
    }
  }
);
export const deleteRoom = createAsyncThunk(
  "room/deleteRoom",
  async (roomId: string) => {
    try {
      const response = await directus.request(deleteItem("room", roomId));
      return response;
    } catch (error) {
      console.error("Delete room error:", error);
      throw error;
    }
  }
);
