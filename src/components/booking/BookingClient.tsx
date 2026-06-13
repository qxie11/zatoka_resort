"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Compass, Anchor, Sparkles, ChevronDown, Waves, Star } from "lucide-react";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import SuccessMessage from "@/app/[lang]/booking/components/SuccessMessage";
import BookingPageClient from "@/app/[lang]/booking/components/BookingPageClient";
import type { Room, Booking } from "@/lib/types";
import i18n from "@/lib/i18n";
import BackgroundBubbles from "@/components/decorative/BackgroundBubbles";

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
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-24 pb-48 lg:pt-32 lg:pb-56 overflow-hidden bg-slate-950 text-white text-center">
        {/* Background Image with Cinematic Grading */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=100&w=1920"
            alt="Luxury resort booking"
            fill
            quality={100}
            className="object-cover scale-105 animate-float-slow opacity-60 brightness-[0.45]"
            priority
          />
          {/* Complex Premium Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent opacity-80" />

          {/* Animated Luxury Gridlines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        </div>

        {/* Floating Holographic Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <BackgroundBubbles count={12} deepCount={6} />
          <div className="absolute top-1/4 -left-12 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-12 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

          <div className="absolute top-12 left-10 animate-float opacity-20">
            <Waves className="h-28 w-28 text-teal-400" />
          </div>
          <div className="absolute bottom-12 right-10 animate-float-slow opacity-20" style={{ animationDelay: "3s" }}>
            <Anchor className="h-24 w-24 text-sky-400" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center">

          {/* Glowing Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 uppercase tracking-[0.25em] animate-fade-in mb-8 shadow-[0_0_15px_rgba(245,158,11,0.15)] backdrop-blur-md">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20 animate-pulse" />
            <span>EST. 2010 • VIP Booking</span>
          </div>

          {/* Premium Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.2] animate-fade-in-up py-4 flex flex-col gap-2 max-w-4xl overflow-visible">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-teal-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] py-2">
              {translate("bookingTitle", "Забронируйте номер")}
            </span>
          </h1>

          <div className="w-32 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mb-8 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />

          {/* Luxury Description */}
          <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl font-light leading-relaxed animate-fade-in-up tracking-wide [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            {translate("bookingDesc", "Погрузитесь в атмосферу абсолютного комфорта. Выберите даты для идеального отдыха на первой линии.")}
          </p>
        </div>

        {/* Стопроцентно отцентрированная кнопка скролла с правильным отступом снизу */}
        <div className="absolute bottom-20 md:bottom-28 left-0 w-full flex justify-center z-30 pointer-events-none">
          <button
            onClick={scrollToBooking}
            className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity animate-bounce cursor-pointer focus:outline-none pointer-events-auto"
            aria-label={translate("scrollToBooking", "Прокрутить к бронированию")}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 drop-shadow-md">Scroll</span>
            <div className="w-5 h-9 rounded-full border border-slate-400/60 bg-slate-900/40 backdrop-blur-sm flex justify-center p-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <div className="w-1 h-2 bg-amber-400 rounded-full animate-scroll shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
            </div>
          </button>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 L1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-teal-500/5" />
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