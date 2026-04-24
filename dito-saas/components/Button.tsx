import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full px-8 py-4",
        variant === "primary" 
          ? "bg-black text-white hover:opacity-90" 
          : "bg-white text-black border border-gray-100 hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
