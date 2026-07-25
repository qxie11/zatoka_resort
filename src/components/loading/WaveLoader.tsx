"use client";

import { Waves } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface WaveLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WaveLoader({ className, size = "md" }: WaveLoaderProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <Waves className={cn(sizeClasses[size], "text-primary animate-wave")} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-primary rounded-full animate-bubble" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-bubble" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>
    </div>
  );
}

export function FullPageLoader() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <WaveLoader size="lg" />
        <p className="text-muted-foreground animate-pulse">{t("loading") || "Загрузка..."}</p>
      </div>
    </div>
  );
}

