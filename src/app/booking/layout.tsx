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

  const descriptions = {
    ru: "Проверьте наличие мест и забронируйте номер в 'Отдых в Затоке'. Выберите из нашего ассортимента красивых номеров и люксов.",
    uk: "Перевірте наявність місць та забронюйте номер у 'Відпочинок в Затоці'. Виберіть з нашого асортименту красивих номерів та люксів.",
    en: "Check availability and book a room at 'Zatoka Resort'. Choose from our range of beautiful rooms and suites.",
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/booking${lang !== "ru" ? `?lang=${lang}` : ""}`;

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    keywords: ["бронирование", "отель в Затоке бронирование", "жилье в Одессе", "забронировать номер", "проверить наличие"],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/booking`,
        uk: `${baseUrl}/booking?lang=uk`,
        en: `${baseUrl}/booking?lang=en`,
      },
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

