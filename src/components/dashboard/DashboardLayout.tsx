
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
