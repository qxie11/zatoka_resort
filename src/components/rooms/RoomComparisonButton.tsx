"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { Room } from "@/lib/types";

interface RoomComparisonButtonProps {
  rooms: Room[];
  currentRoomId?: string;
}

export default function RoomComparisonButton({ rooms, currentRoomId }: RoomComparisonButtonProps) {
  const { t } = useTranslation();

  const [showComparison, setShowComparison] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Gather all unique amenities across all rooms
  const allAmenityNames = Array.from(
    new Set(rooms.flatMap((room) => room.amenities))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <Button
        onClick={() => setShowComparison(true)}
        variant="outline"
        className="border-teal-500/30 bg-teal-500/5 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500/50 transition-all duration-300 rounded-xl px-6"
      >
        {t("compareRooms") || "Сравнить номера"}
      </Button>

      {/* Comparison Modal */}
      {showComparison && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowComparison(false)} />
          
          {/* Modal Container */}
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl z-10 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h3 className="text-2xl font-extrabold text-white">{t("compareFeatures") || "Сравнение характеристик номеров"}</h3>
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
                    <th className="p-4 text-slate-400 font-semibold w-1/4">{t("feature") || "Характеристика"}</th>
                    {rooms.map((room) => (
                      <th
                        key={room.id}
                        className={`p-4 font-bold text-center ${room.id === currentRoomId ? 'text-teal-400 bg-teal-500/5' : 'text-white'}`}
                      >
                        {room.name} {room.id === currentRoomId && (t("thisCurrent") || "(Этот)")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 text-slate-300 font-medium">{t("priceTitle") || "Стоимость"}</td>
                    {rooms.map((room) => (
                      <td
                        key={room.id}
                        className={`p-4 text-center font-bold ${room.id === currentRoomId ? 'text-teal-300 bg-teal-500/5' : 'text-teal-300/85'}`}
                      >
                        {t("pricePerNight")?.replace("{{price}}", room.price.toString()) || `${room.price} грн / ночь`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-300 font-medium">{t("capacityTitle") || "Вместимость"}</td>
                    {rooms.map((room) => (
                      <td
                        key={room.id}
                        className={`p-4 text-center text-slate-200 ${room.id === currentRoomId ? 'bg-teal-500/5' : ''}`}
                      >
                        {t("capacityGuests")?.replace("{{capacity}}", room.capacity.toString()) || `${room.capacity} гостей`}
                      </td>
                    ))}
                  </tr>
                  {allAmenityNames.map((amenity) => (
                    <tr key={amenity}>
                      <td className="p-4 text-slate-300 font-medium">{amenity}</td>
                      {rooms.map((room) => (
                        <td
                          key={room.id}
                          className={`p-4 text-center text-slate-200 ${room.id === currentRoomId ? 'bg-teal-500/5' : ''}`}
                        >
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
    </>
  );
}
