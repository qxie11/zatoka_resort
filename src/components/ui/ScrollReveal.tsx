"use client";
 
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
 
interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: string;
  delay?: number;
  className?: string;
  threshold?: number;
}
 
export function ScrollReveal({
  children,
  variant,
  delay,
  className,
  threshold,
  ...rest
}: ScrollRevealProps) {
  return (
    <div
      className={cn(className)}
      {...rest}
    >
      {children}
    </div>
  );
}
