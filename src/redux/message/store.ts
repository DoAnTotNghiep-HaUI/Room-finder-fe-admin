import { RoomParams } from "@/types/room";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { MessageState } from "@/types/chat";
import { getMessagesByConversationId } from "./action";

const initialState: MessageState = {
  isLoading: false,
  error: "",
  messageList: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesByConversationId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessagesByConversationId.fulfilled, (state, action) => {
        state.messageList = action.payload;
        state.isLoading = false;
      })
      .addCase(getMessagesByConversationId.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default messageSlice.reducer;
