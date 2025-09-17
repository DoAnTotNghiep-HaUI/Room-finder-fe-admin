import { IRoom, RoomDetailParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { BuildingParams } from "@/types/building";
import { getListBuilding } from "./action";

const initialState: BuildingParams = {
  isLoading: false,
  errorMessage: "",
  buildingList: null,
};

const roomDTypeSlice = createSlice({
  name: "roomType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListBuilding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListBuilding.fulfilled, (state, action) => {
        state.buildingList = action.payload;

        state.isLoading = false;
      })
      .addCase(getListBuilding.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const {} = roomDTypeSlice.actions;

export default roomDTypeSlice.reducer;
