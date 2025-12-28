import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Забронируйте проживание",
  description: "Проверьте наличие мест и забронируйте номер в 'Отдых в Затоке'. Выберите из нашего ассортимента красивых номеров и люксов.",
  keywords: ["бронирование", "отель в Затоке бронирование", "жилье в Одессе", "забронировать номер", "проверить наличие"],
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

