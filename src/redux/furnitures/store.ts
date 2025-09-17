import { IRoom, RoomDetailParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getListFurnitures } from "./action";

const initialState = {
  isLoading: false,
  errorMessage: "",
  furnituresList: null,
};

const furnituresSlice = createSlice({
  name: "furnitures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListFurnitures.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListFurnitures.fulfilled, (state, action) => {
        state.furnituresList = action.payload;

        state.isLoading = false;
      })
      .addCase(getListFurnitures.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const {} = furnituresSlice.actions;

export default furnituresSlice.reducer;
