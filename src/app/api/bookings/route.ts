import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/db";

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
    const { roomId, startDate, endDate, name, phone, email } = body;

    if (!roomId || !startDate || !endDate || !name || !phone || !email) {
      return NextResponse.json(
        {
          error:
            "Необходимые поля: roomId, startDate, endDate, name, phone, email",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Неверный формат дат" },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        { error: "Дата выезда должна быть позже даты заезда" },
        { status: 400 }
      );
    }

    const newBooking = await createBooking({
      roomId,
      startDate: start,
      endDate: end,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при создании бронирования" },
      { status: 500 }
    );
  }
}
