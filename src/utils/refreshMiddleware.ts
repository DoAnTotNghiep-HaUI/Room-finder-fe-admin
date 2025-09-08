import { logout, refreshToken } from "@/redux/auth/action";

export const refreshMiddleware =
  (store: any) => (next: any) => async (action: any) => {
    const state = store.getState();
    const auth = state.auth;
    if (
      auth.accessToken &&
      auth.expires &&
      Date.now() > auth.expires - 60 * 1000 &&
      action.type.startsWith("api/")
    ) {
      try {
        await store.dispatch(refreshToken()).unwrap();
      } catch {
        store.dispatch(logout());
        localStorage.removeItem("auth");
      }
    }

    return next(action);
  };
