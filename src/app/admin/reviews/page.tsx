import { prisma } from "@/lib/prisma";
import ReviewsAdminClient from "./ReviewsAdminClient";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const reviews = await prisma.review.findMany({
    include: {
      room: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
  });

  // Convert Date objects to ISO strings for safe serialization
  const serializedReviews = reviews.map((rev) => ({
    ...rev,
    createdAt: rev.createdAt.toISOString(),
    updatedAt: rev.updatedAt.toISOString(),
    room: {
      ...rev.room,
      createdAt: rev.room.createdAt.toISOString(),
      updatedAt: rev.room.updatedAt.toISOString(),
    }
  }));

  const serializedRooms = rooms.map((room) => ({
    ...room,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  }));

  return <ReviewsAdminClient initialReviews={serializedReviews} rooms={serializedRooms} />;
}
