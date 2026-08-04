"use client";

import Image from 'next/image';
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useSearchParams } from 'next/navigation';
import type { Room } from '@/lib/types';
import { ArrowRight, BedDouble, Waves, Moon } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

import RoomCard from "@/app/[lang]/booking/components/RoomCard";

interface FeaturedRoomsProps {
  rooms: Room[];
}

export default function FeaturedRooms({ rooms }: FeaturedRoomsProps) {
  const { t } = useTranslation();
  const params = useParams();
  const lang = params?.lang || 'ru';
  const featuredRooms = rooms.slice(0, 6);

  if (featuredRooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">{t("roomsNotAvailable")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredRooms.map((room, index) => (
          <ScrollReveal key={room.id} variant="wave-in" delay={index * 150} className="h-full">
            <RoomCard room={room} />
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal variant="fade-up" delay={400}>
        <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-8 water-reflection">
                <Link href={`/${lang}/booking`}>{t("viewAllRooms") || "Посмотреть все номера"}</Link>
            </Button>
        </div>
      </ScrollReveal>
    </>
  );
}
