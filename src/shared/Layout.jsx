import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import useAuthAdminCheck from "../hooks/useAuthAdminCheck";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

export default function Layout() {
  const authIsReady = useAuthAdminCheck();

  return !authIsReady ? (
    <div>Loading</div>
  ) : (
    <AdminProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        <ErrorMessage />
        <SuccessMessage />
      </div>
    </AdminProtectedRoute>
  );
}
