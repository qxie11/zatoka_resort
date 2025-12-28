"use client";

import { useState, useEffect } from "react";
import type { Room, Booking } from "@/lib/types";
import RoomsSelector from "@/components/admin/RoomsSelector";
import AdminCalendar from "@/components/admin/AdminCalendar";

interface AdminOverviewProps {
  initialRooms: Room[];
  initialBookings: Booking[];
}

export default function AdminOverview({
  initialRooms,
  initialBookings,
}: AdminOverviewProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    initialRooms[0] || null
  );
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  return (
    <div className="flex flex-col gap-8">
      <div className="md:col-span-1">
        <RoomsSelector
          rooms={initialRooms}
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
        />
      </div>
      <div className="md:col-span-2">
        <AdminCalendar selectedRoom={selectedRoom} bookings={bookings} />
      </div>
    </div>
  );
}
