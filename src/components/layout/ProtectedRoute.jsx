import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = ["admin"] }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If authenticated but wrong role, redirect appropriately
    // For now, redirect to /login or a generic unauthorized page
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
