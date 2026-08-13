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
      card1Title: "Гарантия лучшей цены",
      card1Desc: "Прямое бронирование без комиссий",
      card2Title: "5 минут до моря",
      card2Desc: "Первая линия",
    },
    uk: {
      badge: "Бронювання номерів",
      title1: "Відкрийте для себе",
      title2: "ідеальний відпочинок",
      desc: "Ми пропонуємо унікальний баланс між домашнім затишком та першокласним готельним сервісом прямо на березі моря.",
      btn: "Почати бронювання",
      card1Title: "Гарантія кращої ціни",
      card1Desc: "Пряме бронювання без комісій",
      card2Title: "5 хвилин до моря",
      card2Desc: "Перша лінія",
    },
    en: {
      badge: "Room Booking",
      title1: "Discover your",
      title2: "perfect getaway",
      desc: "We offer a unique balance of home comfort and first-class hotel service right on the seaside.",
      btn: "Start Booking",
      card1Title: "Best Price Guarantee",
      card1Desc: "Direct booking without fees",
      card2Title: "5 mins to the sea",
      card2Desc: "First line",
    }
  };
  const langKey = (i18n.language || "ru") as "ru" | "uk" | "en";
  const tHero = heroTranslations[langKey] || heroTranslations.ru;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30">
      <section id="booking-section" className="relative pt-28 lg:pt-36 pb-12 bg-slate-950 z-30 min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>
          <Suspense fallback={<div className="text-center py-12 md:py-16 text-slate-400">Загрузка формы бронирования...</div>}>
            <BookingPageClient rooms={rooms} bookings={bookings} lang={lang} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}