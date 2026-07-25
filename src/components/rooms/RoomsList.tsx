"use client";

import type { Room } from '@/lib/types';
import { useTranslation } from "react-i18next";
import RoomCard from '@/app/[lang]/booking/components/RoomCard';

interface RoomsListProps {
  rooms: Room[];
  onCompareClick?: () => void;
}

export default function RoomsList({ rooms, onCompareClick }: RoomsListProps) {
  const { t } = useTranslation();

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t("roomsNotAvailable") || "Номера пока не доступны"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onCompareClick={onCompareClick} />
      ))}
    </div>
  );
}

