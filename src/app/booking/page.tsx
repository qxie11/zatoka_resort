import { Suspense } from "react";
import { getRooms, getBookings } from '@/lib/db';
import BookingPageClient from "./components/BookingPageClient";
import SuccessMessage from "./components/SuccessMessage";
import { WavyUnderline } from "@/components/ui/wavy-underline";

export default async function BookingPage() {
  const rooms = await getRooms();
  const bookings = await getBookings();

  return (
    <div>
        <section className="pt-16 lg:pt-24 bg-accent/50">
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
                <BookingPageClient rooms={rooms} bookings={bookings} />
            </div>
        </section>
    </div>
  );
}
