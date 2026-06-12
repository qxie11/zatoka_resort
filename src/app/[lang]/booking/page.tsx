import { getRooms, getBookings } from "@/lib/db";
import BookingClient from "@/components/booking/BookingClient";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const rooms = await getRooms();
  const bookings = await getBookings();

  return <BookingClient rooms={rooms} bookings={bookings} />;
}
