import { getRooms, getReviews } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rooms = await getRooms();
  const reviews = await getReviews();
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";

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

  const reviewCount = reviews.length || 124;
  const ratingValue = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": resortName,
    "description": resortDesc,
    "image": `${baseUrl}/og-image.png`,
    "logo": `${baseUrl}/og-image.png`,
    "url": baseUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "бульвар Золотой Берег, 42",
      "addressLocality": "Затока",
      "addressRegion": "Одесская область",
      "postalCode": "67772",
      "addressCountry": "UA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "46.0683",
      "longitude": "30.4578"
  },
    "priceRange": priceRange,
    "email": "contact@zatokagetaway.com",
    "telephone": "+380501234567",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
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
