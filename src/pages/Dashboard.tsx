
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container p-4 md:p-6">
      {/* Adjust top margin for mobile to prevent overlap with hamburger menu */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 mt-10 md:mt-0">Dashboard</h1>
      <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground">
          This is your dashboard home page. You can access different sections using the sidebar.
        </p>
      </div>
    </div>
  );
}
