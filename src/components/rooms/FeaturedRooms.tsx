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
          <Card key={room.id} className="overflow-hidden flex flex-col group transition-all duration-300 hover-lift min-w-0 shadow-soft border border-white/50 bg-white/70 backdrop-blur-md rounded-3xl">
            <CardHeader className="p-0">
               <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                  <Image src={room.imageUrl} alt={room.name} fill className="object-cover transition-smooth group-hover:scale-110" data-ai-hint={room.imageHint} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
               </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 flex-grow">
              <CardTitle className="text-xl font-bold text-slate-900">{room.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-primary font-medium text-sm">
                  <BedDouble className="h-4 w-4" />
                  <span>{room.capacity} Гостей</span>
              </div>
              <CardDescription className="mt-4 text-muted-foreground text-sm font-light leading-relaxed">{room.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-5 sm:p-6 border-t border-slate-100/50">
              <p className="text-xl font-extrabold text-primary mr-auto">{room.price} грн <span className="text-xs text-muted-foreground font-normal">/ ночь</span></p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button asChild variant="ghost" className="w-full sm:flex-1 text-slate-700 hover:text-primary transition-colors">
                  <Link href={`/booking#${room.id}`} className="flex items-center justify-center">
                    Подробнее <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="w-full sm:flex-1 gradient-sunset text-slate-950 font-bold border-0 shadow-md">
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

