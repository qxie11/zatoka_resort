"use client";

import React from "react";

interface CuteFishPreloaderProps {
  fadeOut?: boolean;
}

export function CuteFishPreloader({ fadeOut = false }: CuteFishPreloaderProps) {
  return (
    <div
      className={`absolute inset-0 z-[15] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-1000 select-none ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Styles for fish and bubble animations */}
      <style jsx global>{`
        @keyframes fish-swim-left-right {
          0% {
            transform: translateX(-40px) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(40px) translateY(-10px) scaleX(1);
          }
          50.01% {
            transform: translateX(40px) translateY(-10px) scaleX(-1);
          }
          100% {
            transform: translateX(-40px) translateY(0px) scaleX(-1);
          }
        }
        @keyframes fish-swim-right-left {
          0% {
            transform: translateX(40px) translateY(0px) scaleX(-1);
          }
          50% {
            transform: translateX(-40px) translateY(10px) scaleX(-1);
          }
          50.01% {
            transform: translateX(-40px) translateY(10px) scaleX(1);
          }
          100% {
            transform: translateX(40px) translateY(0px) scaleX(1);
          }
        }
        @keyframes fish-tail-sway {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(15deg);
          }
        }
        @keyframes fish-fin-wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-20deg);
          }
        }
        @keyframes loader-bubble {
          0% {
            transform: translateY(20px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-80px) scale(1.2);
            opacity: 0;
          }
        }
        .loader-fish-orange {
          animation: fish-swim-left-right 6s ease-in-out infinite;
        }
        .loader-fish-teal {
          animation: fish-swim-right-left 5s ease-in-out infinite;
        }
        .loader-tail-sway {
          transform-origin: 64px 30px;
          animation: fish-tail-sway 0.3s ease-in-out infinite;
        }
        .loader-fin-wiggle {
          transform-origin: 40px 35px;
          animation: fish-fin-wiggle 0.25s ease-in-out infinite;
        }
        .loader-bubble-1 {
          animation: loader-bubble 3s ease-in-out infinite;
        }
        .loader-bubble-2 {
          animation: loader-bubble 2.5s ease-in-out infinite 0.7s;
        }
        .loader-bubble-3 {
          animation: loader-bubble 3.5s ease-in-out infinite 1.4s;
        }
      `}</style>

      {/* Floating Light Rays Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-0 left-[25%] w-32 h-full bg-gradient-to-b from-teal-400/10 to-transparent skew-x-12 animate-pulse" />
        <div className="absolute top-0 right-[25%] w-40 h-full bg-gradient-to-b from-sky-400/10 to-transparent -skew-x-12 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Loading Aquarium Ring */}
        <div className="relative w-44 h-44 rounded-full border border-teal-500/20 bg-teal-950/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(20,184,166,0.15)] overflow-hidden">
          
          {/* Animated Water Bubbles */}
          <div className="absolute bottom-8 left-12 w-2 h-2 rounded-full border border-teal-300/40 bg-teal-400/20 loader-bubble-1" />
          <div className="absolute bottom-10 left-20 w-3 h-3 rounded-full border border-sky-300/40 bg-sky-400/20 loader-bubble-2" />
          <div className="absolute bottom-6 left-28 w-1.5 h-1.5 rounded-full border border-teal-200/40 bg-teal-300/20 loader-bubble-3" />

          {/* Cute Orange Goldfish */}
          <div className="absolute loader-fish-orange" style={{ width: "80px", height: "50px", top: "25%" }}>
            <svg viewBox="0 0 100 60" width="100%" height="100%">
              <defs>
                <linearGradient id="orange-fish" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="orange-tail" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
              {/* Tail */}
              <path className="loader-tail-sway" d="M 64 30 Q 82 10 92 24 Q 84 30 92 36 Q 82 50 64 30 Z" fill="url(#orange-tail)" />
              {/* Body */}
              <path d="M 12 30 Q 30 10 65 22 Q 72 30 65 38 Q 30 50 12 30 Z" fill="url(#orange-fish)" />
              {/* White eye highlight */}
              <circle cx="28" cy="24" r="5.5" fill="white" />
              <circle cx="29.5" cy="23.5" r="3" fill="#1e293b" />
              <circle cx="31" cy="22" r="1" fill="white" />
              {/* Fin */}
              <path className="loader-fin-wiggle" d="M 40 34 Q 32 44 44 42 Z" fill="#f97316" />
            </svg>
          </div>

          {/* Cute Teal Fish */}
          <div className="absolute loader-fish-teal" style={{ width: "70px", height: "45px", bottom: "20%" }}>
            <svg viewBox="0 0 100 60" width="100%" height="100%">
              <defs>
                <linearGradient id="teal-fish" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="teal-tail" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              {/* Tail */}
              <path className="loader-tail-sway" d="M 64 30 Q 82 12 90 25 Q 84 30 90 35 Q 82 48 64 30 Z" fill="url(#teal-tail)" />
              {/* Body */}
              <path d="M 14 30 Q 30 12 65 24 Q 72 30 65 36 Q 30 48 14 30 Z" fill="url(#teal-fish)" />
              {/* White eye highlight */}
              <circle cx="30" cy="25" r="5" fill="white" />
              <circle cx="31.5" cy="24.5" r="2.5" fill="#1e293b" />
              <circle cx="32.5" cy="23.5" r="0.8" fill="white" />
              {/* Fin */}
              <path className="loader-fin-wiggle" d="M 42 33 Q 36 42 45 40 Z" fill="#14b8a6" />
            </svg>
          </div>

        </div>

        {/* Text */}
        <p className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-300 font-extrabold tracking-widest uppercase text-sm animate-pulse text-center drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]">
          Рыбки готовят океан...
        </p>
        <p className="mt-1.5 text-slate-400 text-[11px] uppercase tracking-widest font-medium opacity-60">
          Загрузка курорта
        </p>
      </div>
    </div>
  );
}
