import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StickyBookingBar } from "@/components/conversion/StickyBookingBar";
import { CallbackForm } from "@/components/conversion/CallbackForm";
import ScratchCardPromo from "@/components/conversion/ScratchCardPromo";
import LanguageSync from "@/components/providers/LanguageSync";
import { getRooms } from "@/lib/db";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";

  const currentYear = new Date().getFullYear();

  const i18n = {
    ru: {
      title: "Отдых в Затоке 2026 | Отель Zatoka Resort у моря",
      desc: `Официальный сайт отеля Zatoka Resort в Затоке (Лиманская). Комфортабельные номера с кондиционером в 5 минутах от моря. Цены ${currentYear}, скидки и бронирование без комиссии.`,
      keywords: [
        "отдых в затоке",
        "отель в затоке",
        "гостиница затока 2026",
        "снять номер в затоке",
        "затока отель у моря",
        "отель с кондиционером затока",
        "лиманская затока отели",
        "затока бронирование номеров",
        "отдых в затоке цены",
        "семейный отель затока"
      ]
    },
    uk: {
      title: "Відпочинок в Затоці 2026 | Готель Zatoka Resort біля моря",
      desc: `Офіційний сайт готелю Zatoka Resort в Затоці (Лиманська). Комфортні номери з кондиціонером за 5 хвилин від моря. Ціни ${currentYear}, знижки та бронювання без комісії.`,
      keywords: [
        "відпочинок в затоці",
        "готель в затоці",
        "готель затока 2026",
        "зняти номер в затоці",
        "затока готель біля моря",
        "готель з кондиціонером затока",
        "лиманська затока готелі",
        "затока бронювання номерів",
        "відпочинок в затоці ціни",
        "сімейний готель затока"
      ]
    },
    en: {
      title: "Zatoka Resort 2026 | Family Beachfront Hotel in Zatoka",
      desc: `Official website of Zatoka Resort in Zatoka, Ukraine. Comfortable air-conditioned rooms 5 minutes from the beach. Best rates ${currentYear}, direct booking with no fees.`,
      keywords: [
        "zatoka hotel",
        "resort in zatoka",
        "zatoka beach accommodation",
        "zatoka hotel room booking",
        "seaside hotel zatoka ukraine",
        "black sea resorts zatoka"
      ]
    },
  };

  const { title, desc, keywords } = i18n[lang as keyof typeof i18n] || i18n.ru;
  const ogImageUrl = `${baseUrl}/hero-bg.jpg`;

  return {
    metadataBase: new URL(baseUrl),
    verification: {
      google: "PCgrYQ1lq2e315vICglOzO78yo3_FGhfwEXyPTDmR_8",
    },
    title: {
      default: title,
      template: "%s | Zatoka Resort",
    },
    description: desc,
    keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        "x-default": `${baseUrl}/ru`,
        ru: `${baseUrl}/ru`,
        uk: `${baseUrl}/uk`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang,
      url: `${baseUrl}/${lang}`,
      siteName: "Zatoka Resort",
      title,
      description: desc,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Zatoka Resort - Seaside Hotel",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";

  // Fetch rooms on the Server Side to get min and max prices
  let minPrice = 400;
  let maxPrice = 2200;
  try {
    const rooms = await getRooms();
    if (rooms && rooms.length) {
      const prices = rooms.map((r) => r.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }
  } catch (err) {
    console.error("Failed to fetch rooms in RootLayout:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Zatoka Resort",
    "description": "Premium family hotel in Zatoka, Odesa Region, 5 minutes walk to the Black Sea beach.",
    "url": `${baseUrl}/${lang}`,
    "telephone": "+380669212275",
    "priceRange": `${minPrice} - ${maxPrice} UAH`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sadovaya St, 1835, Limanskaya Station",
      "addressLocality": "Zatoka",
      "addressRegion": "Odesa region",
      "postalCode": "67772",
      "addressCountry": "UA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "46.13355",
      "longitude": "30.51818"
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "4.9"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Beachfront Access", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Barbecue Zone", "value": true }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LanguageSync lang={lang} />
      <Header />

      <main className="min-h-screen flex flex-col">
        {children}
      </main>

      <Footer />

      <StickyBookingBar minPrice={minPrice} />
      <CallbackForm />
      <ScratchCardPromo lang={lang} />
    </div>
  );
}