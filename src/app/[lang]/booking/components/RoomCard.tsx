"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Room } from "@/lib/types";
import { BedDouble, ArrowRight, Eye, Scale, Waves, Sparkles, CheckCircle2, Send } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

interface RoomCardProps {
  room: Room;
  onCompareClick?: () => void;
}

const translations = {
  ru: {
    upTo: "До",
    guests: "гостей",
    beach: "5 мин до моря",
    beachPromenade: "Береговая линия",
    compare: "Сравнить",
    view: "Подробнее",
    book: "Забронировать",
    pricePerNight: "грн",
    perNight: "/ ночь",
    payOnArrival: "Оплата при заезде",
    askTg: "Спросить в Telegram",
  },
  uk: {
    upTo: "До",
    guests: "гостей",
    beach: "5 хв до моря",
    beachPromenade: "Перша лінія",
    compare: "Порівняти",
    view: "Детальніше",
    book: "Забронювати",
    pricePerNight: "грн",
    perNight: "/ ніч",
    payOnArrival: "Оплата при заїзді",
    askTg: "Запитати в Telegram",
  },
  en: {
    upTo: "Up to",
    guests: "guests",
    beach: "5 min to sea",
    beachPromenade: "Beachfront",
    compare: "Compare",
    view: "Details",
    book: "Book Now",
    pricePerNight: "UAH",
    perNight: "/ night",
    payOnArrival: "Pay at check-in",
    askTg: "Ask on Telegram",
  }
};

export default function RoomCard({ room, onCompareClick }: RoomCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname?.split("/") || [];
  const langKey = (["ru", "uk", "en"].includes(segments[1]) ? segments[1] : "ru") as "ru" | "uk" | "en";
  const t = translations[langKey];

  const queryString = searchParams?.toString();
  const detailsHref = `/${langKey}/rooms/${room.slug}${queryString ? `?${queryString}` : ""}`;
  const bookingHref = `/${langKey}/booking/${room.slug}${queryString ? `?${queryString}` : ""}`;

  return (
    <div
      id={room.id}
      className="group relative flex flex-col justify-between overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] transition-all duration-500 hover:border-teal-500/40 hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.25)] hover:bg-slate-900/80"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-[250px] bg-teal-500/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section */}
      <div className="relative w-full p-3 shrink-0 z-10">
        <div className="relative w-full h-52 sm:h-56 rounded-[1.5rem] overflow-hidden shadow-xl bg-slate-950">
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            data-ai-hint={room.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
          
          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 max-w-[90%]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-sm">
              <BedDouble className="h-3.5 w-3.5 text-teal-400" />
              <span>{t.upTo} {room.capacity} {t.guests}</span>
            </div>
            {(() => {
              const seaAmenity = room.amenities.find((a) => 
                /до моря|до пляжа|до пляжу|Береговая линия|Перша лінія|Beach/i.test(a)
              );
              
              if (!seaAmenity) return null;
              
              return (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-500/30 text-white text-xs font-semibold shadow-sm">
                  <Waves className="h-3.5 w-3.5 text-sky-400" />
                  <span className="truncate max-w-[130px]">{seaAmenity}</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col justify-between flex-1 p-5 pt-1 z-10 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-teal-300 transition-colors duration-300">
            {room.name}
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed line-clamp-2">
            {room.description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {room.amenities
              .filter(a => !/до моря|до пляжа|до пляжу|Береговая линия|Перша лінія|Beach/i.test(a))
              .slice(0, 4)
              .map((amenity) => (
              <span 
                key={amenity} 
                className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-lg text-xs font-medium"
              >
                <Sparkles className="h-2.5 w-2.5 text-teal-400" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Price & Buttons */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {/* Price & Details Row */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight leading-none">
                {room.price} <span className="text-xs font-bold text-amber-300/80">{t.pricePerNight}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>{t.payOnArrival}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onCompareClick && (
                <Button 
                  onClick={onCompareClick} 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex shrink-0"
                  title={t.compare}
                >
                  <Scale className="h-4 w-4" />
                </Button>
              )}
              
              <Button 
                asChild 
                variant="outline" 
                className="h-9 px-3 rounded-xl bg-slate-800/80 border-slate-600/60 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 hover:border-teal-400 transition-all text-xs font-semibold"
              >
                <Link href={detailsHref}>
                  <Eye className="mr-1.5 h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <span>{t.view}</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Action Buttons: Book & Telegram Quick Contact */}
          <div className="flex items-center gap-2">
            <Button 
              asChild 
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm"
            >
              <Link href={bookingHref} className="flex items-center justify-center gap-2">
                <span>{t.book}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>

            <a
              href="https://t.me/+380669212275"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-3.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/30 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-extrabold shrink-0"
              title={t.askTg}
            >
              <Send className="h-4 w-4 text-sky-400 shrink-0" />
              <span className="hidden sm:inline">TG</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
