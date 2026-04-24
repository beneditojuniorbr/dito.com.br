import { cn } from "@/lib/utils";
import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Card({ title, value, subtitle, icon, className }: CardProps) {
  return (
    <div className={cn("card-premium flex flex-col justify-between h-full", className)}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-green-600 font-medium mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}
