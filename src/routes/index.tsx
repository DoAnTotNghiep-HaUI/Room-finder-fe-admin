import Layout from "@/layout";
import AuthLogin from "@/page/Auth/auth-login";
import ContractManagement from "@/page/Contracts";
import MessengerPage from "@/page/Message";
import LandlordProfilePage from "@/page/Profile";
import Properties from "@/page/Properties";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import InvoicePage from "@/page/Invoice/backup/index";
import InvoiceManagement from "@/page/Invoice/invoice-management";
import Dashboard from "@/page/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate
        to="/dashboard"
        replace
      />
    ),
  },
  {
    path: "/login",
    element: <AuthLogin />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/properties", element: <Properties /> },
          { path: "/contracts", element: <ContractManagement /> },
          { path: "/messages", element: <MessengerPage /> },
          { path: "/profile", element: <LandlordProfilePage /> },
          { path: "/invoice", element: <InvoiceManagement /> },

          // { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },
]);
