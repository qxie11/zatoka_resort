import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBooking, deleteBooking } from "@/lib/db";
import { startOfDay, isAfter } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { error: "Бронирование не найдено" },
        { status: 404 }
      );
    }
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении бронирования" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { roomId, startDate, endDate, name, phone, email, adminComment, status } = body;

    const updates: any = {};

    if (roomId !== undefined) updates.roomId = roomId;
    if (status !== undefined) updates.status = status;

    const parseDateSafe = (d: string | Date) => {
      if (typeof d === "string") {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
        if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12, 0, 0));
      }
      return new Date(d);
    };

    if (startDate !== undefined) {
      const start = parseDateSafe(startDate);
      if (isNaN(start.getTime())) {
        return NextResponse.json(
          { error: "Неверный формат даты заезда" },
          { status: 400 }
        );
      }
      updates.startDate = start;
    }

    if (endDate !== undefined) {
      const end = parseDateSafe(endDate);
      if (isNaN(end.getTime())) {
        return NextResponse.json(
          { error: "Неверный формат даты выезда" },
          { status: 400 }
        );
      }
      updates.endDate = end;
    }

    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (adminComment !== undefined) {
      updates.adminComment = adminComment === null || adminComment === '' ? null : String(adminComment).trim();
    }
    if (email !== undefined) {
      if (
        email === null ||
        email === "" ||
        (typeof email === "string" && email.trim() === "")
      ) {
        updates.email = null;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json(
            { error: "Неверный формат email" },
            { status: 400 }
          );
        }
        updates.email = email.trim();
      }
    }

    const existingBooking = await getBookingById(id);
    const finalStartDate = updates.startDate || existingBooking?.startDate;
    const finalEndDate = updates.endDate || existingBooking?.endDate;

    if (finalStartDate && finalEndDate) {
      const startDay = startOfDay(finalStartDate);
      const endDay = startOfDay(finalEndDate);

      if (endDay < startDay) {
        return NextResponse.json(
          { error: "Дата выезда не может быть раньше даты заезда" },
          { status: 400 }
        );
      }
    }

    const updatedBooking = await updateBooking(id, updates);

    if (!updatedBooking) {
      return NextResponse.json(
        { error: "Бронирование не найдено" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при обновлении бронирования" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteBooking(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Бронирование не найдено" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при удалении бронирования" },
      { status: 500 }
    );
  }
}
