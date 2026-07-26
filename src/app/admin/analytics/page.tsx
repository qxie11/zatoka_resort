import { getRooms, getBookings } from '@/lib/db';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AnalyticsPage() {
  const [rooms, bookings] = await Promise.all([
    getRooms(),
    getBookings()
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Аналитика бронирований</h1>
      <AdminDashboard bookings={bookings} rooms={rooms} />
    </div>
  );
}
