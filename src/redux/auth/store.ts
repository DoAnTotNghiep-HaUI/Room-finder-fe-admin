import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { get } from "react-hook-form";
import { getUser, login, logout, refreshToken } from "./action";
import { set } from "date-fns";
import { AuthState } from "@/types/user";
import { clearAuthStorage, loadAuth, saveAuth } from "@/utils/storage";

const persisted = loadAuth();

const initialState: AuthState = persisted
  ? {
      accessToken: persisted.accessToken,
      refreshToken: persisted.refreshToken,
      expires: persisted.expires,
      userInfo: persisted.userInfo,
      status: persisted.status ?? "idle",
    }
  : {
      accessToken: null,
      refreshToken: null,
      expires: null,
      userInfo: null,
      status: "idle",
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expires = action.payload.expires;
      state.userInfo = action.payload.userInfo;
      state.status = action.payload.status ?? "idle";
      saveAuth({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expires: state.expires,
        userInfo: state.userInfo,
        status: state.status,
      });
    },

    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expires = null;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expires = action.payload.expires;
        state.userInfo = action.payload.user;
        saveAuth({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          expires: state.expires,
          userInfo: state.userInfo,
          status: state.status,
        });
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expires = action.payload.expires;
        saveAuth({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          expires: state.expires,
          userInfo: state.userInfo,
          status: state.status,
        });
      })
      .addCase(refreshToken.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.userInfo = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.expires = null;
        state.status = "idle";
        state.userInfo = null;
        clearAuthStorage();
      });
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
