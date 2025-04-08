
import React from "react";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-center h-14 relative mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center truncate px-4">{title}</h1>
    </div>
  );
}
