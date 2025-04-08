
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar";

// Import refactored components
import MobileMenuButton from "./sidebar/MobileMenuButton";
import MenuSection from "./sidebar/MenuSection";
import ThemeToggle from "./sidebar/ThemeToggle";
import UserProfile from "./sidebar/UserProfile";
import { menuItems, adminMenuItems } from "./sidebar/menuData";

export default function DashboardSidebar() {
  const { signOut, user, isSysAdmin } = useAuth();
  const navigate = useNavigate();
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <>
      {isMobile && <MobileMenuButton />}
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center px-2 py-2">
            <SidebarTrigger />
            <h1 className={`text-xl font-bold ml-2 ${state === "collapsed" ? "hidden" : "block"}`}>App Dashboard</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Regular Menu */}
          <MenuSection 
            title="Menu"
            items={menuItems}
            onNavigate={handleNavigation}
          />

          {/* Admin Menu - only visible to sysadmins */}
          {isSysAdmin && (
            <MenuSection 
              title="Admin"
              items={adminMenuItems}
              onNavigate={handleNavigation}
            />
          )}
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2 space-y-4">
            <ThemeToggle isExpanded={state === "expanded"} />
            <UserProfile 
              isExpanded={state === "expanded"} 
              onSignOut={handleSignOut} 
            />
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
