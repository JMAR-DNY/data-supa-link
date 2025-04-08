
import React from "react";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center h-14 relative mb-4 md:mb-6">
      {/* Empty left div to balance the centered title */}
      <div className="w-10" /> 
      <h1 className="text-2xl md:text-3xl font-bold flex-1 text-center truncate px-4">{title}</h1>
      {/* Empty right div to balance the centered title */}
      <div className="w-10" />
    </div>
  );
}
