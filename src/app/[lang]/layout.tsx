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
      title: `Отдых в Затоке ${currentYear} | Отель Zatoka Resort у моря`,
      desc: `Официальный сайт отеля Zatoka Resort в Затоке (Лиманская). Комфортабельные номера с кондиционером в 5 минутах от моря. Цены ${currentYear}, скидки и бронирование без комиссии.`,
      keywords: [
        "отдых в затоке",
        "отель в затоке",
        `гостиница затока ${currentYear}`,
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
      title: `Відпочинок в Затоці ${currentYear} | Готель Zatoka Resort біля моря`,
      desc: `Офіційний сайт готелю Zatoka Resort в Затоці (Лиманська). Комфортні номери з кондиціонером за 5 хвилин від моря. Ціни ${currentYear}, знижки та бронювання без комісії.`,
      keywords: [
        "відпочинок в затоці",
        "готель в затоці",
        `готель затока ${currentYear}`,
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
      title: `Zatoka Resort ${currentYear} | Family Beachfront Hotel in Zatoka`,
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
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
  let minPrice = 390;
  let maxPrice = 2190;
  let fetchedRooms: any[] = [];
  try {
    const rooms = await getRooms();
    if (rooms && rooms.length) {
      fetchedRooms = rooms;
      const prices = rooms.map((r) => r.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }
  } catch (err) {
    console.error("Failed to fetch rooms in RootLayout:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Hotel", "Resort"],
    "name": "Zatoka Resort",
    "description": lang === "uk"
      ? "Офіційний сайт отелю Zatoka Resort у Затоці. Номери зі своєю кухнею, басейн, мангали, 5 хвилин до моря."
      : "Официальный сайт отеля Zatoka Resort в Затоке. Номера со своей кухней, бассейн, мангалы, 5 минут до моря.",
    "url": `${baseUrl}/${lang}`,
    "telephone": "+380669212275",
    "priceRange": `${minPrice} - ${maxPrice} UAH`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Садовая, 1835",
      "addressLocality": "Затока",
      "addressRegion": "Одесская область",
      "postalCode": "67770",
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
      { "@type": "LocationFeatureSpecification", "name": "Своя кухня (Променад и Коттедж)", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Бассейн", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "5 минут до моря", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Мангальная зона и BBQ", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Детская площадка", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Номера отеля Zatoka Resort",
      "itemListElement": fetchedRooms.map((room) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "HotelRoom",
          "name": room.name,
          "description": room.description || `${room.name} — отель Zatoka Resort`
        },
        "price": room.price.toString(),
        "priceCurrency": "UAH",
        "url": `${baseUrl}/${lang}/booking/${room.slug || room.id}`
      }))
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": lang === "uk" ? "Де знаходиться готель Zatoka Resort?" : "Где находится отель Zatoka Resort?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === "uk"
            ? "Готель Zatoka Resort розташований у Затоці (Одеська область) за адресою вул. Садова, 1835. Всього 5 хвилин пішки до піщаного пляжу Чорного моря."
            : "Отель Zatoka Resort расположен в Затоке (Одесская область) по адресу ул. Садовая, 1835. Всего в 5 минутах ходьбы от песчаного пляжа Чёрного моря."
        }
      },
      {
        "@type": "Question",
        "name": lang === "uk" ? "Чи є номери зі своєю кухнею в Zatoka Resort?" : "Есть ли в отеле Zatoka Resort номера со своей кухней?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === "uk"
            ? "Так! У номерах категорій 'Променад' та 'Котедж' обладнана власна індивідуальна кухня з усією необхідною технікою та посудом."
            : "Да! В номерах категорий 'Променад' и 'Коттедж' оборудована собственная индивидуальная кухня со всей необходимой кухонной техникой и посудой."
        }
      },
      {
        "@type": "Question",
        "name": lang === "uk" ? "Які ціни на проживання в Zatoka Resort?" : "Каковы цены на проживание в опеле Zatoka Resort?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Цены на проживание варьируются от ${minPrice} грн/сутки до ${maxPrice} грн/сутки в зависимости от выбранного номера.`
        }
      }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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