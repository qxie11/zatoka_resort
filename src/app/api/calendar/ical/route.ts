import { NextRequest, NextResponse } from "next/server";
import { getBookings, getRooms } from "@/lib/db";

function formatDateToICS(dateStr: string | Date): string {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const unitId = searchParams.get("unitId");

    const allBookings = await getBookings();
    const rooms = await getRooms();
    const roomsMap = new Map(rooms.map((r) => [r.id, r.name]));

    // Filter active bookings
    const bookings = allBookings.filter((b) => {
      if (b.status === "CANCELLED") return false;
      if (roomId && b.roomId !== roomId) return false;
      if (unitId && b.unitId !== unitId) return false;
      return true;
    });

    const nowStr = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Grean Beam Hotel//Zatoka Resort Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Zatoka Resort - Bookings",
      "X-WR-TIMEZONE:Europe/Kyiv",
    ];

    for (const booking of bookings) {
      const startDateICS = formatDateToICS(booking.startDate);
      const endDateICS = formatDateToICS(booking.endDate);
      const roomName = roomsMap.get(booking.roomId) || "Room";

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:booking-${booking.id}@zatoka-hotel.com`,
        `DTSTAMP:${nowStr}`,
        `DTSTART;VALUE=DATE:${startDateICS}`,
        `DTEND;VALUE=DATE:${endDateICS}`,
        `SUMMARY:Занято (${roomName})`,
        `DESCRIPTION:Бронирование Grean Beam Hotel (${booking.name || 'Гость'})`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    }

    icsContent.push("END:VCALENDAR");

    const responseText = icsContent.join("\r\n");

    return new NextResponse(responseText, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="zatoka-calendar${roomId ? `-${roomId}` : ""}.ics"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating iCal:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
