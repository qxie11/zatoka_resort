import { notFound } from 'next/navigation';
import { getRoomBySlugOrId, getBookingsByRoomId, getReviewsByRoomId } from '@/lib/db';
import RoomBookingForm, { ViewImagesButton } from './components/RoomBookingForm';
import BookingPageExtras from './components/BookingPageExtras';
import Image from 'next/image';
import { BedDouble } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const room = await getRoomBySlugOrId(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zatoka-hotel.com';

  if (!room) return { title: "Not Found" };

  const title = `${room.name} | Zatoka Resort`;
  const canonicalUrl = `${baseUrl}/${lang}/booking/${room.slug}`;

  return {
    title,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/ru/booking/${room.slug}`,
        uk: `${baseUrl}/uk/booking/${room.slug}`,
        en: `${baseUrl}/en/booking/${room.slug}`,
      },
    },
  };
}

export default async function RoomBookingPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const room = await getRoomBySlugOrId(slug);

  if (!room) notFound();

  const [bookings, reviews] = await Promise.all([
    getBookingsByRoomId(room.id),
    getReviewsByRoomId(room.id),
  ]);

  const t = {
    home: { ru: "Главная", uk: "Головна", en: "Home" },
    rooms: { ru: "Номера", uk: "Номери", en: "Rooms" },
    booking: { ru: "Бронирование", uk: "Бронювання", en: "Booking" },
    guests: { ru: "гостей", uk: "гостей", en: "guests" },
    price: { ru: "грн / ночь", uk: "грн / ніч", en: "UAH / night" },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <section className="relative h-[55vh] min-h-[330px] lg:min-h-[600px] flex items-end justify-start overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image src={room.imageUrl} alt={room.name} fill className="object-cover scale-105 opacity-65 brightness-[0.45]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-12 z-10 max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-teal-200/90 font-medium">
              <Link href={`/${lang}`} className="hover:text-teal-300 hover:underline">{t.home[lang as keyof typeof t.home]}</Link>
              <span className="text-slate-500">/</span>
              <Link href={`/${lang}/booking`} className="hover:text-teal-300 hover:underline">{t.rooms[lang as keyof typeof t.rooms]}</Link>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{room.name}</span>
            </nav>

            <div className="inline-flex bg-teal-500/20 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs font-semibold rounded-lg px-2.5 py-1 mb-4">
              {t.booking[lang as keyof typeof t.booking]}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{room.name}</h1>
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-teal-400" /> До {room.capacity} {t.guests[lang as keyof typeof t.guests]}</span>
              <span className="text-teal-300 font-bold text-lg">{room.price} {t.price[lang as keyof typeof t.price]}</span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <ViewImagesButton room={room} />
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT: FORM + SIDEBAR --- */}
      <section className="container mx-auto px-4 py-12 max-w-6xl relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <RoomBookingForm room={room} existingBookings={bookings} />
          </div>

          {/* Sidebar: Trust + Urgency + Reviews */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <BookingPageExtras
              lang={lang}
              room={room}
              reviews={reviews}
              recentBookingsCount={bookings.filter(b => {
                const created = new Date(b.startDate);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return created > weekAgo;
              }).length}
            />
          </div>
        </div>
      </section>
    </div>
  );
}