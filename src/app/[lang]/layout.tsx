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
    ru: { title: "Отдых в Затоке | Zatoka Resort", desc: `Семейный отель в Затоке в 5 минутах от моря. Кондиционеры, комфортные номера, цены ${currentYear}.` },
    uk: { title: "Відпочинок в Затоці | Zatoka Resort", desc: `Сімейний готель в Затоці в 5 хвилинах від моря. Кондиціонери, комфортні номери, ціни ${currentYear}.` },
    en: { title: "Zatoka Resort | Seaside Hotel", desc: `Family hotel in Zatoka, just a 5-minute walk to the beach. Air conditioning, comfortable rooms, best rates ${currentYear}.` },
  };

  const { title, desc } = i18n[lang as keyof typeof i18n] || i18n.ru;

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
  
  // Fetch rooms on the Server Side to get the lowest price
  let minPrice = 1500;
  try {
    const rooms = await getRooms();
    if (rooms && rooms.length) {
      minPrice = Math.min(...rooms.map((r) => r.price));
    }
  } catch (err) {
    console.error("Failed to fetch rooms in RootLayout:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Zatoka Resort",
    "description": "Premium family hotel in Zatoka, Ukraine.",
    "url": "https://zatoka-hotel.com",
    "telephone": "+380123456789",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sadovaya St, 1835, Limanskaya Station",
      "addressLocality": "Zatoka",
      "addressRegion": "Odesa region",
      "postalCode": "67772",
      "addressCountry": "UA"
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "4"
    },
    "priceRange": "$$"
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