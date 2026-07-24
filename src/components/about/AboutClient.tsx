"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell,
  Dumbbell, Compass, Star, Anchor, Users, Trophy, Milestone, Award,
  Sparkles
} from "lucide-react";
import type { LucideProps } from 'lucide-react';
import { WavyUnderline } from '@/components/ui/wavy-underline';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { amenities } from "@/lib/data";
import i18n from "@/lib/i18n";
import BackgroundBubbles from "@/components/decorative/BackgroundBubbles";
import BackgroundFishes from "@/components/decorative/BackgroundFishes";
import GoogleMapComponent from "@/app/[lang]/booking/components/GoogleMapComponent";

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Waves,
  Wifi,
  UtensilsCrossed,
  Sun,
  HeartPulse,
  Car,
  ConciergeBell,
  Dumbbell
};

const amenityKeyMap: { [key: string]: { name: string; desc: string } } = {
  "Бесплатный Wi-Fi": { name: "wifi", desc: "wifiDesc" },
  "Кондиционер": { name: "pool", desc: "poolDesc" },
  "Уютная общая кухня": { name: "restaurant", desc: "restaurantDesc" },
  "Зона барбекю / Мангал": { name: "roomService", desc: "roomServiceDesc" },
  "Детская площадка": { name: "spa", desc: "spaDesc" },
  "Парковка": { name: "parking", desc: "parkingDesc" },
};

const teamMembers = [
  { name: 'Владимир Петренко', nameUk: 'Володимир Петренко', nameEn: 'Vladimir Petrenko', roleKey: 'roleGM', roleDefault: 'Владелец гостевого дома', imageId: 'staff-1', quote: '«Создаем уют и заботу в каждой детали вашего отдыха»' },
  { name: 'Михаил Коваль', nameUk: 'Михайло Коваль', nameEn: 'Mikhail Koval', roleKey: 'roleConcierge', roleDefault: 'Администратор двора', imageId: 'staff-2', quote: '«Ваш комфорт — наш главный приоритет 24/7»' },
  { name: 'Андрей Шевченко', nameUk: 'Андрій Шевченко', nameEn: 'Andrey Shevchenko', roleKey: 'roleChef', roleDefault: 'Помощник по хозяйству', imageId: 'staff-3', quote: '«Свежие вкусы и домашняя кухня в авторском исполнении»' },
];

const timelineEvents = [
  { year: "2016", ru: "Основание гостевого дома", uk: "Заснування гостьового будинку", en: "Guesthouse foundation" },
  { year: "2021", ru: "Обустройство зеленой зоны и детской площадки", uk: "Облаштування зеленої зони та дитячого майданчика", en: "Green yard & playground addition" },
  { year: "2026", ru: "Полное обновление и новый уровень комфорта", uk: "Повне оновлення та новий рівень комфорту", en: "Full room update & new comfort level" },
];

interface AboutClientProps {
  lang: string;
}

