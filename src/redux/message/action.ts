import { Message } from "@/types/chat";
import { IMessage } from "@/types/message";
import directus from "@/utils/directus";
import { createItem, readItems } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getMessagesByConversationId = createAsyncThunk(
  "conversation/getMessagesByConversationId",
  async (conversationId: string) => {
    try {
      const res = await directus.request(
        readItems("message", {
          fields: ["*", "participants.*, attachments.*"],
          filter: {
            conversation: {
              _eq: conversationId,
            },
          },
        })
      );
      return res as IMessage[];
    } catch (error) {
      //   return rejectWithValue(error);
      console.log("error", error);
    }
  }
);
