"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Room } from '@/lib/types';
import { ArrowRight, BedDouble } from 'lucide-react';

interface FeaturedRoomsProps {
  rooms: Room[];
}

export default function FeaturedRooms({ rooms }: FeaturedRoomsProps) {
  const featuredRooms = rooms.slice(0, 3);

  if (featuredRooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Номера пока не доступны</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="p-0">
               <div className="relative h-64 w-full">
                  <Image src={room.imageUrl} alt={room.name} fill className="object-cover" data-ai-hint={room.imageHint} />
               </div>
            </CardHeader>
            <CardContent className="pt-6 flex-grow">
              <CardTitle className="text-xl">{room.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <BedDouble className="h-4 w-4" />
                  <span>{room.capacity} Гостей</span>
              </div>
              <CardDescription className="mt-4">{room.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between items-stretch sm:items-center">
              <p className="text-lg font-bold text-primary">{room.price} грн / ночь</p>
              <div className="flex gap-2">
                <Button asChild variant="ghost" className="flex-1 sm:flex-none">
                  <Link href={`/booking#${room.id}`}>
                    Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="flex-1 sm:flex-none">
                  <Link href={`/booking/${room.id}`}>
                    Забронировать
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
          <Button asChild size="lg">
              <Link href="/booking">Посмотреть все номера</Link>
          </Button>
      </div>
    </>
  );
}