export default function AboutClient({ lang }: AboutClientProps) {
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

  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us');

  // Multi-language labels
  const L = {
    beach: { ru: "5 минут", uk: "5 хвилин", en: "5 minutes" },
    beachDesc: { ru: "Пешком до песчаного пляжа", uk: "Пішки до піщаного пляжу", en: "Walk to the sandy beach" },
    rooms: { ru: "30 номеров", uk: "30 номерів", en: "30 rooms" },
    roomsDesc: { ru: "Различных категорий комфорта", uk: "Різних категорій комфорту", en: "Different comfort options" },
    guests: { ru: "10k+ гостей", uk: "10k+ гостей", en: "10k+ guests" },
    guestsDesc: { ru: "Доверили нам свой отдых", uk: "Довірили нам свій відпочинок", en: "Trusted us with their vacation" },
    years: { ru: "10 лет", uk: "10 років", en: "10 years" },
    yearsDesc: { ru: "Опыта гостеприимства у моря", uk: "Досвіду гостинності біля моря", en: "Of hospitality by the sea" },
    history: { ru: "История развития", uk: "Історія розвитку", en: "Our History Timeline" },
  };

  const handleScrollDown = () => {
    const nextSec = document.getElementById("stats-section");
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const heroTranslations = {
    ru: {
      badge: "О нас",
      title1: "Создавая",
      title2: "незабываемый отдых",
      desc: "Узнайте историю нашего гостеприимства и философию идеального отпуска у моря, где каждая деталь имеет значение.",
      card1Title: "С любовью",
      card1Desc: "к каждому гостю",
      card2Title: "Идеальный климат",
    },
    uk: {
      badge: "Про нас",
      title1: "Створюючи",
      title2: "незабутній відпочинок",
      desc: "Дізнайтеся історію нашої гостинності та філософію ідеальної відпустки біля моря, де кожна деталь має значення.",
      card1Title: "З любов'ю",
      card1Desc: "до кожного гостя",
      card2Title: "Ідеальний клімат",
    },
    en: {
      badge: "About Us",
      title1: "Crafting",
      title2: "unforgettable stays",
      desc: "Discover the story of our hospitality and the philosophy of a perfect seaside vacation, where every detail matters.",
      card1Title: "With Love",
      card1Desc: "to every guest",
      card2Title: "Perfect Climate",
    }
  };
  const langKey = (lang || "ru") as "ru" | "uk" | "en";
  const tHero = heroTranslations[langKey] || heroTranslations.ru;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">

      {/* --- PREMIUM SPLIT HERO HEADER --- */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-slate-950 pt-20">
        <BackgroundBubbles count={15} />
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000"
            alt="Resort background"
            fill
            className="object-cover scale-105 animate-float-slow opacity-50"
            priority
          />
          {/* Gradient fade to right to allow text on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center h-full pt-10 pb-20">
          
          <div className="flex flex-col items-start text-left animate-fade-in-up space-y-8 max-w-xl">
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-md">
              <Compass className="h-4 w-4" />
              <span>{tHero.badge}</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight [text-shadow:_0_10px_40px_rgb(0_0_0_/_80%)]">
              <span className="block mb-2">{tHero.title1}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400 drop-shadow-sm">
                {tHero.title2}
              </span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
              {tHero.desc}
            </p>
          </div>
          
          {/* Decorative Right Area */}
          <div className="hidden lg:flex flex-col justify-center items-end gap-6 relative h-full">
             <div className="glass-card-dark p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float-slow max-w-sm w-full backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <HeartPulse className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{tHero.card1Title}</h3>
                    <p className="text-slate-400 text-sm">{tHero.card1Desc}</p>
                  </div>
                </div>
             </div>
             
             <div className="glass-card-dark p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float max-w-[250px] w-full backdrop-blur-xl mr-12 delay-150">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{tHero.card2Title}</h3>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60 hover:opacity-100 cursor-pointer z-30" onClick={handleScrollDown}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-px">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-24 fill-slate-950 scale-x-[-1]">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- STATS COUNTER GRID --- */}
      <section id="stats-section" className="relative pt-12 pb-24 z-30 scroll-mt-20 overflow-hidden bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

            <div className="glass-card-dark border border-teal-500/25 p-6 rounded-3xl bg-slate-950/80 backdrop-blur-md flex flex-col items-center text-center shadow-[0_4px_30px_rgba(20,184,166,0.1)] hover:border-teal-400 transition-all">
              <Waves className="h-8 w-8 text-teal-400 mb-2.5 animate-pulse" />
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{L.beach[lang as keyof typeof L.beach]}</span>
              <span className="text-xs md:text-sm text-slate-400 font-light mt-1">{L.beachDesc[lang as keyof typeof L.beachDesc]}</span>
            </div>

            <div className="glass-card-dark border border-teal-500/25 p-6 rounded-3xl bg-slate-950/80 backdrop-blur-md flex flex-col items-center text-center shadow-[0_4px_30px_rgba(20,184,166,0.1)] hover:border-teal-400 transition-all">
              <Compass className="h-8 w-8 text-sky-400 mb-2.5" />
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{L.rooms[lang as keyof typeof L.rooms]}</span>
              <span className="text-xs md:text-sm text-slate-400 font-light mt-1">{L.roomsDesc[lang as keyof typeof L.roomsDesc]}</span>
            </div>

            <div className="glass-card-dark border border-teal-500/25 p-6 rounded-3xl bg-slate-950/80 backdrop-blur-md flex flex-col items-center text-center shadow-[0_4px_30px_rgba(20,184,166,0.1)] hover:border-teal-400 transition-all">
              <Users className="h-8 w-8 text-amber-400 mb-2.5" />
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{L.guests[lang as keyof typeof L.guests]}</span>
              <span className="text-xs md:text-sm text-slate-400 font-light mt-1">{L.guestsDesc[lang as keyof typeof L.guestsDesc]}</span>
            </div>

            <div className="glass-card-dark border border-teal-500/25 p-6 rounded-3xl bg-slate-950/80 backdrop-blur-md flex flex-col items-center text-center shadow-[0_4px_30px_rgba(20,184,166,0.1)] hover:border-teal-400 transition-all">
              <Trophy className="h-8 w-8 text-orange-400 mb-2.5" />
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{L.years[lang as keyof typeof L.years]}</span>
              <span className="text-xs md:text-sm text-slate-400 font-light mt-1">{L.yearsDesc[lang as keyof typeof L.yearsDesc]}</span>
            </div>

          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-24 lg:py-32 relative bg-slate-950 overflow-hidden">
        <BackgroundBubbles count={10} deepCount={4} />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="order-2 lg:order-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-mono">
                <Sparkles className="h-3.5 w-3.5" /> Наследие и традиции
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {translate("ourStory", "Наша история")}
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-teal-400 to-sky-500 rounded-full" />
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {translate("storyDesc1", 'Основанный в 2010 году, "Отдых в Затоке" родился из мечты создать оазис спокойствия и роскоши в одном из самых красивых прибрежных городов Украины.')}
              </p>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {translate("storyDesc2", "За годы мы выросли из небольшого очаровательного гостевого дома в полноценный отель, но наше стремление предоставлять личный, теплый и гостеприимный опыт никогда не ослабевало.")}
              </p>
            </div>

            <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl group transition-all duration-500 hover:border-teal-400/50">
              {aboutImage && (
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent z-10" />
            </div>

          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-sky-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- TIMELINE HISTORY --- */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2.5">
              <Milestone className="h-6 w-6 text-teal-400" />
              {L.history[lang as keyof typeof L.history]}
            </h2>
            <div className="h-1 w-16 bg-teal-400 mx-auto mt-4 rounded-full" />
          </div>

          <div className="relative border-l border-teal-500/30 ml-4 md:ml-32 space-y-12">
            {timelineEvents.map((event, idx) => (
              <div key={event.year} className="relative pl-8 md:pl-12 group">
                {/* Year dot indicator */}
                <div className="absolute -left-2 top-1.5 h-4 w-4 rounded-full bg-slate-950 border-2 border-teal-400 group-hover:bg-teal-400 transition-colors z-20 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />

                {/* Desktop Absolute Year display */}
                <span className="hidden md:block absolute -left-28 top-0 text-xl font-extrabold text-teal-400 font-mono tracking-tight">
                  {event.year}
                </span>

                <div className="bg-slate-950/60 border border-white/5 p-6 rounded-2xl group-hover:border-teal-500/20 transition-all hover:bg-slate-950/80">
                  <span className="inline-block md:hidden text-lg font-bold text-teal-300 font-mono mb-2">{event.year}</span>
                  <p className="text-slate-200 text-lg font-light leading-relaxed">
                    {event[lang as keyof typeof event] || event.ru}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- MISSION & VALUES --- */}
      <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden">
        <BackgroundBubbles count={8} deepCount={4} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            <div className="p-8 md:p-10 rounded-3xl glass-card-dark shadow-2xl border border-white/10 space-y-4 hover-lift transition-smooth hover:border-teal-400/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="h-12 w-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 mb-4 shadow-inner">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{translate("ourMission", "Наша миссия")}</h2>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {translate("missionDesc", "Предоставлять исключительный опыт гостеприимства на берегу моря, сочетая роскошь, комфорт и индивидуальное обслуживание, создавая незабываемые воспоминания для каждого гостя.")}
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-3xl glass-card-dark shadow-2xl border border-white/10 space-y-4 hover-lift transition-smooth hover:border-amber-400/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-4 shadow-inner">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{translate("ourValues", "Наши ценности")}</h2>
              <ul className="text-slate-300 space-y-3 font-light text-base md:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1.5 shrink-0">●</span>
                  <span>{translate("valGuest", "Ориентация на гостя: Наши гости находятся в центре всего, что мы делаем.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1.5 shrink-0">●</span>
                  <span>{translate("valExcel", "Превосходность: Мы стремимся к самым высоким стандартам качества и обслуживания.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-1.5 shrink-0">●</span>
                  <span>{translate("valInteg", "Честность: Мы работаем честно и прозрачно.")}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-sky-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden">
        <BackgroundBubbles count={10} deepCount={5} />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {translate("ourTeam", "Наша преданная команда")}
            </h2>
            <WavyUnderline />
            <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
              {translate("teamDesc", "Улыбающиеся лица, стоящие за вашим идеальным отдыхом на море.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => {
              const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
              const displayName = lang === 'uk' ? member.nameUk : lang === 'en' ? member.nameEn : member.name;
              return (
                <div key={member.name} className="flex flex-col items-center text-center p-8 rounded-3xl glass-card-dark border border-white/10 shadow-2xl hover-lift transition-smooth group hover:border-teal-400/50">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 border-4 border-slate-900 shadow-md group-hover:border-teal-400/50 transition-colors">
                    {memberImage && (
                      <Image
                        src={memberImage.imageUrl}
                        alt={`Portrait ${displayName}`}
                        fill
                        className="object-cover transition-smooth group-hover:scale-110"
                        data-ai-hint={memberImage.imageHint}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{displayName}</h3>
                  <p className="text-teal-300 font-semibold mt-1">{translate(member.roleKey, member.roleDefault)}</p>
                  <p className="text-slate-400 text-sm italic font-light mt-4 px-2 line-clamp-2">
                    {member.quote}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- AMENITIES SECTION --- */}
      <section className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {translate("amenitiesServices", "Удобства и услуги")}
            </h2>
            <WavyUnderline colorClassName="text-secondary" />
            <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
              {translate("amenitiesServicesDesc", "Мы предоставляем широкий спектр услуг премиум-класса, чтобы сделать ваше пребывание комфортным и незабываемым.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {amenities.map((amenity) => {
              const Icon = iconMap[amenity.icon];
              const mapKeys = amenityKeyMap[amenity.name];
              const displayName = mapKeys ? translate(mapKeys.name, amenity.name) : amenity.name;
              const displayDesc = mapKeys ? translate(mapKeys.desc, amenity.description) : amenity.description;

              return (
                <div key={amenity.name} className="flex items-start gap-4 p-6 rounded-2xl glass-card-dark border border-white/10 hover:border-teal-400/50 transition-smooth hover:-translate-y-0.5 shadow-md">
                  <div className="bg-teal-500/10 text-teal-400 p-3.5 rounded-2xl shrink-0">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{displayName}</h3>
                    <p className="text-slate-300 text-sm font-light leading-relaxed">{displayDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-sky-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* --- ATTRACTIONS MAP SECTION --- */}
      <section className="py-24 lg:py-32 bg-slate-950/40 relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-heading">
              {translate("attractionsTitle", "Окрестности & Достопримечательности")}
            </h2>
            <WavyUnderline colorClassName="text-teal-400" />
            <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
              {translate("attractionsDesc", "Исследуйте самые интересные места рядом с Zatoka Resort: от песчаных пляжей и лимана до старинной крепости и центра культуры вина.")}
            </p>
          </div>

          <div className="relative z-30 shadow-2xl">
            <GoogleMapComponent showAttractions={true} lang={lang} />
          </div>
        </div>
      </section>
    </div>
  );
}
