import HomePage from "@/page/HomePage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomePage />,
    },
  ],
  { basename: "/" }
);
