import { Metadata } from "next";
import { cookies, headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = headerList.get("x-lang") || cookieStore.get("lang")?.value || "ru";

  const titles = {
    ru: "Забронировать проживание | Отдых в Затоке",
    uk: "Забронювати проживання | Відпочинок в Затоці",
    en: "Book Your Stay | Zatoka Resort",
  };

  const currentYear = new Date().getFullYear();

  const descriptions = {
    ru: `Прямое бронирование номеров в отеле Zatoka Resort у самого моря. Комфортный семейный отдых в Затоке ${currentYear}, бассейн, первая линия, лучшие цены без посредников.`,
    uk: `Пряме бронювання номерів в готелі Zatoka Resort біля самого моря. Комфортний сімейний відпочинок в Затоці ${currentYear}, басейн, перша лінія, кращі ціни без посередників.`,
    en: `Direct room booking at Zatoka Resort beachfront hotel. Affordable family holidays in Zatoka ${currentYear}, swimming pool, seaside view, and booking without intermediaries.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/booking${lang !== "ru" ? `?lang=${lang}` : ""}`;
  const title = titles[lang as keyof typeof titles] || titles.ru;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/booking`,
        ru: `${baseUrl}/booking`,
        uk: `${baseUrl}/booking?lang=uk`,
        en: `${baseUrl}/booking?lang=en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zatoka Resort",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

