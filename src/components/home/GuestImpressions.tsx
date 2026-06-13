"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

interface Review {
  id: number;
  name: string;
  nameUk: string;
  nameEn: string;
  text: string;
  textUk: string;
  textEn: string;
  rating: number;
  date: string;
  roomType: string;
  roomTypeUk: string;
  roomTypeEn: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Алина К.",
    nameUk: "Аліна К.",
    nameEn: "Alina K.",
    text: "Прекрасный отель! До моря буквально 10 шагов. Дети в восторге от бассейна, а мы — от заката на террасе. Обязательно вернёмся!",
    textUk: "Чудовий готель! До моря буквально 10 кроків. Діти в захваті від басейну, а ми — від заходу сонця на терасі. Обов'язково повернемось!",
    textEn: "Amazing hotel! The sea is literally 10 steps away. Kids loved the pool, and we enjoyed the sunset from the terrace. Will definitely come back!",
    rating: 5,
    date: "Август 2025",
    roomType: "Семейный номер",
    roomTypeUk: "Сімейний номер",
    roomTypeEn: "Family Room",
  },
  {
    id: 2,
    name: "Дмитрий и Ольга",
    nameUk: "Дмитро та Ольга",
    nameEn: "Dmitry & Olga",
    text: "Отметили годовщину свадьбы в люксе Делюкс. Джакузи, завтрак в номер, панорамный вид — всё было идеально. Спасибо за волшебные выходные!",
    textUk: "Відзначили річницю весілля у люксі Делюкс. Джакузі, сніданок у номер, панорамний вид — все було ідеально. Дякуємо за чарівні вихідні!",
    textEn: "Celebrated our wedding anniversary in the Deluxe Suite. Jacuzzi, room service breakfast, panoramic view — everything was perfect. Thanks for the magical weekend!",
    rating: 5,
    date: "Июль 2025",
    roomType: "Люкс Делюкс",
    roomTypeUk: "Люкс Делюкс",
    roomTypeEn: "Deluxe Suite",
  },
  {
    id: 3,
    name: "Виктор М.",
    nameUk: "Віктор М.",
    nameEn: "Victor M.",
    text: "Чистота, тишина, охраняемая территория. Наконец-то нашли место, где можно спокойно отдохнуть. Персонал очень внимательный. Рекомендую!",
    textUk: "Чистота, тиша, охоронювана територія. Нарешті знайшли місце, де можна спокійно відпочити. Персонал дуже уважний. Рекомендую!",
    textEn: "Cleanliness, quiet, secured territory. Finally found a place where you can truly relax. Staff is very attentive. Highly recommend!",
    rating: 5,
    date: "Сентябрь 2025",
    roomType: "Стандартный номер",
    roomTypeUk: "Стандартний номер",
    roomTypeEn: "Standard Room",
  },
  {
    id: 4,
    name: "Марина С.",
    nameUk: "Марина С.",
    nameEn: "Marina S.",
    text: "Лучший отель в Затоке без преувеличения. Оплатили на месте, без предоплаты — это очень удобно. Ресторан великолепный, особенно рыбные блюда.",
    textUk: "Найкращий готель у Затоці без перебільшення. Оплатили на місці, без передоплати — це дуже зручно. Ресторан чудовий, особливо рибні страви.",
    textEn: "Best hotel in Zatoka, no exaggeration. Paid on arrival, no prepayment — very convenient. The restaurant is excellent, especially the fish dishes.",
    rating: 5,
    date: "Июнь 2025",
    roomType: "Президентский люкс",
    roomTypeUk: "Президентський люкс",
    roomTypeEn: "Presidential Suite",
  },
];

export default function GuestImpressions() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [, setLangUpdate] = useState(i18n.language || "ru");

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

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const translate = (key: string, fallback: string) => {
    if (!mounted) return fallback;
    return t(key);
  };

  const lang = i18n.language || "ru";

  const getReviewText = (review: Review) => {
    if (lang === "uk") return review.textUk;
    if (lang === "en") return review.textEn;
    return review.text;
  };

  const getReviewName = (review: Review) => {
    if (lang === "uk") return review.nameUk;
    if (lang === "en") return review.nameEn;
    return review.name;
  };

  const getReviewRoom = (review: Review) => {
    if (lang === "uk") return review.roomTypeUk;
    if (lang === "en") return review.roomTypeEn;
    return review.roomType;
  };

  const goNext = () =>
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const current = reviews[currentIndex];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/[0.03] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-4">
              <Star className="h-3.5 w-3.5 fill-amber-300" />
              <span>
                {translate("reviewsBadge", "Отзывы наших гостей")}
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="tide-in" delay={100}>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {translate("reviewsTitle", "Впечатления гостей")}
            </h2>
            <WavyUnderline colorClassName="text-amber-400" />
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={200}>
            <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-lg font-light">
              {translate(
                "reviewsDesc",
                "Более 200 гостей оценили нас на 4.9 из 5. Вот что они говорят."
              )}
            </p>
          </ScrollReveal>
        </div>

        {/* Review Card */}
        <ScrollReveal variant="scale-in" delay={300}>
          <div className="max-w-3xl mx-auto">
            <div className="relative glass-card-dark border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl group hover:border-amber-400/20 transition-all duration-500">
              {/* Quote icon */}
              <div className="absolute -top-5 left-8 h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Quote className="h-5 w-5 text-white" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Review text */}
              <blockquote
                className="text-lg md:text-xl text-white font-light leading-relaxed mb-8 min-h-[80px] transition-all duration-500"
                key={current.id}
                style={{ animation: "fade-in-up 0.5s ease forwards" }}
              >
                &ldquo;{getReviewText(current)}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400/30 to-sky-400/30 flex items-center justify-center text-teal-300 font-bold text-lg border border-white/10">
                    {getReviewName(current).charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {getReviewName(current)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {getReviewRoom(current)} · {current.date}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goNext}
                    className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                    aria-label="Next review"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex items-center justify-center mt-6 h-12">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="h-12 w-12 flex items-center justify-center group focus:outline-none -mx-2"
                    aria-label={`Go to review ${i + 1}`}
                  >
                    <span className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-6 bg-amber-400"
                        : "w-1.5 bg-slate-600 group-hover:bg-slate-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust summary below card */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span>
                  <span className="text-white font-bold">4.9</span> / 5
                </span>
              </div>
              <div className="h-4 w-px bg-slate-700" />
              <span className="text-slate-400">
                <span className="text-white font-semibold">200+</span>{" "}
                {translate("reviewsCount", "отзывов гостей")}
              </span>
              <div className="h-4 w-px bg-slate-700" />
              <span className="text-slate-400">
                <span className="text-white font-semibold">96%</span>{" "}
                {translate("reviewsRecommend", "рекомендуют")}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-20 fill-slate-950 scale-x-[-1]"
        >
          <path
            d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z"
            className="opacity-30 fill-teal-200/10"
          />
          <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
