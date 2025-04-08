
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, loading, isSysAdmin } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If this is an admin-only route and the user is not a sysadmin
  if (adminOnly && !isSysAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
