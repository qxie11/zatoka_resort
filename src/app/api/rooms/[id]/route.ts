import { NextRequest, NextResponse } from 'next/server';
import { getRoomById, updateRoom, deleteRoom } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await getRoomById(id);
    if (!room) {
      return NextResponse.json(
        { error: 'Номер не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении номера' },
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
    const { name, description, price, capacity, amenities, imageUrl, imageHint } = body;

    // Обработка amenities: может быть массивом или строкой (через запятую)
    let amenitiesArray: string[] | undefined;
    if (amenities !== undefined) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      } else if (typeof amenities === 'string') {
        amenitiesArray = amenities.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        amenitiesArray = [];
      }
    }

    const updatedRoom = await updateRoom(id, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(capacity !== undefined && { capacity: Number(capacity) }),
      ...(amenitiesArray !== undefined && { amenities: amenitiesArray }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(imageHint !== undefined && { imageHint }),
    });

    if (!updatedRoom) {
      return NextResponse.json(
        { error: 'Номер не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении номера' },
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
    const deleted = await deleteRoom(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Номер не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении номера' },
      { status: 500 }
    );
  }
}

