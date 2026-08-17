"use client";

import React, { useMemo, useState } from "react";
import { format, isToday, isWithinInterval, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Search, 
  Phone, 
  User, 
  Calendar, 
  ArrowRight, 
  Clock, 
  Home, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  ChevronDown, 
  Sparkles,
  BedDouble
} from "lucide-react";
import type { Booking, Room } from "@/lib/types";
import { useGetBookingsQuery } from "@/lib/api";

interface LogsClientProps {
  initialBookings: Booking[];
  initialRooms: Room[];
}

export default function LogsClient({ initialBookings, initialRooms }: LogsClientProps) {
  // Use RTK Query to get real-time bookings, fallback to initialBookings
  const { data: bookings = initialBookings } = useGetBookingsQuery();
  const rooms = initialRooms;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Room names map for easy lookup
  const roomNamesMap = useMemo(() => {
    const map: Record<string, string> = {};
    rooms.forEach((room) => {
      map[room.id] = room.name;
    });
    return map;
  }, [rooms]);

  // Statistics calculations
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    let activeNow = 0;
    let checkOutsToday = 0;
    let upcoming = 0;

    bookings.forEach((b) => {
      const start = startOfDay(new Date(b.startDate));
      const end = startOfDay(new Date(b.endDate));
      
      // Active now: today is between start and end
      if (today >= start && today < end && b.status !== "CANCELLED") {
        activeNow++;
      }
      
      // Checking out today
      if (isToday(end) && b.status !== "CANCELLED") {
        checkOutsToday++;
      }
      
      // Upcoming bookings
      if (start > today && b.status !== "CANCELLED") {
        upcoming++;
      }
    });

    return {
      total: bookings.length,
      activeNow,
      checkOutsToday,
      upcoming
    };
  }, [bookings]);

  // Filter logs based on search and status
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch = 
          b.name.toLowerCase().includes(query) || 
          b.phone.includes(query) ||
          (b.email && b.email.toLowerCase().includes(query)) ||
          (roomNamesMap[b.roomId] && roomNamesMap[b.roomId].toLowerCase().includes(query));

        if (statusFilter === "ALL") return matchesSearch;
        if (statusFilter === "ACTIVE") {
          const today = startOfDay(new Date());
          const start = startOfDay(new Date(b.startDate));
          const end = startOfDay(new Date(b.endDate));
          return matchesSearch && today >= start && today < end && b.status !== "CANCELLED";
        }
        if (statusFilter === "COMPLETED") {
          const today = startOfDay(new Date());
          const end = startOfDay(new Date(b.endDate));
          return matchesSearch && today >= end && b.status !== "CANCELLED";
        }
        if (statusFilter === "UPCOMING") {
          const today = startOfDay(new Date());
          const start = startOfDay(new Date(b.startDate));
          return matchesSearch && start > today && b.status !== "CANCELLED";
        }
        if (statusFilter === "CANCELLED") {
          return matchesSearch && b.status === "CANCELLED";
        }
        return matchesSearch;
      })
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [bookings, searchTerm, statusFilter, roomNamesMap]);

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-teal-400" />
          Логи заездов и выездов
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          История заселения гостей, даты заезда/выезда, комнаты и контактная информация из бронирований.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-teal-500/30 transition-all duration-300">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-12 h-12 text-teal-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Всего записей</span>
          <div className="text-2xl font-extrabold text-white mt-1">{stats.total}</div>
          <p className="text-[10px] text-slate-500 mt-2">Общая история бронирований</p>
        </div>

        {/* Currently Active */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Проживают сейчас</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.activeNow}</div>
          <p className="text-[10px] text-slate-500 mt-2">Гости, находящиеся в отеле</p>
        </div>

        {/* Check-outs Today */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <AlertCircle className="w-12 h-12 text-amber-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Выезд сегодня</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{stats.checkOutsToday}</div>
          <p className="text-[10px] text-slate-500 mt-2">Ожидаемый выезд сегодня</p>
        </div>

        {/* Upcoming */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-12 h-12 text-sky-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Будущие заезды</span>
          <div className="text-2xl font-extrabold text-sky-400 mt-1">{stats.upcoming}</div>
          <p className="text-[10px] text-slate-500 mt-2">Бронирования на будущие даты</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по имени, телефону, комнате..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Фильтр:
          </span>
          {[
            { id: "ALL", label: "Все" },
            { id: "ACTIVE", label: "Проживают" },
            { id: "UPCOMING", label: "Предстоящие" },
            { id: "COMPLETED", label: "Завершённые" },
            { id: "CANCELLED", label: "Отменённые" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                statusFilter === filter.id
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 font-semibold">Гость / Контакты</th>
                <th className="py-3 px-4 font-semibold">Комната / Юнит</th>
                <th className="py-3 px-4 font-semibold">Дата заезда (Заехал)</th>
                <th className="py-3 px-4 font-semibold">Дата выезда (Выехал)</th>
                <th className="py-3 px-4 font-semibold text-center">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const roomName = roomNamesMap[b.roomId] || "Неизвестно";
                  const unitName = b.unitName || "Основной";
                  const nights = Math.max(
                    1,
                    Math.ceil(
                      (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 
                      (1000 * 3600 * 24)
                    )
                  );

                  // Date styles / labels
                  const start = new Date(b.startDate);
                  const end = new Date(b.endDate);

                  return (
                    <tr 
                      key={b.id} 
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Guest Contacts */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white leading-snug">{b.name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              {b.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Room & Unit */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0">
                            <BedDouble className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200 block text-xs sm:text-sm">{roomName}</span>
                            <span className="text-[10px] text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block">
                              Юнит: {unitName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Check-in Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-100 block">
                              {format(start, "dd MMM yyyy", { locale: ru })}
                            </span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {format(start, "EEEE", { locale: ru })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Check-out Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-100 block">
                              {format(end, "dd MMM yyyy", { locale: ru })}
                            </span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {format(end, "EEEE", { locale: ru })} ({nights} ноч.)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {b.status === "CANCELLED" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide bg-rose-500/15 text-rose-400 border border-rose-500/20">
                            Отменено
                          </span>
                        ) : startOfDay(new Date()) >= startOfDay(start) && startOfDay(new Date()) < startOfDay(end) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            Проживает
                          </span>
                        ) : startOfDay(new Date()) >= startOfDay(end) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide bg-slate-800 text-slate-400 border border-slate-700">
                            Выехал
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide bg-teal-500/15 text-teal-400 border border-teal-500/20">
                            Ожидается
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <span>Записи не найдены</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
