import { createAsyncThunk } from "@reduxjs/toolkit";
import directus from "@/utils/directus";
import {
  readItems,
  readItem,
  createItem,
  updateItem,
  deleteItem,
} from "@directus/sdk";
import { IInvoice } from "@/types/invoice";

export const getInvoicesByBuilding = createAsyncThunk(
  "invoice/getInvoicesByBuilding",
  async (buildingId: string) => {
    try {
      const response = await directus.request<IInvoice[]>(
        readItems("invoice", {
          filter: {
            contract: {
              room: {
                building: {
                  id: { _eq: buildingId },
                },
              },
            },
          },
          fields: [
            "*",
            "contract.*",
            "contract.room.*",
            "contract.room.contract.tenant.*",

            "contract.tenant.*",
            "contract.room.building.*",
          ],
          // sort: ["-created_at"],
        })
      );
      // log
      return response;
    } catch (error) {
      console.error("Error fetching invoices by building:", error);
      throw error;
    }
  }
);
// Lấy danh sách hóa đơn theo phòng
export const getInvoicesByRoom = createAsyncThunk(
  "invoice/getInvoicesByRoom",
  async (roomId: string) => {
    try {
      const response = await directus.request<IInvoice[]>(
        readItems("invoice", {
          filter: {
            "contract.room.id": { _eq: roomId },
          },
          fields: [
            "*",
            "contract.*",
            "contract.room.*",
            "contract.tenant.*",
            "contract.room.contract.tenant.*",
            "services.*",
          ],
          sort: ["-created_at"],
        })
      );
      return response;
    } catch (error) {
      console.error("Error fetching invoices by room:", error);
      throw error;
    }
  }
);

// Xem chi tiết hóa đơn
export const getInvoiceById = createAsyncThunk(
  "invoice/getInvoiceById",
  async (invoiceId: string) => {
    try {
      const response = await directus.request<IInvoice>(
        readItem("invoice", invoiceId, {
          fields: [
            "*",
            "contract.*",
            "contract.room.*",
            "contract.tenant.*",
            "services.*",
          ],
        })
      );
      return response;
    } catch (error) {
      console.error("Error fetching invoice detail:", error);
      throw error;
    }
  }
);

// Thêm hóa đơn mới
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (data: Partial<IInvoice>) => {
    try {
      const response = await directus.request(createItem("invoice", data));
      return response;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }
);

// Sửa hóa đơn
export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async ({
    invoiceId,
    data,
  }: {
    invoiceId: string;
    data: Partial<IInvoice>;
  }) => {
    try {
      const response = await directus.request(
        updateItem("invoice", invoiceId, data)
      );
      return response;
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  }
);

// Xoá hóa đơn
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (invoiceId: string) => {
    try {
      const response = await directus.request(deleteItem("invoice", invoiceId));
      return response;
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  }
);
