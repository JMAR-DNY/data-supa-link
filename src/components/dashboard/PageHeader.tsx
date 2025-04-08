
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const { user } = useAuth();
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between h-14 relative mb-4 md:mb-6 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold truncate">{title}</h1>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
