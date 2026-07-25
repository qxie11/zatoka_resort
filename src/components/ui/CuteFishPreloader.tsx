"use client";

import React from "react";
import { Waves, Fish, Droplets } from "lucide-react";

const BUBBLES = [
  { size: 6, delay: 0.5, duration: 3.2 },
  { size: 10, delay: 1.2, duration: 4.1 },
  { size: 5, delay: 0.2, duration: 2.8 },
  { size: 8, delay: 1.8, duration: 3.5 },
  { size: 11, delay: 0.8, duration: 4.8 },
  { size: 7, delay: 1.5, duration: 3.0 },
];

interface CuteFishPreloaderProps {
  fadeOut?: boolean;
}

export function CuteFishPreloader({ fadeOut = false }: CuteFishPreloaderProps) {
  return (
    <div
      className={`absolute inset-0 z-[15] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-1000 select-none ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
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
          50% { opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes float-bubble {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        @keyframes swim-fish {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-swim-fish { animation: swim-fish 4s ease-in-out infinite; }
      `}</style>

      {/* Deep Sea Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950" />

      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
        {BUBBLES.map((bubble, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-sky-300/40 bg-sky-300/10"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '30%',
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: `float-bubble ${bubble.duration}s linear infinite`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Elegant Premium Spinner */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Pulsing background rings */}
          <div className="absolute inset-0 rounded-full border border-teal-500/40 animate-pulse-ring shadow-[0_0_20px_rgba(20,184,166,0.2)]" />
          <div className="absolute inset-0 rounded-full border border-sky-400/30 animate-pulse-ring" style={{ animationDelay: '1.2s' }} />

          {/* Rotating outer ring */}
          <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-teal-400 border-r-cyan-400 opacity-80 animate-spin-slow blur-[1px]" />
          
          {/* Inner ripple ring */}
          <div className="absolute inset-4 rounded-full border border-sky-300/30 border-dashed animate-spin-reverse" />

          {/* Central glowing core */}
          <div className="relative w-20 h-20 rounded-full bg-slate-900/60 backdrop-blur-lg border border-teal-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-sky-500/20 animate-pulse" />
            
            {/* Animated Fish inside */}
            <div className="animate-swim-fish text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
              <Fish className="w-8 h-8" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Decorative Droplet */}
          <div className="absolute -bottom-2 text-teal-400/60 animate-bounce">
             <Droplets className="w-5 h-5" />
          </div>
        </div>

        {/* Text */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-300 to-sky-200 font-extrabold tracking-[0.2em] uppercase text-sm animate-pulse text-center drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            Загрузка моря...
          </h2>
          <div className="flex items-center gap-2 opacity-60">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-sky-400" />
            <p className="text-sky-100 text-[10px] uppercase tracking-widest font-medium">
              Погружение в отдых
            </p>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-sky-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

