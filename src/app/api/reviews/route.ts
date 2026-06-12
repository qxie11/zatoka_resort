import { NextRequest, NextResponse } from "next/server";
import { getReviews, getReviewsByRoomId, createReview } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (roomId) {
      const reviews = await getReviewsByRoomId(roomId);
      return NextResponse.json(reviews);
    }

    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении отзывов" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, name, rating, comment, date } = body;

    if (!roomId || !name || !rating || !comment) {
      return NextResponse.json(
        { error: "Необходимые поля: roomId, name, rating, comment" },
        { status: 400 }
      );
    }

    const newReview = await createReview({
      roomId,
      name,
      rating: Number(rating),
      comment,
      date: date || new Date().toLocaleDateString("ru-RU"),
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при создании отзыва" },
      { status: 500 }
    );
  }
}
