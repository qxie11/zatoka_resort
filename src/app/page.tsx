import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { amenities, rooms } from '@/lib/data';
import { ArrowRight, BedDouble, Star, Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';

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

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const featuredRooms = rooms.slice(0, 3);

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
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Your Seaside Escape in Zatoka
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
              Experience unparalleled comfort and breathtaking Black Sea views at Zatoka Getaway.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/booking">Book Your Stay <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold">Welcome to Zatoka Getaway</h2>
            <div className="flex justify-center my-4">
              <div className="w-24 h-1 bg-primary rounded-full" />
            </div>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
              Nestled on the serene coast of the Black Sea, Zatoka Getaway offers a perfect blend of luxury, comfort, and natural beauty. Whether you're seeking a romantic retreat or a family adventure, our hotel is your ultimate destination for an unforgettable holiday.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Our Featured Rooms</h2>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Elegantly designed rooms for your utmost comfort.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden flex flex-col group transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="p-0">
                     <div className="relative h-64 w-full">
                        <Image src={room.imageUrl} alt={room.name} fill className="object-cover" data-ai-hint={room.imageHint} />
                     </div>
                  </CardHeader>
                  <CardContent className="pt-6 flex-grow">
                    <CardTitle className="font-headline text-xl">{room.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <BedDouble className="h-4 w-4" />
                        <span>{room.capacity} Guests</span>
                    </div>
                    <CardDescription className="mt-4">{room.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">{room.price} UAH / night</p>
                    <Button asChild variant="link" className="text-primary">
                      <Link href={`/booking#${room.id}`}>
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href="/booking">View All Rooms</Link>
                </Button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Hotel Amenities</h2>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Everything you need for a perfect stay.</p>
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

        <section className="py-16 lg:py-24 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground">Ready for Your Getaway?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              The shores of Zatoka are calling. Book your dream vacation today and create memories that will last a lifetime.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/booking">Reserve Your Room Now</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
