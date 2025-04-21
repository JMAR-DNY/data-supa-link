
import React from "react";

interface PageHeaderProps {
  title: string;
  className?: string;
}

export default function PageHeader({ title, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex items-center h-14 relative ${className}`}>
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
    </div>
  );
}
