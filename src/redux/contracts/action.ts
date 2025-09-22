import { createAsyncThunk } from "@reduxjs/toolkit";
import directus from "@/utils/directus";
import { readItems, createItem, updateItem, deleteItem } from "@directus/sdk";
import { IRentalContract } from "@/types/contract";

// Lấy danh sách hợp đồng theo landlordId
export const getListContractsByLandlord = createAsyncThunk(
  "contracts/getListContractsByLandlord",
  async (landlordId: string) => {
    try {
      const response = await directus.request<IRentalContract[]>(
        readItems("contracts", {
          filter: {
            room: {
              building: {
                landlord: {
                  _eq: landlordId,
                },
              },
            },
          },
          fields: [
            "*",
            "room.id",
            "room.building.*",
            "room.number_room",
            "room.deposit",
            "room.room_price",
            "room.floor",
            "tenant.*",
            "landlord.*",
            "contract_file.*",
          ],
          sort: ["-date_created"],
        })
      );
      return response;
    } catch (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }
  }
);

// Thêm hợp đồng mới
export const createContract = createAsyncThunk(
  "contracts/createContract",
  async (data: any) => {
    try {
      const response = await directus.request(createItem("contracts", data));
      return response;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw error;
    }
  }
);

// Sửa hợp đồng
export const updateContract = createAsyncThunk(
  "contracts/updateContract",
  async ({ contractId, data }: { contractId: string; data: any }) => {
    try {
      const response = await directus.request(
        updateItem("contracts", contractId, data)
      );
      return response;
    } catch (error) {
      console.error("Error updating contract:", error);
      throw error;
    }
  }
);
