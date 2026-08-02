"use client";

import { useState, useEffect } from "react";
import { 
  Waves, 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Anchor, 
  Compass, 
  ChevronRight,
  Sun,
  Thermometer,
  Sunset
} from "lucide-react";
import { FaViber, FaTelegramPlane } from "react-icons/fa";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { GreanBeamLogo } from "./Header";

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [weather, setWeather] = useState({
    temp: 26,
    seaTemp: 22,
    waveHeight: "0.2м",
  });

  // Extract lang prefix from pathname
  const segments = pathname?.split("/") || [];
  const currentLang = ["ru", "uk", "en"].includes(segments[1]) ? segments[1] : "ru";

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.temp === "number") {
          setWeather(data);
        }
      })
      .catch((err) => console.error("Error fetching weather in footer:", err));
  }, []);

  const getLocalizedHref = (href: string) => {
    if (href === "/") return `/${currentLang}`;
    return `/${currentLang}${href}`;
  };

  return (
    <footer className="relative overflow-hidden pt-20 pb-8 mt-10">
      
      {/* ── Background & Ambient Glows ── */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl z-0 border-t border-white/5" />
      <div className="absolute bottom-0 left-[-10%] w-[50%] h-[80%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-0 right-[-10%] w-[40%] h-[60%] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      
      {/* Multi-layered Wave Transition on Top (Optional subtle hint) */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-12 z-10 select-none opacity-40">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-slate-950">
          <path d="M0,50 C300,10 600,90 900,50 C1050,30 1125,40 1200,50 L1200,120 L0,120 Z" className="opacity-30 fill-teal-500" />
          <path d="M0,70 C300,30 600,110 900,70 C1050,50 1125,60 1200,70 L1200,120 L0,120 Z" className="opacity-20 fill-sky-400" />
        </svg>
      </div>

      {/* Floating Maritime Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.02]">
        <div className="absolute bottom-[20%] left-[8%] animate-float">
          <Anchor className="h-32 w-32 text-white stroke-[0.5]" />
        </div>
        <div className="absolute top-[25%] right-[10%] animate-float-slow" style={{ animationDelay: "3s" }}>
          <Compass className="h-40 w-40 text-white stroke-[0.3]" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        {/* ── Main Footer Content ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          
          {/* Brand & Description Column */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            <Link href={getLocalizedHref("/")} className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.2)] transition-all duration-500 flex items-center justify-center">
                <GreanBeamLogo scrolled={true} className="h-6 w-6" />
              </div>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-100 to-emerald-400 tracking-tight drop-shadow-sm">
                {t("brandName")}
              </span>
            </Link>
            <p className="text-slate-400/90 text-sm font-light leading-relaxed max-w-sm">
              {t("footerDesc")}
            </p>
            
            {/* Social & Messenger Icons */}
            <div className="flex items-center gap-3 pt-4">
              <a
                href="viber://chat?number=%2B380669212275"
                aria-label="Viber"
                className="group relative flex items-center justify-center h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:text-[#7360F2] hover:border-[#7360F2]/40 hover:shadow-[0_8px_20px_rgba(115,96,242,0.25)]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#7360F2]/10 to-[#7360F2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaViber className="h-5 w-5 z-10 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="https://t.me/+380669212275"
                aria-label="Telegram"
                className="group relative flex items-center justify-center h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:text-[#2AABEE] hover:border-[#2AABEE]/40 hover:shadow-[0_8px_20px_rgba(42,171,238,0.25)]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#2AABEE]/10 to-[#2AABEE]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaTelegramPlane className="h-5 w-5 z-10 transition-transform duration-300 group-hover:scale-110 -ml-0.5" />
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white">
              {t("navigation")}
            </h3>
            <ul className="space-y-4">
              {[
                { name: t("home"), href: "/" },
                { name: t("about"), href: "/about" },
                { name: t("booking"), href: "/booking" },
                { name: t("blog"), href: "/blog" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={getLocalizedHref(link.href)} 
                    className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-out flex items-center">
                      <ChevronRight className="h-3 w-3 text-teal-400" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 ease-out">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts Column */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white">
              {t("contacts")}
            </h3>
            <ul className="space-y-5 text-sm text-slate-400 font-light">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0">
                  <MapPin className="h-4 w-4 text-teal-400" />
                </div>
                <div className="flex flex-col mt-0.5">
                  <span className="text-slate-200">{t("address")}</span>
                  <span className="text-xs text-slate-500 mt-1">{t("region")}</span>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0 group-hover:bg-white/10 transition-colors">
                  <Mail className="h-4 w-4 text-sky-400" />
                </div>
                <a href="mailto:zatokahotelresort@gmail.com" className="text-slate-300 group-hover:text-white transition-colors">
                  zatokahotelresort@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0 group-hover:bg-white/10 transition-colors">
                  <Phone className="h-4 w-4 text-amber-400" />
                </div>
                <a href="tel:+380669212275" className="text-slate-300 group-hover:text-white transition-colors font-medium">
                  +380 66 921 22 75
                </a>
              </li>
            </ul>
          </div>

          {/* Live Sea & Weather Widget */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              {t("blackSeaLive")}
            </h3>
            
            {/* Premium Glassmorphic Weather Widget */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <ul className="space-y-4 text-sm relative z-10">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                    <Sun className="h-4.5 w-4.5 text-amber-400" />
                    <span>{t("airTemp")}</span>
                  </div>
                  <strong className="text-white font-bold text-base">+{weather.temp}°C</strong>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                    <Thermometer className="h-4.5 w-4.5 text-teal-400" />
                    <span>{t("seaTemp")}</span>
                  </div>
                  <strong className="text-teal-300 font-bold text-base">+{weather.seaTemp}°C</strong>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                    <Waves className="h-4.5 w-4.5 text-sky-400" />
                    <span>{t("wavesHeight")}</span>
                  </div>
                  <strong className="text-white font-bold">{weather.waveHeight}</strong>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                    <Sunset className="h-4.5 w-4.5 text-purple-400" />
                    <span>{t("sunset")}</span>
                  </div>
                  <strong className="text-purple-300 font-bold">20:46</strong>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[11px] text-teal-200/80 font-medium leading-relaxed italic">
                  &quot;{t("tipOfDay")}&quot;
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer Bottom / Copyright ── */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium tracking-wide text-center md:text-left">
            &copy; {new Date().getFullYear()} {t("brandName")}. {t("allRightsReserved")}
          </p>
          
          {/* Decorative Wave Indicators */}
          <div className="flex items-center gap-2 opacity-30 select-none">
            {[...Array(5)].map((_, i) => (
              <Waves
                key={i}
                className="h-3.5 w-3.5 text-teal-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
