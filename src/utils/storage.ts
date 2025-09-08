import { AuthState } from "@/types/user";

const KEY = "auth";

export const loadAuth = (): AuthState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthState;
  } catch (err) {
    console.error("loadAuth parse error:", err);
    return null;
  }
};

export const saveAuth = (auth: AuthState) => {
  try {
    // ensure plain object
    const payload: AuthState = {
      accessToken: auth.accessToken ?? null,
      refreshToken: auth.refreshToken ?? null,
      expires: auth.expires ?? null,
      userInfo: auth.userInfo ?? null,
      status: auth.status ?? null,
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("saveAuth error:", err);
  }
};

export const clearAuthStorage = () => {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.error("clearAuthStorage error:", err);
  }
};
