
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const { loading } = useAuth();

  useEffect(() => {
    // The supabase client will automatically process the OAuth callback
    // and update the user's session
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Finishing authentication...</h2>
          <p className="mt-2 text-sm text-muted-foreground">You will be redirected shortly</p>
        </div>
      </div>
    );
  }

  // Redirect to home once we're no longer loading
  return <Navigate to="/" replace />;
}
