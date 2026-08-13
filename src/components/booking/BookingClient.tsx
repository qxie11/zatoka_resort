"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Compass, Anchor, Sparkles, ChevronDown, Waves, ShieldCheck } from "lucide-react";
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
  lang?: string;
}

export default function BookingClient({ rooms, bookings, lang = "ru" }: BookingClientProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState(lang);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (i18n.language) {
      setCurrentLang(i18n.language);
    }
    const handleLangChange = (lng: string) => {
      setCurrentLang(lng);
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

  const pageTranslations = {
    ru: {
      title: "Бронирование номеров",
    },
    uk: {
      title: "Бронювання номерів",
    },
    en: {
      title: "Room Booking",
    }
  };
  const langKey = (currentLang || lang || "ru").slice(0, 2) as "ru" | "uk" | "en";
  const tTitle = pageTranslations[langKey]?.title || pageTranslations.ru.title;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30">
      <section id="booking-section" className="relative pt-28 lg:pt-36 pb-12 bg-slate-950 z-30 min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {tTitle}
            </h1>
          </div>
          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>
          <Suspense fallback={<div className="text-center py-12 md:py-16 text-slate-400">Загрузка формы бронирования...</div>}>
            <BookingPageClient rooms={rooms} bookings={bookings} lang={currentLang} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}