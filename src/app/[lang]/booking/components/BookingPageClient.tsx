"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BookingForm from "./BookingForm";
import RoomsList from '@/components/rooms/RoomsList';
import { WavyUnderline } from "@/components/ui/wavy-underline";
import type { Room, Booking } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Check, HelpCircle } from "lucide-react";

interface BookingPageClientProps {
  rooms: Room[];
  bookings: Booking[];
  lang?: string;
}

export default function BookingPageClient({ rooms, bookings, lang = "ru" }: BookingPageClientProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const searchParams = useSearchParams();
  const guestsParam = searchParams.get("guests");
  const initialGuests = guestsParam ? parseInt(guestsParam, 10) : 1;
  const [searchedGuests, setSearchedGuests] = useState<number>(initialGuests);

  const displayRooms = filteredRooms !== null ? filteredRooms : rooms;
  const { t, i18n } = useTranslation();
  
  const maxCapacity = rooms.length > 0 ? Math.max(...rooms.map(r => r.capacity)) : 4;
  const needsMultipleRooms = searchedGuests > maxCapacity && filteredRooms !== null;

  const localTranslations = {
    ru: {
      directBookingTitle: "Гарантия прямого бронирования",
      directBookingDesc: "Вы бронируете напрямую у владельца гостевого дома. Никаких наценок систем бронирования (Booking.com), скрытых сборов и переплат агентам.",
      commission: "Комиссия",
      here: "Здесь",
      compareTitle: "Сравнение характеристик номеров",
      characteristic: "Характеристика",
      price: "Стоимость",
      perNight: "грн / ночь",
      capacity: "Вместимость",
      guestsStr: "гостей",
      multipleRooms: (g: number, m: number) => `Для компании из ${g} гостей у нас нет одного общего номера (наш самый большой вмещает ${m}). Однако вы можете забронировать несколько номеров рядом! Пожалуйста, выберите подходящие варианты ниже и оформите их по отдельности.`
    },
    uk: {
      directBookingTitle: "Гарантія прямого бронювання",
      directBookingDesc: "Ви бронюєте безпосередньо у власника гостьового будинку. Жодних націнок систем бронювання (Booking.com), прихованих зборів та переплат агентам.",
      commission: "Комісія",
      here: "Тут",
      compareTitle: "Порівняння характеристик номерів",
      characteristic: "Характеристика",
      price: "Вартість",
      perNight: "грн / ніч",
      capacity: "Місткість",
      guestsStr: "гостей",
      multipleRooms: (g: number, m: number) => `Для компанії з ${g} гостей у нас немає одного спільного номера (наш найбільший вміщує ${m}). Однак ви можете забронювати кілька номерів поруч! Будь ласка, виберіть відповідні варіанти нижче і оформіть їх окремо.`
    },
    en: {
      directBookingTitle: "Direct Booking Guarantee",
      directBookingDesc: "You are booking directly with the guest house owner. No booking system markups (Booking.com), hidden fees, or agent overpayments.",
      commission: "Commission",
      here: "Here",
      compareTitle: "Room Features Comparison",
      characteristic: "Characteristic",
      price: "Price",
      perNight: "UAH / night",
      capacity: "Capacity",
      guestsStr: "guests",
      multipleRooms: (g: number, m: number) => `For a group of ${g} guests, we don't have a single shared room (our largest accommodates ${m}). However, you can book several rooms next to each other! Please select suitable options below and book them separately.`
    }
  };
  const langKey = (lang || i18n.language || "ru").slice(0, 2) as "ru" | "uk" | "en";
  const tLocal = localTranslations[langKey] || localTranslations.ru;

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
        onFilterChange={(rooms, guests) => {
          setFilteredRooms(rooms);
          setSearchedGuests(guests);
        }}
      />

      {/* Direct Booking & Long Stay Discount Banner */}
      <div className="max-w-4xl mx-auto mb-10 sm:mb-12 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Banner 1: Direct booking */}
        <div className="relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-teal-950/20 border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-4 text-left pr-10 sm:pr-0">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-white leading-tight">{tLocal.directBookingTitle}</h4>
              <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 leading-tight">{tLocal.directBookingDesc}</p>
            </div>
          </div>
          <div className="absolute top-3 right-3 sm:static sm:top-auto sm:right-auto flex gap-2 items-center shrink-0">
            <div className="text-center bg-teal-500/10 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-teal-500/20">
              <span className="text-[8px] sm:text-[10px] text-teal-300 block font-bold leading-none">{tLocal.here}</span>
              <span className="text-xs sm:text-sm font-extrabold text-teal-300 leading-none">0%</span>
            </div>
          </div>
        </div>

        {/* Banner 2: Auto Long Stay Discount */}
        <div className="relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-emerald-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-4 text-left pr-12 sm:pr-0">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 text-sm sm:text-xl">
              🎁
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-white leading-tight">
                {langKey === "uk" ? "Знижки за тривале проживання" : langKey === "en" ? "Long Stay Discounts" : "Скидки за длительное проживание"}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 leading-tight">
                {langKey === "uk" 
                  ? "Автоматично: від 7 ночей — знижка 5%, від 10 ночей — 10%!"
                  : langKey === "en"
                  ? "Automatic: 7+ nights = 5% off, 10+ nights = 10% off!"
                  : "Автоматически: от 7 ночей — 5%, от 10 ночей — 10%!"}
              </p>
            </div>
          </div>
          <div className="absolute top-3 right-3 sm:static sm:top-auto sm:right-auto flex flex-col gap-1 items-end shrink-0">
            <span className="text-[10px] sm:text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl">
              до -10%
            </span>
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
              <h3 className="text-2xl font-extrabold text-white">{tLocal.compareTitle}</h3>
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
                    <th className="p-4 text-slate-400 font-semibold w-1/4">{tLocal.characteristic}</th>
                    {rooms.map((room) => (
                      <th key={room.id} className="p-4 font-bold text-white text-center">{room.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 text-slate-300 font-medium">{tLocal.price}</td>
                    {rooms.map((room) => (
                      <td key={room.id} className="p-4 text-center text-teal-300 font-bold">{room.price} {tLocal.perNight}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-300 font-medium">{tLocal.capacity}</td>
                    {rooms.map((room) => (
                      <td key={room.id} className="p-4 text-center text-slate-200">{room.capacity} {tLocal.guestsStr}</td>
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

      <section id="available-rooms" className="py-16 lg:py-12 md:py-16 bg-slate-950 scroll-mt-20">
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
            {needsMultipleRooms && (
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl max-w-2xl mx-auto flex items-start text-left gap-4 animate-fade-in-up">
                <HelpCircle className="h-6 w-6 text-teal-400 shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-teal-50 leading-relaxed font-medium">
                  {tLocal.multipleRooms(searchedGuests, maxCapacity)}
                </p>
              </div>
            )}
          </div>
          <RoomsList rooms={displayRooms} onCompareClick={() => setShowComparison(true)} />
        </div>
      </section>
    </>
  );
}
