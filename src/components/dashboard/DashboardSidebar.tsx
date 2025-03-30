
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, List, Users, Settings, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

export default function DashboardSidebar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      title: "Lists",
      icon: List,
      path: "/dashboard/lists"
    },
    {
      title: "Campaigns",
      icon: Mail,
      path: "/dashboard/campaigns"
    },
    {
      title: "Teams",
      icon: Users,
      path: "/dashboard/teams"
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/dashboard/settings"
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarHeader>
        <div className="flex items-center px-2 py-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold ml-2">App Dashboard</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <div className="p-4 rounded-md bg-secondary">
            <p className="text-sm font-medium mb-1">{user?.email}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                signOut();
                navigate('/auth');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
