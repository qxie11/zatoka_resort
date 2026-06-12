"use client";

import { useState } from "react";
import BookingForm from "./BookingForm";
import RoomsList from '@/components/rooms/RoomsList';
import { WavyUnderline } from "@/components/ui/wavy-underline";
import type { Room, Booking } from "@/lib/types";
import { useTranslation } from "react-i18next";

interface BookingPageClientProps {
  rooms: Room[];
  bookings: Booking[];
}

export default function BookingPageClient({ rooms, bookings }: BookingPageClientProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const displayRooms = filteredRooms !== null ? filteredRooms : rooms;
  const { t } = useTranslation();

  return (
    <>
      <BookingForm
        rooms={rooms}
        bookings={bookings}
        onFilterChange={setFilteredRooms}
      />

      <section className="py-16 lg:py-24 bg-slate-950">
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
