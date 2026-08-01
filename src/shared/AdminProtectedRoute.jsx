import { Navigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

export default function AdminProtectedRoute({ children }) {
  const isLogedIn = useAdmin();

  return isLogedIn ? children : <Navigate to="/admin/login" />;
}
