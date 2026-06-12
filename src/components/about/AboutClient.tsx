"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell, Compass, Star, Anchor } from "lucide-react";
import type { LucideProps } from 'lucide-react';
import { WavyUnderline } from '@/components/ui/wavy-underline';
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
  Dumbbell
};

// Map amenity names to their translation keys
const amenityKeyMap: { [key: string]: { name: string; desc: string } } = {
  "Бассейн": { name: "pool", desc: "poolDesc" },
  "Бесплатный Wi-Fi": { name: "wifi", desc: "wifiDesc" },
  "Ресторан": { name: "restaurant", desc: "restaurantDesc" },
  "Частный пляж": { name: "privateBeach", desc: "privateBeachDesc" },
  "Спа и оздоровление": { name: "spa", desc: "spaDesc" },
  "Парковка": { name: "parking", desc: "parkingDesc" },
  "Обслуживание номеров": { name: "roomService", desc: "roomServiceDesc" },
  "Фитнес-центр": { name: "fitness", desc: "fitnessDesc" },
};

const teamMembers = [
  { name: 'Олена Петренко', roleKey: 'roleGM', roleDefault: 'Генеральный менеджер', imageId: 'staff-1' },
  { name: 'Михайло Коваль', roleKey: 'roleConcierge', roleDefault: 'Начальник консьерж-службы', imageId: 'staff-2' },
  { name: 'Андрій Шевченко', roleKey: 'roleChef', roleDefault: 'Шеф-повар', imageId: 'staff-3' },
];

interface AboutClientProps {
  lang: string;
}

export default function AboutClient({ lang }: AboutClientProps) {
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

  const translate = (key: string, fallback: string) => {
    if (!mounted) return fallback;
    return t(key);
  };

  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* HEADER SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1683459285195-2bff6b201b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Seaside background"
            fill
            className="object-cover scale-105 animate-float-slow opacity-80 brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Floating animated accents */}
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
          <div className="absolute bottom-1/3 right-12 animate-current" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 100 60" className="h-24 w-24 text-teal-300 fill-current">
              <path d="M10 30 C 25 15, 55 15, 70 30 C 80 25, 88 20, 95 15 C 92 25, 92 35, 95 45 C 88 40, 80 35, 70 30 C 55 45, 25 45, 10 30 Z M30 25 A 3 3 0 1 0 30 25.1" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-[15%] animate-float-slow opacity-15" style={{ animationDelay: '4s' }}>
            <Anchor className="h-16 w-16 text-sky-200" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 text-center z-10 flex flex-col items-center">
          {/* Premium Micro-Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in mb-6">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>{translate("aboutService", "Премиум сервис у моря")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md animate-fade-in-up py-2 px-1">
            {translate("aboutTitle", "Создавая незабываемый отдых")}
          </h1>
          <WavyUnderline colorClassName="text-teal-300" />
          <p className="mt-6 max-w-2xl mx-auto text-slate-200 text-lg md:text-xl font-light leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            {translate("aboutDesc", 'Откройте для себя историю, страсть и людей, которые делают "Отдых в Затоке" уникальным местом на побережье Черного моря.')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-20 lg:py-28 relative bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white animate-fade-in-up">
                {translate("ourStory", "Наша история")}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-sky-500 rounded-full" />
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {translate("storyDesc1", 'Основанный в 2010 году, "Отдых в Затоке" родился из мечты создать оазис спокойствия и роскоши в одном из самых красивых прибрежных городов Украины.')}
              </p>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {translate("storyDesc2", "За годы мы выросли из небольшого очаровательного гостевого дома в полноценный отель, но наше стремление предоставлять личный, теплый и гостеприимный опыт никогда не ослабевало.")}
              </p>
            </div>
            
            <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-2xl group hover:border-teal-400/50 transition-all duration-500">
              {aboutImage && (
                <Image 
                  src={aboutImage.imageUrl} 
                  alt={aboutImage.description}
                  fill
                  className="object-cover transition-smooth group-hover:scale-105"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VALUES */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 animate-float">
            <Waves className="h-40 w-40 text-teal-300/20" />
          </div>
          <div className="absolute bottom-10 left-10 animate-float-slow" style={{ animationDelay: "2s" }}>
            <Waves className="h-32 w-32 text-sky-300/20" />
          </div>
          <div className="absolute top-1/3 left-1/3 animate-float opacity-10" style={{ animationDelay: '3s' }}>
            <Anchor className="h-28 w-28 text-teal-400" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            <div className="p-8 md:p-10 rounded-3xl glass-card-dark shadow-xl border border-white/10 space-y-4 hover-lift transition-smooth hover:border-teal-400/40">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 mb-4 shadow-inner">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{translate("ourMission", "Наша миссия")}</h2>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {translate("missionDesc", "Предоставлять исключительный опыт гостеприимства на берегу моря, сочетая роскошь, комфорт и индивидуальное обслуживание, создавая незабываемые воспоминания для каждого гостя.")}
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-3xl glass-card-dark shadow-xl border border-white/10 space-y-4 hover-lift transition-smooth hover:border-amber-400/40">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-4 shadow-inner">
                <Sun className="h-6 w-6" />
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
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 lg:py-28 bg-slate-950">
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
              return (
                <div key={member.name} className="flex flex-col items-center text-center p-8 rounded-3xl glass-card-dark border border-white/10 shadow-2xl hover-lift transition-smooth group hover:border-teal-400/50">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 border-4 border-slate-800 shadow-md group-hover:border-teal-400/50 transition-colors">
                    {memberImage && (
                      <Image
                        src={memberImage.imageUrl}
                        alt={`Portrait ${member.name}`}
                        fill
                        className="object-cover transition-smooth group-hover:scale-110"
                        data-ai-hint={memberImage.imageHint}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-teal-300 font-medium mt-1">{translate(member.roleKey, member.roleDefault)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section className="py-20 lg:py-28 bg-slate-900/50 border-t border-slate-900 relative overflow-hidden">
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
      </section>
    </div>
  );
}
