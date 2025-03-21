
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome to Your App</h1>
        
        {user && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Logged in as: {user.email}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
