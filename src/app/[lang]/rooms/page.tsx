import { Metadata } from "next";
import { getRooms } from "@/lib/db";
import RoomsClient from "@/components/rooms/RoomsClient";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";
  const currentYear = new Date().getFullYear();

  const data = {
    ru: {
      title: `Номера и Цены ${currentYear} — Отель Zatoka Resort в Затоке`,
      desc: `Каталог номеров отеля Zatoka Resort. Цены ${currentYear} года, фотографии, удобства (кондиционер, Wi-Fi, кухонная зона). Забронируйте номер у моря без комиссии!`,
      keywords: [
        "номера в затоке",
        `цены затока ${currentYear}`,
        "снять номер затока",
        "отель затока каталог номеров",
        "трехместный номер затока",
        "домик в затоке"
      ]
    },
    uk: {
      title: `Номери та Ціни ${currentYear} — Готель Zatoka Resort у Затоці`,
      desc: `Каталог номерів готелю Zatoka Resort. Ціни ${currentYear} року, фотографії, зручності (кондиціонер, Wi-Fi, кухонна зона). Забронюйте номер біля моря без комісії!`,
      keywords: [
        "номери в затоці",
        `ціни затока ${currentYear}`,
        "зняти номер затока",
        "готель затока каталог номерів",
        "тримісний номер затока",
        "будиночок в затоці"
      ]
    },
    en: {
      title: `Hotel Rooms & Rates ${currentYear} — Zatoka Resort Beachfront Hotel`,
      desc: `Browse rooms at Zatoka Resort. Best rates for ${currentYear}, photos, air conditioning, Wi-Fi, and kitchen facilities. Book your seaside vacation direct!`,
      keywords: [
        "zatoka hotel rooms",
        "zatoka room rates",
        "beachfront accommodation zatoka",
        "book room zatoka"
      ]
    },
  };

  const meta = data[lang as keyof typeof data] || data.ru;
  const canonicalUrl = `${baseUrl}/${lang}/rooms`;
  const ogImageUrl = `${baseUrl}/og-image.png`;

  return {
    title: meta.title,
    description: meta.desc,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/ru/rooms`,
        uk: `${baseUrl}/uk/rooms`,
        en: `${baseUrl}/en/rooms`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang,
      url: canonicalUrl,
      title: meta.title,
      description: meta.desc,
      siteName: "Zatoka Resort",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.desc,
      images: [ogImageUrl],
    },
  };
}

export default async function RoomsPage({ params }: PageProps) {
  const { lang } = await params;
  const rooms = await getRooms();

  return <RoomsClient rooms={rooms} lang={lang} />;
}
