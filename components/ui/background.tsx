"use client";

import { cn } from "@/lib/utils";

interface BackgroundProps {
  className?: string;
  variant?: "default" | "subtle" | "intense";
  children?: React.ReactNode;
}

export function Background({
  className,
  variant = "default",
  children,
}: BackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}
