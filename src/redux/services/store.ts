import { createSlice } from "@reduxjs/toolkit";
import { getListServices } from "./action";
import { ServiceParams } from "@/types/room";

const initialState: ServiceParams = {
  isLoading: false,
  errorMessage: "",
  servicesList: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListServices.fulfilled, (state, action) => {
        state.servicesList = action.payload;

        state.isLoading = false;
      })
      .addCase(getListServices.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const {} = servicesSlice.actions;

export default servicesSlice.reducer;
