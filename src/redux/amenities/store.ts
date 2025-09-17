import { IRoom, RoomDetailParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getListAmenities } from "./action";

const initialState = {
  isLoading: false,
  errorMessage: "",
  amenitiesList: null,
};

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListAmenities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListAmenities.fulfilled, (state, action) => {
        state.amenitiesList = action.payload;

        state.isLoading = false;
      })
      .addCase(getListAmenities.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const {} = amenitiesSlice.actions;

export default amenitiesSlice.reducer;
