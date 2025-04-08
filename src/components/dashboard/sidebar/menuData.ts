
import { 
  LayoutDashboard, List, Users, Settings, Mail, 
  Sparkles, Shield, Database, BarChart, Key, FileText
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    title: "Lists",
    icon: List,
    path: "/dashboard/lists",
    expandable: true,
    id: "lists",
    subItems: [
      { 
        title: "Create New", 
        path: "/dashboard/lists/new",
        icon: Sparkles 
      }
    ]
  },
  {
    title: "Campaigns",
    icon: Mail,
    path: "/dashboard/campaigns"
  },
  {
    title: "Teams",
    icon: Users,
    path: "/dashboard/teams",
    expandable: true,
    id: "teams",
    subItems: [
      { title: "Invitations", path: "/dashboard/teams/invitations" }
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings"
  }
];

// Admin menu items - only shown to sysadmins
export const adminMenuItems = [
  {
    title: "Admin Dashboard",
    icon: Shield,
    path: "/dashboard/admin"
  },
  {
    title: "API",
    icon: Key,
    path: "/dashboard/admin/api-usage",
    expandable: true,
    id: "api",
    subItems: [
      { 
        title: "Usage", 
        path: "/dashboard/admin/api-usage",
        icon: BarChart 
      },
      { 
        title: "Key Config", 
        path: "/dashboard/admin/api-keys",
        icon: Key 
      },
      { 
        title: "Provider Config", 
        path: "/dashboard/admin/api-providers",
        icon: Database 
      }
    ]
  },
  {
    title: "Prompt Config",
    icon: FileText,
    path: "/dashboard/admin/prompts"
  }
];
