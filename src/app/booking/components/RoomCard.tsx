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
import { BedDouble, Eye, Waves } from "lucide-react";
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
        className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-xl"
      >
        <Eye className="mr-2 h-4 w-4 text-teal-400" />
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
      className="flex flex-col md:flex-row overflow-hidden transition-smooth hover-lift shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-3xl text-white hover:border-teal-400/30"
    >
      <div className="relative w-full md:w-1/3 h-64 md:h-auto min-h-[250px] overflow-hidden group/image">
        <Image
          src={room.imageUrl}
          alt={`Изображение ${room.name}`}
          fill
          className="object-cover transition-smooth group-hover/image:scale-110"
          data-ai-hint={room.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col justify-between w-full md:w-2/3 p-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-extrabold text-white">{room.name}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
            <div className="flex items-center gap-1.5 text-teal-300 font-medium">
              <BedDouble className="h-4 w-4 text-teal-400" />
              <span>До {room.capacity} гостей</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-300 font-medium bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-lg">
              <Waves className="h-3.5 w-3.5 text-sky-400" />
              <span>10м до пляжа (1-я линия)</span>
            </div>
          </div>
          <CardDescription className="pt-2 text-slate-300 font-light leading-relaxed">{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <Badge key={amenity} className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/20 transition-colors font-medium rounded-lg px-2.5 py-1">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-2xl font-extrabold text-teal-300 tracking-tight">{room.price} грн <span className="text-sm text-slate-400 font-normal">/ ночь</span></p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <ViewImagesButton room={room} />
            <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl px-6">
              <Link href={`/booking/${room.id}`}>Забронировать</Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
