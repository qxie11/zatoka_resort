"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import OceanSceneClient from "@/components/three/OceanSceneClient";
import FeaturedRooms from "@/components/rooms/FeaturedRooms";
import GuestImpressions from "@/components/home/GuestImpressions";
import { Users, Minus, Plus, CalendarDays, Loader2 } from "lucide-react";
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
  Eye,
  User,
  Phone,
  Send,
  CheckCircle2,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { Room } from "@/lib/types";
import { amenities } from "@/lib/data";
import i18n from "@/lib/i18n";
import SeasideStatusWidget from "@/components/conversion/SeasideStatusWidget";
import RoomFinderQuiz from "@/components/conversion/RoomFinderQuiz";
import BackgroundBubbles from "@/components/decorative/BackgroundBubbles";
import HomeFAQ from "@/components/home/HomeFAQ";

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
  "Бесплатный Wi-Fi": "wifi",
  "Кондиционер": "pool",
  "Уютная общая кухня": "restaurant",
  "Зона барбекю / Мангал": "roomService",
  "Детская площадка": "spa",
  "Парковка": "parking",
};

interface HomeClientProps {
  rooms: Room[];
  lang: string;
}

export default function HomeClient({ rooms, lang }: HomeClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [, setLangUpdate] = useState(i18n.language);

  const [heroCbName, setHeroCbName] = useState("");
  const [heroCbPhone, setHeroCbPhone] = useState("");
  const [heroCbLoading, setHeroCbLoading] = useState(false);
  const [heroCbSuccess, setHeroCbSuccess] = useState(false);
  const [heroCbError, setHeroCbError] = useState("");

  const handleHeroCbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroCbPhone.trim()) {
      setHeroCbError(translate("phoneRequired", "Укажите номер телефона"));
      return;
    }
    setHeroCbLoading(true);
    setHeroCbError("");
    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: heroCbName || "Гость с сайта (Главный экран)",
          phone: heroCbPhone,
          message: "Быстрый запрос подбора свободных номеров с первого экрана сайта",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setHeroCbSuccess(true);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-16858169999/callback",
        });
      }
    } catch {
      setHeroCbError(translate("callbackError", "Ошибка отправки. Попробуйте еще раз."));
    } finally {
      setHeroCbLoading(false);
    }
  };

  const widgetForm = useForm({
    defaultValues: {
      dateRange: { from: undefined, to: undefined },
      guests: 1,
    },
  });

  const dateRange = widgetForm.watch("dateRange");
  const isFormValid = dateRange?.from && dateRange?.to;

  const onWidgetSubmit = (data: any) => {
    setIsSearching(true);
    const params = new URLSearchParams();
    if (data.dateRange?.from) {
      params.set("checkin", data.dateRange.from.toISOString());
    }
    if (data.dateRange?.to) {
      params.set("checkout", data.dateRange.to.toISOString());
    }
    params.set("guests", data.guests.toString());
    router.push(`/${lang}/booking?${params.toString()}`);
  };

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
    const val = t(key);
    return val && val !== key ? val : fallback;
  };

  return (
    <div className="flex flex-col min-h-dvh bg-slate-950 text-slate-100">
      <div className="flex-1">
        <section className="relative w-full min-h-[95vh] lg:min-h-screen flex items-center overflow-hidden bg-slate-950 py-16 lg:py-0">
          <OceanSceneClient />

          {/* Glowing Radial Background Flares */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none z-[6] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none z-[6]" />

          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30 pointer-events-none z-[8]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60 pointer-events-none z-[8]" />

          {/* Underwater light rays */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[7]">
            <div className="absolute top-0 left-[15%] w-28 h-full bg-gradient-to-b from-teal-300/10 via-sky-300/5 to-transparent skew-x-12 animate-light-ray" />
            <div className="absolute top-0 left-[38%] w-20 h-full bg-gradient-to-b from-sky-200/8 via-teal-300/3 to-transparent skew-x-6 animate-light-ray" style={{ animationDelay: '2s' }} />
            <div className="absolute top-0 right-[22%] w-24 h-full bg-gradient-to-b from-teal-400/8 via-transparent to-transparent -skew-x-8 animate-light-ray" style={{ animationDelay: '4s' }} />
          </div>

          {/* Swimming fish layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[7]">
            <svg
              className="absolute animate-fish w-7 h-5 text-teal-300/50 fill-current"
              style={{ top: '25%', '--fish-duration': '32s', '--fish-delay': '3s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
            <svg
              className="absolute animate-fish-2 w-9 h-6 text-sky-300/40 fill-current"
              style={{ top: '58%', '--fish-duration': '45s', '--fish-delay': '8s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
            <svg
              className="absolute animate-fish w-5 h-4 text-teal-200/40 fill-current"
              style={{ top: '75%', '--fish-duration': '25s', '--fish-delay': '15s' } as React.CSSProperties}
              viewBox="0 0 40 24"
            >
              <path d="M30,12 C30,12 40,6 40,12 C40,18 30,12 30,12 Z M5,12 C5,12 0,6 5,12 C5,18 10,22 20,20 C28,18 30,14 30,12 C30,10 28,6 20,4 C10,2 5,6 5,12 Z M8,11 C8,10 9,9 10,9 C11,9 12,10 12,11 C12,12 11,13 10,13 C9,13 8,12 8,11 Z" />
            </svg>
          </div>

          <div className="relative container mx-auto px-4 lg:px-8 z-10 w-full pt-28 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* LEFT COLUMN: Hero Copy & Command Booking Bar */}
              <div className="lg:col-span-7 flex flex-col items-start text-left text-white space-y-5 sm:space-y-6 lg:space-y-7">

                {/* Live Status Glass Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-teal-500/40 text-[11px] sm:text-xs font-extrabold text-teal-300 tracking-wider shadow-[0_0_25px_rgba(20,184,166,0.25)] animate-fade-in">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
                  </span>
                  <span className="uppercase">{translate("familyBadge", `Сезон ${new Date().getFullYear()} • 5 минут до Чёрного Моря`)}</span>
                </div>

                {/* Heading */}
                <h1 className="text-[2rem] sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] sm:leading-[1.1] animate-fade-in-up drop-shadow-2xl font-heading">
                  {translate("heroTitle1", "Уютный летний отдых")}{" "}
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 animate-ocean-shimmer font-black drop-shadow-md">
                    {translate("heroTitle2", "для всей вашей семьи")}
                  </span>
                </h1>

                {/* Subtitle / Description - NOW VISIBLE ON MOBILE */}
                <p className="text-sm sm:text-lg text-slate-200/95 font-medium leading-snug sm:leading-relaxed max-w-xl animate-fade-in-up [animation-delay:0.15s] opacity-0 [animation-fill-mode:forwards]">
                  {translate("heroDescription", "Семейный отель «Zatoka Resort». Зелёный двор, детская площадка, зона барбекю, Wi-Fi и бесплатная парковка. Всего 5 минут ходьбы до моря!")}
                </p>

                {/* Feature Micro-Pills - NOW VISIBLE ON MOBILE */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 animate-fade-in-up [animation-delay:0.25s] opacity-0 [animation-fill-mode:forwards]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 border border-teal-500/30 text-[11px] sm:text-xs font-semibold text-teal-300 backdrop-blur-md shadow-sm">
                    🌴 {translate("heroPill1", "Зелёный двор")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-[11px] sm:text-xs font-semibold text-amber-300 backdrop-blur-md shadow-sm">
                    🔥 {translate("heroPill2", "Мангалы")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 border border-rose-500/30 text-[11px] sm:text-xs font-semibold text-rose-300 backdrop-blur-md shadow-sm">
                    🧸 {translate("heroPill3", "Детям")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 border border-sky-500/30 text-[11px] sm:text-xs font-semibold text-sky-300 backdrop-blur-md shadow-sm">
                    🌊 {translate("heroPill4", "5 мин до моря")}
                  </span>
                </div>

                {/* Floating Command Glass Booking Bar */}
                <div className="w-full pt-1 sm:pt-4 animate-fade-in-up [animation-delay:0.35s] opacity-0 [animation-fill-mode:forwards] z-20 relative">
                  <Form {...widgetForm}>
                    <form
                      onSubmit={widgetForm.handleSubmit(onWidgetSubmit)}
                      className="relative overflow-hidden grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-row gap-3.5 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-teal-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-400/50 transition-all duration-500 items-stretch xl:items-end w-full group/bar"
                    >
                      {/* Animated Loading Bar */}
                      {isSearching && (
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-950 overflow-hidden z-30">
                          <div className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-sky-400 animate-pulse w-full" />
                        </div>
                      )}
                      <div className="w-full md:col-span-1 xl:flex-1 min-w-0 relative group/field">
                        <FormField
                          control={widgetForm.control}
                          name="dateRange"
                          render={({ field }) => (
                            <DateRangePicker
                              value={field.value}
                              onChange={field.onChange}
                              label={translate("checkInOut", "Заезд / Выезд")}
                            />
                          )}
                        />
                      </div>

                      <FormField
                        control={widgetForm.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem className="flex flex-col relative w-full md:col-span-1 xl:w-36">
                            <div className="text-teal-300 font-bold mb-2 flex items-center gap-1.5 tracking-wide text-xs uppercase">
                              <Users className="h-3.5 w-3.5 text-teal-400" />
                              {translate("guests", "Гости")}
                            </div>
                            <FormControl>
                              <div className="flex items-center justify-between bg-slate-950/90 border border-white/15 hover:border-teal-400/40 focus-within:border-teal-400 rounded-xl h-12 px-3.5 w-full transition-all duration-300 shadow-inner">
                                <button
                                  type="button"
                                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition-all duration-300 active:scale-90"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-lg font-black select-none text-white tracking-widest min-w-[18px] text-center">
                                  {field.value}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => field.onChange(Math.min(10, field.value + 1))}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition-all duration-300 active:scale-90"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={!isFormValid || isSearching}
                        className="w-full md:col-span-2 xl:w-auto h-12 px-6 sm:px-8 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-black border-0 shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-xs whitespace-nowrap shrink-0"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="h-4 w-4 text-slate-950 animate-spin shrink-0" />
                            <span>{translate("checkingAvailability", "Проверяем...")}</span>
                          </>
                        ) : (
                          <>
                            <Sun className="h-4 w-4 fill-slate-950 shrink-0" />
                            <span>{translate("checkAvailability", "Найти номера")}</span>
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>

                {/* Trust Guarantees - Grid on mobile */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 pt-1 animate-fade-in-up [animation-delay:0.45s] opacity-0 [animation-fill-mode:forwards] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 w-full">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-2 rounded-xl border border-teal-500/25 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{translate("trustBadge1", "Отмена за 7 дней")}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-2 rounded-xl border border-amber-500/25 shadow-sm">
                    <CreditCard className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{translate("trustBadge2", "Оплата при заезде")}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-2 rounded-xl border border-sky-500/25 shadow-sm">
                    <Star className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{translate("trustBadge3", "Гарантия лучшей цены")}</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive Feedback & Quick Room Selection Form */}
              <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center animate-fade-in-up [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards] select-none mt-8 lg:mt-0">
                
                {/* Outer Glow Halo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/25 via-sky-500/25 to-amber-500/15 rounded-[2.5rem] blur-3xl transform scale-95 animate-pulse" />

                {/* Main Glass Form Card */}
                <div className="relative w-full max-w-[440px] rounded-[2.2rem] overflow-hidden border-[2px] border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.8)] bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 text-white transition-all duration-500 hover:border-teal-400/40">
                  
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-sky-400 to-amber-400" />

                  {/* Admin status & Rating header */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      {translate("adminOnline", "Администратор Виктор онлайн")}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 / 5.0</span>
                      <span className="text-[10px] text-slate-400 font-medium">(120+)</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug mb-5">
                    {translate("heroFormTitle", "Быстрый подбор свободного номера")}
                  </h3>

                  {heroCbSuccess ? (
                    <div className="py-8 text-center space-y-3 animate-fade-in">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-white">{translate("heroFormSuccessTitle", "Спасибо за заявку!")}</h4>
                      <p className="text-xs text-slate-300 max-w-xs mx-auto">
                        {translate("heroFormSuccessDesc", "Администратор Виктор свяжется с вами в течение 5 минут для уточнения свободных мест.")}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleHeroCbSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                          {translate("yourName", "Ваше имя")}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={heroCbName}
                            onChange={(e) => setHeroCbName(e.target.value)}
                            placeholder={translate("namePlaceholder", "Александр")}
                            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                          {translate("yourPhone", "Номер телефона")} <span className="text-teal-400">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                          <input
                            type="tel"
                            required
                            value={heroCbPhone}
                            onChange={(e) => setHeroCbPhone(e.target.value)}
                            placeholder="+380 (__) ___-__-__"
                            className="w-full bg-slate-950/80 border border-teal-500/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                          />
                        </div>
                      </div>

                      {heroCbError && (
                        <p className="text-xs text-rose-400 font-medium text-center">{heroCbError}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={heroCbLoading}
                        className="w-full h-12 bg-gradient-to-r from-teal-500 via-sky-500 to-teal-400 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {heroCbLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{translate("sending", "Отправляем...")}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-center">
                            <Send className="w-4 h-4" />
                            <span>{translate("heroFormBtn", "Получить варианты номеров")}</span>
                          </div>
                        )}
                      </Button>

                      {/* Guarantees footer */}
                      <div className="pt-2 flex items-center justify-around text-[11px] text-slate-400 border-t border-white/10 mt-4">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {translate("noSpam", "Без спама")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {translate("noPrepay", "0% предоплаты")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {translate("seaDistShort", "5 мин до моря")}
                        </span>
                      </div>
                    </form>
                  )}
                </div>

              </div>

            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-24 md:h-32 opacity-15 z-[9]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-[200%] h-full fill-teal-300 animate-wave-flow">
              <path d="M0,60 C300,20 600,100 900,60 C1200,20 1500,100 1800,60 C2100,20 2400,100 2700,60 L2700,120 L0,120 Z" />
            </svg>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-[200%] h-full fill-sky-300 animate-wave-flow-slow opacity-60">
              <path d="M0,80 C300,40 600,120 900,80 C1200,40 1500,120 1800,80 C2100,40 2400,120 2700,80 L2700,120 L0,120 Z" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[9] pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* WELCOME SECTION */}
        <section className="py-12 md:py-16 relative overflow-hidden bg-slate-950">
          {/* Bubbles */}
          <BackgroundBubbles count={12} deepCount={8} />

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

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 text-left space-y-6">
                <ScrollReveal variant="fade-up">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-xs font-semibold text-teal-300 uppercase tracking-widest mb-2">
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
                  <p className="mt-6 text-slate-300 text-lg font-light leading-relaxed">
                    {translate("welcomeDesc", 'Расположенный на безмятежном побережье Черного моря, "Отдых в Затоке" предлагает идеальное сочетание роскоши, комфорта и природной красоты. Ищете ли вы романтический уик-энд или семейное приключение, наш отель — ваше идеальное место для незабываемого отдыха.')}
                  </p>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-5 w-full">
                <ScrollReveal variant="scale-in" delay={300}>
                  <SeasideStatusWidget lang={i18n.language} />
                </ScrollReveal>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
          <BackgroundBubbles count={10} deepCount={5} />
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
                  titleFallback: "5 минут до пляжа",
                  descKey: "whyBeachDesc",
                  descFallback: "Первая береговая линия — выходите из номера и через минуту вы на песчаном пляже.",
                  gradient: "from-sky-400/20 to-teal-400/20",
                  iconColor: "text-sky-400",
                },
                {
                  icon: CreditCard,
                  titleKey: "whyPayment",
                  titleFallback: "Оплата при заезде",
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
                    <div className="relative p-6 rounded-3xl border-shimmer-card group h-full overflow-hidden">
                      {/* Subtle premium hover gradient glow */}
                      <div className="absolute -inset-px bg-gradient-to-br from-teal-500/10 via-transparent to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl -z-10" />
                      <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${item.gradient} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-7 w-7 ${item.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{translate(item.titleKey, item.titleFallback)}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{translate(item.descKey, item.descFallback)}</p>
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

        {/* ROOM FINDER QUIZ SECTION */}
        <section className="py-16 bg-slate-950 relative overflow-hidden">
          <BackgroundBubbles count={8} deepCount={4} />
          <div className="container mx-auto px-4 relative z-10">
            <RoomFinderQuiz rooms={rooms} lang={lang} />
          </div>
        </section>

        {/* FEATURED ROOMS SECTION */}
        <section id="rooms" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
          <BackgroundBubbles count={12} deepCount={6} />
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
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-slate-950">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* HOTEL AMENITIES */}
        <section className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
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

          <BackgroundBubbles count={10} deepCount={6} />

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
                <WavyUnderline colorClassName='text-teal-300' />
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={200}>
                <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
                  {translate("hotelAmenitiesDesc", "Всё, что вам может понадобиться для безупречного и беззаботного отпуска у моря.")}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center stagger-children">
              {amenities.map((amenity, index) => {
                const Icon = iconMap[amenity.icon];
                const translationKey = amenityKeyMap[amenity.name] || "";
                const displayName = translationKey ? translate(translationKey, amenity.name) : amenity.name;
                const descKey = translationKey ? `${translationKey}Desc` : "";
                const displayDesc = descKey ? translate(descKey, amenity.description || "") : (amenity.description || "");

                return (
                  <ScrollReveal key={amenity.name} variant="scale-in" delay={index * 80}>
                    <div className="relative flex flex-col items-center p-6 rounded-3xl border-shimmer-card marine-3d-card group h-full overflow-hidden">
                      {/* Hover background glow */}
                      <div className="absolute -inset-px bg-gradient-to-br from-teal-500/10 via-transparent to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl -z-10" />
                      <div className="bg-teal-500/10 p-5 rounded-2xl transition-smooth hover:bg-teal-500/25 relative group/icon text-teal-300 marine-3d-card-inner">
                        {Icon && <Icon className="h-8 w-8 text-teal-400 transition-smooth group-hover/icon:animate-coral-sway glow-teal" />}
                        <div className="absolute inset-0 rounded-2xl bg-teal-500/5 opacity-0 group-hover/icon:opacity-100 group-hover/icon:animate-water-ripple transition-opacity" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-white marine-3d-card-inner">{displayName}</h3>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed font-light text-center marine-3d-card-inner">{displayDesc}</p>
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

        {/* FAQ SECTION */}
        <HomeFAQ lang={i18n.language} />

        {/* BOTTOM CTA */}
        <section className="py-12 md:py-16 bg-slate-950 text-white relative overflow-hidden">
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

          <BackgroundBubbles count={12} deepCount={6} />

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
                  <Link href={`/${lang}/booking`} className="flex items-center">
                    {translate("bookNowBtn", "Забронировать номер сейчас")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </div>
  );
}
