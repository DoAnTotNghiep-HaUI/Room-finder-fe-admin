import { createSlice } from "@reduxjs/toolkit";
import {
  getInvoicesByRoom,
  getInvoicesByBuilding,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "./action";
import { IInvoice } from "@/types/invoice";

interface InvoiceState {
  invoices: IInvoice[];
  invoiceDetail: IInvoice | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  invoiceDetail: null,
  isLoading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get list by room
      .addCase(getInvoicesByRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInvoicesByRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload;
      })
      .addCase(getInvoicesByRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Lỗi lấy danh sách hóa đơn";
      })

      // Get list by building
      .addCase(getInvoicesByBuilding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInvoicesByBuilding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload;
      })
      .addCase(getInvoicesByBuilding.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Lỗi lấy danh sách hóa đơn theo tòa nhà";
      })

      // Get detail
      .addCase(getInvoiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceDetail = action.payload;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Lỗi lấy chi tiết hóa đơn";
      });
  },
});

export default invoiceSlice.reducer;
