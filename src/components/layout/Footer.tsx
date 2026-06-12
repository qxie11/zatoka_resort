"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Waves, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Extract lang prefix from pathname
  const segments = pathname?.split("/") || [];
  const currentLang = ["ru", "uk", "en"].includes(segments[1]) ? segments[1] : "ru";

  const getLocalizedHref = (href: string) => {
    if (href === "/") return `/${currentLang}`;
    return `/${currentLang}${href}`;
  };

  return (
    <footer className="relative bg-slate-950 text-slate-100 overflow-hidden">
      {/* Animated wave top border */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-3 opacity-40">
        <svg viewBox="0 0 2400 12" preserveAspectRatio="none" className="w-[200%] h-full animate-foam fill-teal-400/50">
          <path d="M0,6 C60,2 120,10 180,6 C240,2 300,10 360,6 C420,2 480,10 540,6 C600,2 660,10 720,6 C780,2 840,10 900,6 C960,2 1020,10 1080,6 C1140,2 1200,10 1260,6 C1320,2 1380,10 1440,6 C1500,2 1560,10 1620,6 C1680,2 1740,10 1800,6 C1860,2 1920,10 1980,6 C2040,2 2100,10 2160,6 C2220,2 2280,10 2340,6 C2400,2 2400,10 2400,6 L2400,12 L0,12 Z" />
        </svg>
      </div>

      {/* Background bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="bubble-particle"
            style={{
              left: `${i * 18 + 4}%`,
              width: `${4 + (i % 3) * 4}px`,
              height: `${4 + (i % 3) * 4}px`,
              '--bubble-duration': `${10 + i * 3}s`,
              '--bubble-delay': `${i * 2}s`,
              '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 25}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <Link href={getLocalizedHref("/")} className="flex items-center gap-2 mb-4 group">
              <Waves className="h-6 w-6 text-teal-400 group-hover:animate-coral-sway glow-teal" />
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 group-hover:animate-ocean-shimmer">
                {t("brandName")}
              </span>
            </Link>
            <p className="text-slate-300 text-sm font-light">
              {currentLang === "ru" 
                ? "Ваш безмятежный морской отдых на побережье Черного моря."
                : currentLang === "uk"
                ? "Ваш безтурботний морський відпочинок на узбережжі Чорного моря."
                : "Your serene seaside getaway on the Black Sea coast."}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
             <div>
                <h3 className="font-bold text-white mb-4">
                  {currentLang === "ru" ? "Быстрые ссылки" : currentLang === "uk" ? "Швидкі посилання" : "Quick Links"}
                </h3>
                <ul className="space-y-2">
                    <li><Link href={getLocalizedHref("/")} className="text-sm text-slate-300 hover:text-teal-300 transition-colors">{t("home")}</Link></li>
                    <li><Link href={getLocalizedHref("/about")} className="text-sm text-slate-300 hover:text-teal-300 transition-colors">{t("about")}</Link></li>
                    <li><Link href={getLocalizedHref("/booking")} className="text-sm text-slate-300 hover:text-teal-300 transition-colors">{t("booking")}</Link></li>
                    <li><Link href={getLocalizedHref("/blog")} className="text-sm text-slate-300 hover:text-teal-300 transition-colors">{t("blog")}</Link></li>
                </ul>
             </div>
             <div>
                <h3 className="font-bold text-white mb-4">
                  {currentLang === "ru" ? "Контакты" : currentLang === "uk" ? "Контакти" : "Contacts"}
                </h3>
                <ul className="space-y-2 text-sm text-slate-300 font-light">
                    <li>
                      {currentLang === "en" ? "42, Zolotoy Bereg blvd" : "бульвар Золотой Берег, 42"}
                    </li>
                    <li>
                      {currentLang === "ru" 
                        ? "Затока, Одесская область, 67772"
                        : currentLang === "uk"
                        ? "Затока, Одеська область, 67772"
                        : "Zatoka, Odesa region, 67772"}
                    </li>
                    <li>contact@zatokagetaway.com</li>
                </ul>
             </div>
          </div>
          <div className="md:ml-auto">
             <h3 className="font-bold text-white mb-4">
               {currentLang === "ru" ? "Следите за нами" : currentLang === "uk" ? "Стежте за нами" : "Follow Us"}
             </h3>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="text-slate-300 hover:text-teal-300 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 hover:glow-teal">
                    <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="text-slate-300 hover:text-teal-300 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110">
                    <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="text-slate-300 hover:text-teal-300 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110">
                    <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                </Button>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 font-light">
              &copy; {new Date().getFullYear()} {t("brandName")}. {currentLang === "ru" ? "Все права защищены." : currentLang === "uk" ? "Всі права захищені." : "All rights reserved."}
            </p>
            {/* Decorative animated waves line */}
            <div className="flex items-center gap-1 mt-4 md:mt-0 opacity-30">
              {[...Array(5)].map((_, i) => (
                <Waves
                  key={i}
                  className="h-3 w-3 text-teal-400 animate-float"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
