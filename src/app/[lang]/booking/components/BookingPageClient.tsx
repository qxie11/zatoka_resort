"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const displayRooms = filteredRooms !== null ? filteredRooms : rooms;
  const { t } = useTranslation();

  // Gather all unique amenities across all rooms
  const allAmenityNames = Array.from(
    new Set(rooms.flatMap((room) => room.amenities))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
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

      {/* Comparison Modal (rendered via Portal) */}
      {showComparison && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowComparison(false)} />
          
          {/* Modal Container */}
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl z-10 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h3 className="text-2xl font-extrabold text-white">Сравнение характеристик номеров</h3>
              <button
                onClick={() => setShowComparison(false)}
                className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/50">
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
                  {allAmenityNames.map((amenity) => (
                    <tr key={amenity}>
                      <td className="p-4 text-slate-300 font-medium">{amenity}</td>
                      {rooms.map((room) => (
                        <td key={room.id} className="p-4 text-center text-slate-200">
                          {room.amenities.includes(amenity) ? (
                            <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                          ) : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>,
        document.body
      )}

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
          <RoomsList rooms={displayRooms} onCompareClick={() => setShowComparison(true)} />
        </div>
      </section>
    </>
  );
}
