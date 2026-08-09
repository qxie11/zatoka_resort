"use client";

import type { Room } from "@/lib/types";
import { Waves } from "lucide-react";
import RoomCard from "@/app/[lang]/booking/components/RoomCard";

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
            <Waves className="w-3.5 h-3.5" />
            Zatoka Resort {new Date().getFullYear()}
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
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}
