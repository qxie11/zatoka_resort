"use client";

import { useMemo } from 'react';
import type { Booking, Room } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';

interface AdminDashboardProps {
  bookings: Booking[];
  rooms: Room[];
}

const COLORS = ['#14b8a6', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard({ bookings, rooms }: AdminDashboardProps) {
  // Aggregate revenue and checkins by month
  const monthlyData = useMemo(() => {
    const data: Record<string, { revenue: number; checkins: number }> = {};
    bookings.forEach(b => {
      const date = new Date(b.startDate);
      const month = date.toLocaleString('ru-RU', { month: 'short' });
      
      const days = Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 3600 * 24));
      const room = rooms.find(r => r.id === b.roomId);
      const price = room ? room.price * days : 0;
      
      if (!data[month]) data[month] = { revenue: 0, checkins: 0 };
      data[month].revenue += price;
      data[month].checkins += 1;
    });
    
    return Object.entries(data).map(([name, vals]) => ({ name, revenue: vals.revenue, checkins: vals.checkins }));
  }, [bookings, rooms]);

  // Aggregate bookings and revenue by room
  const roomData = useMemo(() => {
    const data: Record<string, { count: number; revenue: number }> = {};
    bookings.forEach(b => {
      const room = rooms.find(r => r.id === b.roomId);
      const name = room ? room.name : 'Удаленный номер';
      
      const days = Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 3600 * 24));
      const price = room ? room.price * days : 0;
      
      if (!data[name]) data[name] = { count: 0, revenue: 0 };
      data[name].count += 1;
      data[name].revenue += price;
    });
    return Object.entries(data).map(([name, vals]) => ({ name, count: vals.count, revenue: vals.revenue }));
  }, [bookings, rooms]);

  // Calculate KPIs
  const totalBookings = bookings.length;
  
  const totalRevenue = bookings.reduce((sum, b) => {
    const days = Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 3600 * 24));
    const room = rooms.find(r => r.id === b.roomId);
    return sum + (room ? room.price * days : 0);
  }, 0);
  
  const averageCheck = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
  
  const averageDuration = totalBookings > 0 
    ? Math.round(bookings.reduce((sum, b) => sum + Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 3600 * 24)), 0) / totalBookings)
    : 0;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Общая выручка</span>
          <span className="text-3xl font-extrabold text-teal-400">{totalRevenue.toLocaleString('ru-RU')} грн</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Бронирований</span>
          <span className="text-3xl font-extrabold text-sky-400">{totalBookings}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Средний чек</span>
          <span className="text-3xl font-extrabold text-amber-400">{averageCheck.toLocaleString('ru-RU')} грн</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Ср. длительность</span>
          <span className="text-3xl font-extrabold text-rose-400">{averageDuration} дней</span>
        </div>
      </div>

      {/* Row 1: Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-100">Выручка по месяцам (ГРН)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                  itemStyle={{ color: '#14b8a6' }}
                  formatter={(value) => [`${value} грн`, 'Выручка']}
                />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Check-ins Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-100">Количество заездов по месяцам</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                  itemStyle={{ color: '#f59e0b' }}
                  formatter={(value) => [`${value} заездов`, 'Кол-во']}
                />
                <Line type="monotone" dataKey="checkins" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Row 2: Room Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue by Room (Bar) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-100">Выручка по номерам (ГРН)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                  itemStyle={{ color: '#0ea5e9' }}
                  formatter={(value) => [`${value} грн`, 'Выручка']}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Rooms Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-100">Популярность номеров (Кол-во броней)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {roomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => [`${value} броней`, 'Кол-во']}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
