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
    <Card>
      <CardHeader>
        <CardTitle>Номера</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">Выберите номер, чтобы увидеть его бронирования.</p>
        <Select 
          onValueChange={handleRoomChange} 
          value={selectedRoom?.id || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите номер" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

