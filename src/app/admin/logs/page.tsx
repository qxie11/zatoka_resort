import { getBookingLogs, getRooms } from "@/lib/db";
import LogsClient from "./LogsClient";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const [bookings, rooms] = await Promise.all([
    getBookingLogs(),
    getRooms(),
  ]);

  return <LogsClient initialBookings={bookings} initialRooms={rooms} />;
}
