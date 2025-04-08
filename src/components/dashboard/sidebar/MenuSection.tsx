
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu 
} from "@/components/ui/sidebar";
import SidebarMenuItemComponent from "./SidebarMenuItem";
import { useState } from "react";

interface MenuSectionProps {
  title: string;
  items: any[];
  onNavigate: (path: string) => void;
}

export default function MenuSection({ title, items, onNavigate }: MenuSectionProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

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
