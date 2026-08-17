import { getRooms, getBookings } from '@/lib/db';
import AdminBookingGrid from '@/components/admin/AdminBookingGrid';

export default async function AdminCalendarPage() {
  const [rooms, bookings] = await Promise.all([
    getRooms(),
    getBookings()
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Шахматка бронирований</h1>
      <AdminBookingGrid bookings={bookings} rooms={rooms} />
    </div>
  );
}
