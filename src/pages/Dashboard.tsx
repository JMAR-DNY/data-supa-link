
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/dashboard/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container p-4 md:p-6">
      <PageHeader title="Dashboard" />
      <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground">
          This is your dashboard home page. You can access different sections using the sidebar.
        </p>
      </div>
    </div>
  );
}
