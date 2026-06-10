import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

  const titles = {
    ru: "Забронировать проживание",
    uk: "Забронювати проживання",
    en: "Book Your Stay",
  };

  const descriptions = {
    ru: "Проверьте наличие мест и забронируйте номер в 'Отдых в Затоке'. Выберите из нашего ассортимента красивых номеров и люксов.",
    uk: "Перевірте наявність місць та забронюйте номер у 'Відпочинок в Затоці'. Виберіть з нашого асортименту красивих номерів та люксів.",
    en: "Check availability and book a room at 'Zatoka Resort'. Choose from our range of beautiful rooms and suites.",
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    keywords: ["бронирование", "отель в Затоке бронирование", "жилье в Одессе", "забронировать номер", "проверить наличие"],
  };
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

