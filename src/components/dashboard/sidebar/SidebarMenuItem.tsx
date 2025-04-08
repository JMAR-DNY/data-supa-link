
import { useState } from "react";
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

  const isActive = (path: string) => {
    // For exact matches
    if (location.pathname === path) {
      return true;
    }
    
    // Special case for dashboard root to prevent highlighting when on sub-routes
    if (path === '/dashboard' && location.pathname !== '/dashboard') {
      return false;
    }
    
    // For expandable items, check if we're on a direct child route,
    // but avoid matching paths that could be part of another section
    if (path !== '/dashboard' && location.pathname.startsWith(path)) {
      // Extract the next path segment after the current path to ensure we're
      // only matching direct children
      const remainingPath = location.pathname.substring(path.length);
      
      // If there's nothing more or it starts with a slash followed by characters,
      // it's a direct child or the exact path
      if (remainingPath === '' || remainingPath.startsWith('/')) {
        return true;
      }
    }
    
    return false;
  };

  return (
    <SidebarMenuItem key={item.title}>
      {item.expandable ? (
        <Collapsible 
          open={expanded} 
          onOpenChange={onToggle}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              tooltip={item.title}
              onClick={() => onNavigate(item.path)}
              isActive={isActive(item.path)}
              className={isActive(item.path) && !item.subItems?.some((sub) => isActive(sub.path))
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium rounded-md border-l-4 border-sidebar-primary" 
                : "hover:bg-accent/50"
              }
            >
              <item.icon className={`mr-2 h-4 w-4 ${isActive(item.path) && !item.subItems?.some((sub) => isActive(sub.path)) ? "text-sidebar-primary" : ""}`} />
              <span>{item.title}</span>
              <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
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
