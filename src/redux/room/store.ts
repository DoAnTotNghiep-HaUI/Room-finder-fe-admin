import { RoomParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  // getListRoom,
  getListRoomByLandlord,
  getRoomCheapPrice,
  getListRoomByBuilding,
} from "./action";

const initialState: RoomParams = {
  isLoading: false,
  errorMessage: "",
  roomList: null,
  searchParam: null,
  roomByBuilding: null,
  roomCheapPrice: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomList: (state, action: PayloadAction<any>) => {
      state.roomList = action.payload;
    },
    setSearchParam: (state, action: PayloadAction<any>) => {
      state.searchParam = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getListRoom.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(getListRoom.fulfilled, (state, action) => {
      //   state.roomList = action.payload.data;
      //   console.log(" action.payload", action.payload);

      //   state.isLoading = false;
      //   const totalItems = action.payload.total;
      //   const itemsPerPage = action.payload.limit || 10;
      //   const totalPages = Math.ceil(totalItems / itemsPerPage);

      //   state.pagination = {
      //     currentPage: action.payload.page || 1,
      //     totalPages,
      //     totalItems,
      //     itemsPerPage,
      //   };
      // })
      .addCase(getListRoomByLandlord.fulfilled, (state, action) => {
        state.roomList = action.payload.data;
        const totalItems = action.payload.total;
        const itemsPerPage = action.payload.limit || 10;
        const totalPages = Math.ceil(Number(totalItems) / itemsPerPage);

        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages,
          totalItems: Number(totalItems),
          itemsPerPage,
        };
        console.log("action.payload", action.payload);
      })
      .addCase(getListRoomByBuilding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListRoomByBuilding.fulfilled, (state, action) => {
        state.roomByBuilding = action.payload;

        state.isLoading = false;
      })
      .addCase(getListRoomByBuilding.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getRoomCheapPrice.fulfilled, (state, action) => {
        state.roomCheapPrice = action.payload;
        state.isLoading = false;
      });
  },
});
export const { setRoomList, setSearchParam, setCurrentPage, setItemsPerPage } =
  roomSlice.actions;

export default roomSlice.reducer;
