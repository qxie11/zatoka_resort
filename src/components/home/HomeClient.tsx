"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import OceanSceneClient from "@/components/three/OceanSceneClient";
import FeaturedRooms from "@/components/rooms/FeaturedRooms";
import GuestImpressions from "@/components/home/GuestImpressions";
import {
  ArrowRight,
  Waves,
  Wifi,
  UtensilsCrossed,
  Sun,
  HeartPulse,
  Car,
  ConciergeBell,
  Dumbbell,
  Star,
  MapPin,
  ShieldCheck,
  Anchor,
  Compass,
  Umbrella,
  XCircle,
  CreditCard,
  Baby,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { Room } from "@/lib/types";
import { amenities } from "@/lib/data";
import i18n from "@/lib/i18n";

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Waves,
  Wifi,
  UtensilsCrossed,
  Sun,
  HeartPulse,
  Car,
  ConciergeBell,
  Dumbbell,
};

// Map amenity names to their translation keys
const amenityKeyMap: { [key: string]: string } = {
  "Бассейн": "pool",
  "Бесплатный Wi-Fi": "wifi",
  "Ресторан": "restaurant",
  "Частный пляж": "privateBeach",
  "Спа и оздоровление": "spa",
  "Парковка": "parking",
  "Обслуживание номеров": "roomService",
  "Фитнес-центр": "fitness",
};

interface HomeClientProps {
  rooms: Room[];
}

