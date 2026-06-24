"use client";

import React from "react";
import { Fish } from "lucide-react";

interface FishInstance {
  id: number;
  dir: "ltr" | "rtl";
  top: string;
  duration: string;
  delay: string;
  scale: string;
  opacity: number;
}

const FISHES: FishInstance[] = [
  { id: 1, dir: "ltr", top: "25%", duration: "25s", delay: "0s", scale: "scale-100", opacity: 0.15 },
  { id: 2, dir: "rtl", top: "45%", duration: "30s", delay: "4s", scale: "scale-75", opacity: 0.1 },
  { id: 3, dir: "ltr", top: "65%", duration: "22s", delay: "8s", scale: "scale-90", opacity: 0.12 },
  { id: 4, dir: "rtl", top: "15%", duration: "28s", delay: "12s", scale: "scale-110", opacity: 0.08 },
];

export default function BackgroundFishes() {
  return (
    <>
      <style jsx global>{`
        @keyframes swim-ltr {
          0% {
            left: -10%;
            transform: translateY(0) scaleX(1);
          }
          25% {
            transform: translateY(-15px) scaleX(1);
          }
          50% {
            transform: translateY(10px) scaleX(1);
          }
          75% {
            transform: translateY(-5px) scaleX(1);
          }
          100% {
            left: 110%;
            transform: translateY(0) scaleX(1);
          }
        }

        @keyframes swim-rtl {
          0% {
            left: 110%;
            transform: translateY(0) scaleX(-1);
          }
          25% {
            transform: translateY(15px) scaleX(-1);
          }
          50% {
            transform: translateY(-10px) scaleX(-1);
          }
          75% {
            transform: translateY(5px) scaleX(-1);
          }
          100% {
            left: -10%;
            transform: translateY(0) scaleX(-1);
          }
        }

        .fish-swim-ltr {
          animation: swim-ltr var(--fish-duration) linear infinite;
          animation-delay: var(--fish-delay);
        }

        .fish-swim-rtl {
          animation: swim-rtl var(--fish-duration) linear infinite;
          animation-delay: var(--fish-delay);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {FISHES.map((fish) => {
          const animationClass = fish.dir === "ltr" ? "fish-swim-ltr" : "fish-swim-rtl";
          return (
            <div
              key={`fish-${fish.id}`}
              className={`absolute ${animationClass} text-teal-300`}
              style={{
                top: fish.top,
                opacity: fish.opacity,
                left: fish.dir === "ltr" ? "-10%" : "110%",
                "--fish-duration": fish.duration,
                "--fish-delay": fish.delay,
              } as React.CSSProperties}
            >
              <Fish className={`h-8 w-8 ${fish.scale} animate-pulse`} style={{ animationDuration: "3s" }} />
            </div>
          );
        })}
      </div>
    </>
  );
}
