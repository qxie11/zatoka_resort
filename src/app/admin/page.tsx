import { getRooms, getBookings } from '@/lib/db';
import AdminOverview from '@/components/admin/AdminOverview';

export default async function AdminPage() {
  const rooms = await getRooms();
  const bookings = await getBookings();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Панель администратора</h1>
      <AdminOverview 
        initialRooms={rooms}
        initialBookings={bookings}
      />
    </div>
  );
}
