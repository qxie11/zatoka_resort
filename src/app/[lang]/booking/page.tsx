import { getRooms, getBookings } from "@/lib/db";
import BookingClient from "@/components/booking/BookingClient";

export const dynamic = "force-dynamic";

export default async function BookingPage({ params }: { params: { lang: string } }) {
  const [rooms, bookings] = await Promise.all([getRooms(), getBookings()]);

  return <BookingClient rooms={rooms} bookings={bookings} lang={params.lang} />;
}
