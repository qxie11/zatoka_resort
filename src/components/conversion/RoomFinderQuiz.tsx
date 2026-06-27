"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, RefreshCw, Star, Users, Check, Sparkles } from "lucide-react";
import type { Room } from "@/lib/types";

interface RoomFinderQuizProps {
  rooms: Room[];
  lang: string;
}

type QuizStep = "intro" | "company" | "preference" | "duration" | "result";

export default function RoomFinderQuiz({ rooms, lang }: RoomFinderQuizProps) {
  const [step, setStep] = useState<QuizStep>("intro");
  const [answers, setAnswers] = useState({
    company: "",
    preference: "",
    duration: "",
  });
  const [recommendation, setRecommendation] = useState<Room | null>(null);

  const t = {
    ru: {
      introTitle: "Найдите свой идеальный номер",
      introDesc: "Ответьте на 3 простых вопроса, и мы подберем лучший номер для вашего незабываемого отдыха у моря.",
      startBtn: "Начать подбор",
      nextBtn: "Далее",
      backBtn: "Назад",
      restartBtn: "Начать заново",
      bookBtn: "Забронировать этот номер",
      matchingRooms: "Ваш идеальный выбор:",
      bestMatch: "Рекомендация отеля",
      stepOf: "Шаг",
      outOf: "из 3",
      
      // Question 1
      q1Title: "С кем вы планируете отдых?",
      q1Romantic: "Романтический отдых вдвоем",
      q1Family: "Семейный отпуск с детьми",
      q1Friends: "Компания друзей или коллег",
      q1Solo: "Один / Деловая поездка",

      // Question 2
      q2Title: "Что для вас важнее всего?",
      q2Yard: "Тишина и зеленый двор",
      q2Kitchen: "Своя кухня или терраса",
      q2Space: "Максимум пространства и комфорта",
      q2Budget: "Лучшая цена / Экономия",

      // Question 3
      q3Title: "Длительность вашего визита?",
      q3Short: "Короткие выходные (1-3 ночи)",
      q3Long: "Неделя или больше (от 4 ночей)",
    },
    uk: {
      introTitle: "Знайдіть свій ідеальний номер",
      introDesc: "Дайте відповідь на 3 простих запитання, і ми підберемо найкращий номер для вашого незабутнього відпочинку біля моря.",
      startBtn: "Почати підбір",
      nextBtn: "Далі",
      backBtn: "Назад",
      restartBtn: "Почати спочатку",
      bookBtn: "Забронювати цей номер",
      matchingRooms: "Ваш ідеальний вибір:",
      bestMatch: "Рекомендація готелю",
      stepOf: "Крок",
      outOf: "з 3",

      // Question 1
      q1Title: "З ким ви плануєте відпочинок?",
      q1Romantic: "Романтичний відпочинок удвох",
      q1Family: "Сімейна відпустка з дітьми",
      q1Friends: "Компанія друзів або колег",
      q1Solo: "Один / Ділова поїздка",

      // Question 2
      q2Title: "Що для вас найважливіше?",
      q2Yard: "Тиша та зелене подвір'я",
      q2Kitchen: "Своя кухня або тераса",
      q2Space: "Максимум простору та комфорту",
      q2Budget: "Краща ціна / Економія",

      // Question 3
      q3Title: "Тривалість вашого візиту?",
      q3Short: "Короткі вихідні (1-3 ночі)",
      q3Long: "Тиждень або більше (від 4 ночей)",
    },
    en: {
      introTitle: "Find Your Perfect Room",
      introDesc: "Answer 3 quick questions, and we will find the ideal match for your unforgettable seaside holiday.",
      startBtn: "Start Quiz",
      nextBtn: "Next",
      backBtn: "Back",
      restartBtn: "Retake Quiz",
      bookBtn: "Book This Room Now",
      matchingRooms: "Your Perfect Match:",
      bestMatch: "Best Hotel Match",
      stepOf: "Step",
      outOf: "of 3",

      // Question 1
      q1Title: "Who are you traveling with?",
      q1Romantic: "Romantic getaway for two",
      q1Family: "Family vacation with kids",
      q1Friends: "Group of friends / colleagues",
      q1Solo: "Solo / Business trip",

      // Question 2
      q2Title: "What is your main priority?",
      q2Yard: "Quiet & green yard",
      q2Kitchen: "Private kitchen or terrace",
      q2Space: "Maximum space & comfort",
      q2Budget: "Best price / budget-friendly",

      // Question 3
      q3Title: "How long is your stay?",
      q3Short: "Short weekend (1-3 nights)",
      q3Long: "One week or longer (4+ nights)",
    }
  };

  const current = t[lang as keyof typeof t] || t.ru;

  const handleAnswer = (field: "company" | "preference" | "duration", value: string, nextStep: QuizStep) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
    
    if (nextStep === "result") {
      calculateRecommendation(newAnswers);
    } else {
      setStep(nextStep);
    }
  };

  const calculateRecommendation = (finalAnswers: typeof answers) => {
    if (!rooms || rooms.length === 0) return;

    let filtered = [...rooms];

    // 1. Capacity filter based on company
    if (finalAnswers.company === "family") {
      filtered = filtered.filter(r => r.capacity >= 3);
    } else if (finalAnswers.company === "friends") {
      filtered = filtered.filter(r => r.capacity >= 4);
    } else if (finalAnswers.company === "solo" || finalAnswers.company === "romantic") {
      filtered = filtered.filter(r => r.capacity <= 3);
    }

    // If we filtered out too many, fall back to all rooms
    if (filtered.length === 0) filtered = [...rooms];

    // 2. Preferences filter
    if (finalAnswers.preference === "yard") {
      const yardRooms = filtered.filter(r => 
        r.description.toLowerCase().includes("террас") || 
        r.description.toLowerCase().includes("балкон") ||
        r.description.toLowerCase().includes("terrace") ||
        r.description.toLowerCase().includes("balcony")
      );
      if (yardRooms.length > 0) filtered = yardRooms;
    } else if (finalAnswers.preference === "kitchen") {
      const kitchenRooms = filtered.filter(r => 
        r.description.toLowerCase().includes("кухн") || 
        r.description.toLowerCase().includes("kitchen")
      );
      if (kitchenRooms.length > 0) filtered = kitchenRooms;
    } else if (finalAnswers.preference === "budget") {
      // Sort by price ascending
      filtered.sort((a, b) => a.price - b.price);
    } else if (finalAnswers.preference === "space") {
      // Sort by capacity descending
      filtered.sort((a, b) => b.capacity - a.capacity);
    }

    // Select the first recommended room
    setRecommendation(filtered[0] || rooms[0]);
    setStep("result");
  };

  const resetQuiz = () => {
    setAnswers({ company: "", preference: "", duration: "" });
    setRecommendation(null);
    setStep("intro");
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl glass-card-dark border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Visual decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* STEP: INTRO */}
      {step === "intro" && (
        <div className="text-center space-y-6 py-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 px-3 py-1.5 rounded-full text-xs font-semibold text-teal-300 uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>Интерактивный Помощник</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {current.introTitle}
          </h3>
          <p className="text-slate-300 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
            {current.introDesc}
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => setStep("company")} 
              className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold px-8 py-6 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              {current.startBtn}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP: COMPANY */}
      {step === "company" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>{current.stepOf} 1 {current.outOf}</span>
            <span className="text-teal-400">33%</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 border border-white/5">
            <div className="bg-teal-400 h-1.5 rounded-full transition-all duration-300" style={{ width: "33%" }}></div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">{current.q1Title}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "romantic", text: current.q1Romantic },
              { id: "family", text: current.q1Family },
              { id: "friends", text: current.q1Friends },
              { id: "solo", text: current.q1Solo },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAnswer("company", opt.id, "preference")}
                className="p-5 rounded-2xl bg-slate-950/40 border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-left text-sm md:text-base font-medium text-slate-200 hover:text-white transition-all active:scale-[0.98] focus:outline-none flex justify-between items-center group"
              >
                <span>{opt.text}</span>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-start">
            <Button onClick={() => setStep("intro")} variant="ghost" className="text-slate-200 hover:!text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> {current.backBtn}
            </Button>
          </div>
        </div>
      )}

      {/* STEP: PREFERENCE */}
      {step === "preference" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>{current.stepOf} 2 {current.outOf}</span>
            <span className="text-teal-400">66%</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 border border-white/5">
            <div className="bg-teal-400 h-1.5 rounded-full transition-all duration-300" style={{ width: "66%" }}></div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">{current.q2Title}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "yard", text: current.q2Yard || (lang === "uk" ? "Тиша та зелене подвір'я" : lang === "en" ? "Quiet & green yard" : "Тишина и зеленый двор") },
              { id: "kitchen", text: current.q2Kitchen || (lang === "uk" ? "Своя кухня або тераса" : lang === "en" ? "Private kitchen or terrace" : "Своя кухня или терраса") },
              { id: "space", text: current.q2Space },
              { id: "budget", text: current.q2Budget },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAnswer("preference", opt.id, "duration")}
                className="p-5 rounded-2xl bg-slate-950/40 border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-left text-sm md:text-base font-medium text-slate-200 hover:text-white transition-all active:scale-[0.98] focus:outline-none flex justify-between items-center group"
              >
                <span>{opt.text}</span>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-start">
            <Button onClick={() => setStep("company")} variant="ghost" className="text-slate-200 hover:!text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> {current.backBtn}
            </Button>
          </div>
        </div>
      )}

      {/* STEP: DURATION */}
      {step === "duration" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>{current.stepOf} 3 {current.outOf}</span>
            <span className="text-teal-400">90%</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 border border-white/5">
            <div className="bg-teal-400 h-1.5 rounded-full transition-all duration-300" style={{ width: "90%" }}></div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">{current.q3Title}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "short", text: current.q3Short },
              { id: "long", text: current.q3Long },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAnswer("duration", opt.id, "result")}
                className="p-5 rounded-2xl bg-slate-950/40 border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-left text-sm md:text-base font-medium text-slate-200 hover:text-white transition-all active:scale-[0.98] focus:outline-none flex justify-between items-center group"
              >
                <span>{opt.text}</span>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-start">
            <Button onClick={() => setStep("preference")} variant="ghost" className="text-slate-200 hover:!text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> {current.backBtn}
            </Button>
          </div>
        </div>
      )}

      {/* STEP: RESULT */}
      {step === "result" && recommendation && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>{current.bestMatch}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white">{current.matchingRooms}</h3>
          </div>

          {/* Recommended Room Card */}
          <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden bg-slate-950/40 border border-white/10 shadow-2xl hover:border-teal-400/30 transition-all duration-300">
            <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto min-h-[220px]">
              <Image
                src={recommendation.imageUrl}
                alt={recommendation.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h4 className="text-xl font-black text-white">{recommendation.name}</h4>
                <p className="text-xs text-slate-400 font-light line-clamp-3 leading-relaxed">
                  {recommendation.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-teal-400" /> {recommendation.capacity} чел.</span>
                  <span className="text-teal-300 text-sm font-bold">{recommendation.price} UAH / ночь</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <Button asChild className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold rounded-xl py-5">
                  <Link href={`/${lang}/booking/${recommendation.slug}`}>
                    {current.bookBtn}
                  </Link>
                </Button>
                <Button onClick={resetQuiz} variant="ghost" className="w-full text-slate-200 hover:!text-white hover:bg-white/10 rounded-xl flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {current.restartBtn}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
