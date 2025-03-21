
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if user is already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Login or create an account to continue
          </p>
        </div>

        <AuthForm setIsLoading={setIsLoading} />
      </div>
    </div>
  );
}
