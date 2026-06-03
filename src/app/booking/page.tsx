import { Suspense } from "react";
import Image from "next/image";
import { Waves, Compass } from "lucide-react";
import { getRooms, getBookings } from '@/lib/db';
import BookingPageClient from "./components/BookingPageClient";
import SuccessMessage from "./components/SuccessMessage";
import { WavyUnderline } from "@/components/ui/wavy-underline";

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
  const rooms = await getRooms();
  const bookings = await getBookings();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO HEADER SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900 text-white text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Luxury resort booking"
            fill
            className="object-cover scale-105 animate-float-slow opacity-80 brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Floating animated marine wave accents in background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
          <div className="absolute top-1/4 left-10 animate-float">
            <Waves className="h-24 w-24 text-teal-300" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-slow" style={{ animationDelay: "3s" }}>
            <Waves className="h-16 w-16 text-sky-300" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: "5s" }}>
            <Waves className="h-20 w-20 text-teal-200" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center">
          {/* Premium Micro-Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in mb-6">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>Бронирование номеров</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md animate-fade-in-up">
            Забронируйте ваш номер
          </h1>
          <WavyUnderline colorClassName="text-teal-300" />
          <p className="mt-6 max-w-2xl mx-auto text-slate-200 text-lg md:text-xl font-light leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            Выберите даты, чтобы найти идеальный номер для вашего отпуска на море.
          </p>
        </div>

        {/* Dynamic Layered Wave SVG Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-slate-950">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* BOOKING CLIENT CONTAINER */}
      <section className="py-12 bg-slate-950 relative z-10 -mt-8">
        <div className="container mx-auto px-4">
          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>
          <BookingPageClient rooms={rooms} bookings={bookings} />
        </div>
      </section>
    </div>
  );
}
