"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Compass, Anchor, Sparkles, ChevronDown } from "lucide-react";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import SuccessMessage from "@/app/[lang]/booking/components/SuccessMessage";
import BookingPageClient from "@/app/[lang]/booking/components/BookingPageClient";
import type { Room, Booking } from "@/lib/types";
import i18n from "@/lib/i18n";

interface BookingClientProps {
  rooms: Room[];
  bookings: Booking[];
}

export default function BookingClient({ rooms, bookings }: BookingClientProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [, setLangUpdate] = useState(i18n.language);

  useEffect(() => {
    setMounted(true);
    const handleLangChange = (lng: string) => {
      setLangUpdate(lng);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  const translate = (key: string, fallback: string) => {
    if (!mounted) return fallback;
    return t(key);
  };

  // Функция для плавного скролла к блоку бронирования
  const scrollToBooking = () => {
    const section = document.getElementById("booking-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30">
      {/* PREMIUM HERO SECTION */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden bg-slate-950 text-center">
        {/* Background Image with Cinematic Grading */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=100&w=1920"
            alt="Luxury resort booking"
            fill
            quality={100}
            className="object-cover scale-105 animate-float-slow opacity-60 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-slate-950/90" />
        </div>

        {/* Floating Holographic Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
          <div className="absolute top-[20%] left-[10%] animate-float opacity-20 blur-[1px]">
            <Anchor className="h-24 w-24 text-teal-500/30 stroke-[1]" />
          </div>
          <div className="absolute bottom-[30%] right-[15%] animate-float-slow opacity-20 blur-[2px]" style={{ animationDelay: "2s" }}>
            <Compass className="h-32 w-32 text-sky-400/20 stroke-[0.5]" />
          </div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center mt-10">

          {/* Glassmorphism Premium Badge */}
          <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(45,212,191,0.15)] animate-fade-in mb-8 transition-all hover:bg-white/10 hover:border-teal-500/30 hover:shadow-[0_0_40px_rgba(45,212,191,0.3)] cursor-default">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center">
              <span className="absolute w-2 h-2 rounded-full bg-teal-400 animate-ping opacity-75" />
              <span className="relative w-2 h-2 rounded-full bg-teal-300" />
            </div>
            <span className="relative text-xs font-bold text-slate-200 uppercase tracking-[0.2em] flex items-center gap-1.5">
              {translate("bookingService", "VIP Бронирование")}
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            </span>
          </div>

          {/* High-End Typography */}
          <div className="relative">
            <div className="absolute -inset-4 bg-teal-500/20 blur-3xl rounded-full opacity-30 pointer-events-none" />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md animate-fade-in-up py-2">
              {translate("bookingTitle", "Забронируйте номер")}
            </h1>
          </div>

          <div className="mt-4 opacity-80">
            <WavyUnderline colorClassName="text-amber-300" />
          </div>

          <p className="mt-8 max-w-2xl mx-auto text-slate-300 text-lg md:text-xl font-light leading-relaxed animate-fade-in-up tracking-wide [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards] drop-shadow-md">
            {translate("bookingDesc", "Погрузитесь в атмосферу абсолютного комфорта. Выберите даты для идеального отдыха на первой линии.")}
          </p>
        </div>

        <div className="absolute bottom-6 md:bottom-12 left-0 w-full flex justify-center z-40">
          <button
            onClick={scrollToBooking}
            className="group flex flex-col items-center gap-2.5 focus:outline-none"
            aria-label={translate("scrollToBooking", "Прокрутить к бронированию")}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-300/60 group-hover:text-amber-300 transition-colors duration-500 drop-shadow-md">
              Scroll
            </span>
            <div className="relative flex justify-center w-6 h-11 rounded-full border border-white/20 bg-slate-950/60 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.1)] group-hover:shadow-[0_0_30px_rgba(253,230,138,0.25)] group-hover:border-amber-300/50 transition-all duration-700">
              <div className="w-1 h-2.5 mt-2 bg-teal-400 rounded-full animate-bounce group-hover:bg-amber-300 transition-colors duration-500 shadow-[0_0_8px_rgba(45,212,191,0.8)] group-hover:shadow-[0_0_10px_rgba(253,230,138,0.8)]" />
            </div>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <section id="booking-section" className="relative py-12 bg-slate-950 z-30 -mt-8 scroll-mt-8">
        <div className="container mx-auto px-4 relative z-10">
          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>
          <BookingPageClient rooms={rooms} bookings={bookings} />
        </div>
      </section>
    </div>
  );
}