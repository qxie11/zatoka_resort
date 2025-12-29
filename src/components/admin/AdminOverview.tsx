"use client";

import { useState, useEffect } from "react";
import type { Room, Booking } from "@/lib/types";
import { useGetRoomsQuery, useGetBookingsQuery } from "@/lib/api";
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
  // Используем RTK Query для получения актуальных данных
  const { data: rooms = initialRooms } = useGetRoomsQuery();
  const { data: bookings = initialBookings } = useGetBookingsQuery();
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    initialRooms[0] || null
  );

  // Обновляем selectedRoom если текущий не найден в обновленном списке
  useEffect(() => {
    if (selectedRoom && !rooms.find(r => r.id === selectedRoom.id)) {
      setSelectedRoom(rooms[0] || null);
    } else if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms, selectedRoom]);

  return (
    <div className="flex flex-col gap-8">
      <div className="md:col-span-1">
        <RoomsSelector
          rooms={rooms}
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
