"use client";

import type { Room } from '@/lib/types';
import RoomCard from '@/app/booking/components/RoomCard';

interface RoomsListProps {
  rooms: Room[];
}

export default function RoomsList({ rooms }: RoomsListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Номера пока не доступны</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

