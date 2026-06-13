"use client";

import React from "react";

interface BackgroundBubblesProps {
  count?: number;
  deepCount?: number;
}

export default function BackgroundBubbles({ count = 10, deepCount = 6 }: BackgroundBubblesProps) {
  return (
    <>
      {/* Light Rising Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {[...Array(count)].map((_, i) => (
          <span
            key={`bubble-${i}`}
            className="bubble-particle"
            style={{
              left: `${(i * (90 / count)) + 5}%`,
              width: `${(i % 3) * 6 + 6}px`,
              height: `${(i % 3) * 6 + 6}px`,
              '--bubble-duration': `${(i % 4) * 4 + 9}s`,
              '--bubble-delay': `${(i % 6) * 1.2}s`,
              '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * (i * 5 + 15)}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Deep Underwater Dots */}
      {deepCount > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {[...Array(deepCount)].map((_, i) => (
            <span
              key={`deep-${i}`}
              className="deep-particle"
              style={{
                left: `${(i * (80 / deepCount)) + 10}%`,
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                '--bubble-duration': `${6 + i * 1.5}s`,
                '--bubble-delay': `${i * 0.8}s`,
                '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 20}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </>
  );
}
