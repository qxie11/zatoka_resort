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
      className="flex flex-col md:flex-row overflow-hidden transition-smooth hover-lift shadow-gentle border border-white/50 bg-white/70 backdrop-blur-md rounded-3xl"
    >
      <div className="relative w-full md:w-1/3 h-64 md:h-auto min-h-[250px] overflow-hidden group/image">
        <Image
          src={room.imageUrl}
          alt={`Изображение ${room.name}`}
          fill
          className="object-cover transition-smooth group-hover/image:scale-110"
          data-ai-hint={room.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col justify-between w-full md:w-2/3 p-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-extrabold text-slate-900">{room.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2 text-primary font-medium text-sm">
            <BedDouble className="h-4 w-4" />
            <span>До {room.capacity} гостей</span>
          </div>
          <CardDescription className="pt-2 text-muted-foreground font-light leading-relaxed">{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 transition-colors font-medium rounded-lg">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100/50">
          <div>
            <p className="text-2xl font-extrabold text-primary tracking-tight">{room.price} грн <span className="text-sm text-muted-foreground font-normal">/ ночь</span></p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <ViewImagesButton room={room} />
            <Button asChild className="flex-1 sm:flex-none gradient-sunset hover:opacity-90 text-slate-950 font-bold border-0 shadow-md">
              <Link href={`/booking/${room.id}`}>Забронировать</Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
