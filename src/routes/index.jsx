import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin/AdminLogin";
import FabricatorRegistration from "../pages/FabricatorRegistration/FabricatorRegistration";
import Layout from "../shared/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import FabricatorManagement from "../pages/FabricatorManagement/FabricatorManagement";
import Representative from "../pages/Representative/Representative";
import Distributors from "../pages/Distributors/Distributors";
import Reports from "../pages/Reports/Reports";
import HomePage from "../pages/Homepage/Homepage";
import AdminManagement from "../pages/AdminManagement/AdminManagement";
import ActivityLogs from "../pages/ActivityLogs/ActivityLogs";
import DeletionRequests from "../pages/DeletionRequests/DeletionRequests";
import Issues from "../pages/Issues/Issues";

export const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/fabricator-management",
        element: <FabricatorManagement />,
      },
      {
        path: "/representative",
        element: <Representative />,
      },
      {
        path: "/distributors",
        element: <Distributors />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      // admin management route
      {
        path: "/admin-management",
        element: <AdminManagement />,
      },
      {
        path: "/activity-logs",
        element: <ActivityLogs />,
      },
      {
        path: "/deletion-requests",
        element: <DeletionRequests />,
      },
      {
        path: "/issues",
        element: <Issues />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/fabricator-registration",
    element: <FabricatorRegistration />,
  },
]);

export default routes;
