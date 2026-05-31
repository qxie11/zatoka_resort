import Image from "next/image";
import { Metadata } from "next";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { amenities } from "@/lib/data";
import { Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell, Compass, Star } from "lucide-react";
import type { LucideProps } from 'lucide-react';
import { WavyUnderline } from '@/components/ui/wavy-underline';

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
    <div className="bg-background min-h-screen">
      {/* HEADER SECTION */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1683459285195-2bff6b201b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Seaside background"
            fill
            className="object-cover scale-105 animate-float-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-background" />
        </div>

        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md">
            Создавая незабываемый отдых
          </h1>
          <WavyUnderline colorClassName="text-teal-300" />
          <p className="mt-6 max-w-2xl mx-auto text-slate-200 text-lg md:text-xl font-light leading-relaxed">
            Откройте для себя историю, страсть и людей, которые делают "Отдых в Затоке" уникальным местом на побережье Черного моря.
          </p>
        </div>

        {/* Floating wavy separator */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-background">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-20 lg:py-28 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Наша история
              </h2>
              <div className="h-1 w-20 bg-primary/80 rounded-full" />
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                Основанный в 2010 году, "Отдых в Затоке" родился из мечты создать оазис спокойствия и роскоши в одном из самых красивых прибрежных городов Украины. Наши основатели, семья с глубокими корнями в Одесском регионе, представляли себе место, где современный комфорт сочетается с вечной красотой Черного моря.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                За годы мы выросли из небольшого очаровательного гостевого дома в полноценный отель, но наше стремление предоставлять личный, теплый и гостеприимный опыт никогда не ослабевало. Мы гордимся тем, что являемся краеугольным камнем гостеприимства в Затоке.
              </p>
            </div>
            
            {/* Elegant Image Showcase frame */}
            <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl group hover:border-primary/30 transition-all duration-500">
              {aboutImage && (
                <Image 
                  src={aboutImage.imageUrl} 
                  alt={aboutImage.description}
                  fill
                  className="object-cover transition-smooth group-hover:scale-105"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VALUES SECTION (Glass Panels) */}
      <section className="py-20 lg:py-28 bg-gradient-sea-foam relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 animate-float">
            <Waves className="h-40 w-40 text-primary" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Mission Card */}
            <div className="p-8 md:p-10 rounded-3xl glass-card-premium shadow-xl border border-white/50 space-y-4 hover-lift transition-smooth">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Наша миссия</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                Предоставлять исключительный опыт гостеприимства на берегу моря, сочетая роскошь, комфорт и индивидуальное обслуживание, создавая незабываемые воспоминания для каждого гостя.
              </p>
            </div>

            {/* Values Card */}
            <div className="p-8 md:p-10 rounded-3xl glass-card-premium shadow-xl border border-white/50 space-y-4 hover-lift transition-smooth">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                <Sun className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Наши ценности</h2>
              <ul className="text-muted-foreground space-y-3 font-light text-base md:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">●</span>
                  <span><strong>Ориентация на гостя:</strong> Наши гости находятся в центре всего, что мы делаем.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">●</span>
                  <span><strong>Превосходство:</strong> Мы стремимся к самым высоким стандартам качества и обслуживания.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">●</span>
                  <span><strong>Честность:</strong> Мы работаем честно и прозрачно.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* TEAM SECTION (Frosted Glass Cards) */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Наша преданная команда
            </h2>
            <WavyUnderline />
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg font-light">
              Улыбающиеся лица, стоящие за вашим идеальным отдыхом на море.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => {
              const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
              return (
                <div key={member.name} className="flex flex-col items-center text-center p-8 rounded-3xl glass-card-premium border border-white/60 shadow-gentle hover-lift transition-smooth group">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md group-hover:border-primary/40 transition-colors">
                    {memberImage && (
                      <Image
                        src={memberImage.imageUrl}
                        alt={`Портрет ${member.name}`}
                        fill
                        className="object-cover transition-smooth group-hover:scale-110"
                        data-ai-hint={memberImage.imageHint}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                  <p className="text-primary font-medium mt-1">{member.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Удобства и услуги
            </h2>
            <WavyUnderline colorClassName="text-secondary" />
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg font-light">
              Мы предоставляем широкий спектр услуг премиум-класса, чтобы сделать ваше пребывание комфортным и незабываемым.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {amenities.map((amenity) => {
              const Icon = iconMap[amenity.icon];
              return (
                <div key={amenity.name} className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-soft hover:shadow-md transition-smooth hover:-translate-y-0.5 border border-slate-100">
                  <div className="bg-primary/10 text-primary p-3.5 rounded-2xl shrink-0">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">{amenity.name}</h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">{amenity.description}</p>
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
