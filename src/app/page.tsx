import { getRooms } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rooms = await getRooms();
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

  const prices = rooms.map((r) => r.price);
  const minPrice = prices.length ? Math.min(...prices) : 1500;
  const maxPrice = prices.length ? Math.max(...prices) : 5000;
  const priceRange = `${minPrice} UAH - ${maxPrice} UAH`;

  const names = {
    ru: "Отдых в Затоке",
    uk: "Відпочинок в Затоці",
    en: "Zatoka Resort",
  };

  const descriptions = {
    ru: "Забронируйте свой идеальный пляжный отдых в 'Отдых в Затоке', премиум-отеле в Затоке, Одесса. Наслаждайтесь потрясающими видами на море, отличным сервисом и современными удобствами.",
    uk: "Забронюйте свій ідеальний пляжний відпочинок у 'Відпочинок в Затоці', преміум-готелі в Затоці, Одеса. Насолоджуйтесь приголомшливими видами на море, чудовим сервісом та сучасними зручностями.",
    en: "Book your perfect beach holiday at 'Zatoka Resort', a premium hotel in Zatoka, Odesa. Enjoy stunning sea views, excellent service, and modern amenities.",
  };

  const resortName = names[lang as keyof typeof names] || names.ru;
  const resortDesc = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Resort",
    "name": resortName,
    "description": resortDesc,
    "image": "https://zatokaresort.com/og-image.png",
    "logo": "https://zatokaresort.com/og-image.png",
    "url": "https://zatokaresort.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Приморская, 1",
      "addressLocality": "Затока",
      "addressRegion": "Одесская область",
      "postalCode": "67772",
      "addressCountry": "UA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "46.0641",
      "longitude": "30.4567"
    },
    "priceRange": priceRange,
    "email": "contact@zatokagetaway.com"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient rooms={rooms} />
    </>
  );
}
