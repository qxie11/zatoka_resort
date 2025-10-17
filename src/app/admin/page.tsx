"use client";

import { useState } from "react";
import { rooms, bookings } from "@/lib/data";
import type { Room, Booking } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ru } from "date-fns/locale";

export default function AdminPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[0] || null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const handleRoomChange = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId) || null;
    setSelectedRoom(room);
    if (room) {
      const roomBookings = bookings.filter((b: Booking) => b.roomId === room.id);
      const dates: Date[] = [];
      roomBookings.forEach((booking) => {
        let currentDate = new Date(booking.startDate);
        while (currentDate <= booking.endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      setBookedDates(dates);
    } else {
      setBookedDates([]);
    }
  };
  
  // Initialize with the first room's bookings
  useState(() => {
    if (rooms.length > 0) {
      handleRoomChange(rooms[0].id);
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Номера</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Выберите номер, чтобы увидеть его бронирования.</p>
              <Select onValueChange={handleRoomChange} defaultValue={selectedRoom?.id}>
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
        </div>
        <div className="md:col-span-2">
          <Card>
             <CardHeader>
              <CardTitle>Календарь бронирований</CardTitle>
               <p className="text-muted-foreground pt-2">
                {selectedRoom ? `Показаны бронирования для "${selectedRoom.name}"` : 'Выберите номер для просмотра бронирований'}
              </p>
            </CardHeader>
            <CardContent className="flex justify-center">
              {selectedRoom ? (
                <Calendar
                  mode="multiple"
                  selected={bookedDates}
                  defaultMonth={bookedDates.length > 0 ? bookedDates[0] : new Date()}
                  locale={ru}
                  className="rounded-md border"
                  classNames={{
                      day_selected: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive/90",
                  }}
                   modifiers={{
                    booked: bookedDates,
                  }}
                  modifiersStyles={{
                    booked: { 
                      color: 'white',
                      backgroundColor: 'hsl(var(--destructive))' 
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Пожалуйста, выберите номер, чтобы увидеть календарь.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
