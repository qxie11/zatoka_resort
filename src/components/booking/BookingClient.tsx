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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-end justify-center overflow-hidden bg-slate-950 text-white text-center border-b border-white/5">
        {/* Immersive Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Hotel Room"
            fill
            className="object-cover scale-105 animate-float-slow opacity-60 brightness-[0.4]"
            priority
          />
          {/* Smooth editorial gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center pt-40 pb-20 md:pb-28 h-full justify-end">
          
          <div className="flex flex-col items-center text-center max-w-5xl animate-fade-in-up">
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-white/30 text-xs font-semibold text-white uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
              <Compass className="h-4 w-4 opacity-80" />
              <span>{translate("bookingService", "Бронирование комнат")}</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.05] font-semibold tracking-tight text-white mb-10 [text-shadow:_0_4px_30px_rgb(0_0_0_/_50%)]">
              {translate("bookingTitle", "Забронируйте ваш отдых")}
            </h1>
            
            <WavyUnderline colorClassName="text-teal-400" />
          </div>

          {/* Minimal Scroll Indicator */}
          <div className="absolute bottom-8 animate-bounce opacity-60 hover:opacity-100 cursor-pointer" onClick={scrollToBooking}>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
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