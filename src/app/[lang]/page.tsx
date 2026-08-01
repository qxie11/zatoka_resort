import { Metadata } from "next";
import { getRooms, getReviews } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";
  const currentYear = new Date().getFullYear();

  const data = {
    ru: {
      title: `Отдых в Затоке ${currentYear} — Семейный Отель Zatoka Resort у Моря`,
      desc: `Снять номер в Затоке у моря на станции Лиманская. Комфортные номера, детская площадка, мангальная зона, Wi-Fi, цены ${currentYear}. Забронируйте отдых напрямую!`,
      keywords: [
        `отдых в затоке ${currentYear}`,
        "снять номер в затоке у моря",
        "отель затока лиманская",
        "семейный отдых затока",
        "затока гостиница цены",
        "отель в затоке первая линия",
        "бронирование затока"
      ]
    },
    uk: {
      title: `Відпочинок в Затоці ${currentYear} — Сімейний Готель Zatoka Resort біля Моря`,
      desc: `Зняти номер в Затоці біля моря на станції Лиманська. Комфортні номери, дитячий майданчик, мангальна зона, Wi-Fi, ціни ${currentYear}. Забронюйте відпочинок напряму!`,
      keywords: [
        `відпочинок в затоці ${currentYear}`,
        "зняти номер в затоці біля моря",
        "готель затока лиманська",
        "сімейний відпочинок затока",
        "затока готель ціни",
        "бронювання затока"
      ]
    },
    en: {
      title: `Zatoka Resort ${currentYear} — Family Hotel near the Black Sea Beach`,
      desc: `Book a hotel room in Zatoka, Ukraine. Comfortable air-conditioned rooms, barbecue area, Wi-Fi, playground, best rates ${currentYear}. Direct online booking.`,
      keywords: [
        `zatoka resort ${currentYear}`,
        "book room zatoka beach",
        "zatoka hotel limanskaya",
        "family vacation zatoka ukraine",
        "zatoka seaside hotel"
      ]
    },
  };

  const meta = data[lang as keyof typeof data] || data.ru;
  const canonicalUrl = `${baseUrl}/${lang}`;

  return {
    title: meta.title,
    description: meta.desc,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/ru`,
        uk: `${baseUrl}/uk`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang,
      url: canonicalUrl,
      title: meta.title,
      description: meta.desc,
      siteName: "Zatoka Resort",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.desc,
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const [rooms, reviews] = await Promise.all([
    getRooms(), 
    getReviews()
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";

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