"use client";

import React from "react";
import { Waves } from "lucide-react";

interface CuteFishPreloaderProps {
  fadeOut?: boolean;
}

export function CuteFishPreloader({ fadeOut = false }: CuteFishPreloaderProps) {
  return (
    <div
      className={`absolute inset-0 z-[15] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-1000 select-none ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.2; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Floating Light Rays Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-0 left-[25%] w-32 h-full bg-gradient-to-b from-teal-400/10 to-transparent skew-x-12 animate-pulse" />
        <div className="absolute top-0 right-[25%] w-40 h-full bg-gradient-to-b from-sky-400/10 to-transparent -skew-x-12 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Elegant Premium Spinner */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Pulsing background rings */}
          <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full border border-sky-400/20 animate-pulse-ring" style={{ animationDelay: '1.5s' }} />

          {/* Rotating outer ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-teal-400 border-r-sky-400 opacity-70 animate-spin-slow" />

          {/* Rotating inner ring */}
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-transparent border-b-sky-300 border-l-teal-300 opacity-60 animate-spin-reverse" />

          {/* Central glowing core */}
          <div className="relative w-16 h-16 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)]">
            <Waves className="w-8 h-8 text-teal-300 opacity-80" />
          </div>
        </div>

        {/* Text */}
        <p className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-300 font-extrabold tracking-widest uppercase text-sm animate-pulse text-center drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]">
          Загрузка моря...
        </p>
        <p className="mt-2 text-slate-400 text-[11px] uppercase tracking-widest font-medium opacity-60">
          Подготовка курорта
        </p>
      </div>
    </div>
  );
}
