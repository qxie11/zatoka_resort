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
    text: "Прекрасный гостевой дом! До моря всего 5 минут неспешным шагом. Дети в восторге от игровой площадки во дворе, а мы — от уютной беседки. Обязательно вернёмся!",
    textUk: "Чудовий гостьовий будинок! До моря всього 5 хвилин неспішним кроком. Діти в захваті від ігрового майданчика у дворі, а ми — від затишної альтанки. Обов'язково повернемось!",
    textEn: "Wonderful guesthouse! Just a 5-minute leisurely walk to the beach. Kids loved the playground in the yard, and we enjoyed the cozy gazebo. Will definitely come back!",
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
    text: "Отдыхали всей семьей в улучшенном номере. Кондиционер спасал в жару, во дворе чистота, очень тихий район. Большой плюс за общую кухню со всем необходимым — готовить домашнюю еду очень просто. Спасибо за душевный прием!",
    textUk: "Відпочивали всією родиною в покращеному номері. Кондиціонер рятував у спеку, у дворі чистота, дуже тихий район. Великий плюс за спільну кухню з усім необхідним — готувати домашню їжу дуже просто. Дякуємо за душевний прийом!",
    textEn: "Stayed with the whole family in the triple room. The AC saved us from the heat, the yard is clean, and the area is very quiet. Big plus for the shared kitchen with everything needed to cook home meals easily. Thanks for the warm hospitality!",
    rating: 5,
    date: "Июль 2025",
    roomType: "Улучшенный 3-местный",
    roomTypeUk: "Покращений 3-місний",
    roomTypeEn: "Triple Room",
  },
  {
    id: 3,
    name: "Виктор М.",
    nameUk: "Віктор М.",
    nameEn: "Victor M.",
    text: "Чистота, тишина, закрытая территория двора. Наконец-то нашли место, где можно спокойно отдохнуть с детьми. Владельцы очень приветливые, всё подскажут. Рекомендую!",
    textUk: "Чистота, тиша, закрита територія двору. Нарешті знайшли місце, де можна спокійно відпочити з дітьми. Власники дуже привітні, все підкажуть. Рекомендую!",
    textEn: "Clean, quiet, and gated yard. Finally found a place where we can relax peacefully with kids. Owners are very friendly and helpful. Highly recommend!",
    rating: 5,
    date: "Сентябрь 2025",
    roomType: "Уютный стандарт",
    roomTypeUk: "Затишний стандарт",
    roomTypeEn: "Cozy Standard",
  },
  {
    id: 4,
    name: "Марина С.",
    nameUk: "Марина С.",
    nameEn: "Marina S.",
    text: "Лучшее место в Затоке по соотношению цены и качества. Оплатили на месте при заселении, никаких переплат. Зона с мангалами во дворе просто отличная, жарили свежую рыбу каждый вечер. Обязательно приедем ещё!",
    textUk: "Найкраще місце у Затоці за співвідношенням ціни та якості. Оплатили на місці при заселенні, жодних переплат. Зона з мангалами у дворі просто чудова, смажили свіжу рибу щовечора. Обов'язково приїдемо ще!",
    textEn: "Best place in Zatoka for value and comfort. Paid on arrival, no hidden fees. The BBQ area in the yard is awesome, we grilled fresh fish every evening. Will definitely come back!",
    rating: 5,
    date: "Июнь 2025",
    roomType: "Двухкомнатный семейный",
    roomTypeUk: "Двокімнатний сімейний",
    roomTypeEn: "Two-Room Family",
  },
];

export default function GuestImpressions() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [, setLangUpdate] = useState(i18n.language || "ru");

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
    <section className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
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
