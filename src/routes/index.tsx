import Layout from "@/layout";
import ContractManagement from "@/page/Contracts";
import Dashboard from "@/page/Dashboard";
import InvoicePage from "@/page/Invoice";
import MessengerPage from "@/page/Message";
import LandlordProfilePage from "@/page/Profile";
import Properties from "@/page/Properties";
import { createBrowserRouter, Navigate } from "react-router-dom";

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
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/properties", element: <Properties /> },
      { path: "/contracts", element: <ContractManagement /> },
      { path: "/messages", element: <MessengerPage /> },
      { path: "/profile", element: <LandlordProfilePage /> },
      { path: "/invoice", element: <InvoicePage /> },
      // { path: "/settings", element: <Settings /> },
    ],
  },
]);
