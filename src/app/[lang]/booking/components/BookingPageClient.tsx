"use client";

import { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import RoomsList from '@/components/rooms/RoomsList';
import { WavyUnderline } from "@/components/ui/wavy-underline";
import type { Room, Booking } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Check, HelpCircle } from "lucide-react";

interface BookingPageClientProps {
  rooms: Room[];
  bookings: Booking[];
}

export default function BookingPageClient({ rooms, bookings }: BookingPageClientProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const displayRooms = filteredRooms !== null ? filteredRooms : rooms;
  const { t } = useTranslation();

  useEffect(() => {
    if (filteredRooms !== null) {
      const element = document.getElementById("available-rooms");
      if (element) {
        // A slight timeout ensures the DOM has updated and layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [filteredRooms]);

  return (
    <>
      <BookingForm
        rooms={rooms}
        bookings={bookings}
        onFilterChange={setFilteredRooms}
      />

      {/* Direct Booking Trust Banner */}
      <div className="max-w-4xl mx-auto mb-12 p-6 rounded-3xl bg-teal-950/20 border border-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Гарантия прямого бронирования</h4>
            <p className="text-sm text-slate-300 mt-1">Вы бронируете напрямую у владельца гостевого дома. Никаких наценок систем бронирования (Booking.com), скрытых сборов и переплат агентам.</p>
          </div>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <div className="text-center bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
            <span className="text-xs text-slate-400 block font-medium">Комиссия</span>
            <span className="text-base font-extrabold text-rose-400 line-through">15%</span>
          </div>
          <div className="text-center bg-teal-500/10 px-4 py-2 rounded-xl border border-teal-500/20">
            <span className="text-xs text-teal-300 block font-bold">Здесь</span>
            <span className="text-base font-extrabold text-teal-300">0%</span>
          </div>
        </div>
      </div>

      {/* Collapsible Comparison Table */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300"
        >
          {showComparison ? "Скрыть таблицу сравнения" : "Сравнить характеристики номеров"}
        </button>

        {showComparison && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl animate-fade-in">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/80">
                  <th className="p-4 text-slate-400 font-semibold w-1/4">Характеристика</th>
                  {rooms.map((room) => (
                    <th key={room.id} className="p-4 font-bold text-white text-center">{room.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="p-4 text-slate-300 font-medium">Стоимость</td>
                  {rooms.map((room) => (
                    <td key={room.id} className="p-4 text-center text-teal-300 font-bold">{room.price} грн / ночь</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-slate-300 font-medium">Вместимость</td>
                  {rooms.map((room) => (
                    <td key={room.id} className="p-4 text-center text-slate-200">{room.capacity} гостей</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-slate-300 font-medium">Кондиционер</td>
                  {rooms.map((room) => (
                    <td key={room.id} className="p-4 text-center text-slate-200">
                      {room.amenities.some(a => a.toLowerCase().includes("кондиционер") || a.toLowerCase().includes("ac")) ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-slate-300 font-medium">Собственный балкон</td>
                  {rooms.map((room) => (
                    <td key={room.id} className="p-4 text-center text-slate-200">
                      {room.amenities.some(a => a.toLowerCase().includes("балкон")) ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-slate-300 font-medium">Спутниковое ТВ</td>
                  {rooms.map((room) => (
                    <td key={room.id} className="p-4 text-center text-slate-200">
                      {room.amenities.some(a => a.toLowerCase().includes("тв") || a.toLowerCase().includes("телевизор")) ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section id="available-rooms" className="py-16 lg:py-24 bg-slate-950 scroll-mt-20">
        <div className="container mx-auto px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white animate-fade-in">
              {filteredRooms !== null ? t("availableRooms") : t("allRooms")}
            </h2>
            <WavyUnderline />
            <p className="mt-2 text-slate-300 font-light">
              {filteredRooms !== null
                ? t("roomsFound", { count: filteredRooms.length })
                : t("findPerfectSpace")}
            </p>
          </div>
          <RoomsList rooms={displayRooms} />
        </div>
      </section>
    </>
  );
}
