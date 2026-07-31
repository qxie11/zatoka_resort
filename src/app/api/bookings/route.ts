import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/lib/db";
import { prisma } from "@/lib/prisma";
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

    let newBooking;
    
    // Perform double-booking prevention check inside an atomic Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      let unitIdToAssign = body.unitId;

      // 1. Fetch room with units inside transaction
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: { units: true },
      });

      if (!room) {
        throw new Error("ROOM_NOT_FOUND");
      }

      // 2. Fetch all overlapping bookings for this room inside transaction
      // A booking overlaps if: existing.startDate < new.endDate AND existing.endDate > new.startDate
      const roomBookings = await tx.booking.findMany({
        where: {
          roomId,
          startDate: { lt: end },
          endDate: { gt: start },
        },
      });

      if (unitIdToAssign) {
        // If a specific unit was selected, verify it is not already booked for these dates
        const isOccupied = roomBookings.some((b) => b.unitId === unitIdToAssign);
        if (isOccupied) {
          throw new Error("UNIT_OCCUPIED");
        }
      } else if (room.units && room.units.length > 0) {
        // Automatically find first available unit for this room category
        const bookedUnitIds = new Set(roomBookings.map((b) => b.unitId).filter(Boolean));
        const availableUnit = room.units.find((u) => !bookedUnitIds.has(u.id));

        if (!availableUnit) {
          throw new Error("NO_AVAILABLE_UNITS");
        }
        unitIdToAssign = availableUnit.id;
      }

      // 3. Atomically create the booking record inside the transaction
      return await tx.booking.create({
        data: {
          roomId,
          unitId: unitIdToAssign || null,
          startDate: start,
          endDate: end,
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          pricePaid: pricePaid ? parseInt(pricePaid) : null,
          promoCode: promoCode || null,
          discountApplied: discountApplied ? parseInt(discountApplied) : null,
          status: body.status || "PENDING",
          adminComment: adminComment && typeof adminComment === "string" ? adminComment.trim() : null,
        },
      });
    });

    newBooking = result;

    // Check if booking was created via admin panel or admin session
    const adminSession = request.cookies.get("admin_session")?.value;
    const isAdminBooking = !!adminSession || body.isAdmin === true || body.source === "admin";

    if (!isAdminBooking) {
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

      // Send Telegram Notification to Owner (non-blocking)
      try {
        const { sendTelegramNotification } = await import('@/lib/telegram');
        const startStr = start.toLocaleDateString('ru-RU');
        const endStr = end.toLocaleDateString('ru-RU');
        
        const tgMsg = `🔔 <b>Новое бронирование №${newBooking.id}</b>\n\n` +
          `👤 <b>Гость:</b> ${name.trim()}\n` +
          `📞 <b>Телефон:</b> ${phone.trim()}\n` +
          (email?.trim() ? `✉️ <b>Email:</b> ${email.trim()}\n` : '') +
          `🏨 <b>Номер ID:</b> ${roomId}\n` +
          `📅 <b>Даты:</b> ${startStr} — ${endStr}\n` +
          (pricePaid ? `💰 <b>Сумма:</b> ${pricePaid} грн\n` : '');
        
        sendTelegramNotification(tgMsg).catch(err => console.error("Failed to send telegram notification:", err));
      } catch (notifyError) {
        console.error("Failed to send telegram notification", notifyError);
      }
    }

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNIT_OCCUPIED" || error?.message === "NO_AVAILABLE_UNITS") {
      return NextResponse.json(
        { error: "К сожалению, этот номер уже забронирован на выбранные даты." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка при создании бронирования" },
      { status: 500 }
    );
  }
}
