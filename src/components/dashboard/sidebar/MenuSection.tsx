
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu 
} from "@/components/ui/sidebar";
import SidebarMenuItemComponent from "./SidebarMenuItem";

interface MenuSectionProps {
  title: string;
  items: any[];
  onNavigate: (path: string) => void;
}

export default function MenuSection({ title, items, onNavigate }: MenuSectionProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  // Effect to handle auto-expanding/collapsing of menus when navigating
  useEffect(() => {
    const newExpandedState: Record<string, boolean> = {};
    let activeMenuFound = false;
    
    // First pass: find which menu should be active based on current location
    items.forEach(item => {
      if (item.expandable && item.id) {
        // Check if we're on this menu's main path or one of its subitems
        const isOnMainPath = location.pathname === item.path;
        const isOnSubPath = item.subItems?.some(
          (subItem: { path: string }) => location.pathname === subItem.path
        ) || false;
        
        if (isOnMainPath || isOnSubPath) {
          newExpandedState[item.id] = true;
          activeMenuFound = true;
        }
      }
    });
    
    // Second pass: close all other menus that aren't active
    items.forEach(item => {
      if (item.expandable && item.id) {
        if (!newExpandedState[item.id]) {
          newExpandedState[item.id] = false;
        }
      }
    });
    
    setExpandedMenus(prev => ({
      ...prev,
      ...newExpandedState
    }));
  }, [location.pathname, items]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newState = { ...prev };
      // Toggle the target menu
      newState[menuId] = !prev[menuId];
      return newState;
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItemComponent
              key={item.title}
              item={item}
              expanded={expandedMenus[item.id] || false}
              onToggle={() => item.id && toggleMenu(item.id)}
              onNavigate={onNavigate}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
