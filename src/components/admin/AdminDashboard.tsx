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
  Legend
} from 'recharts';

interface AdminDashboardProps {
  bookings: Booking[];
  rooms: Room[];
}

const COLORS = ['#14b8a6', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard({ bookings, rooms }: AdminDashboardProps) {
  // Aggregate revenue by month
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.startDate);
      const month = date.toLocaleString('ru-RU', { month: 'short' });
      
      const days = Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 3600 * 24));
      const room = rooms.find(r => r.id === b.roomId);
      const price = room ? room.price * days : 0;
      
      if (!data[month]) data[month] = 0;
      data[month] += price;
    });
    
    return Object.entries(data).map(([name, total]) => ({ name, total }));
  }, [bookings, rooms]);

  // Aggregate bookings by room
  const popularRoomsData = useMemo(() => {
    const data: Record<string, number> = {};
    bookings.forEach(b => {
      const room = rooms.find(r => r.id === b.roomId);
      const name = room ? room.name : 'Удаленный номер';
      if (!data[name]) data[name] = 0;
      data[name] += 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [bookings, rooms]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Revenue Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Выручка по месяцам (ГРН)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                itemStyle={{ color: '#14b8a6' }}
              />
              <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Rooms Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Популярность номеров (Кол-во броней)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={popularRoomsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {popularRoomsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
