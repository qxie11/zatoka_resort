"use client";

import { useEffect, useState } from "react";
import { X, Sun, Waves, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

type SeasonPhase = "before" | "during" | "after";

function getSeasonPhase(now: Date): { phase: SeasonPhase; daysLeft: number } {
  const year = now.getFullYear();
  const seasonStart = new Date(year, 5, 1); // June 1
  const seasonEnd = new Date(year, 8, 15); // Sept 15

  if (now < seasonStart) {
    const diff = Math.ceil(
      (seasonStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return { phase: "before", daysLeft: diff };
  } else if (now <= seasonEnd) {
    const diff = Math.ceil(
      (seasonEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return { phase: "during", daysLeft: diff };
  } else {
    return { phase: "after", daysLeft: 0 };
  }
}

function pluralDays(n: number, lang: string): string {
  if (lang === "en") {
    return n === 1 ? "day" : "days";
  }
  // ru/uk
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return lang === "uk" ? "днів" : "дней";
  if (lastDigit === 1) return lang === "uk" ? "день" : "день";
  if (lastDigit >= 2 && lastDigit <= 4) return lang === "uk" ? "дні" : "дня";
  return lang === "uk" ? "днів" : "дней";
}

export function SeasonBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [seasonData, setSeasonData] = useState<{
    phase: SeasonPhase;
    daysLeft: number;
  } | null>(null);
  const { t } = useTranslation();
  const [, setLangUpdate] = useState(i18n.language || "ru");

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("season-banner-dismissed");
    if (!wasDismissed) {
      setDismissed(false);
    }
    setSeasonData(getSeasonPhase(new Date()));

    const handleLangChange = (lng: string) => {
      setLangUpdate(lng);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("season-banner-dismissed", "true");
  };

  if (dismissed || !seasonData || seasonData.phase === "after") return null;

  const lang = i18n.language || "ru";
  const daysWord = pluralDays(seasonData.daysLeft, lang);

  return (
    <div className="sticky top-16 z-[49] bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-rose-500/90 text-white overflow-hidden backdrop-blur-sm">
      {/* Animated shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "season-shimmer 3s linear infinite",
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-2.5 relative">
        <div className="flex items-center justify-center gap-3 text-sm font-medium">
          {/* Icon */}
          <div className="shrink-0 hidden sm:flex items-center gap-1.5">
            {seasonData.phase === "before" ? (
              <Sun className="h-4 w-4 animate-spin-slow" />
            ) : (
              <Waves className="h-4 w-4 animate-coral-sway" />
            )}
          </div>

          {/* Text */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {seasonData.phase === "before" ? (
              <>
                <span>
                  {t("seasonBefore", "До начала сезона")}{" "}
                  <span className="font-extrabold text-white bg-white/20 px-1.5 py-0.5 rounded-md mx-0.5 tabular-nums">
                    {seasonData.daysLeft}
                  </span>{" "}
                  {daysWord} —
                </span>
                <span className="font-bold">
                  {t("seasonBookEarly", "бронируйте заранее по лучшей цене!")}
                </span>
              </>
            ) : (
              <>
                <span>
                  🌊{" "}
                  {t("seasonDuring", "Сезон в разгаре! Осталось")}{" "}
                  <span className="font-extrabold text-white bg-white/20 px-1.5 py-0.5 rounded-md mx-0.5 tabular-nums">
                    {seasonData.daysLeft}
                  </span>{" "}
                  {daysWord}
                </span>
                <span className="font-bold">
                  — {t("seasonHurry", "лучшие номера уходят!")}
                </span>
              </>
            )}

            <Link
              href="/booking"
              className="inline-flex items-center gap-1 ml-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <CalendarDays className="h-3 w-3" />
              {t("selectDates", "Выбрать даты")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Season shimmer keyframe injected via style tag */}
      <style jsx>{`
        @keyframes season-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
