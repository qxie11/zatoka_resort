"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Share2,
  Check
} from "lucide-react";
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
    galleryTitle: "Ваш будущий номер",
    loadingGallery: "Загрузка фотографий номера...",
    noImages: "Фотографии номера временно недоступны",
    btnShare: "Поделиться",
    btnShareCopied: "Скопировано!",
    shareText: (room: string, dates: string, price: string) =>
      `🏨 Я забронировал ${room} в Затока Resort!\n📅 Даты: ${dates}\n💰 Сумма: ${price} грн\n\nЗаписывайте: zatoka-hotel.com`,
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
    galleryTitle: "Ваш майбутній номер",
    loadingGallery: "Завантаження фотографій номера...",
    noImages: "Фотографії номера тимчасово недоступні",
    btnShare: "Поділитись",
    btnShareCopied: "Скопійовано!",
    shareText: (room: string, dates: string, price: string) =>
      `🏨 Я забронював ${room} у Zatoka Resort!\n📅 Дати: ${dates}\n💰 Сума: ${price} грн\n\nЗаписуйте: zatoka-hotel.com`,
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
    galleryTitle: "Your Upcoming Room",
    loadingGallery: "Loading room photos...",
    noImages: "Room photos are temporarily unavailable",
    btnShare: "Share",
    btnShareCopied: "Copied!",
    shareText: (room: string, dates: string, price: string) =>
      `🏨 I just booked ${room} at Zatoka Resort!\n📅 Dates: ${dates}\n💰 Total: ${price} UAH\n\nBook at: zatoka-hotel.com`,
    guestsCount: (count: number) => `${count} ${count === 1 ? 'guest' : 'guests'}`
  }
};

function SuccessContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId") || "";
  const roomId = searchParams.get("roomId") || "";
  const roomName = searchParams.get("roomName") || "";
  const name = searchParams.get("name") || "";
  const startDateStr = searchParams.get("startDate") || "";
  const endDateStr = searchParams.get("endDate") || "";
  const pricePaid = searchParams.get("pricePaid") || "";
  const guests = parseInt(searchParams.get("guests") || "1", 10);

  const [mounted, setMounted] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (roomId) {
      setLoadingRoom(true);
      fetch(`/api/rooms/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setRoom(data);
          }
        })
        .catch((err) => console.error("Error loading room data:", err))
        .finally(() => setLoadingRoom(false));
    }
  }, [roomId]);

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

  // Extract gallery images
  const allImages = room
    ? [room.imageUrl, ...(room.imageUrls || [])].filter(Boolean)
    : [];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (allImages.length === 0) return;
    setActiveImgIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (allImages.length === 0) return;
    setActiveImgIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    const text = t.shareText(roomName, formattedDates, pricePaid);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Zatoka Resort — бронирование",
          text,
          url: "https://zatoka-hotel.com",
        });
        return;
      } catch {}
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden selection:bg-teal-500/30">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <BackgroundBubbles count={20} deepCount={10} />
        <BackgroundFishes />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-sky-500/10 blur-[100px] animate-pulse" style={{ animationDelay: "2.5s" }} />

        {/* Decorative Gridlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Animated Checkmark Circle & Header Titles */}
        <div className="text-center mb-10">
          <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-75" style={{ animationDuration: "2s" }} />
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-sm py-1 animate-fade-in-up">
            {t.title}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-medium animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Two-Column Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-10">

          {/* LEFT COLUMN: Booking Details */}
          <div
            className="glass-card-dark bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 text-left shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="font-heading font-extrabold text-white text-lg tracking-wide uppercase flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-400" />
                  {t.detailsTitle}
                </h3>
                <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Zatoka VIP
                </span>
              </div>

              <div className="space-y-4 mb-6">
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

            {/* Info Box */}
            <div className="flex gap-3 text-left bg-slate-950/40 border border-teal-500/20 rounded-2xl p-4 mt-auto">
              <Sparkles className="h-5 w-5 text-teal-400 shrink-0 animate-pulse mt-0.5" />
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                {t.infoText}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Room Photo Gallery */}
          <div
            className="glass-card-dark bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 text-left shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="font-heading font-extrabold text-white text-lg tracking-wide uppercase flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-sky-400" />
                {t.galleryTitle}
              </h3>
            </div>

            {/* Slider Content */}
            <div className="flex-1 flex flex-col justify-center">
              {loadingRoom ? (
                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-slate-400 gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                  <span className="text-sm">{t.loadingGallery}</span>
                </div>
              ) : allImages.length > 0 ? (
                <div className="space-y-4">
                  {/* Large Active Image Box */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950 group">
                    <Image
                      src={allImages[activeImgIdx]}
                      alt={room?.name || "Room preview"}
                      fill
                      className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-slate-950/60 hover:bg-teal-500/80 border border-white/10 hover:border-teal-400 text-white transition-all duration-300 shadow-lg backdrop-blur-sm"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-slate-950/60 hover:bg-teal-500/80 border border-white/10 hover:border-teal-400 text-white transition-all duration-300 shadow-lg backdrop-blur-sm"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/70 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300">
                      {activeImgIdx + 1} / {allImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-hide">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImgIdx(idx)}
                          className={`relative h-14 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 ${idx === activeImgIdx
                            ? "border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.4)] scale-95"
                            : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-slate-500 gap-2">
                  <ImageIcon className="h-10 w-10 text-slate-600 animate-pulse" />
                  <span className="text-sm font-medium">{t.noImages}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Control Buttons */}
        <div
          className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <a
            href={`https://t.me/zatoka_resort_booking_bot?start=${bookingId ? `booking_${bookingId}` : 'start'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold shadow-[0_10px_25px_rgba(14,165,233,0.4)] hover:shadow-[0_15px_30px_rgba(14,165,233,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.18-1.82 6.97-3.02 8.37-3.61 3.98-1.66 4.81-1.95 5.35-1.96.12 0 .38.03.55.17.14.12.18.28.2.45-.02.07-.02.16-.04.24z"/>
            </svg>
            <span>Получить ваучер в Telegram</span>
          </a>

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

          <button
            onClick={handleShare}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${
              copied
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border border-white/10 hover:bg-sky-500/15 hover:border-sky-400/40 text-slate-300 hover:text-sky-300"
            }`}
          >
            {copied ? (
              <><Check className="h-4 w-4" />{t.btnShareCopied}</>
            ) : (
              <><Share2 className="h-4 w-4" />{t.btnShare}</>
            )}
          </button>
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
        /* Hide scrollbars for thumbnails row */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
