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

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

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
    <footer className="relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-950/40 via-slate-950 to-slate-950 text-slate-100 overflow-hidden border-t border-white/5 pt-16 pb-8">
      
      {/* Multi-layered Wave Transition on Top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-10 z-10 select-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-slate-950">
          <path d="M0,50 C300,10 600,90 900,50 C1050,30 1125,40 1200,50 L1200,120 L0,120 Z" className="opacity-25 fill-teal-400" />
          <path d="M0,70 C300,30 600,110 900,70 C1050,50 1125,60 1200,70 L1200,120 L0,120 Z" className="opacity-15 fill-sky-300" />
        </svg>
      </div>

      {/* Floating Maritime Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.03]">
        <div className="absolute bottom-[20%] left-[8%] animate-float">
          <Anchor className="h-24 w-24 text-teal-400 stroke-[0.5]" />
        </div>
        <div className="absolute top-[25%] right-[10%] animate-float-slow" style={{ animationDelay: "3s" }}>
          <Compass className="h-28 w-28 text-sky-400 stroke-[0.3]" />
        </div>
      </div>

      {/* Background Bubble Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="bubble-particle"
            style={{
              left: `${i * 12 + 6}%`,
              width: `${3 + (i % 3) * 3}px`,
              height: `${3 + (i % 3) * 3}px`,
              '--bubble-duration': `${12 + i * 2.5}s`,
              '--bubble-delay': `${i * 1.5}s`,
              '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 30}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Brand & Description Column */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-5">
            <Link href={getLocalizedHref("/")} className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-teal-500/30 group-hover:bg-teal-500/10 transition-all duration-500 shadow-inner">
                <Waves className="h-6 w-6 text-teal-400 group-hover:animate-coral-sway transition-transform duration-500" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 tracking-wide drop-shadow-[0_2px_10px_rgba(45,212,191,0.15)]">
                {t("brandName")}
              </span>
            </Link>
            <p className="text-slate-300/80 text-sm font-light leading-relaxed max-w-sm">
              {currentLang === "ru" 
                ? "Ваш эксклюзивный оазис комфорта и спокойствия на живописном побережье Черного моря."
                : currentLang === "uk"
                ? "Ваш ексклюзивний оазис комфорту та спокою на мальовничому узбережжі Чорного моря."
                : "Your exclusive oasis of luxury and peace on the picturesque Black Sea coast."}
            </p>
            
            {/* Social Icons with Glowing Backdrops */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" }
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-teal-300 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-[0_0_15px_rgba(45,212,191,0.25)]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-teal-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <social.icon className="h-4.5 w-4.5 z-10 transition-transform duration-300 group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
              {currentLang === "ru" ? "Навигация" : currentLang === "uk" ? "Навігація" : "Navigation"}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t("home"), href: "/" },
                { name: t("about"), href: "/about" },
                { name: t("booking"), href: "/booking" },
                { name: t("blog"), href: "/blog" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={getLocalizedHref(link.href)} 
                    className="group flex items-center text-sm text-slate-300 hover:text-white transition-colors duration-300 font-light"
                  >
                    <ChevronRight className="h-3 w-3 text-teal-400/0 -ml-3 group-hover:text-teal-400/100 group-hover:ml-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              {currentLang === "ru" ? "Контакты" : currentLang === "uk" ? "Контакти" : "Contacts"}
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-300 font-light">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-400/80 shrink-0 mt-0.5" />
                <span>
                  {currentLang === "en" ? "1835 Sadovaya St, Limanskaya Station, Zatoka" : "ул. Садовая, 1835, станция Лиманская, Затока"}
                  <br />
                  <span className="text-xs text-slate-400">
                    {currentLang === "en" ? "Odesa region, Ukraine" : "Одесская область, Украина"}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-sky-400/80 shrink-0" />
                <a href="mailto:zatokahotelresort@gmail.com" className="hover:text-teal-300 transition-colors">
                  zatokahotelresort@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-amber-400/80 shrink-0" />
                <a href="tel:+380482000000" className="hover:text-teal-300 transition-colors">
                  +380 (48) 200-00-00
                </a>
              </li>
            </ul>
          </div>

          {/* Live Sea & Weather Status Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
              {currentLang === "ru" ? "Черное море сейчас" : currentLang === "uk" ? "Чорне море зараз" : "Black Sea Live"}
            </h3>
            
            <ul className="space-y-3.5 text-sm text-slate-300 font-light">
              <li className="flex items-center gap-3">
                <Sun className="h-4.5 w-4.5 text-amber-400/80 shrink-0" />
                <span>
                  {currentLang === "ru" ? "Воздух" : currentLang === "uk" ? "Повітря" : "Air"}:{" "}
                  <strong className="text-white font-medium">+{weather.temp}°C</strong>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Thermometer className="h-4.5 w-4.5 text-teal-400/80 shrink-0" />
                <span>
                  {currentLang === "ru" ? "Вода в море" : currentLang === "uk" ? "Вода в морі" : "Sea Temp"}:{" "}
                  <strong className="text-teal-300 font-medium">+{weather.seaTemp}°C</strong>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Waves className="h-4.5 w-4.5 text-sky-400/80 shrink-0" />
                <span>
                  {currentLang === "ru" ? "Высота волны" : currentLang === "uk" ? "Висота хвилі" : "Waves"}:{" "}
                  <strong className="text-white font-medium">{weather.waveHeight}</strong>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Sunset className="h-4.5 w-4.5 text-purple-400/80 shrink-0" />
                <span>
                  {currentLang === "ru" ? "Закат" : currentLang === "uk" ? "Захід" : "Sunset"}:{" "}
                  <strong className="text-purple-300 font-medium">20:46</strong>
                </span>
              </li>
            </ul>

            <p className="text-xs text-slate-400/80 font-light leading-relaxed italic border-t border-white/5 pt-3">
              {currentLang === "ru" 
                ? "Рекомендация дня: идеальная температура для вечернего купания и сапбордов."
                : currentLang === "uk"
                ? "Рекомендація дня: ідеальна температура для вечірнього купання та сапбордів."
                : "Today's Tip: perfect water temperature for evening swimming & paddleboarding."}
            </p>
          </div>

        </div>

        {/* Footer Bottom / Copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-light tracking-wider text-center md:text-left">
            &copy; {new Date().getFullYear()} {t("brandName")}. {currentLang === "ru" ? "Все права защищены." : currentLang === "uk" ? "Всі права захищені." : "All rights reserved."}
          </p>
          
          {/* Decorative Wave Indicators */}
          <div className="flex items-center gap-1.5 opacity-25 select-none">
            {[...Array(6)].map((_, i) => (
              <Waves
                key={i}
                className="h-3 w-3 text-teal-400 animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
