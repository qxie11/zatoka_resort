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
        <section className="relative w-full h-[60vh] md:h-[80vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Ваш морской побег в Затоке
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
              Испытайте несравненный комфорт и захватывающие виды на Черное море в "Отдыхе в Затоке".
            </p>
            <Button asChild size="lg" className="mt-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link href="/booking">Забронировать <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Добро пожаловать в "Отдых в Затоке"</h2>
            <WavyUnderline colorClassName='text-secondary' />
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
              Расположенный на безмятежном побережье Черного моря, "Отдых в Затоке" предлагает идеальное сочетание роскоши, комфорта и природной красоты. Ищете ли вы романтический уик-энд или семейное приключение, наш отель - ваше идеальное место для незабываемого отдыха.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Наши избранные номера</h2>
               <WavyUnderline />
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Элегантно оформленные номера для вашего максимального комфорта.</p>
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
              {amenities.slice(0, 8).map((amenity) => {
                const Icon = iconMap[amenity.icon];
                return (
                  <div key={amenity.name} className="flex flex-col items-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                      {Icon && <Icon className="h-8 w-8 text-primary" />}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{amenity.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold">Готовы к вашему отдыху?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg">
              Берега Затоки зовут. Забронируйте отпуск своей мечты сегодня и создайте воспоминания, которые останутся на всю жизнь.
            </p>
            <Button asChild size="lg" className="mt-8" variant="secondary">
              <Link href="/booking">Забронировать номер сейчас</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
