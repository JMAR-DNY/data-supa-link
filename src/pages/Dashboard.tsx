
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarInset>
          <div className="container p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
              <p className="text-muted-foreground">
                This is your dashboard home page. You can access different sections using the sidebar.
              </p>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
