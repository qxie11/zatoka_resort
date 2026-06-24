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
import BackgroundFishes from "@/components/decorative/BackgroundFishes";

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
      {/* BUBBLE HERO SECTION */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white text-center border-b border-white/5">
        {/* Floating Bubbles & Luxury Gridlines */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <BackgroundBubbles count={15} deepCount={8} />
          <BackgroundFishes />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[130px] animate-pulse" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
          
          <div className="absolute top-1/4 left-10 opacity-10 animate-float">
            <Waves className="h-24 w-24 text-teal-300" />
          </div>
          <div className="absolute bottom-1/4 right-10 opacity-10 animate-float-slow" style={{ animationDelay: "3s" }}>
            <Waves className="h-20 w-20 text-sky-300" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center">
          {/* Compass Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in mb-6">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>{translate("bookingService", "Бронирование комнат")}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md py-2 px-1">
            {translate("bookingTitle", "Забронируйте ваш отдых")}
          </h1>
          <WavyUnderline colorClassName="text-teal-300" />
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <section id="booking-section" className="relative py-12 bg-slate-950 z-30 scroll-mt-8">
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