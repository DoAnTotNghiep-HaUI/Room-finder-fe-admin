import { createSlice } from "@reduxjs/toolkit";
import {
  getListContractsByLandlord,
  createContract,
  updateContract,
} from "./action";
import { IRentalContract } from "@/types/contract";

interface ContractsState {
  contractsList: IRentalContract[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ContractsState = {
  contractsList: [],
  isLoading: false,
  error: null,
};

const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get list
      .addCase(getListContractsByLandlord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListContractsByLandlord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contractsList = action.payload;
      })
      .addCase(getListContractsByLandlord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Lỗi lấy danh sách hợp đồng";
      });
  },
});

export default contractsSlice.reducer;
