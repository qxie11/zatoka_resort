import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking, getRoomById, getBookingsByRoomId } from "@/lib/db";
import { startOfDay } from "date-fns";
import { sendBookingNotification } from "@/lib/email";

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении бронирований" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, startDate, endDate, name, phone, email, pricePaid, promoCode, discountApplied, adminComment } = body;

    if (!roomId || !startDate || !endDate || !name || !phone) {
      return NextResponse.json(
        {
          error: "Необходимые поля: roomId, startDate, endDate, name, phone",
        },
        { status: 400 }
      );
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: "Неверный формат email" },
          { status: 400 }
        );
      }
    }

    const parseDateSafe = (d: string) => {
      // YYYY-MM-DD → parse as UTC noon to avoid any TZ shifting
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
      if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12, 0, 0));
      return new Date(d);
    };

    const start = parseDateSafe(startDate);
    const end = parseDateSafe(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Неверный формат дат" },
        { status: 400 }
      );
    }

    const startDay = startOfDay(start);
    const endDay = startOfDay(end);

    if (endDay < startDay) {
      return NextResponse.json(
        { error: "Дата выезда не может быть раньше даты заезда" },
        { status: 400 }
      );
    }

    let finalUnitId = body.unitId;

    if (!finalUnitId) {
      const room = await getRoomById(roomId);
      if (!room || !room.units || room.units.length === 0) {
         // No units or room not found, proceed without unitId or handle error?
         // Since we just migrated, some might have no units, but we should allow it as fallback.
      } else {
         const roomBookings = await getBookingsByRoomId(roomId);
         const overlappingBookings = roomBookings.filter(b => {
           const bStart = new Date(b.startDate);
           const bEnd = new Date(b.endDate);
           return startDay < bEnd && bStart < endDay;
         });
         
         const bookedUnitIds = new Set(overlappingBookings.map(b => b.unitId).filter(Boolean));
         const availableUnit = room.units.find(u => !bookedUnitIds.has(u.id));
         
         if (!availableUnit) {
           return NextResponse.json(
             { error: "Нет доступных номеров на выбранные даты" },
             { status: 400 }
           );
         }
         finalUnitId = availableUnit.id;
      }
    }

    const newBooking = await createBooking({
      roomId,
      unitId: finalUnitId,
      startDate: start,
      endDate: end,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      pricePaid: pricePaid ? parseInt(pricePaid) : undefined,
      promoCode: promoCode || undefined,
      discountApplied: discountApplied ? parseInt(discountApplied) : undefined,
      adminComment: adminComment && typeof adminComment === 'string' ? adminComment.trim() : undefined,
    });

    // Send email notification (non-blocking)
    await sendBookingNotification({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      roomId,
      startDate: start,
      endDate: end,
      pricePaid: pricePaid ? parseInt(pricePaid) : undefined,
      promoCode: promoCode || undefined,
      discountApplied: discountApplied ? parseInt(discountApplied) : undefined,
      adminComment: adminComment && typeof adminComment === 'string' ? adminComment.trim() : undefined,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при создании бронирования" },
      { status: 500 }
    );
  }
}
