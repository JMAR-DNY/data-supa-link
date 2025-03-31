import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, List, Users, Settings, Mail, LogOut, ChevronRight, Sun, Moon, Sparkles, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  useSidebar,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar";

import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function DashboardSidebar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setOpen, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    lists: false,
    teams: false
  });

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
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

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Mobile hamburger menu - repositioned with fixed positioning
  const MobileMenuButton = () => {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpenMobile(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    );
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
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.expandable ? (
                      <Collapsible 
                        open={expandedMenus[item.id]} 
                        onOpenChange={() => toggleMenu(item.id)}
                        className="w-full"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            tooltip={item.title}
                            onClick={() => handleNavigation(item.path)}
                            isActive={isActive(item.path)}
                            className={isActive(item.path) 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium rounded-md border-l-4 border-sidebar-primary" 
                              : "hover:bg-accent/50"
                            }
                          >
                            <item.icon className={`mr-2 h-4 w-4 ${isActive(item.path) ? "text-sidebar-primary" : ""}`} />
                            <span>{item.title}</span>
                            <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${expandedMenus[item.id] ? 'rotate-90' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-8 space-y-1 mt-1">
                          {item.subItems?.map(subItem => (
                            <Button
                              key={subItem.title}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleNavigation(subItem.path)}
                              className={`w-full justify-start h-8 ${isActive(subItem.path) 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-4 border-sidebar-primary" 
                                : "hover:bg-accent/50"
                              }`}
                            >
                              {subItem.icon && <subItem.icon className="mr-2 h-4 w-4 text-sidebar-primary" />}
                              {subItem.title}
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton 
                        tooltip={item.title}
                        onClick={() => handleNavigation(item.path)}
                        isActive={isActive(item.path)}
                        className={isActive(item.path) 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium rounded-md border-l-4 border-sidebar-primary" 
                          : "hover:bg-accent/50"
                        }
                      >
                        <item.icon className={`mr-2 h-4 w-4 ${isActive(item.path) ? "text-sidebar-primary" : ""}`} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2 space-y-4">
            {state === "expanded" ? (
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                </div>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme} 
                  className="rounded-full"
                >
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {state === "expanded" ? (
              <div className="p-4 rounded-md bg-secondary">
                <p className="text-sm font-medium mb-1">{user?.email}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <SidebarMenuButton 
                tooltip="Sign Out"
                onClick={handleSignOut}
                className="w-full flex justify-center"
              >
                <LogOut />
              </SidebarMenuButton>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
