import directus from "@/utils/directus";
import { readMe, refresh } from "@directus/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, IUser } from "@/types/user";

export const getUser = createAsyncThunk("auth/getUser", async () => {
  try {
    const response: any = await directus.request(
      readMe({
        fields: ["*, avatar.*"],
      })
    );
    return response;
  } catch (error) {
    //   return rejectWithValue(error);
    console.log("error", error);
  }
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await directus.login(email, password);
    const user = await directus.request<IUser>(
      readMe({ fields: ["*, avatar.*"] })
    );
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expires: Date.now() + response.expires * 1000, // ms
      user,
    };
  }
);
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const refresh = state.auth.refreshToken;
    if (!refresh) return rejectWithValue("No refresh token");

    try {
      const sdkResp: any = await directus.refresh();
      const accessToken = sdkResp?.access_token ?? sdkResp?.data?.access_token;
      const refreshToken =
        sdkResp?.refresh_token ?? sdkResp?.data?.refresh_token;
      const expiresSeconds = sdkResp?.expires ?? sdkResp?.data?.expires ?? 900;
      return {
        accessToken,
        refreshToken,
        expires: Date.now() + expiresSeconds * 1000,
      };
    } catch (err) {
      return rejectWithValue("Refresh failed");
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async () => {
  await directus.logout();
  return {};
});
