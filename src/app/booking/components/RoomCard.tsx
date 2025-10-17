"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Room } from "@/lib/types";
import { BedDouble } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {

  const handleBooking = () => {
    toast({
        title: `Booking for ${room.name}`,
        description: "This is a demo. In a real application, this would redirect to a payment gateway."
    })
  }

  return (
    <Card id={room.id} className="flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <div className="relative w-full md:w-1/3 h-64 md:h-auto">
        <Image
          src={room.imageUrl}
          alt={`Image of ${room.name}`}
          fill
          className="object-cover"
          data-ai-hint={room.imageHint}
        />
      </div>
      <div className="flex flex-col justify-between w-full md:w-2/3">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{room.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
            <BedDouble className="h-4 w-4" />
            <span>Up to {room.capacity} guests</span>
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
            <p className="text-xl font-bold text-primary">{room.price} UAH</p>
            <p className="text-sm text-muted-foreground">per night</p>
          </div>
          <Button onClick={handleBooking} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">Book Now</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
