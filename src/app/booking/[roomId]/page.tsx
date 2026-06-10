import { notFound } from 'next/navigation';
import { getRoomById, getBookingsByRoomId } from '@/lib/db';
import RoomBookingForm from './components/RoomBookingForm';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BedDouble } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { roomId } = await params;
  const room = await getRoomById(roomId);
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

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
    ru: `${room.description.substring(0, 150)}... Забронируйте номер ${room.name} в Затоке по лучшей цене от ${room.price} грн за ночь.`,
    uk: `${room.description.substring(0, 150)}... Забронюйте номер ${room.name} в Затоці за найкращою ціною від ${room.price} грн за ніч.`,
    en: `${room.description.substring(0, 150)}... Book room ${room.name} in Zatoka at the best rate starting from ${room.price} UAH per night.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const title = titleTemplates[lang as keyof typeof titleTemplates] || titleTemplates.ru;
  const description = descTemplates[lang as keyof typeof descTemplates] || descTemplates.ru;

  const imageUrl = room.imageUrl.startsWith("http")
    ? room.imageUrl
    : `${baseUrl}${room.imageUrl.startsWith("/") ? "" : "/"}${room.imageUrl}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
