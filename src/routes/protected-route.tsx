import { AppDispatch, RootState } from "@/redux";
import { refreshToken } from "@/redux/auth/action";
import { clearAuth } from "@/redux/auth/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { accessToken } = useSelector((state: RootState) => state.auth);
  const auth = localStorage.getItem("auth");
  const authParsed = JSON.parse(auth);
  const accessToken = authParsed?.accessToken;
  useEffect(() => {
    // if (!accessToken) {

    if (auth) {
      if (authParsed.expires && Date.now() > authParsed.expires) {
        dispatch(refreshToken() as any)
          .unwrap()
          .catch(() => {
            dispatch(clearAuth());
            localStorage.removeItem("auth");
          });
      }
      // }
    }
  }, []);
  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
