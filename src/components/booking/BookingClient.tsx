"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Waves, Compass, Anchor } from "lucide-react";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import SuccessMessage from "@/app/booking/components/SuccessMessage";
import BookingPageClient from "@/app/booking/components/BookingPageClient";
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO HEADER SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900 text-white text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Luxury resort booking"
            fill
            className="object-cover scale-105 animate-float-slow opacity-80 brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Floating animated marine elements */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
          <div className="absolute top-1/4 left-10 animate-float">
            <Waves className="h-24 w-24 text-teal-300" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-slow" style={{ animationDelay: "3s" }}>
            <Waves className="h-16 w-16 text-sky-300" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: "5s" }}>
            <Waves className="h-20 w-20 text-teal-200" />
          </div>
          <div className="absolute bottom-1/3 right-12 animate-current" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 100 60" className="h-24 w-24 text-teal-300 fill-current">
              <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-[15%] animate-float-slow opacity-15" style={{ animationDelay: '4s' }}>
            <Anchor className="h-16 w-16 text-sky-200" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center">
          {/* Premium Micro-Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in mb-6">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>{translate("bookingService", "Бронирование номеров")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md animate-fade-in-up">
            {translate("bookingTitle", "Забронируйте ваш номер")}
          </h1>
          <WavyUnderline colorClassName="text-teal-300" />
          <p className="mt-6 max-w-2xl mx-auto text-slate-200 text-lg md:text-xl font-light leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            {translate("bookingDesc", "Выберите даты, чтобы найти идеальный номер для вашего отпуска на море.")}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* BOOKING CLIENT CONTAINER */}
      <section className="py-12 bg-slate-950 relative z-10 -mt-8">
        <div className="container mx-auto px-4">
          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>
          <BookingPageClient rooms={rooms} bookings={bookings} />
        </div>
      </section>
    </div>
  );
}
