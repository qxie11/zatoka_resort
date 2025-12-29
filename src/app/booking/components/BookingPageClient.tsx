"use client";

import { useState } from "react";
import BookingForm from "./BookingForm";
import RoomsList from '@/components/rooms/RoomsList';
import { WavyUnderline } from "@/components/ui/wavy-underline";
import type { Room, Booking } from "@/lib/types";

interface BookingPageClientProps {
  rooms: Room[];
  bookings: Booking[];
}

export default function BookingPageClient({ rooms, bookings }: BookingPageClientProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const displayRooms = filteredRooms !== null ? filteredRooms : rooms;

  return (
    <>
      <BookingForm 
        rooms={rooms} 
        bookings={bookings} 
        onFilterChange={setFilteredRooms}
      />

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {filteredRooms !== null ? "Доступные номера" : "Наши номера и люксы"}
            </h2>
            <WavyUnderline />
            <p className="mt-2 text-muted-foreground">
              {filteredRooms !== null 
                ? `Найдено ${filteredRooms.length} номеров по вашему запросу.`
                : "Найдите идеальное пространство для вашего пребывания."}
            </p>
          </div>
          <RoomsList rooms={displayRooms} />
        </div>
      </section>
    </>
  );
}

