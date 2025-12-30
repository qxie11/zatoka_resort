"use client";

import { Anchor, Shell, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeaDecorationProps {
  type: "anchor" | "shell" | "star";
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function SeaDecoration({ type, className, size = "md", animated = true }: SeaDecorationProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const iconMap = {
    anchor: Anchor,
    shell: Shell,
    star: Star,
  };

  const Icon = iconMap[type];

  return (
    <Icon
      className={cn(
        sizeClasses[size],
        "text-primary/40",
        animated && "animate-float-slow",
        className
      )}
    />
  );
}

interface WaveDividerProps {
  className?: string;
  color?: string;
  height?: number;
}

export function WaveDivider({ className, color = "currentColor", height = 40 }: WaveDividerProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)} style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z"
          fill={color}
          className="animate-wave"
        />
        <path
          d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.6"
          className="animate-wave"
          style={{ animationDelay: "1s" }}
        />
      </svg>
    </div>
  );
}

