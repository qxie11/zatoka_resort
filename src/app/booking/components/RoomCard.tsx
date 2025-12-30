"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Room } from "@/lib/types";
import { BedDouble, Eye } from "lucide-react";
import ImageGallery from "@/components/rooms/ImageGallery";

interface RoomCardProps {
  room: Room;
}

function ViewImagesButton({ room }: { room: Room }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const allImages = room.imageUrl
    ? [room.imageUrl, ...(room.imageUrls || [])]
    : room.imageUrls || [];

  if (allImages.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsGalleryOpen(true)}
        className="flex-1 sm:flex-none"
      >
        <Eye className="mr-2 h-4 w-4" />
        Посмотреть
      </Button>
      <ImageGallery
        images={allImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        roomName={room.name}
      />
    </>
  );
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Card
      id={room.id}
      className="flex flex-col md:flex-row overflow-hidden transition-smooth hover-lift shadow-soft border-0 bg-white/80 backdrop-blur-sm"
    >
      <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden group/image">
        <Image
          src={room.imageUrl}
          alt={`Изображение ${room.name}`}
          fill
          className="object-cover transition-smooth group-hover/image:scale-110"
          data-ai-hint={room.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col justify-between w-full md:w-2/3">
        <CardHeader>
          <CardTitle className="text-2xl">{room.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
            <BedDouble className="h-4 w-4" />
            <span>До {room.capacity} гостей</span>
          </div>
          <CardDescription className="pt-2">{room.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-primary">{room.price} грн</p>
            <p className="text-sm text-muted-foreground">за ночь</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <ViewImagesButton room={room} />
            <Button asChild className="flex-1 sm:flex-none">
              <Link href={`/booking/${room.id}`}>Забронировать</Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
