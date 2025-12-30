import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { amenities } from '@/lib/data';
import { getRooms } from '@/lib/db';
import FeaturedRooms from '@/components/rooms/FeaturedRooms';
import { ArrowRight, Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { WavyUnderline } from '@/components/ui/wavy-underline';

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Waves,
  Wifi,
  UtensilsCrossed,
  Sun,
  HeartPulse,
  Car,
  ConciergeBell,
  Dumbbell
};

export default async function Home() {
  const rooms = await getRooms();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover transition-transform duration-[20s] hover:scale-110"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 sea-foam-layer" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 animate-float-slow">
              <Waves className="h-16 w-16 text-white/30" />
            </div>
            <div className="absolute top-40 right-20 animate-float-slow" style={{ animationDelay: "2s" }}>
              <Waves className="h-12 w-12 text-white/20" />
            </div>
            <div className="absolute bottom-32 left-1/4 animate-float-slow" style={{ animationDelay: "4s" }}>
              <Waves className="h-10 w-10 text-white/25" />
            </div>
          </div>
          <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center text-white px-4 z-10">
            <div className="relative">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up relative">
                <span className="relative z-10">Ваш морской побег в Затоке</span>
                <span className="absolute inset-0 text-primary/20 blur-sm animate-pulse">Ваш морской побег в Затоке</span>
              </h1>
            </div>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/95 animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards] drop-shadow-lg">
              Испытайте несравненный комфорт и захватывающие виды на Черное море в "Отдыхе в Затоке".
            </p>
            <Button asChild size="lg" className="mt-10 bg-secondary/95 hover:bg-secondary text-secondary-foreground shadow-gentle hover-lift animate-fade-in-up [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards] transition-smooth gradient-sunset border-0">
              <Link href="/booking">Забронировать <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-background">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        <section className="py-16 lg:py-24 gradient-sea-foam">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight animate-fade-in-up">Добро пожаловать в "Отдых в Затоке"</h2>
            <WavyUnderline colorClassName='text-secondary' />
            <p className="mt-6 max-w-3xl mx-auto text-muted-foreground text-lg leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Расположенный на безмятежном побережье Черного моря, "Отдых в Затоке" предлагает идеальное сочетание роскоши, комфорта и природной красоты. Ищете ли вы романтический уик-энд или семейное приключение, наш отель - ваше идеальное место для незабываемого отдыха.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight animate-fade-in-up">Наши избранные номера</h2>
               <WavyUnderline />
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">Элегантно оформленные номера для вашего максимального комфорта.</p>
            </div>
            <FeaturedRooms rooms={rooms} />
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Удобства отеля</h2>
               <WavyUnderline colorClassName='text-secondary'/>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Все, что нужно для идеального отдыха.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {amenities.slice(0, 8).map((amenity, index) => {
                const Icon = iconMap[amenity.icon];
                return (
                  <div key={amenity.name} className="flex flex-col items-center animate-fade-in-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="bg-primary/10 p-5 rounded-full transition-smooth hover:bg-primary/20 hover-lift relative group/icon">
                      {Icon && <Icon className="h-8 w-8 text-primary transition-smooth group-hover/icon:animate-float-slow" />}
                      <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover/icon:opacity-100 group-hover/icon:animate-water-ripple transition-opacity" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{amenity.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 gradient-ocean text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)' }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-semibold animate-fade-in-up">Готовы к вашему отдыху?</h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white/95 leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Берега Затоки зовут. Забронируйте отпуск своей мечты сегодня и создайте воспоминания, которые останутся на всю жизнь.
            </p>
            <Button asChild size="lg" className="mt-10 bg-white text-primary hover:bg-white/95 shadow-gentle hover-lift transition-smooth animate-fade-in-up [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              <Link href="/booking">Забронировать номер сейчас</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
