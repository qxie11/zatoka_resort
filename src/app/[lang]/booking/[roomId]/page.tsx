import { notFound } from 'next/navigation';
import { getRoomById, getBookingsByRoomId } from '@/lib/db';
import RoomBookingForm from './components/RoomBookingForm';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Waves, Compass, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import RoomReviews from '../components/RoomReviews';
import { Button } from '@/components/ui/button';
import GoogleMapComponent from '../components/GoogleMapComponent';

interface PageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { roomId } = await params;
  const { lang: queryLang } = await searchParams;
  const room = await getRoomById(roomId);
  
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = queryLang || headerList.get("x-lang") || cookieStore.get("lang")?.value || "ru";

  if (!room) {
    const notFoundTitles = {
      ru: "Номер не найден",
      uk: "Номер не знайдено",
      en: "Room Not Found",
    };
    return {
      title: notFoundTitles[lang as keyof typeof notFoundTitles] || notFoundTitles.ru,
    };
  }

  const titleTemplates = {
    ru: `${room.name} - Бронирование | Отдых в Затоке`,
    uk: `${room.name} - Бронювання | Відпочинок в Затоці`,
    en: `${room.name} - Booking | Zatoka Resort`,
  };

  const descTemplates = {
    ru: `Забронируйте ${room.name} в отеле Zatoka Resort у самого моря. Первая линия, собственный бассейн, прямое бронирование на 2026 год. До ${room.capacity} гостей, от ${room.price} грн/ночь.`,
    uk: `Забронюйте ${room.name} в готелі Zatoka Resort біля самого моря. Перша лінія, власний басейн, пряме бронювання на 2026 рік. До ${room.capacity} гостей, від ${room.price} грн/ніч.`,
    en: `Book ${room.name} at Zatoka Resort beachfront hotel. Family seaside getaway 2026, private swimming pool, direct booking. Room up to ${room.capacity} guests, starting from ${room.price} UAH/night.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const title = titleTemplates[lang as keyof typeof titleTemplates] || titleTemplates.ru;
  const description = descTemplates[lang as keyof typeof descTemplates] || descTemplates.ru;

  const imageUrl = room.imageUrl.startsWith("http")
    ? room.imageUrl
    : `${baseUrl}${room.imageUrl.startsWith("/") ? "" : "/"}${room.imageUrl}`;

  const canonicalUrl = `${baseUrl}/booking/${roomId}${lang !== "ru" ? `?lang=${lang}` : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/booking/${roomId}`,
        ru: `${baseUrl}/booking/${roomId}`,
        uk: `${baseUrl}/booking/${roomId}?lang=uk`,
        en: `${baseUrl}/booking/${roomId}?lang=en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          alt: room.name,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default async function RoomBookingPage({ params }: PageProps) {
  const { roomId } = await params;
  const room = await getRoomById(roomId);
  const bookings = await getBookingsByRoomId(roomId);

  if (!room) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "name": room.name,
    "description": room.description,
    "image": room.imageUrl,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": room.capacity
    },
    "offers": {
      "@type": "Offer",
      "price": room.price,
      "priceCurrency": "UAH",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": room.price,
        "priceCurrency": "UAH",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": 1,
          "unitCode": "DAY"
        }
      }
    },
    "amenityFeature": room.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
            <Card className="mb-8 shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm text-white rounded-3xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/3 h-64 md:h-auto min-h-[250px] overflow-hidden">
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                    data-ai-hint={room.imageHint}
                  />
                </div>
                <div className="flex flex-col justify-between w-full md:w-2/3">
                  <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-white">{room.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-teal-300 font-medium text-sm">
                      <BedDouble className="h-4 w-4 text-teal-400" />
                      <span>До {room.capacity} гостей</span>
                    </div>
                    <CardDescription className="pt-2 text-slate-300 font-light leading-relaxed text-base">{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity) => (
                        <Badge key={amenity} className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/20 transition-colors font-medium rounded-lg px-2.5 py-1">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-teal-300 tracking-tight">{room.price} грн <span className="text-sm text-slate-400 font-normal">/ ночь</span></p>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>

            <RoomBookingForm room={room} existingBookings={bookings} />

            {/* Location & Beach Distance Map Section */}
            <div className="mt-12 bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-teal-400" />
                Местоположение отеля
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1 space-y-4">
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

                <div className="lg:col-span-2 relative h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-slate-950">
                  <GoogleMapComponent />
                </div>
              </div>
            </div>

            {/* UGC Reviews Section */}
            <RoomReviews roomId={room.id} roomName={room.name} />
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
