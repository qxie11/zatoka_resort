"use client";

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
    <Card className="glass-card-dark border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden text-white">
      <CardHeader className="border-b border-white/5 bg-slate-950/20 p-5 sm:p-6">
        <CardTitle className="text-xl font-extrabold text-white">Номера</CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">Выберите домик / номер, чтобы увидеть его текущие бронирования на календаре.</p>
        <Select 
          onValueChange={handleRoomChange} 
          value={selectedRoom?.id || undefined}
        >
          <SelectTrigger className="w-full bg-slate-950/40 border-white/10 text-white rounded-xl focus:ring-teal-400/50 shadow-sm h-11">
            <SelectValue placeholder="Выберите домик / номер" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl shadow-2xl">
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id} className="focus:bg-white/10 focus:text-teal-300 rounded-lg py-2 cursor-pointer">
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
