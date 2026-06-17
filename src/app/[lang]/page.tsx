import { Metadata } from "next";
import { getRooms, getReviews } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;

  const currentYear = new Date().getFullYear();

  const data = {
    ru: { title: "Отдых в Затоке | Zatoka Resort", desc: `Премиум-отель в Затоке в 10 минутах от моря. Бассейн, комфорт ${currentYear}.` },
    uk: { title: "Відпочинок в Затоці | Zatoka Resort", desc: `Преміум-готель в Затоці в 10 хвилинах від моря. Басейн, комфорт ${currentYear}.` },
    en: { title: "Zatoka Resort | Seaside Hotel", desc: `Premium hotel in Zatoka just a 10-minute walk to the sea. Pool, best rates ${currentYear}.` },
  };

  const meta = data[lang as keyof typeof data] || data.ru;

  return {
    title: meta.title,
    description: meta.desc,
  };
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const [rooms, reviews] = await Promise.all([getRooms(), getReviews()]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const prices = rooms.map((r) => r.price);
  const minPrice = prices.length ? Math.min(...prices) : 1500;
  const maxPrice = prices.length ? Math.max(...prices) : 5000;

  const ratingValue = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Zatoka Resort",
    "description": "Premium hotel in Zatoka, Odesa region.",
    "image": [`${baseUrl}/og-image.png`],
    "url": baseUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Садовая, 1835, станция Лиманская",
      "addressLocality": "Затока",
      "addressRegion": "Одесская область",
      "addressCountry": "UA"
    },
    "priceRange": `${minPrice} - ${maxPrice} UAH`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviews.length || 124,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient rooms={rooms} lang={lang} />
    </>
  );
}