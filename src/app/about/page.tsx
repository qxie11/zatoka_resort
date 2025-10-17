import Image from "next/image";
import { Metadata } from "next";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { amenities } from "@/lib/data";
import { Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell } from "lucide-react";
import type { LucideProps } from 'lucide-react';

export const metadata: Metadata = {
  title: "О нас - Отдых в Затоке",
  description: "Узнайте об истории, миссии и команде, стоящей за 'Отдых в Затоке', ведущим отелем в Затоке, Одесская область.",
  keywords: ["о нас", "история отеля", "отель в Затоке", "курорт в Одессе", "наша миссия"],
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
    { name: 'Олена Петренко', role: 'Генеральный менеджер', imageId: 'staff-1' },
    { name: 'Михайло Коваль', role: 'Начальник консьерж-службы', imageId: 'staff-2' },
    { name: 'Андрій Шевченко', role: 'Шеф-повар', imageId: 'staff-3' },
];

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us');

  return (
    <div className="bg-background">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Создавая незабываемый отдых</h1>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
                Откройте для себя историю, страсть и людей, которые делают "Отдых в Затоке" уникальным местом на побережье Черного моря.
            </p>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                    <h2 className="font-headline text-3xl font-semibold mb-4">Наша история</h2>
                    <p className="text-muted-foreground mb-4">
                        Основанный в 2010 году, "Отдых в Затоке" родился из мечты создать оазис спокойствия и роскоши в одном из самых красивых прибрежных городов Украины. Наши основатели, семья с глубокими корнями в Одесском регионе, представляли себе место, где современный комфорт сочетается с вечной красотой Черного моря.
                    </p>
                    <p className="text-muted-foreground">
                        За годы мы выросли из небольшого очаровательного гостевого дома в полноценный отель, но наше стремление предоставлять личный, теплый и гостеприимный опыт никогда не ослабевало. Мы гордимся тем, что являемся краеугольным камнем гостеприимства в Затоке.
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
                    <h2 className="font-headline text-3xl font-semibold mb-4">Наша миссия</h2>
                    <p className="text-muted-foreground">
                        Предоставлять исключительный опыт гостеприимства на берегу моря, сочетая роскошь, комфорт и индивидуальное обслуживание, создавая незабываемые воспоминания для каждого гостя.
                    </p>
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4">Наши ценности</h2>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li><strong>Ориентация на гостя:</strong> Наши гости находятся в центре всего, что мы делаем.</li>
                        <li><strong>Превосходство:</strong> Мы стремимся к самым высоким стандартам качества и обслуживания.</li>
                        <li><strong>Честность:</strong> Мы работаем честно и прозрачно.</li>
                        <li><strong>Сообщество:</strong> Мы стремимся поддерживать наше местное сообщество и окружающую среду.</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

       <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Наша преданная команда</h2>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Улыбающиеся лица, стоящие за вашим идеальным отдыхом.</p>
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
                                alt={`Портрет ${member.name}`}
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
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Удобства и услуги</h2>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Мы предоставляем широкий спектр услуг, чтобы сделать ваше пребывание комфортным и незабываемым.</p>
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
