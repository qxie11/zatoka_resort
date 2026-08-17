"use client";

import { useMemo, useState } from "react";
import type { Booking, Room } from "@/lib/types";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";

interface AdminBookingGridProps {
  bookings: Booking[];
  rooms: Room[];
}

export default function AdminBookingGrid({ bookings, rooms }: AdminBookingGridProps) {
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const daysToShow = 14; // View 2 weeks at a time

  const dates = useMemo(() => {
    return Array.from({ length: daysToShow }).map((_, i) => addDays(startDate, i));
  }, [startDate, daysToShow]);

  // Navigate dates
  const goPrev = () => setStartDate(prev => addDays(prev, -7));
  const goNext = () => setStartDate(prev => addDays(prev, 7));
  const goToday = () => setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col relative">
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-teal-300 mb-4 border-b border-slate-800 pb-2">
              Детали бронирования
            </h3>
            <div className="space-y-3 text-sm text-slate-300 mb-6">
              <p><span className="font-semibold text-slate-400">Имя:</span> {selectedBooking.name}</p>
              <p><span className="font-semibold text-slate-400">Телефон:</span> {selectedBooking.phone}</p>
              {selectedBooking.email && <p><span className="font-semibold text-slate-400">Email:</span> {selectedBooking.email}</p>}
              <p><span className="font-semibold text-slate-400">Заезд:</span> {format(new Date(selectedBooking.startDate), 'dd.MM.yyyy')}</p>
              <p><span className="font-semibold text-slate-400">Выезд:</span> {format(new Date(selectedBooking.endDate), 'dd.MM.yyyy')}</p>
              <p><span className="font-semibold text-slate-400">Сумма:</span> {selectedBooking.pricePaid || 0} грн</p>
              {selectedBooking.promoCode && <p><span className="font-semibold text-slate-400">Промокод:</span> {selectedBooking.promoCode}</p>}
              {selectedBooking.adminComment && (
                <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="font-semibold text-slate-400 block mb-1">Примечание:</span>
                  <p className="text-slate-200">{selectedBooking.adminComment}</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSelectedBooking(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className="p-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold">Шахматка бронирований</h3>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={goPrev} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-medium">Пред. неделя</button>
          <button onClick={goToday} className="px-2.5 py-1 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 rounded-md text-xs font-bold">Сегодня</button>
          <button onClick={goNext} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-medium">След. неделя</button>
        </div>
      </div>
      
      <div className="w-full">
        <div className="w-full">
          {/* Header row */}
          <div className="flex border-b border-slate-800 sticky top-0 bg-slate-900 z-30 shadow-md">
            <div className="w-24 sm:w-48 shrink-0 border-r border-slate-800 p-1.5 sm:p-2 font-semibold text-slate-400 text-xs sm:text-sm flex items-center sticky left-0 bg-slate-900 z-40 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.5)]">
              Номера / Даты
            </div>
            <div className="flex flex-1">
              {dates.map((date, i) => (
                <div key={i} className="flex-1 min-w-[50px] border-r border-slate-800/50 p-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-slate-500 uppercase leading-tight">{format(date, 'E', { locale: ru })}</span>
                  <span className={`text-xs sm:text-sm font-bold ${isSameDay(date, new Date()) ? 'text-teal-400' : 'text-slate-300'}`}>
                    {format(date, 'd')}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Room / Unit rows */}
          <div className="flex flex-col">
            {rooms.map(room => {
              // Expand room into its units, or just 1 row if no units
              const units = room.units && room.units.length > 0 
                ? room.units 
                : [{ id: null, name: 'Основной' }];
                
              return (
                <div key={room.id} className="flex flex-col">
                  {/* Category header for room */}
                  <div className="bg-slate-800/40 px-3 py-1 border-b border-slate-800/50 flex justify-between items-center sticky left-0 w-full z-20 backdrop-blur-sm">
                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-teal-400">{room.name}</span>
                    <span className="text-[9px] sm:text-xs font-semibold text-slate-500 whitespace-nowrap ml-4">{room.price} грн/сутки</span>
                  </div>

                  {units.map((unit, index) => (
                    <div key={unit.id || `${room.id}-${index}`} className="flex border-b border-slate-800/50 hover:bg-slate-800/30 group">
                      <div className="w-24 sm:w-48 shrink-0 border-r border-slate-800 p-1.5 sm:p-2 flex flex-col justify-center sticky left-0 bg-slate-900 group-hover:bg-slate-800/90 z-10 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.5)] transition-colors">
                        <span className="font-bold text-[10px] sm:text-xs text-slate-200 truncate" title={unit.name}>{unit.name}</span>
                      </div>
                      <div className="flex flex-1 relative">
                        {/* Grid columns background */}
                        {dates.map((date, i) => (
                          <div key={i} className={`flex-1 min-w-[50px] border-r border-slate-800/30 ${isSameDay(date, new Date()) ? 'bg-teal-500/5' : ''}`}></div>
                        ))}
                        
                        {/* Render Bookings Overlays */}
                        {bookings
                          .filter(b => b.roomId === room.id && (unit.id ? b.unitId === unit.id : true))
                          .map(booking => {
                            const bStart = new Date(booking.startDate);
                            const bEnd = new Date(booking.endDate);
                            
                            // Check if booking overlaps with current view
                            const viewStart = dates[0];
                            const viewEnd = addDays(dates[dates.length - 1], 1);
                            
                            if (bEnd <= viewStart || bStart >= viewEnd) return null;
                            
                            // Calculate positions
                            // We assume each cell represents 1 day
                            const startIndex = Math.max(0, Math.floor((bStart.getTime() - viewStart.getTime()) / (1000 * 3600 * 24)));
                            const endIndex = Math.min(daysToShow, Math.ceil((bEnd.getTime() - viewStart.getTime()) / (1000 * 3600 * 24)));
                            
                            const span = endIndex - startIndex;
                            if (span <= 0) return null;
                            
                            // Determine color based on status
                            let colorClass = "bg-teal-500/20 border-teal-500/50 text-teal-300";
        
                            return (
                              <div 
                                key={booking.id}
                                onClick={() => setSelectedBooking(booking)}
                                className={`absolute top-0.5 bottom-0.5 rounded-md border ${colorClass} px-2 py-0.5 shadow-sm overflow-hidden text-[10px] sm:text-xs font-medium flex items-center cursor-pointer hover:bg-teal-500/30 hover:border-teal-400 z-10 transition-all`}
                                style={{
                                  left: `calc(${(startIndex / daysToShow) * 100}%)`,
                                  width: `calc(${(span / daysToShow) * 100}%)`
                                }}
                                title={`${booking.name}`}
                              >
                                <span className="truncate">{booking.name}</span>
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
