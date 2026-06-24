import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    ru: "Забронировать проживание | Отдых в Затоке",
    uk: "Забронювати проживання | Відпочинок в Затоці",
    en: "Book Your Stay | Zatoka Resort",
  };

  const currentYear = new Date().getFullYear();

  const descriptions = {
    ru: `Прямое бронирование номеров в отеле Zatoka Resort. Комфортный семейный отдых в Затоке ${currentYear} в 10 минутах от моря, бассейн, лучшие цены без посредников.`,
    uk: `Пряме бронювання номерів в готелі Zatoka Resort. Комфортний сімейний відпочинок в Затоці ${currentYear} в 10 хвилинах від моря, басейн, кращі ціни без посередників.`,
    en: `Direct room booking at Zatoka Resort. Affordable family holidays in Zatoka ${currentYear} just a 10-minute walk to the beach, swimming pool, and booking without intermediaries.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/${lang}/booking`;
  const title = titles[lang as keyof typeof titles] || titles.ru;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/ru/booking`,
        ru: `${baseUrl}/ru/booking`,
        uk: `${baseUrl}/uk/booking`,
        en: `${baseUrl}/en/booking`,
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

