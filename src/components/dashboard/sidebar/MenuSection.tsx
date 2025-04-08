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

  useEffect(() => {
    const newExpandedState: Record<string, boolean> = {};
    
    items.forEach(item => {
      if (item.expandable && item.id) {
        const shouldBeExpanded = item.subItems?.some(
          (subItem: { path: string }) => location.pathname === subItem.path
        ) || false;
        
        if (shouldBeExpanded) {
          newExpandedState[item.id] = true;
        } else {
          newExpandedState[item.id] = expandedMenus[item.id] || false;
        }
      }
    });
    
    setExpandedMenus(newExpandedState);
  }, [location.pathname]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
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
