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
    const { name, description, price, capacity, amenities, imageUrl, imageUrls, imageHint } = body;

    console.log('PUT /api/rooms/[id] - Room ID:', id);
    console.log('PUT /api/rooms/[id] - Body:', JSON.stringify(body, null, 2));

    const existingRoom = await getRoomById(id);
    console.log('PUT /api/rooms/[id] - Existing room:', existingRoom ? 'found' : 'not found');
    
    if (!existingRoom) {
      console.error('PUT /api/rooms/[id] - Room not found with ID:', id);
      return NextResponse.json(
        { error: 'Номер не найден', id },
        { status: 404 }
      );
    }

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

    let imageUrlsArray: string[] | undefined;
    if (imageUrls !== undefined) {
      if (Array.isArray(imageUrls)) {
        imageUrlsArray = imageUrls.filter(Boolean);
      } else if (typeof imageUrls === 'string') {
        imageUrlsArray = imageUrls.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        imageUrlsArray = [];
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (capacity !== undefined) updateData.capacity = Number(capacity);
    if (amenitiesArray !== undefined) updateData.amenities = amenitiesArray;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageUrlsArray !== undefined) updateData.imageUrls = imageUrlsArray;
    if (imageHint !== undefined) updateData.imageHint = imageHint;

    console.log('PUT /api/rooms/[id] - Update data:', JSON.stringify(updateData, null, 2));

    const updatedRoom = await updateRoom(id, updateData);

    if (!updatedRoom) {
      console.error('PUT /api/rooms/[id] - updateRoom returned null for ID:', id);
      return NextResponse.json(
        { error: 'Номер не найден', id },
        { status: 404 }
      );
    }

    console.log('PUT /api/rooms/[id] - Room updated successfully');
    return NextResponse.json(updatedRoom);
  } catch (error: any) {
    console.error('PUT /api/rooms/[id] - Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении номера', message: error?.message },
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

