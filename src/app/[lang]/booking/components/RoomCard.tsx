"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Room } from "@/lib/types";
import { BedDouble, Eye, Waves, Sparkles, ArrowRight, Scale } from "lucide-react";
import { usePathname } from "next/navigation";

interface RoomCardProps {
  room: Room;
  onCompareClick?: () => void;
}

const translations = {
  ru: {
    upTo: "До",
    guests: "гостей",
    beach: "5 мин до пляжа",
    compare: "Сравнить",
    view: "Подробнее",
    book: "Забронировать",
    pricePerNight: "грн",
    perNight: "/ ночь",
  },
  uk: {
    upTo: "До",
    guests: "гостей",
    beach: "5 хв до пляжу",
    compare: "Порівняти",
    view: "Детальніше",
    book: "Забронювати",
    pricePerNight: "грн",
    perNight: "/ ніч",
  },
  en: {
    upTo: "Up to",
    guests: "guests",
    beach: "5 min to beach",
    compare: "Compare",
    view: "Details",
    book: "Book Now",
    pricePerNight: "UAH",
    perNight: "/ night",
  }
};

export default function RoomCard({ room, onCompareClick }: RoomCardProps) {
  const pathname = usePathname();
  const segments = pathname?.split("/") || [];
  const langKey = (["ru", "uk", "en"].includes(segments[1]) ? segments[1] : "ru") as "ru" | "uk" | "en";
  const t = translations[langKey];

  return (
    <div
      id={room.id}
      className="group relative flex flex-col lg:flex-row overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] transition-all duration-500 hover:border-teal-500/30 hover:shadow-[0_0_50px_-12px_rgba(20,184,166,0.2)] hover:bg-slate-900/60"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section (Apple-style inner padding) */}
      <div className="relative w-full lg:w-2/5 p-4 md:p-5 shrink-0 z-10">
        <div className="relative w-full h-full min-h-[260px] md:min-h-[320px] rounded-[1.75rem] overflow-hidden shadow-2xl">
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            data-ai-hint={room.imageHint}
          />
          {/* Subtle overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
          
          {/* Floating Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
              <BedDouble className="h-3.5 w-3.5 text-teal-400" />
              <span>{t.upTo} {room.capacity} {t.guests}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-sky-500/30 text-white text-xs font-medium">
              <Waves className="h-3.5 w-3.5 text-sky-400" />
              <span>{t.beach}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col justify-between w-full lg:w-3/5 p-6 md:p-8 lg:p-10 lg:pl-4 z-10">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight group-hover:text-teal-300 transition-colors duration-300">
              {room.name}
            </h3>
          </div>
          
          <p className="mt-4 text-base md:text-lg text-slate-300 font-light leading-relaxed line-clamp-3">
            {room.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <span 
                key={amenity} 
                className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Sparkles className="h-3 w-3 text-teal-500/70" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-black text-white group-hover:text-amber-400 transition-colors duration-300 tracking-tight">
              {room.price} <span className="text-xl font-bold">{t.pricePerNight}</span>
            </span>
            <span className="text-sm text-slate-500 font-medium">{t.perNight}</span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
            {onCompareClick && (
              <Button 
                onClick={onCompareClick} 
                variant="ghost" 
                size="icon"
                className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 hidden sm:flex shrink-0"
                title={t.compare}
              >
                <Scale className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              asChild 
              variant="outline" 
              className="h-12 px-6 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 w-full sm:w-auto text-base font-semibold"
            >
              <Link href={`/${langKey}/rooms/${room.slug}`}>
                <Eye className="mr-2 h-4 w-4 text-teal-400" />
                {t.view}
              </Link>
            </Button>

            <Button 
              asChild 
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black border-0 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-base uppercase tracking-wider"
            >
              <Link href={`/${langKey}/booking/${room.slug}`}>
                {t.book}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            {/* Mobile compare button */}
            {onCompareClick && (
              <Button 
                onClick={onCompareClick} 
                variant="outline" 
                className="h-12 w-full rounded-2xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 transition-all duration-300 sm:hidden font-semibold"
              >
                <Scale className="mr-2 h-4 w-4" />
                {t.compare}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
