
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type SubItem = {
  title: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type MenuItemProps = {
  item: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
    expandable?: boolean;
    id?: string;
    subItems?: SubItem[];
  };
  expanded: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
};

export default function SidebarMenuItemComponent({ 
  item, 
  expanded, 
  onToggle, 
  onNavigate 
}: MenuItemProps) {
  const location = useLocation();
  
  // Improved isActive function to prevent multiple highlighting
  const isActive = (path: string) => {
    // Exact match for current path
    if (location.pathname === path) {
      return true;
    }
    
    // For the root dashboard path
    if (path === '/dashboard' && location.pathname !== '/dashboard') {
      return false;
    }
    
    // For expandable items with subitems
    if (item.expandable && item.subItems) {
      // If we're checking the parent item itself
      if (path === item.path) {
        // Only highlight parent if we're on the exact parent path
        return location.pathname === path;
      }
      
      // For subitems, do exact matching only
      return location.pathname === path;
    }
    
    return false;
  };

  // Check if any subitem is active
  const hasActiveSubItem = item.subItems?.some(subItem => location.pathname === subItem.path) || false;
  
  // This effect will handle expansion when navigating
  useEffect(() => {
    // Auto-expand if we're on a page that's part of this menu's subitems
    if (item.expandable && !expanded && (hasActiveSubItem || isActive(item.path))) {
      onToggle(); // Open this section
    }
    
    // If we navigate outside this menu's items while it's expanded, close it
    if (item.expandable && expanded && !isActive(item.path) && !hasActiveSubItem) {
      // Only close menus that aren't active
      onToggle(); // Close this section
    }
  }, [location.pathname]);

  // Handle clicks on the parent menu item
  const handleParentClick = (e: React.MouseEvent) => {
    // Navigate to the main path
    onNavigate(item.path);
    
    // Don't toggle if we're clicking directly on the parent item
    // Let the collapsible trigger handle the toggle instead
    e.stopPropagation();
  };

  // Handle the toggle action (clicking on the chevron)
  const handleToggle = () => {
    onToggle();
  };

  return (
    <SidebarMenuItem key={item.title}>
      {item.expandable ? (
        <Collapsible 
          open={expanded || hasActiveSubItem} 
          onOpenChange={handleToggle}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              tooltip={item.title}
              onClick={handleParentClick}
              isActive={isActive(item.path)}
              className={isActive(item.path)
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium rounded-md border-l-4 border-sidebar-primary" 
                : "hover:bg-accent/50"
              }
            >
              <item.icon className={`mr-2 h-4 w-4 ${isActive(item.path) ? "text-sidebar-primary" : ""}`} />
              <span>{item.title}</span>
              <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${expanded || hasActiveSubItem ? 'rotate-90' : ''}`} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1 mt-1">
            {item.subItems?.map((subItem) => (
              <Button
                key={subItem.title}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(subItem.path)}
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
          onClick={() => onNavigate(item.path)}
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
  );
}
