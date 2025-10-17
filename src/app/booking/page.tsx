import { Metadata } from "next";
import { rooms } from "@/lib/data";
import BookingForm from "./components/BookingForm";
import RoomCard from "./components/RoomCard";

export const metadata: Metadata = {
  title: "Забронируйте проживание",
  description: "Проверьте наличие мест и забронируйте номер в 'Отдых в Затоке'. Выберите из нашего ассортимента красивых номеров и люксов.",
  keywords: ["бронирование", "отель в Затоке бронирование", "жилье в Одессе", "забронировать номер", "проверить наличие"],
};


export default function BookingPage() {
  return (
    <div>
        <section className="py-16 lg:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">Забронируйте ваш номер</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                        Выберите даты, чтобы найти идеальный номер для вашего отпуска на море.
                    </p>
                </div>
                <BookingForm />
            </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-semibold">Наши номера и люксы</h2>
                    <p className="mt-2 text-muted-foreground">Найдите идеальное пространство для вашего пребывания.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}
