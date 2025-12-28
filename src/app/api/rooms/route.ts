import { NextRequest, NextResponse } from "next/server";
import { getRooms, createRoom } from "@/lib/db";

export async function GET() {
  try {
    const rooms = await getRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении номеров" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      capacity,
      amenities,
      imageUrl,
      imageHint,
    } = body;

    if (
      !name ||
      !description ||
      price === undefined ||
      capacity === undefined
    ) {
      return NextResponse.json(
        { error: "Необходимые поля: name, description, price, capacity" },
        { status: 400 }
      );
    }

    let amenitiesArray: string[] = [];
    if (Array.isArray(amenities)) {
      amenitiesArray = amenities;
    } else if (typeof amenities === "string") {
      amenitiesArray = amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const newRoom = await createRoom({
      name,
      description,
      price: Number(price),
      capacity: Number(capacity),
      amenities: amenitiesArray,
      imageUrl: imageUrl || "",
      imageHint: imageHint || "",
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при создании номера" },
      { status: 500 }
    );
  }
}
