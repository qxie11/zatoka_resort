"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Room, Booking } from "@/lib/types";
import { ru } from "date-fns/locale";
import { format, startOfDay, isAfter, isToday } from "date-fns";

interface AdminCalendarProps {
  selectedRoom: Room | null;
  bookings: Booking[];
}

interface BookingRange {
  booking: Booking;
  startDate: Date;
  endDate: Date;
}

interface UnitCalendarData {
  unitId: string | null;
  unitName: string;
  bookedDates: Date[];
  bookingRanges: BookingRange[];
}

export default function AdminCalendar({ selectedRoom, bookings }: AdminCalendarProps) {
  const unitCalendars = useMemo<UnitCalendarData[]>(() => {
    if (selectedRoom) {
      const today = startOfDay(new Date());
      
      const roomBookings = bookings.filter((b: Booking) => {
        const endDate = startOfDay(new Date(b.endDate));
        return b.roomId === selectedRoom.id && (isAfter(endDate, today) || isToday(endDate));
      });
      
      const computeDataForBookings = (filteredBookings: Booking[], unitId: string | null, unitName: string): UnitCalendarData => {
        const dates: Date[] = [];
        const ranges: BookingRange[] = [];
        filteredBookings.forEach((booking) => {
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
        return { unitId, unitName, bookedDates: dates, bookingRanges: ranges };
      };

      const result: UnitCalendarData[] = [];

      if (selectedRoom.units && selectedRoom.units.length > 0) {
        selectedRoom.units.forEach(unit => {
          const unitBookings = roomBookings.filter(b => b.unitId === unit.id);
          result.push(computeDataForBookings(unitBookings, unit.id!, unit.name));
        });
        
        const unassignedBookings = roomBookings.filter(b => !b.unitId);
        if (unassignedBookings.length > 0) {
          result.push(computeDataForBookings(unassignedBookings, null, "Без привязки к конкретному юниту"));
        }
      } else {
        result.push(computeDataForBookings(roomBookings, null, "Общий календарь"));
      }

      return result;
    }
    return [];
  }, [bookings, selectedRoom]);

  const stats = useMemo(() => {
    if (!selectedRoom || unitCalendars.length === 0) {
      return { totalDays: 0, totalBookings: 0 };
    }
    const totalDays = unitCalendars.reduce((sum, c) => sum + c.bookedDates.length, 0);
    const totalBookings = unitCalendars.reduce((sum, c) => sum + c.bookingRanges.length, 0);
    return { totalDays, totalBookings };
  }, [selectedRoom, unitCalendars]);

  return (
    <Card className="glass-card-dark border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden text-white">
      <CardHeader className="border-b border-white/5 bg-slate-950/20 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-white">Календарь бронирований</CardTitle>
            <div className="text-slate-300 text-sm font-light mt-2">
              {selectedRoom ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-teal-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/5">{selectedRoom.name}</span>
                  <span className="text-xs text-slate-400">
                    • {stats.totalBookings} {stats.totalBookings === 1 ? 'бронирование' : 'бронирований'} 
                    • {stats.totalDays} {stats.totalDays === 1 ? 'день' : 'дней'}
                  </span>
                </div>
              ) : (
                'Выберите домик / номер для просмотра бронирований'
              )}
            </div>
          </div>
          {selectedRoom && stats.totalBookings > 0 && (
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold border-0 shadow-sm text-sm px-3.5 py-1.5 rounded-full">
              Занято {stats.totalDays} {stats.totalDays === 1 ? 'день' : 'дней'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        {selectedRoom ? (
          <div className="space-y-10">
            {unitCalendars.map((uc, index) => (
              <div key={uc.unitId || `unassigned-${index}`} className="space-y-6">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                  <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-lg text-sm">{uc.unitName}</span>
                </h3>
                
                <div className="flex justify-center bg-slate-950/40 p-4 rounded-2xl border border-white/10 shadow-inner max-w-full overflow-x-auto text-white">
                  <Calendar
                    mode="multiple"
                    selected={uc.bookedDates}
                    defaultMonth={uc.bookedDates.length > 0 ? uc.bookedDates[0] : new Date()}
                    locale={ru}
                    numberOfMonths={2}
                    className="rounded-xl bg-slate-950 text-white border-0"
                    classNames={{
                      day_selected: "gradient-sunset text-slate-950 font-bold shadow-md rounded-lg",
                    }}
                    modifiers={{
                      booked: uc.bookedDates,
                    }}
                    modifiersClassNames={{
                      booked: "gradient-sunset text-slate-950 font-bold rounded-lg",
                    }}
                  />
                </div>
                
                {uc.bookingRanges.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-300 text-sm uppercase tracking-wider">Детали бронирований ({uc.unitName})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uc.bookingRanges.map((range) => (
                        <div
                          key={range.booking.id}
                          className="p-4 border border-white/10 bg-slate-950/40 rounded-2xl shadow-lg hover:border-teal-400/30 transition-smooth"
                        >
                          <div className="flex items-center justify-between mb-3 gap-2">
                            <span className="font-extrabold text-white">{range.booking.name}</span>
                            <Badge variant="outline" className="text-xs bg-slate-900 border-white/10 text-teal-300 px-2 py-0.5 rounded-md font-semibold">
                              {format(range.startDate, "dd.MM")} - {format(range.endDate, "dd.MM.yyyy")}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-300 space-y-1.5 font-light">
                            {range.booking.email && <p className="flex items-center gap-1.5"><span>📧</span> <span className="hover:text-teal-300 transition-colors">{range.booking.email}</span></p>}
                            <p className="flex items-center gap-1.5"><span>📞</span> <span>{range.booking.phone}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 bg-slate-900/20 rounded-2xl border border-dashed border-white/10">
            <div className="text-center p-6">
              <p className="text-lg font-light mb-1">Ожидание выбора</p>
              <p className="text-xs font-light">Выберите домик / номер в панели слева для просмотра календаря бронирований</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
