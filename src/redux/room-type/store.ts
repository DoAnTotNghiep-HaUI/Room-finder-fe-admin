import { IRoom, RoomDetailParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getListRoomType } from "./action";

const initialState = {
  isLoading: false,
  errorMessage: "",
  roomTypeList: null,
};

const roomDTypeSlice = createSlice({
  name: "roomType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListRoomType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListRoomType.fulfilled, (state, action) => {
        state.roomTypeList = action.payload;

        state.isLoading = false;
      })
      .addCase(getListRoomType.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const {} = roomDTypeSlice.actions;

export default roomDTypeSlice.reducer;
