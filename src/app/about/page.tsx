import Image from "next/image";
import { Metadata } from "next";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { amenities } from "@/lib/data";
import { Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell } from "lucide-react";
import type { LucideProps } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Zatoka Getaway",
  description: "Learn about the history, mission, and team behind Zatoka Getaway, the premier hotel in Zatoka, Odessa region.",
  keywords: ["about us", "hotel history", "Zatoka hotel", "Odessa resort", "our mission"],
};

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


const teamMembers = [
    { name: 'Olena Petrenko', role: 'General Manager', imageId: 'staff-1' },
    { name: 'Mykhailo Koval', role: 'Head of Concierge', imageId: 'staff-2' },
    { name: 'Andriy Shevchenko', role: 'Executive Chef', imageId: 'staff-3' },
];

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us');

  return (
    <div className="bg-background">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Crafting Unforgettable Stays</h1>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
                Discover the story, passion, and people that make Zatoka Getaway a unique destination on the Black Sea coast.
            </p>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                    <h2 className="font-headline text-3xl font-semibold mb-4">Our History</h2>
                    <p className="text-muted-foreground mb-4">
                        Founded in 2010, Zatoka Getaway was born from a dream to create a haven of tranquility and luxury in one of Ukraine's most beautiful coastal towns. Our founders, a family with deep roots in the Odessa region, envisioned a place where modern comfort meets the timeless beauty of the Black Sea.
                    </p>
                    <p className="text-muted-foreground">
                        Over the years, we've grown from a small, charming guesthouse into a full-service hotel, but our commitment to providing a personal, warm, and welcoming experience has never wavered. We are proud to be a cornerstone of hospitality in Zatoka.
                    </p>
                </div>
                <div className="order-1 lg:order-2 rounded-lg overflow-hidden shadow-xl">
                    {aboutImage && (
                        <Image 
                            src={aboutImage.imageUrl} 
                            alt={aboutImage.description}
                            width={1200}
                            height={800}
                            className="w-full h-full object-cover"
                            data-ai-hint={aboutImage.imageHint}
                        />
                    )}
                </div>
            </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground">
                        To provide an exceptional seaside hospitality experience by combining luxury, comfort, and personalized service, creating lasting memories for every guest.
                    </p>
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4">Our Values</h2>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li><strong>Guest-Centric:</strong> Our guests are at the heart of everything we do.</li>
                        <li><strong>Excellence:</strong> We strive for the highest standards in quality and service.</li>
                        <li><strong>Integrity:</strong> We operate with honesty and transparency.</li>
                        <li><strong>Community:</strong> We are committed to supporting our local community and environment.</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

       <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Our Dedicated Team</h2>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">The smiling faces behind your perfect stay.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => {
                const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
                return (
                 <Card key={member.name} className="text-center">
                    <CardHeader>
                        {memberImage && (
                            <Image
                                src={memberImage.imageUrl}
                                alt={`Portrait of ${member.name}`}
                                width={400}
                                height={400}
                                className="w-32 h-32 rounded-full mx-auto object-cover"
                                data-ai-hint={memberImage.imageHint}
                            />
                        )}
                    </CardHeader>
                    <CardContent>
                        <CardTitle className="text-xl font-headline">{member.name}</CardTitle>
                        <p className="text-primary">{member.role}</p>
                    </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </section>

      <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Amenities & Services</h2>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">We provide a wide range of services to make your stay comfortable and memorable.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {amenities.map((amenity) => {
                const Icon = iconMap[amenity.icon];
                return (
                  <div key={amenity.name} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full mt-1">
                      {Icon && <Icon className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{amenity.name}</h3>
                      <p className="text-muted-foreground text-sm">{amenity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
    </div>
  );
}
