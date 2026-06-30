"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, Home, ArrowLeft, Waves, Sparkles, ShieldCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru, uk, enUS } from "date-fns/locale";
import BackgroundBubbles from "@/components/decorative/BackgroundBubbles";
import BackgroundFishes from "@/components/decorative/BackgroundFishes";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const locales = {
  ru,
  uk,
  en: enUS,
};

const translations = {
  ru: {
    title: "Бронирование подтверждено!",
    subtitle: "Ваш незабываемый отдых в Zatoka Resort начинается здесь",
    detailsTitle: "Детали вашей брони",
    guestName: "Гость",
    room: "Категория номера",
    dates: "Даты проживания",
    guests: "Количество гостей",
    price: "Оплачено",
    currency: "грн",
    infoText: "Мы уже начали подготовку к вашему визиту. Наш администратор свяжется с вами по телефону в течение 15 минут для подтверждения деталей заезда.",
    btnHome: "На главную",
    btnRooms: "Выбрать другой номер",
    guestsCount: (count: number) => {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return `${count} гостей`;
      if (lastDigit === 1) return `${count} гость`;
      if (lastDigit >= 2 && lastDigit <= 4) return `${count} гостя`;
      return `${count} гостей`;
    }
  },
  uk: {
    title: "Бронювання підтверджено!",
    subtitle: "Ваш незабутній відпочинок у Zatoka Resort починається тут",
    detailsTitle: "Деталі вашої броні",
    guestName: "Гість",
    room: "Категорія номера",
    dates: "Дати проживання",
    guests: "Кількість гостей",
    price: "Сплачено",
    currency: "грн",
    infoText: "Ми вже розпочали підготовку до вашого визиту. Наш адміністратор зв'яжеться з вами телефоном протягом 15 хвилин для підтвердження деталей заїзду.",
    btnHome: "На головну",
    btnRooms: "Обрати інший номер",
    guestsCount: (count: number) => {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return `${count} гостей`;
      if (lastDigit === 1) return `${count} гість`;
      if (lastDigit >= 2 && lastDigit <= 4) return `${count} гості`;
      return `${count} гостей`;
    }
  },
  en: {
    title: "Booking Confirmed!",
    subtitle: "Your unforgettable vacation at Zatoka Resort starts here",
    detailsTitle: "Your Booking Details",
    guestName: "Guest",
    room: "Room Category",
    dates: "Dates of Stay",
    guests: "Number of Guests",
    price: "Total Paid",
    currency: "UAH",
    infoText: "We are already preparing for your arrival. Our administrator will contact you by phone within 15 minutes to confirm check-in details.",
    btnHome: "Go Home",
    btnRooms: "View Other Rooms",
    guestsCount: (count: number) => `${count} ${count === 1 ? 'guest' : 'guests'}`
  }
};

function SuccessContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams();

  const roomName = searchParams.get("roomName") || "";
  const name = searchParams.get("name") || "";
  const startDateStr = searchParams.get("startDate") || "";
  const endDateStr = searchParams.get("endDate") || "";
  const pricePaid = searchParams.get("pricePaid") || "";
  const guests = parseInt(searchParams.get("guests") || "1", 10);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = translations[lang as keyof typeof translations] || translations.ru;
  const currentLocale = locales[lang as keyof typeof locales] || ru;

  // Format dates beautifully
  let formattedDates = "";
  if (startDateStr && endDateStr) {
    try {
      const start = parseISO(startDateStr);
      const end = parseISO(endDateStr);
      formattedDates = `${format(start, "d MMMM yyyy", { locale: currentLocale })} — ${format(end, "d MMMM yyyy", { locale: currentLocale })}`;
    } catch (e) {
      formattedDates = `${startDateStr} — ${endDateStr}`;
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-16 overflow-hidden selection:bg-teal-500/30">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <BackgroundBubbles count={20} deepCount={10} />
        <BackgroundFishes />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-sky-500/10 blur-[100px] animate-pulse" style={{ animationDelay: "2.5s" }} />
        
        {/* Decorative Gridlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Animated Checkmark Circle */}
        <div className="relative mx-auto w-24 h-24 mb-8 flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-75" style={{ animationDuration: "2s" }} />
          
          {/* Solid glass circle */}
          <div className="absolute inset-1 rounded-full bg-slate-900 border border-teal-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)]">
            <svg 
              className="w-12 h-12 text-teal-400 stroke-current"
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline 
                points="20 6 9 17 4 12" 
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: 50,
                  animation: "drawCheck 0.6s ease-in-out forwards 0.2s"
                }}
              />
            </svg>
          </div>
        </div>

        {/* Header Titles */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-sm py-1 animate-fade-in-up">
          {t.title}
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto mb-10 text-base md:text-lg font-medium animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {t.subtitle}
        </p>

        {/* Premium Detail Card */}
        <div 
          className="glass-card-dark bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 text-left shadow-[0_30px_60px_rgba(0,0,0,0.5)] mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 className="font-heading font-extrabold text-white text-lg tracking-wide uppercase flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              {t.detailsTitle}
            </h3>
            <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Zatoka VIP
            </span>
          </div>

          <div className="space-y-4">
            {name && (
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">{t.guestName}</span>
                <span className="text-white font-semibold text-right">{name}</span>
              </div>
            )}

            {roomName && (
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">{t.room}</span>
                <span className="text-teal-300 font-bold text-right">{roomName}</span>
              </div>
            )}

            {formattedDates && (
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">{t.dates}</span>
                <span className="text-white font-semibold text-right">{formattedDates}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-slate-400 text-sm">{t.guests}</span>
              <span className="text-white font-semibold text-right">{t.guestsCount(guests)}</span>
            </div>

            {pricePaid && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-sm">{t.price}</span>
                <span className="text-2xl font-black text-amber-400 flex items-baseline gap-1">
                  {pricePaid} <span className="text-sm font-semibold">{t.currency}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Administration Info Box */}
        <div 
          className="flex gap-3 text-left bg-slate-900/40 border border-teal-500/20 rounded-2xl p-5 mb-10 max-w-xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Sparkles className="h-6 w-6 text-teal-400 shrink-0 animate-pulse" />
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {t.infoText}
          </p>
        </div>

        {/* Custom Actions */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href={`/${lang}`} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-sky-500 to-teal-600 text-white font-extrabold shadow-[0_10px_25px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_30px_rgba(20,184,166,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              {t.btnHome}
            </button>
          </Link>

          <Link href={`/${lang}/booking`} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white font-extrabold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.btnRooms}
            </button>
          </Link>
        </div>
      </div>

      {/* SVG check drawing styling */}
      <style jsx global>{`
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default function BookingSuccessPage({ params }: PageProps) {
  const { lang } = use(params);

  return (
    <div className="min-h-screen bg-slate-950">
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        </div>
      }>
        <SuccessContent lang={lang} />
      </Suspense>
    </div>
  );
}
