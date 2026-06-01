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

  const stats = useMemo(() => {
    if (!selectedRoom || bookingRanges.length === 0) {
      return { totalDays: 0, totalBookings: 0 };
    }
    const totalDays = bookedDates.length;
    const totalBookings = bookingRanges.length;
    return { totalDays, totalBookings };
  }, [selectedRoom, bookedDates.length, bookingRanges.length]);

  return (
    <Card className="glass-card-premium border border-white/50 bg-white/70 backdrop-blur-md rounded-3xl shadow-soft overflow-hidden">
      <CardHeader className="border-b border-slate-100/50 bg-white/30 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900">Календарь бронирований</CardTitle>
            <div className="text-slate-600 text-sm font-light mt-2">
              {selectedRoom ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100/50">{selectedRoom.name}</span>
                  <span className="text-xs text-slate-500">
                    • {stats.totalBookings} {stats.totalBookings === 1 ? 'бронирование' : 'бронирований'} 
                    • {stats.totalDays} {stats.totalDays === 1 ? 'день' : 'дней'}
                  </span>
                </div>
              ) : (
                'Выберите номер для просмотра бронирований'
              )}
            </div>
          </div>
          {selectedRoom && stats.totalBookings > 0 && (
            <Badge className="gradient-sunset text-slate-950 font-bold border-0 shadow-sm text-sm px-3.5 py-1.5 rounded-full">
              Занято {stats.totalDays} {stats.totalDays === 1 ? 'день' : 'дней'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        {selectedRoom ? (
          <div className="space-y-6">
            <div className="flex justify-center bg-white/50 p-4 rounded-2xl border border-slate-100/50 shadow-sm max-w-full overflow-x-auto">
              <Calendar
                mode="multiple"
                selected={bookedDates}
                defaultMonth={bookedDates.length > 0 ? bookedDates[0] : new Date()}
                locale={ru}
                numberOfMonths={2}
                className="rounded-xl"
                classNames={{
                  day_selected: "gradient-sunset text-slate-950 font-bold shadow-md rounded-lg",
                }}
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersClassNames={{
                  booked: "gradient-sunset text-slate-950 font-bold rounded-lg",
                }}
              />
            </div>
            
            {bookingRanges.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Детали бронирований</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookingRanges.map((range) => (
                    <div
                      key={range.booking.id}
                      className="p-4 border border-slate-100 bg-white/80 rounded-2xl shadow-soft hover-lift transition-smooth"
                    >
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="font-bold text-slate-900">{range.booking.name}</span>
                        <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {format(range.startDate, "dd.MM")} - {format(range.endDate, "dd.MM.yyyy")}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1.5 font-light">
                        {range.booking.email && <p className="flex items-center gap-1.5"><span>📧</span> <span className="hover:text-primary transition-colors">{range.booking.email}</span></p>}
                        <p className="flex items-center gap-1.5"><span>📞</span> <span>{range.booking.phone}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 bg-white/30 rounded-2xl border border-dashed border-slate-200/50">
            <div className="text-center p-6">
              <p className="text-lg font-light mb-1">Ожидание выбора</p>
              <p className="text-xs font-light">Выберите номер в панели слева для просмотра календаря бронирований</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
