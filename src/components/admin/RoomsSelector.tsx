"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Room } from "@/lib/types";

interface RoomsSelectorProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onRoomChange: (room: Room | null) => void;
}

export default function RoomsSelector({ rooms, selectedRoom, onRoomChange }: RoomsSelectorProps) {
  const handleRoomChange = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId) || null;
    onRoomChange(room);
  };

  return (
    <Card className="glass-card-premium border border-white/50 bg-white/70 backdrop-blur-md rounded-3xl shadow-soft overflow-hidden">
      <CardHeader className="border-b border-slate-100/50 bg-white/30 p-5 sm:p-6">
        <CardTitle className="text-xl font-bold text-slate-900">Номера</CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <p className="text-slate-600 text-sm font-light leading-relaxed mb-4">Выберите номер, чтобы увидеть его текущие бронирования на календаре.</p>
        <Select 
          onValueChange={handleRoomChange} 
          value={selectedRoom?.id || undefined}
        >
          <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-11">
            <SelectValue placeholder="Выберите номер" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl shadow-md">
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id} className="focus:bg-sky-50 focus:text-primary rounded-lg py-2">
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

