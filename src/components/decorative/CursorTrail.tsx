"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  useEffect(() => {
    // Check if device supports fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      
      // Throttle bubble generation (min 45ms between bubbles)
      if (now - lastTime.current < 45) return;

      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      // Only spawn if mouse moved a bit (min 15px)
      if (dist < 15) return;

      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;

      // Create bubble element
      const bubble = document.createElement("div");
      bubble.className = "cursor-bubble";
      
      // Randomize drift direction, size and animation speed slightly
      const size = Math.random() * 8 + 6; // 6px to 14px
      const driftX = (Math.random() - 0.5) * 40; // -20px to 20px
      const duration = 0.8 + Math.random() * 0.5; // 0.8s to 1.3s

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${e.clientX - size / 2}px`;
      bubble.style.top = `${e.clientY - size / 2}px`;
      bubble.style.setProperty("--drift-x", `${driftX}px`);
      bubble.style.animationDuration = `${duration}s`;

      document.body.appendChild(bubble);

      // Clean up bubble from DOM after animation completes
      setTimeout(() => {
        bubble.remove();
      }, duration * 1000);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return null;
}
