import { NextRequest, NextResponse } from "next/server";
import { deleteReview, updateReview } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, rating, comment, roomId } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (comment !== undefined) updateData.comment = comment;
    if (roomId !== undefined) updateData.roomId = roomId;

    const updated = await updateReview(id, updateData);

    if (!updated) {
      return NextResponse.json(
        { error: "Отзыв не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при обновлении отзыва" },
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
    const deleted = await deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Отзыв не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при удалении отзыва" },
      { status: 500 }
    );
  }
}
