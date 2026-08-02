"use client";

import Link from "next/link";
import Image from "next/image";
import { getRooms } from "@/lib/db";
import type { Room } from "@/lib/types";
import { BedDouble, Users, Waves, Sparkles, ArrowRight, ShieldCheck, Wifi, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomsClientProps {
  rooms: Room[];
  lang: string;
}

export default function RoomsClient({ rooms, lang }: RoomsClientProps) {
  const t = {
    ru: {
      heading: "Каталог номеров",
      subheading: "Выберите идеальный вариант для отдыха у Чёрного моря",
      from: "от",
      perNight: "грн / ночь",
      capacity: "до",
      guests: "гостей",
      details: "Подробнее",
      book: "Забронировать",
    },
    uk: {
      heading: "Каталог номерів",
      subheading: "Оберіть ідеальний варіант для відпочинку біля Чорного моря",
      from: "від",
      perNight: "грн / ніч",
      capacity: "до",
      guests: "гостей",
      details: "Детальніше",
      book: "Забронювати",
    },
    en: {
      heading: "Our Rooms",
      subheading: "Choose the perfect room for your Black Sea getaway",
      from: "from",
      perNight: "UAH / night",
      capacity: "up to",
      guests: "guests",
      details: "Details",
      book: "Book Now",
    },
  }[lang as "ru" | "uk" | "en"] || {
    heading: "Каталог номеров",
    subheading: "Выберите идеальный вариант для отдыха у Чёрного моря",
    from: "от",
    perNight: "грн / ночь",
    capacity: "до",
    guests: "гостей",
    details: "Подробнее",
    book: "Забронировать",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            </span>
            Grean Beam {new Date().getFullYear()}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {t.heading}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            {t.subheading}
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group relative flex flex-col bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-teal-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10"
            >
              {/* Room Image */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <Image
                  src={room.imageUrl || "/og-image.png"}
                  alt={`${room.name} - отель Grean Beam`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-teal-300 font-bold text-sm">
                  {t.from} {room.price} {t.perNight}
                </div>
              </div>

              {/* Room Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white font-heading group-hover:text-teal-300 transition-colors">
                    {room.name}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <Users className="w-3.5 h-3.5 text-teal-400" />
                      {t.capacity} {room.capacity} {t.guests}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      Кондиционер
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href={`/${lang}/rooms/${room.slug}`}>
                    <Button variant="outline" className="w-full bg-slate-800/80 border-slate-600/60 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 hover:border-teal-400 rounded-xl font-semibold transition-all">
                      {t.details}
                    </Button>
                  </Link>
                  <Link href={`/${lang}/booking/${room.slug}`}>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/20">
                      {t.book}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
