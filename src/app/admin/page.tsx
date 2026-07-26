import { getRooms, getBookings } from '@/lib/db';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const [rooms, bookings] = await Promise.all([
    getRooms(),
    getBookings()
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Панель администратора (Дашборд)</h1>
      <AdminDashboard bookings={bookings} rooms={rooms} />
      <h2 className="text-2xl font-bold mt-12 mb-4">Быстрый обзор номеров</h2>
      <AdminOverview 
        initialRooms={rooms}
        initialBookings={bookings}
      />
    </div>
  );
}
