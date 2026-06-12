import { getBookings, getRooms } from "@/lib/db";
import BookingsAdminClient from "./BookingsAdminClient";

export const dynamic = "force-dynamic";

export default async function BookingsAdminPage() {
  const [bookings, rooms] = await Promise.all([
    getBookings(),
    getRooms(),
  ]);

  return <BookingsAdminClient initialBookings={bookings} initialRooms={rooms} />;
}
