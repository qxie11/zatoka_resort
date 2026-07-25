import { notFound } from 'next/navigation';
import { getRoomBySlugOrId, getRooms } from '@/lib/db';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Waves, Compass, Navigation, Ship, Star, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import RoomReviews from '@/app/[lang]/booking/components/RoomReviews';
import { Button } from '@/components/ui/button';
import GoogleMapComponent from '@/app/[lang]/booking/components/GoogleMapComponent';
import RoomGallery from '@/components/rooms/RoomGallery';
import Link from 'next/link';
import RoomComparisonButton from '@/components/rooms/RoomComparisonButton';
import TrustBadges from "@/components/rooms/TrustBadges";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const room = await getRoomBySlugOrId(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zatoka-hotel.com';

  if (!room) return { title: "Not Found" };

  const title = `${room.name} | Zatoka Resort`;
  const canonicalUrl = `${baseUrl}/${lang}/rooms/${room.slug}`;

  return {
    title,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/ru/rooms/${room.slug}`,
        uk: `${baseUrl}/uk/rooms/${room.slug}`,
        en: `${baseUrl}/en/rooms/${room.slug}`,
      },
    },
  };
}

export default async function RoomDetailsPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const room = await getRoomBySlugOrId(slug);

  if (!room) notFound();

  const allRooms = await getRooms();

  const t = {
    home: { ru: "Главная", uk: "Головна", en: "Home" },
    rooms: { ru: "Номера", uk: "Номери", en: "Rooms" },
    booking: { ru: "Забронировать номер", uk: "Забронювати номер", en: "Book Room" },
    guests: { ru: "гостей", uk: "гостей", en: "guests" },
    about: { ru: "О номере", uk: "Про номер", en: "About the Room" },
    amenities: { ru: "Удобства и услуги", uk: "Зручності та послуги", en: "Amenities & Services" },
    price: { ru: "грн / ночь", uk: "грн / ніч", en: "UAH / night" },
    location: { ru: "Местоположение отеля", uk: "Місцезнаходження готелю", en: "Hotel Location" },
    beachline: { ru: "Близость к пляжу", uk: "Близькість до пляжу", en: "Close to the Beach" },
    beachlineDesc: {
      ru: "До чистого песчаного пляжа всего 5 минут приятной ходьбы прогулочным шагом.",
      uk: "До чистого піщаного пляжу всього 5 хвилин приємної ходьби прогулянковим кроком.",
      en: "Only a pleasant 5-minute walk to the clean sandy beach."
    },
    address: { ru: "Точный адрес", uk: "Точна адреса", en: "Exact Address" },
    addressDesc: {
      ru: "ул. Садовая, 1835, станция Лиманская, Затока, Одесская область, Украина",
      uk: "вул. Садова, 1835, станція Лиманська, Затока, Одеська область, Україна",
      en: "1835 Sadova str., Lymanska station, Zatoka, Odesa Oblast, Ukraine"
    },
    coords: { ru: "Гео-координаты", uk: "Гео-координати", en: "Geo Coordinates" },
    openMaps: { ru: "Открыть в Google Картах", uk: "Відкрити в Google Картах", en: "Open in Google Maps" },
    priceLabel: { ru: "Стоимость суток", uk: "Вартість доби", en: "Price per night" },
    capacityLabel: { ru: "Размещение", uk: "Розміщення", en: "Capacity" },
    capacityDesc: { ru: "до", uk: "до", en: "up to" },
    seaDist: { ru: "5 мин до моря", uk: "5 хв до моря", en: "5 min to the sea" },
    goToBooking: { ru: "Перейти к бронированию", uk: "Перейти до бронювання", en: "Proceed to Booking" },
  };

  const allImages = room.imageUrl
    ? [room.imageUrl, ...(room.imageUrls || [])]
    : room.imageUrls || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">

      {/* --- HERO HEADER --- */}
      <section className="relative w-full aspect-[4/3] md:aspect-video min-h-[420px] flex items-end justify-start overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image src={room.imageUrl} alt={room.name} fill className="object-cover opacity-70 brightness-[0.35]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-12 z-10 max-w-6xl w-full">
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-teal-200/90 font-medium">
            <Link href={`/${lang}`} className="hover:text-teal-300 hover:underline">{t.home[lang as keyof typeof t.home]}</Link>
            <span className="text-slate-500">/</span>
            <Link href={`/${lang}/booking`} className="hover:text-teal-300 hover:underline">{t.rooms[lang as keyof typeof t.rooms]}</Link>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{room.name}</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 bg-teal-500/20 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs font-semibold rounded-lg px-3 py-1 mb-4 uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" /> Premium Suite
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            {room.name}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/10 w-full">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/50 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-xl">
                <BedDouble className="h-4.5 w-4.5 text-teal-400" />
                До {room.capacity} {t.guests[lang as keyof typeof t.guests]}
              </span>
              <span className="text-teal-300 font-extrabold text-2xl tracking-tight">
                {room.price} <span className="text-sm font-normal text-slate-400">{t.price[lang as keyof typeof t.price]}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
              <RoomComparisonButton rooms={allRooms} currentRoomId={room.id} />
              
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/25 rounded-2xl px-8 hover:scale-[1.03] active:scale-95 transition-all flex-grow sm:flex-grow-0">
                <Link href={`/${lang}/booking/${room.slug}`} className="flex items-center gap-2 justify-center">
                  {t.booking[lang as keyof typeof t.booking]}
                  <ArrowRight className="h-5 w-5 text-slate-950" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT & LAYOUT --- */}
      <section className="container mx-auto px-4 py-12 max-w-6xl relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left / Middle: Slider, About, Map & Reviews */}
          <div className="lg:col-span-2 space-y-8">

            {/* Inline Premium Gallery Slider */}
            <RoomGallery images={allImages} roomName={room.name} />

            {/* Description & Badges */}
            <div className="glass-card-dark border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl bg-slate-900/40 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">{t.about[lang as keyof typeof t.about]}</h2>
              <p className="text-slate-200 font-light text-base md:text-lg leading-relaxed mb-6">
                {room.description}
              </p>

              <h3 className="text-xl font-bold text-white mb-4 pt-4 border-t border-white/5">
                {t.amenities[lang as keyof typeof t.amenities]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <Badge key={amenity} className="bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-lg px-3.5 py-2 font-medium">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hotel Location / Google Map Component */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-teal-400" />
                {t.location[lang as keyof typeof t.location]}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-4">
                  <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                    <Waves className="h-5 w-5 text-teal-300 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.beachline[lang as keyof typeof t.beachline]}</h4>
                      <p className="text-slate-400 text-sm font-light mt-1">
                        {t.beachlineDesc[lang as keyof typeof t.beachlineDesc]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                    <MapPin className="h-5 w-5 text-sky-300 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.address[lang as keyof typeof t.address]}</h4>
                      <p className="text-slate-400 text-sm font-light mt-1">
                        {t.addressDesc[lang as keyof typeof t.addressDesc]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                    <Compass className="h-5 w-5 text-amber-300 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.coords[lang as keyof typeof t.coords]}</h4>
                      <p className="text-slate-400 text-sm font-mono text-xs mt-1">46.158222° N, 30.541194° E</p>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-slate-950 border border-white/10 text-white hover:bg-slate-900 rounded-xl py-5 transition-all">
                    <a href="https://www.google.com/maps/search/?api=1&query=46.158222,30.541194" target="_blank" rel="noopener noreferrer">
                      <Navigation className="mr-2 h-4 w-4 text-teal-400" />
                      {t.openMaps[lang as keyof typeof t.openMaps]}
                    </a>
                  </Button>
                </div>

                <div className="md:col-span-2 relative h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-slate-950">
                  <GoogleMapComponent />
                </div>
              </div>
            </div>

            {/* Room Reviews Component */}
            <RoomReviews roomId={room.id} roomName={room.name} lang={lang} />
          </div>

          {/* Right Sidebar: Sticky Info panel (Fixed at bottom on mobile) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-teal-500/20 bg-slate-900/95 backdrop-blur-xl lg:relative lg:p-6 lg:rounded-3xl lg:border lg:shadow-2xl lg:bg-slate-900/80 lg:bottom-auto lg:left-auto lg:right-auto lg:z-auto lg:overflow-hidden">
              <div className="hidden lg:block absolute -right-12 -top-12 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between lg:block">
                
                {/* Mobile Price */}
                <div className="flex flex-col lg:hidden">
                  <span className="text-slate-400 text-xs uppercase font-medium tracking-wider mb-0.5">{t.priceLabel[lang as keyof typeof t.priceLabel]}</span>
                  <span className="text-xl font-extrabold text-teal-300 leading-none">{room.price} <span className="text-sm font-normal text-slate-400">грн</span></span>
                </div>
                
                {/* Desktop Price */}
                <div className="hidden lg:flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">{t.priceLabel[lang as keyof typeof t.priceLabel]}</span>
                  <span className="text-2xl font-extrabold text-teal-300">{room.price} грн</span>
                </div>

                {/* Details (Desktop only) */}
                <div className="hidden lg:block space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-teal-500/80" /> {t.capacityLabel[lang as keyof typeof t.capacityLabel]}</span>
                    <span>{t.capacityDesc[lang as keyof typeof t.capacityDesc]} {room.capacity} {t.guests[lang as keyof typeof t.guests]}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="flex items-center gap-1.5"><Ship className="h-4 w-4 text-teal-500/80" /> {t.beachline[lang as keyof typeof t.beachline]}</span>
                    <span>{t.seaDist[lang as keyof typeof t.seaDist]}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-auto px-6 ml-4 lg:ml-0 lg:w-full lg:mt-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl transition-all h-12 lg:h-12 flex-shrink-0">
                  <Link href={`/${lang}/booking/${room.slug}`} className="flex items-center justify-center gap-2">
                    {t.goToBooking[lang as keyof typeof t.goToBooking]}
                    <ArrowRight className="h-4 w-4 text-slate-950 hidden sm:block" />
                  </Link>
                </Button>
                
                {/* Trust Badges - Desktop Only */}
                <div className="hidden lg:block">
                  <TrustBadges lang={lang} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
