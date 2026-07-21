"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Star, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

import { usePathname } from "next/navigation";

interface StickyBookingBarProps {
  minPrice: number;
}

export function StickyBookingBar({ minPrice = 1500 }: StickyBookingBarProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useTranslation();
  const [, setLangUpdate] = useState(i18n.language || "ru");

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleLangChange = (lng: string) => {
      setLangUpdate(lng);
    };
    i18n.on("languageChanged", handleLangChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  if (
    dismissed || 
    !visible || 
    pathname.includes("/booking") || 
    pathname.startsWith("/admin") || 
    pathname.includes("/login")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-slide-up">
      {/* Glass bar */}
      <div className="relative bg-slate-950/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        {/* Teal accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

        <div className="container mx-auto max-w-7xl px-4 py-3">
          {/* MOBILE: Compact version */}
          <div className="flex sm:hidden items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-0.5 shrink-0">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-white">4.9</span>
              </div>
              <div className="h-3 w-px bg-slate-700 shrink-0" />
              <span className="text-xs text-slate-300 truncate">
                {t("stickyMobileFrom", "от")} <span className="text-white font-bold">{minPrice} грн</span>/{t("stickyMobileNight", "ночь")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold text-xs transition-all duration-300 shadow-lg shadow-teal-500/25 animate-gentle-nudge"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {t("selectDates")}
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* DESKTOP: Full version */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            
            {/* Left: Rating + label */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-slate-300 font-medium">
                <span className="text-white font-bold">4.9</span> · 200+ {t("reviews")}
              </span>
            </div>

            {/* Center: Scarcity / Offer */}
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-slate-300">
                <span className="text-white font-semibold">{t("scarcityTitle")} {new Date().getFullYear()} —</span>
                {" "}{t("scarcityText")}
              </span>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold text-sm transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-teal-500/25 animate-gentle-nudge"
              >
                <CalendarDays className="h-4 w-4" />
                {t("selectDates")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
