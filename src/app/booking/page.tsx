import { Metadata } from "next";
import { rooms } from "@/lib/data";
import BookingForm from "./components/BookingForm";
import RoomCard from "./components/RoomCard";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Check availability and book your room at Zatoka Getaway. Choose from our selection of beautiful rooms and suites.",
  keywords: ["booking", "Zatoka hotel booking", "Odessa accommodation", "reserve room", "check availability"],
};


export default function BookingPage() {
  return (
    <div>
        <section className="py-16 lg:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">Reserve Your Room</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                        Select your dates to find the perfect room for your seaside vacation.
                    </p>
                </div>
                <BookingForm />
            </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-semibold">Our Rooms & Suites</h2>
                    <p className="mt-2 text-muted-foreground">Find the perfect space for your stay.</p>
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