export default function HomeClient({ rooms }: HomeClientProps) {
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

  // Use a fallback flag to prevent hydration mismatch for localized strings
  const translate = (key: string, fallback: string) => {
    if (!mounted) return fallback;
    return t(key);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-slate-950 text-slate-100">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-slate-900 py-16 lg:py-0">
          <OceanSceneClient />

          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent pointer-events-none z-[8]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none z-[8]" />

          {/* Underwater light rays */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[7]">
            <div className="absolute top-0 left-[15%] w-24 h-full bg-gradient-to-b from-teal-300/5 via-sky-300/3 to-transparent skew-x-12 animate-light-ray" />
            <div className="absolute top-0 left-[35%] w-16 h-full bg-gradient-to-b from-sky-200/4 via-teal-300/2 to-transparent skew-x-6 animate-light-ray" style={{ animationDelay: '2s' }} />
            <div className="absolute top-0 right-[20%] w-20 h-full bg-gradient-to-b from-teal-400/4 via-transparent to-transparent -skew-x-8 animate-light-ray" style={{ animationDelay: '4s' }} />
          </div>

          {/* Swimming fish layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[7]">
            <svg
              className="absolute animate-fish w-6 h-4 text-teal-300/40 fill-current"
              style={{ top: '28%', '--fish-duration': '32s', '--fish-delay': '3s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
            <svg
              className="absolute animate-fish-2 w-8 h-5 text-sky-300/35 fill-current"
              style={{ top: '62%', '--fish-duration': '45s', '--fish-delay': '8s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
            <svg
              className="absolute animate-fish w-4 h-3 text-teal-200/30 fill-current"
              style={{ top: '78%', '--fish-duration': '25s', '--fish-delay': '15s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <svg className="absolute animate-seagull w-8 h-8 text-white/20 fill-current" viewBox="0 0 24 24">
              <path d="M12,6.5C11,7.5 9.5,9 7,9C4.5,9 2.5,7.5 1.5,6.5C1,6 0.5,6.5 1,7C2,8 4,10.5 7,10.5C10,10.5 11.5,9 12,8C12.5,9 14,10.5 17,10.5C20,10.5 22,8 23,7C23.5,6.5 23,6 22.5,6.5C21.5,7.5 19.5,9 17,9C14.5,9 13,7.5 12,6.5Z" />
            </svg>
          </div>

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
          </div>

          <div className="relative container mx-auto px-4 lg:px-8 z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* LEFT COLUMN: Premium Copy & Interactive Quick CTA */}
              <div className="lg:col-span-7 flex flex-col items-start text-left text-white space-y-6">
                
                {/* Premium Micro-Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in">
                  <Compass className="h-4 w-4 animate-spin-slow" />
                  <span>{translate("premiumBadge", "Премиум курорт на Черном море")}</span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-up drop-shadow-2xl">
                  {translate("heroTitle1", "Ваш идеальный")} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md animate-ocean-shimmer">
                    {translate("heroTitle2", "морской побег")}
                  </span> <br />
                  {translate("heroTitle3", "в Затоке")}
                </h1>

                {/* Description */}
                <p className="max-w-xl text-base md:text-lg text-slate-100 font-medium leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards] drop-shadow-lg">
                  {translate("heroDescription", "Испытайте несравненный пятизвездочный комфорт, ласковые волны и захватывающие дух панорамные виды на Черное море.")}
                </p>

                {/* Quick Interactive Reservation Panel */}
                <div className="w-full max-w-lg p-5 rounded-2xl glass-card-dark shadow-2xl border border-white/10 animate-fade-in-up [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">{translate("firstLine", "Первая линия")}</div>
                        <div>{translate("beachDistance", "10м до пляжа")}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">{translate("security", "Безопасность")}</div>
                        <div>{translate("securedArea", "Охраняемая зона")}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button asChild size="lg" className="w-full sm:flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 water-reflection">
                      <Link href="/booking" className="flex items-center justify-center">
                        {translate("bookStay", "Забронировать отдых")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                      <Link href="/about">{translate("learnMore", "Узнать больше")}</Link>
                    </Button>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                      <span>{translate("trustBadge1", "Отмена за 7 дней")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-3.5 w-3.5 text-amber-400" />
                      <span>{translate("trustBadge2", "Оплата на месте")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
                      <span>{translate("trustBadge3", "Лучшая цена")}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-in-up [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
                <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl group hover:border-teal-400/50 transition-all duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                    alt="Luxury Seaside Dining"
                    fill
                    className="object-cover transition-all duration-[10s] group-hover:scale-110 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Floating Premium Rating Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-card-premium text-slate-900 border border-white/40 shadow-xl transition-all duration-300 group-hover:translate-y-[-5px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{translate("guestRating", "Рейтинг гостей")}</p>
                        <p className="text-sm font-extrabold text-slate-950">{translate("excellent", "Превосходно")}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-400 px-2.5 py-1 rounded-lg text-slate-950 font-bold text-sm">
                        <Star className="h-4 w-4 fill-slate-950" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra Floating Badge */}
                <div className="absolute -top-4 -right-4 p-4 rounded-2xl glass-card-dark text-white border border-white/10 shadow-xl animate-jellyfish hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-400/20 flex items-center justify-center">
                      <Waves className="h-5 w-5 text-teal-300" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">{translate("waterTemp", "Температура воды")}</p>
                      <p className="text-sm font-extrabold text-white">+24°C</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-24 md:h-32 opacity-15 z-10">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-[200%] h-full fill-teal-300 animate-wave-flow">
              <path d="M0,60 C300,20 600,100 900,60 C1200,20 1500,100 1800,60 C2100,20 2400,100 2700,60 L2700,120 L0,120 Z" />
            </svg>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-[200%] h-full fill-sky-300 animate-wave-flow-slow opacity-60">
              <path d="M0,80 C300,40 600,120 900,80 C1200,40 1500,120 1800,80 C2100,40 2400,120 2700,80 L2700,120 L0,120 Z" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* WELCOME SECTION */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          {/* Bubbles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="bubble-particle"
                style={{
                  left: `${i * 8.5 + 2}%`,
                  width: `${(i % 3) * 6 + 6}px`,
                  height: `${(i % 3) * 6 + 6}px`,
                  '--bubble-duration': `${(i % 4) * 4 + 9}s`,
                  '--bubble-delay': `${(i % 6) * 1.2}s`,
                  '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * (i * 7 + 15)}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="deep-particle"
                style={{
                  left: `${i * 13 + 5}%`,
                  width: `${3 + (i % 3)}px`,
                  height: `${3 + (i % 3)}px`,
                  '--bubble-duration': `${6 + i * 1.5}s`,
                  '--bubble-delay': `${i * 0.8}s`,
                  '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 20}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-5 animate-current">
              <Waves className="h-32 w-32 text-teal-400/20" />
            </div>
            <div className="absolute bottom-1/4 right-8 animate-current" style={{ animationDelay: '2s' }}>
              <svg viewBox="0 0 100 60" className="h-32 w-32 text-sky-400/20 fill-current">
                <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
              </svg>
            </div>
            <div className="absolute top-1/4 left-1/3 animate-float-slow opacity-15" style={{ animationDelay: '1s' }}>
              <Anchor className="h-20 w-20 text-teal-300/30" />
            </div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollReveal variant="fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-xs font-semibold text-teal-300 uppercase tracking-widest mb-4">
                <span>{translate("exclusiveService", "Эксклюзивный сервис")}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="tide-in" delay={100}>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {translate("welcomeTitle", 'Добро пожаловать в "Отдых в Затоке"')}
              </h2>
              <WavyUnderline colorClassName='text-teal-300' />
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={200}>
              <p className="mt-6 max-w-3xl mx-auto text-slate-300 text-lg md:text-xl font-light leading-relaxed">
                {translate("welcomeDesc", 'Расположенный на безмятежном побережье Черного моря, "Отдых в Затоке" предлагает идеальное сочетание роскоши, комфорта и природной красоты. Ищете ли вы романтический уик-энд или семейное приключение, наш отель — ваше идеальное место для незабываемого отдыха.')}
              </p>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <ScrollReveal variant="fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-xs font-semibold text-teal-300 uppercase tracking-widest mb-4">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{translate("whyChooseBadge", "Ваши гарантии")}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="tide-in" delay={100}>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {translate("whyChooseTitle", "Почему выбирают нас")}
                </h2>
                <WavyUnderline colorClassName="text-teal-300" />
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={200}>
                <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
                  {translate("whyChooseDesc", "Бронируйте без рисков — мы делаем всё, чтобы ваш отдых был идеальным.")}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Umbrella,
                  titleKey: "whyBeach",
                  titleFallback: "10 метров до пляжа",
                  descKey: "whyBeachDesc",
                  descFallback: "Первая береговая линия — выходите из номера и через минуту вы на песчаном пляже.",
                  gradient: "from-sky-400/20 to-teal-400/20",
                  iconColor: "text-sky-400",
                },
                {
                  icon: CreditCard,
                  titleKey: "whyPayment",
                  titleFallback: "Оплата на месте",
                  descKey: "whyPaymentDesc",
                  descFallback: "Никакой предоплаты. Оплачивайте при заселении — наличными или картой.",
                  gradient: "from-amber-400/20 to-orange-400/20",
                  iconColor: "text-amber-400",
                },
                {
                  icon: XCircle,
                  titleKey: "whyCancel",
                  titleFallback: "Бесплатная отмена",
                  descKey: "whyCancelDesc",
                  descFallback: "Планы изменились? Отмените бронирование за 7 дней без каких-либо штрафов.",
                  gradient: "from-teal-400/20 to-emerald-400/20",
                  iconColor: "text-teal-400",
                },
                {
                  icon: Baby,
                  titleKey: "whyFamily",
                  titleFallback: "Идеально для семей",
                  descKey: "whyFamilyDesc",
                  descFallback: "Детская площадка, мелководье, семейные номера — всё для комфортного отдыха с детьми.",
                  gradient: "from-rose-400/20 to-pink-400/20",
                  iconColor: "text-rose-400",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.titleKey} variant="scale-in" delay={index * 100}>
                    <div className="relative p-6 rounded-3xl glass-card-dark border border-white/10 hover:border-teal-400/30 transition-all duration-500 group h-full">
                      <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${item.gradient} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-7 w-7 ${item.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{translate(item.titleKey, item.titleFallback)}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{translate(item.descKey, item.descFallback)}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* FEATURED ROOMS SECTION */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
            <svg
              className="absolute animate-fish w-10 h-6 text-teal-900/60 fill-current"
              style={{ top: '45%', '--fish-duration': '55s', '--fish-delay': '5s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
            <div className="absolute top-1/4 left-10 animate-current" style={{ animationDelay: '4s' }}>
              <svg viewBox="0 0 100 60" className="h-36 w-36 text-teal-400/10 fill-current scale-x-[-1]">
                <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <ScrollReveal variant="fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-4">
                  <span>{translate("perfectComfort", "Идеальный комфорт")}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="tide-in" delay={100}>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {translate("featuredRooms", "Наши избранные номера")}
                </h2>
                <WavyUnderline />
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={200}>
                <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
                  {translate("featuredRoomsDesc", "Элегантно оформленные номера и роскошные люксы для вашего максимального расслабления.")}
                </p>
              </ScrollReveal>
            </div>
            <FeaturedRooms rooms={rooms} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-900">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* HOTEL AMENITIES */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-teal-500/5 animate-jellyfish pointer-events-none" />
          <div className="absolute bottom-20 left-5 w-40 h-40 rounded-full bg-sky-500/5 animate-jellyfish pointer-events-none" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 right-12 animate-current opacity-10 pointer-events-none" style={{ animationDelay: '1s' }}>
            <svg viewBox="0 0 100 60" className="h-40 w-40 text-teal-400/20 fill-current">
              <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 left-12 animate-float-slow opacity-10 pointer-events-none" style={{ animationDelay: '3s' }}>
            <Anchor className="h-24 w-24 text-sky-300/30" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="bubble-particle"
                style={{
                  left: `${i * 13 + 3}%`,
                  width: `${5 + (i % 4) * 3}px`,
                  height: `${5 + (i % 4) * 3}px`,
                  '--bubble-duration': `${10 + i * 2}s`,
                  '--bubble-delay': `${i * 1.5}s`,
                  '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * 30}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <ScrollReveal variant="fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-xs font-semibold text-teal-300 uppercase tracking-widest mb-4">
                  <span>{translate("allInclusive", "Всё включено")}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="tide-in" delay={100}>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {translate("hotelAmenities", "Удобства отеля")}
                </h2>
                <WavyUnderline colorClassName='text-teal-300'/>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={200}>
                <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
                  {translate("hotelAmenitiesDesc", "Всё, что вам может понадобиться для безупречного и беззаботного отпуска у моря.")}
                </p>
              </ScrollReveal>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger-children">
              {amenities.slice(0, 8).map((amenity, index) => {
                const Icon = iconMap[amenity.icon];
                const translationKey = amenityKeyMap[amenity.name] || "";
                const displayName = translationKey ? translate(translationKey, amenity.name) : amenity.name;

                return (
                  <ScrollReveal key={amenity.name} variant="scale-in" delay={index * 80}>
                    <div className="flex flex-col items-center p-6 rounded-3xl glass-card-dark border border-white/10 marine-3d-card hover:bg-slate-900/60 hover:border-teal-400/50 hover:shadow-2xl transition-all duration-500 group h-full">
                      <div className="bg-teal-500/10 p-5 rounded-2xl transition-smooth hover:bg-teal-500/25 relative group/icon text-teal-300 marine-3d-card-inner">
                        {Icon && <Icon className="h-8 w-8 text-teal-400 transition-smooth group-hover/icon:animate-coral-sway glow-teal" />}
                        <div className="absolute inset-0 rounded-2xl bg-teal-500/5 opacity-0 group-hover/icon:opacity-100 group-hover/icon:animate-water-ripple transition-opacity" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-white marine-3d-card-inner">{displayName}</h3>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* GUEST IMPRESSIONS */}
        <GuestImpressions />

        {/* BOTTOM CTA */}
        <section className="py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 z-0">
            <Image
              src="https://images.unsplash.com/photo-1683459285195-2bff6b201b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Sunset sea"
              fill
              className="object-cover scale-105 animate-float-slow brightness-[0.3] contrast-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950" />
          </div>
          <div className="absolute bottom-12 left-16 animate-current opacity-10 pointer-events-none" style={{ animationDelay: '3s' }}>
            <svg viewBox="0 0 100 60" className="h-32 w-32 text-sky-400/20 fill-current scale-x-[-1]">
              <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
            </svg>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="bubble-particle"
                style={{
                  left: `${i * 10 + 3}%`,
                  width: `${4 + (i % 5) * 4}px`,
                  height: `${4 + (i % 5) * 4}px`,
                  '--bubble-duration': `${8 + i * 2.5}s`,
                  '--bubble-delay': `${i * 1.1}s`,
                  '--bubble-drift': `${(i % 2 === 0 ? 1 : -1) * (i * 8 + 20)}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 space-y-6">
            <ScrollReveal variant="tide-in">
              <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {translate("readyForHoliday", "Готовы к вашему идеальному отдыху?")}
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={150}>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300 font-light leading-relaxed">
                {translate("bottomCtaDesc", "Берега Затоки зовут. Забронируйте отпуск своей мечты сегодня и создайте воспоминания, которые останутся на всю жизнь.")}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="scale-in" delay={300}>
              <div className="pt-6">
                <Button asChild size="lg" className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all duration-300 h-12 px-8 rounded-xl water-reflection animate-deep-pulse">
                  <Link href="/booking" className="flex items-center">
                    {translate("bookNowBtn", "Забронировать номер сейчас")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </div>
  );
}
