import { notFound } from 'next/navigation';
import { getRoomById, getBookingsByRoomId } from '@/lib/db';
import RoomBookingForm from './components/RoomBookingForm';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Waves, Compass, Navigation } from 'lucide-react';
import { Metadata } from 'next';
import RoomReviews from '../components/RoomReviews';
import { Button } from '@/components/ui/button';
import GoogleMapComponent from '../components/GoogleMapComponent';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string; roomId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { roomId, lang } = await params;
  const room = await getRoomById(roomId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!room) return { title: "Not Found" };

  const title = `${room.name} | Zatoka Resort`;
  const canonicalUrl = `${baseUrl}/${lang}/booking/${roomId}`;

  return {
    title,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/ru/booking/${roomId}`,
        uk: `${baseUrl}/uk/booking/${roomId}`,
        en: `${baseUrl}/en/booking/${roomId}`,
      },
    },
  };
}

export default async function RoomBookingPage({ params }: PageProps) {
  const { roomId, lang } = await params;
  const room = await getRoomById(roomId);
  const bookings = await getBookingsByRoomId(roomId);

  if (!room) notFound();

  // Возвращаем ваши labels для перевода
  const t = {
    home: { ru: "Главная", uk: "Головна", en: "Home" },
    rooms: { ru: "Номера", uk: "Номери", en: "Rooms" },
    booking: { ru: "Бронирование", uk: "Бронювання", en: "Booking" },
    guests: { ru: "гостей", uk: "гостей", en: "guests" },
    about: { ru: "О номере", uk: "Про номер", en: "About the Room" },
    amenities: { ru: "Удобства и услуги", uk: "Зручності та послуги", en: "Amenities & Services" },
    price: { ru: "грн / ночь", uk: "грн / ніч", en: "UAH / night" },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* --- ВЕРСТКА ХЕДЕРА --- */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end justify-start overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image src={room.imageUrl} alt={room.name} fill className="object-cover scale-105 opacity-65 brightness-[0.45]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-12 z-10 max-w-6xl">
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-teal-200/90 font-medium">
            <Link href={`/${lang}`} className="hover:text-teal-300 hover:underline">{t.home[lang as keyof typeof t.home]}</Link>
            <span className="text-slate-500">/</span>
            <Link href={`/${lang}/rooms`} className="hover:text-teal-300 hover:underline">{t.rooms[lang as keyof typeof t.rooms]}</Link>
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
      </section>

      {/* --- ВЕРСТКА ОСНОВНОГО КОНТЕНТА --- */}
      <section className="container mx-auto px-4 py-12 max-w-4xl space-y-8 relative z-30">
        <RoomBookingForm room={room} existingBookings={bookings} />

        <div className="glass-card-dark border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl bg-slate-900/40 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-4">{t.about[lang as keyof typeof t.about]}</h2>
          <p className="text-slate-200 font-light text-base md:text-lg leading-relaxed mb-6">{room.description}</p>
          <h3 className="text-xl font-bold text-white mb-4 pt-4 border-t border-white/5">{t.amenities[lang as keyof typeof t.amenities]}</h3>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <Badge key={amenity} className="bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-lg px-3 py-1.5">{amenity}</Badge>
            ))}
          </div>
        </div>

        {/* Location & Beach Distance Map Section */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-teal-400" />
            Местоположение отеля
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                <Waves className="h-5 w-5 text-teal-300 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Первая береговая линия</h4>
                  <p className="text-slate-400 text-sm font-light mt-1">До чистого песчаного пляжа всего 10 метров. Вы выходите из отеля прямо к морской воде.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                <MapPin className="h-5 w-5 text-sky-300 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Точный адрес</h4>
                  <p className="text-slate-400 text-sm font-light mt-1">бульвар Золотой Берег, 42, Затока, Одесская область, Украина</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                <Compass className="h-5 w-5 text-amber-300 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Гео-координаты</h4>
                  <p className="text-slate-400 text-sm font-mono text-xs mt-1">46.0683° N, 30.4578° E</p>
                </div>
              </div>

              <Button asChild className="w-full bg-slate-950 border border-white/10 text-white hover:bg-slate-900 rounded-xl py-5 transition-all">
                <a href="https://www.google.com/maps/search/?api=1&query=46.0683,30.4578" target="_blank" rel="noopener noreferrer">
                  <Navigation className="mr-2 h-4 w-4 text-teal-400" />
                  Открыть в Google Картах
                </a>
              </Button>
            </div>

            <div className="md:col-span-2 relative h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-slate-950">
              <GoogleMapComponent />
            </div>
          </div>
        </div>

        <RoomReviews roomId={room.id} roomName={room.name} />
      </section>
    </div>
  );
}