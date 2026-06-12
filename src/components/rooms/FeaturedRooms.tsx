"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import type { Room } from '@/lib/types';
import { ArrowRight, BedDouble } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface FeaturedRoomsProps {
  rooms: Room[];
}

export default function FeaturedRooms({ rooms }: FeaturedRoomsProps) {
  const params = useParams();
  const lang = params?.lang || 'ru';
  const featuredRooms = rooms.slice(0, 3);

  if (featuredRooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Номера пока не доступны</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredRooms.map((room, index) => (
          <ScrollReveal key={room.id} variant="wave-in" delay={index * 150}>
            <Card className="overflow-hidden flex flex-col group transition-all duration-500 marine-3d-card min-w-0 shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-3xl text-white hover:border-teal-400/30 h-full">
              <CardHeader className="p-0">
                 <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                    <Image src={room.imageUrl} alt={room.name} fill className="object-cover transition-smooth group-hover:scale-110" data-ai-hint={room.imageHint} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Water shimmer overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, transparent 40%, rgba(20,184,166,0.12) 50%, rgba(56,189,248,0.08) 60%, transparent 70%)',
                        backgroundSize: '200% 200%',
                        animation: 'ocean-shimmer 4s ease-in-out infinite',
                      }}
                    />
                 </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 flex-grow">
                 <CardTitle className="text-xl font-extrabold text-white">{room.name}</CardTitle>
                 <div className="flex items-center gap-2 mt-2 text-teal-300 font-medium text-sm">
                     <BedDouble className="h-4 w-4 text-teal-400" />
                     <span>{room.capacity} Гостей</span>
                 </div>
                 <CardDescription className="mt-4 text-slate-300 text-sm font-light leading-relaxed">{room.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 p-5 sm:p-6 border-t border-white/5">
                <p className="text-xl font-extrabold text-teal-300 mr-auto">{room.price} грн <span className="text-xs text-slate-400 font-normal">/ ночь</span></p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button asChild variant="outline" className="w-full sm:flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-xl">
                    <Link href={`/${lang}/booking#${room.slug}`} className="flex items-center justify-center">
                      Подробнее <ArrowRight className="ml-1.5 h-4 w-4 text-teal-400" />
                    </Link>
                  </Button>
                  <Button asChild className="w-full sm:flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl water-reflection">
                    <Link href={`/${lang}/booking/${room.slug}`}>
                      Забронировать
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal variant="fade-up" delay={400}>
        <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-8 water-reflection">
                <Link href={`/${lang}/booking`}>Посмотреть все номера</Link>
            </Button>
        </div>
      </ScrollReveal>
    </>
  );
}
