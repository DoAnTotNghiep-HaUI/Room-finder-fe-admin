import { IRoom, RoomDetailParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getRoomDetail } from "./action";

const initialState: RoomDetailParams = {
  isLoading: false,
  errorMessage: "",
  roomDetail: null,
};

const roomDetailSlice = createSlice({
  name: "roomDetail",
  initialState,
  reducers: {
    setRoomDetail: (state, action: PayloadAction<IRoom>) => {
      state.roomDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoomDetail.fulfilled, (state, action) => {
        state.roomDetail = action.payload;

        state.isLoading = false;
      })
      .addCase(getRoomDetail.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const { setRoomDetail } = roomDetailSlice.actions;

export default roomDetailSlice.reducer;
