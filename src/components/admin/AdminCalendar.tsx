"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Room, Booking } from "@/lib/types";
import { ru } from "date-fns/locale";
import { format, startOfDay, isAfter, isToday, isFuture } from "date-fns";
import { cn } from "@/lib/utils";

interface AdminCalendarProps {
  selectedRoom: Room | null;
  bookings: Booking[];
}

interface BookingRange {
  booking: Booking;
  startDate: Date;
  endDate: Date;
}

export default function AdminCalendar({ selectedRoom, bookings }: AdminCalendarProps) {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [bookingRanges, setBookingRanges] = useState<BookingRange[]>([]);

  useEffect(() => {
    if (selectedRoom) {
      const today = startOfDay(new Date());
      
      // Фильтруем только актуальные бронирования (endDate >= сегодня)
      const roomBookings = bookings.filter((b: Booking) => {
        const endDate = startOfDay(new Date(b.endDate));
        return b.roomId === selectedRoom.id && (isAfter(endDate, today) || isToday(endDate));
      });
      
      const dates: Date[] = [];
      const ranges: BookingRange[] = [];

      roomBookings.forEach((booking) => {
        const start = startOfDay(new Date(booking.startDate));
        const end = startOfDay(new Date(booking.endDate));
        
        ranges.push({
          booking,
          startDate: start,
          endDate: end,
        });

        let currentDate = new Date(start);
        while (currentDate <= end) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      setBookedDates(dates);
      setBookingRanges(ranges);
    } else {
      setBookedDates([]);
      setBookingRanges([]);
    }
  }, [bookings, selectedRoom]);

  // Статистика
  const stats = useMemo(() => {
    if (!selectedRoom || bookingRanges.length === 0) {
      return { totalDays: 0, totalBookings: 0 };
    }
    const totalDays = bookedDates.length;
    const totalBookings = bookingRanges.length;
    return { totalDays, totalBookings };
  }, [selectedRoom, bookedDates.length, bookingRanges.length]);

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Календарь бронирований</CardTitle>
            <p className="text-muted-foreground pt-2">
              {selectedRoom ? (
                <>
                  <span className="font-semibold text-foreground">{selectedRoom.name}</span>
                  <span className="ml-3 text-sm">
                    • {stats.totalBookings} {stats.totalBookings === 1 ? 'бронирование' : 'бронирований'} 
                    • {stats.totalDays} {stats.totalDays === 1 ? 'день' : 'дней'}
                  </span>
                </>
              ) : (
                'Выберите номер для просмотра бронирований'
              )}
            </p>
          </div>
          {selectedRoom && stats.totalBookings > 0 && (
            <Badge variant="destructive" className="text-base px-4 py-2 font-semibold">
              {stats.totalBookings} {stats.totalBookings === 1 ? 'бронирование' : 'бронирований'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {selectedRoom ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={bookedDates}
                defaultMonth={bookedDates.length > 0 ? bookedDates[0] : new Date()}
                locale={ru}
                numberOfMonths={2}
                className="rounded-md border"
                classNames={{
                  day_selected: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive/90 font-bold shadow-md",
                }}
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersClassNames={{
                  booked: "bg-destructive text-destructive-foreground font-bold",
                }}
              />
            </div>
            
            {/* Детали бронирований */}
            {bookingRanges.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-lg mb-3">Детали бронирований:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bookingRanges.map((range) => (
                    <div
                      key={range.booking.id}
                      className="p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{range.booking.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {format(range.startDate, "dd.MM")} - {format(range.endDate, "dd.MM.yyyy")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {range.booking.email && <p>📧 {range.booking.email}</p>}
                        <p>📞 {range.booking.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Выберите номер</p>
              <p className="text-sm">для просмотра календаря бронирований</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
