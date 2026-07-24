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

  const scrollToBooking = () => {
    const section = document.getElementById("booking-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const heroTranslations = {
    ru: {
      badge: "Бронирование комнат",
      title1: "Откройте для себя",
      title2: "идеальный отдых",
      desc: "Мы предлагаем уникальный баланс между домашним уютом и первоклассным гостиничным сервисом прямо на берегу моря.",
      btn: "Начать бронирование",
      card1Title: "Премиум сервис",
      card1Desc: "Гарантия лучшей цены",
      card2Title: "5 минут до моря",
      card2Desc: "Первая линия",
    },
    uk: {
      badge: "Бронювання номерів",
      title1: "Відкрийте для себе",
      title2: "ідеальний відпочинок",
      desc: "Ми пропонуємо унікальний баланс між домашнім затишком та першокласним готельним сервісом прямо на березі моря.",
      btn: "Почати бронювання",
      card1Title: "Преміум сервіс",
      card1Desc: "Гарантія найкращої ціни",
      card2Title: "5 хвилин до моря",
      card2Desc: "Перша лінія",
    },
    en: {
      badge: "Room Booking",
      title1: "Discover your",
      title2: "perfect getaway",
      desc: "We offer a unique balance of home comfort and first-class hotel service right on the seaside.",
      btn: "Start Booking",
      card1Title: "Premium Service",
      card1Desc: "Best price guarantee",
      card2Title: "5 mins to the sea",
      card2Desc: "First line",
    }
  };
  const langKey = (i18n.language || "ru") as "ru" | "uk" | "en";
  const tHero = heroTranslations[langKey] || heroTranslations.ru;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30">
      {/* BUBBLE HERO SECTION */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-slate-950 pt-20">
        <BackgroundBubbles count={15} />
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Hotel Room"
            fill
            className="object-cover scale-105 animate-float-slow opacity-50"
            priority
          />
          {/* Gradient fade to left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center h-full pt-10 pb-20">
          
          <div className="flex flex-col items-start text-left animate-fade-in-up space-y-8 max-w-xl">
            {/* Minimal Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>{translate("bookingService", "Бронирование комнат")}</span>
            </div>

            {/* Premium Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight [text-shadow:_0_10px_40px_rgb(0_0_0_/_80%)]">
              <span className="block mb-2">{tHero.title1}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400 drop-shadow-sm">
                {tHero.title2}
              </span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
              {tHero.desc}
            </p>

            <button onClick={scrollToBooking} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <span className="relative z-10">{tHero.btn}</span>
              <ChevronDown className="h-5 w-5 relative z-10 group-hover:translate-y-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            </button>
          </div>
          
          {/* Decorative Floating Elements for Right Side */}
          <div className="hidden lg:flex flex-col justify-center items-end gap-6 relative h-full">
             <div className="glass-card-dark p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float-slow max-w-[280px] w-full backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-teal-400 fill-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{tHero.card1Title}</h3>
                    <p className="text-slate-400 text-sm">{tHero.card1Desc}</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-sky-400 w-3/4 rounded-full"></div>
                </div>
             </div>
             
             <div className="glass-card-dark p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float max-w-[260px] w-full backdrop-blur-xl mr-12 delay-150">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Waves className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{tHero.card2Title}</h3>
                    <p className="text-slate-400 text-xs">{tHero.card2Desc}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-px">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-24 fill-slate-950 scale-x-[-1]">
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
          <Suspense fallback={<div className="text-center py-20 text-slate-400">Загрузка формы бронирования...</div>}>
            <BookingPageClient rooms={rooms} bookings={bookings} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}