"use client";

import React from "react";
import { Waves, Anchor } from "lucide-react";

export function GlobalMarineBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.07]">
      {/* Bubble Column Left */}
      <div className="absolute left-[5%] inset-y-0 w-8 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <span
            key={`bubble-l-${i}`}
            className="bubble-particle"
            style={{
              left: `${(i % 3) * 10}px`,
              width: `${6 + (i % 3) * 3}px`,
              height: `${6 + (i % 3) * 3}px`,
              '--bubble-duration': `${12 + i * 3}s`,
              '--bubble-delay': `${i * 2}s`,
              '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 15}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Bubble Column Right */}
      <div className="absolute right-[8%] inset-y-0 w-8 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <span
            key={`bubble-r-${i}`}
            className="bubble-particle"
            style={{
              right: `${(i % 3) * 10}px`,
              width: `${5 + (i % 3) * 4}px`,
              height: `${5 + (i % 3) * 4}px`,
              '--bubble-duration': `${10 + i * 4}s`,
              '--bubble-delay': `${i * 1.5}s`,
              '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 20}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Drifting Waves - Top Right */}
      <div className="absolute top-[12%] right-[10%] animate-float-slow">
        <Waves className="h-28 w-28 text-teal-300" />
      </div>

      {/* Drifting Waves - Mid Left */}
      <div className="absolute top-[45%] left-[4%] animate-float">
        <Waves className="h-20 w-20 text-sky-300" />
      </div>

      {/* Drifting Waves - Bottom Right */}
      <div className="absolute bottom-[15%] right-[6%] animate-float-slow" style={{ animationDelay: "3s" }}>
        <Waves className="h-24 w-24 text-teal-200" />
      </div>

      {/* Drifting Fish - Upper Left */}
      <div className="absolute top-[28%] left-[6%] animate-current" style={{ animationDelay: "1s" }}>
        <svg viewBox="0 0 100 60" className="h-28 w-28 text-teal-400 fill-current">
          <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
        </svg>
      </div>

      {/* Drifting Fish - Lower Right (Flipped) */}
      <div className="absolute top-[65%] right-[5%] animate-current" style={{ animationDelay: "4s" }}>
        <svg viewBox="0 0 100 60" className="h-32 w-32 text-sky-400 fill-current scale-x-[-1]">
          <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
        </svg>
      </div>

      {/* Anchor - Bottom Left */}
      <div className="absolute bottom-[8%] left-[5%] animate-jellyfish" style={{ animationDelay: "2s" }}>
        <Anchor className="h-24 w-24 text-teal-300" />
      </div>

      {/* Anchor - Top Left */}
      <div className="absolute top-[8%] left-[8%] animate-jellyfish">
        <Anchor className="h-20 w-20 text-sky-300" />
      </div>
    </div>
  );
}
