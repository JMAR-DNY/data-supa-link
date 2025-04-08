
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileProps {
  isExpanded: boolean;
  onSignOut: () => void;
}

export default function UserProfile({ isExpanded, onSignOut }: UserProfileProps) {
  const { user } = useAuth();
  
  if (isExpanded) {
    return (
      <div className="p-4 rounded-md bg-secondary">
        <p className="text-sm font-medium mb-1">{user?.email}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <SidebarMenuButton 
      tooltip="Sign Out"
      onClick={onSignOut}
      className="w-full flex justify-center"
    >
      <LogOut />
    </SidebarMenuButton>
  );
}
