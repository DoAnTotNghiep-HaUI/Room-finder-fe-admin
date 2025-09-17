import { IRoom, SearchParams } from "@/types/room";
import directus from "@/utils/directus";
import { aggregate, readItem, readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListRoom = createAsyncThunk(
  "room/getListRoom",
  async (params?: SearchParams & { page?: number; limit?: number }) => {
    try {
      const filter: any = { _and: [] };
      const sort: any = [];
      if (params?.sortBy) {
        sort.push(params.sortBy);
      }
      if (params?.title) {
        filter._and.push({ title: { _contains: params.title } });
      }
      if (params?.city) {
        filter._and.push({ building: { city: { _eq: params.city } } });
      }

      if (params?.district) {
        filter._and.push({ building: { district: { _eq: params.district } } });
      }

      if (params?.roomType) {
        filter._and.push({ room_type: { _eq: params.roomType[0] } });
      }

      if (params?.price) {
        // const priceFilter: any = {};
        // if (params.priceMin !== undefined) priceFilter._gte = params.priceMin;
        // if (params.priceMax !== undefined) priceFilter._lte = params.priceMax;
        filter._and.push({
          room_price: {
            _gte: params.price[0] * 1000000,
            _lte: params.price[1] * 1000000,
          },
        });
      }
      if (params?.area) {
        filter._and.push({
          acreage: {
            _gte: params.area[0],
            _lte: params.area[1],
          },
        });
      }
      if (params?.amenities && params.amenities.length > 0) {
        const amenityFilters = params.amenities.map((id) => ({
          amenities: {
            _some: {
              amenities_id: { _eq: id },
            },
          },
        }));
        filter._and.push(...amenityFilters);
      }

      if (params?.furnitures && params.furnitures.length > 0) {
        const furnitureFilters = params.furnitures.map((id) => ({
          furnitures: {
            _some: {
              furnitures_id: { _eq: id },
            },
          },
        }));
        filter._and.push(...furnitureFilters);
      }
      // Nếu không có filter nào, xóa _and để lấy tất cả
      if (filter._and.length === 0) {
        delete filter._and;
      }
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const offset = (page - 1) * limit;
      const response: any = await directus.request(
        readItems("room", {
          sort,
          filter,
          fields: [
            "*",
            "room_type.*",
            "building.*",
            "building.landlord.*",
            "building.district.*",
            "photos.*",
            "amenities.*",
            "furnitures.*",
          ],
          limit,
          offset,
          // meta: "total_count",
        })
      );
      const total_count = await directus.request(
        aggregate("room", {
          aggregate: { count: "*" },
        })
      );
      console.log("room list data", response);

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
export const getListRoomByLandlord = createAsyncThunk(
  "room/getListRoomByLandlord",
  async (currentUserId: string) => {
    try {
      const rawResponse = await directus.request(
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
          filter: {
            building: {
              landlord: {
                _eq: currentUserId,
              },
            },
          },
          sort: ["date_created"],
          // limit: 9,
        })
      );
      console.log("raw");

      const response = rawResponse?.map((room) => ({
        ...room,
        services: room.services.map((s) => ({
          ...s.service_id,
          custome_unit: s.custome_unit,
          custome_price: s.custom_price,
        })),
        amenities: room.amenities.map((a) => a.amenities_id),
        furnitures: room.furnitures.map((f) => f.furnitures_id),
      }));
      return response;
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
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
