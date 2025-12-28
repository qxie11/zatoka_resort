import { Suspense } from "react";
import { getRooms } from '@/lib/db';
import BookingForm from "./components/BookingForm";
import RoomsList from '@/components/rooms/RoomsList';
import SuccessMessage from "./components/SuccessMessage";
import { WavyUnderline } from "@/components/ui/wavy-underline";

export default async function BookingPage() {
  const rooms = await getRooms();

  return (
    <div>
        <section className="py-16 lg:py-24 bg-accent/50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Забронируйте ваш номер</h1>
                    <WavyUnderline colorClassName="text-secondary" />
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                        Выберите даты, чтобы найти идеальный номер для вашего отпуска на море.
                    </p>
                </div>
                <Suspense fallback={null}>
                  <SuccessMessage />
                </Suspense>
                <BookingForm />
            </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Наши номера и люксы</h2>
                    <WavyUnderline />
                    <p className="mt-2 text-muted-foreground">Найдите идеальное пространство для вашего пребывания.</p>
                </div>
                <RoomsList rooms={rooms} />
            </div>
        </section>
    </div>
  );
}
