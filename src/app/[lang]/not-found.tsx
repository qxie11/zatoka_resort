"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Compass, Home, Moon, Waves, Ship } from "lucide-react";
import { WaveDivider } from "@/components/decorative/SeaDecorations";
import { useEffect, useState } from "react";

export default function NotFound() {
  const pathname = usePathname() || "";
  const segments = pathname.split("/");
  const lang = ["ru", "uk", "en"].includes(segments[1]) ? (segments[1] as "ru" | "uk" | "en") : "ru";

  const t = {
    ru: {
      title: "Вы сбились с курса",
      description: "Наш маяк не может отыскать эту страницу. Возможно, её унесло течением или она скрылась под водой.",
      btnHome: "Вернуться в гавань",
      btnRooms: "Выбрать номер",
      code: "Ошибка 404",
      lost: "Потерялись в море?"
    },
    uk: {
      title: "Ви збилися з курсу",
      description: "Наш маяк не може знайти цю сторінку. Можливо, її забрала течія або вона сховалася під водою.",
      btnHome: "Повернутися в гавань",
      btnRooms: "Обрати номер",
      code: "Помилка 404",
      lost: "Заблукали в морі?"
    },
    en: {
      title: "You've Drifted Off Course",
      description: "Our lighthouse cannot locate this page. It might have been swept away by the tide or submerged.",
      btnHome: "Return to Harbor",
      btnRooms: "View Rooms",
      code: "Error 404",
      lost: "Lost at Sea?"
    }
  }[lang];

  // Micro-interaction: Mouse move parallax effect for the stars & moon
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 text-slate-100 relative overflow-hidden font-sans">
      
      {/* Stars and Ambient Light Background */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out pointer-events-none opacity-40"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        <div className="absolute top-12 left-10 w-2 h-2 bg-white rounded-full animate-ping" />
        <div className="absolute top-24 right-1/4 w-1 h-1 bg-white rounded-full opacity-80" />
        <div className="absolute top-48 left-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full opacity-60" />
        <div className="absolute top-80 right-12 w-2 h-2 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute bottom-60 left-12 w-1 h-1 bg-white rounded-full opacity-45" />
        <div className="absolute top-10 right-10 opacity-70">
          <Moon className="h-10 w-10 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.4)]" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center container mx-auto px-6 py-12 gap-8 z-10">
        
        {/* Left: Lighthouse CSS Illustration */}
        <div className="relative w-64 h-96 flex items-end justify-center select-none animate-fade-in">
          {/* Light Beam Effect */}
          <div className="absolute bottom-[285px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none origin-bottom z-0">
            <div 
              className="w-full h-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" 
              style={{
                clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                animation: "sweep 8s linear infinite",
              }}
            />
          </div>

          {/* Lighthouse Tower Structure */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Top Light Lantern */}
            <div className="w-8 h-10 bg-amber-400 rounded-t-md relative flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.8)] border border-amber-300">
              <div className="absolute w-2 h-6 bg-slate-900 left-1" />
              <div className="absolute w-2 h-6 bg-slate-900 right-1" />
              <div className="absolute top-0 w-10 h-2 bg-slate-800 rounded-sm" />
              <div className="absolute -top-3 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-slate-800" />
            </div>

            {/* Gallery Deck */}
            <div className="w-16 h-2 bg-slate-800 rounded-sm shadow-md" />
            
            {/* Upper Tower */}
            <div className="w-12 h-16 bg-gradient-to-b from-white to-slate-200 relative overflow-hidden flex flex-col justify-between items-center py-2">
              <div className="w-2 h-3 bg-slate-900 rounded-t-sm" />
              <div className="w-full h-4 bg-rose-600" />
            </div>

            {/* Middle Tower */}
            <div className="w-16 h-20 bg-gradient-to-b from-slate-200 to-white relative overflow-hidden flex flex-col justify-between items-center py-2">
              <div className="w-2.5 h-4 bg-slate-900 rounded-t-sm" />
              <div className="w-full h-5 bg-rose-600" />
            </div>

            {/* Lower Tower Base */}
            <div className="w-20 h-24 bg-gradient-to-b from-white to-slate-300 relative overflow-hidden flex flex-col justify-end items-center py-2">
              <div className="w-3 h-5 bg-slate-900 rounded-t-sm mb-4" />
              <div className="w-full h-6 bg-rose-600" />
            </div>

            {/* Rocky Hill Foundation */}
            <div className="w-32 h-14 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-3xl border-t border-slate-600 shadow-xl flex items-center justify-center overflow-hidden">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-mono font-semibold select-none pt-4">ZATOKA LIGHT</span>
            </div>
          </div>

          {/* Drifting Clouds behind lighthouse */}
          <div className="absolute top-10 left-[-80px] w-20 h-6 bg-white/5 rounded-full blur-[2px] animate-float-slow" />
          <div className="absolute top-24 right-[-80px] w-24 h-8 bg-white/5 rounded-full blur-[2px] animate-float-slow" style={{ animationDelay: "2s" }} />
        </div>

        {/* Right: Message and Actions */}
        <div className="max-w-xl text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono font-medium mb-4 uppercase tracking-wider animate-pulse">
            <Compass className="h-3.5 w-3.5" />
            {t.lost}
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-amber-200 via-teal-300 to-sky-300 bg-clip-text text-transparent">
              {t.code}
            </span>
          </h1>

          <h2 className="text-2xl lg:text-3xl font-semibold text-slate-200 mb-4 leading-tight">
            {t.title}
          </h2>

          <p className="text-slate-400 text-lg font-light mb-8 leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 hover:scale-[1.03] transition-smooth active:scale-95"
            >
              <Link href={`/${lang}`}>
                <Home className="mr-2 h-5 w-5 text-slate-950" />
                {t.btnHome}
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:text-white hover:border-slate-600 transition-smooth hover:scale-[1.03] active:scale-95"
            >
              <Link href={`/${lang}/booking`}>
                <Ship className="mr-2 h-5 w-5" />
                {t.btnRooms}
              </Link>
            </Button>
          </div>
        </div>

      </div>

      {/* Decorative Sea Waves at the Bottom */}
      <div className="w-full relative z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent h-16 pointer-events-none -top-16" />
        <WaveDivider color="rgb(2, 6, 23)" height={100} />
      </div>

      {/* Embedded styles for rotation of the beam */}
      <style jsx global>{`
        @keyframes sweep {
          0% {
            transform: rotate(-35deg);
          }
          50% {
            transform: rotate(35deg);
          }
          100% {
            transform: rotate(-35deg);
          }
        }
      `}</style>
    </div>
  );
}
