import store from "@/redux";
import { refreshToken } from "@/redux/auth/action";
import { clearAuth, setCredentials } from "@/redux/auth/store";
import directus from "@/utils/directus";
import { loadAuth } from "@/utils/storage";

export const initAuth = async () => {
  const saved = loadAuth();
  if (!saved) return;

  // Nếu access token còn hạn => restore Redux + gán token cho Directus
  if (saved.accessToken && saved.expires && Date.now() < saved.expires) {
    try {
      // set token for directus so subsequent SDK calls use it
      if (typeof (directus as any).setToken === "function") {
        (directus as any).setToken(saved.accessToken);
      }
      store.dispatch(setCredentials(saved));
      return;
    } catch (err) {
      console.error("initAuth setToken error:", err);
    }
  }

  // Nếu access token hết hạn nhưng có refreshToken => thử refresh
  if (saved.refreshToken) {
    try {
      // dispatch refreshToken thunk
      const result = await store.dispatch(refreshToken() as any).unwrap();
      // set token to directus
      if (
        result?.accessToken &&
        typeof (directus as any).setToken === "function"
      ) {
        (directus as any).setToken(result.accessToken);
      }
      // setCredentials được thực hiện trong slice extraReducers via refreshToken.fulfilled (we saved to storage)
      return;
    } catch (err) {
      console.warn("initAuth refresh failed:", err);
      store.dispatch(clearAuth());
      return;
    }
  }

  // else: no valid tokens
  store.dispatch(clearAuth());
};
