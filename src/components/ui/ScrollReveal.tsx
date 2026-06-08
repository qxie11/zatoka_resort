"use client";

import { useEffect, useRef, ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type RevealVariant =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "wave-in"
  | "tide-in";

interface ScrollRevealProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  threshold?: number;
}

const variantClasses: Record<RevealVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 translate-x-12",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-12",
    visible: "opacity-100 translate-x-0",
  },
  "scale-in": {
    hidden: "opacity-0 scale-90",
    visible: "opacity-100 scale-100",
  },
  "wave-in": {
    hidden: "opacity-0 translate-y-8 scale-95",
    visible: "opacity-100 translate-y-0 scale-100",
  },
  "tide-in": {
    hidden: "opacity-0 translate-y-16",
    visible: "opacity-100 translate-y-0",
  },
};

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  threshold = 0.15,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const hiddenList = variantClasses[variant].hidden.split(" ").filter(Boolean);
    const visibleList = variantClasses[variant].visible.split(" ").filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove(...hiddenList);
            entry.target.classList.add(...visibleList);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [variant, threshold]);

  const hiddenClasses = variantClasses[variant].hidden;

  return (
    <div
      ref={ref}
      className={cn(
        hiddenClasses,
        "transition-all duration-700 ease-out",
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}
