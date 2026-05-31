import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { amenities } from '@/lib/data';
import { getRooms } from '@/lib/db';
import FeaturedRooms from '@/components/rooms/FeaturedRooms';
import { ArrowRight, Waves, Wifi, UtensilsCrossed, Sun, HeartPulse, Car, ConciergeBell, Dumbbell, Star, MapPin, Compass, ShieldCheck } from 'lucide-react';
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
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-slate-900 py-16 lg:py-0">
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover scale-105 animate-float-slow opacity-80 brightness-[0.7]"
                priority
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
            </div>
          )}

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

          <div className="relative container mx-auto px-4 lg:px-8 z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* LEFT COLUMN: Premium Copy & Interactive Quick CTA */}
              <div className="lg:col-span-7 flex flex-col items-start text-left text-white space-y-6">
                
                {/* Premium Micro-Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in">
                  <Compass className="h-4 w-4 animate-spin-slow" />
                  <span>Премиум курорт на Черном море</span>
                </div>

                {/* Heading with glowing highlights & elegant tracking */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-up">
                  Ваш идеальный <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md">
                    морской побег
                  </span> <br />
                  в Затоке
                </h1>

                {/* Description */}
                <p className="max-w-xl text-base md:text-lg text-slate-200 font-light leading-relaxed animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
                  Испытайте несравненный пятизвездочный комфорт, ласковые волны и захватывающие дух панорамные виды на Черное море.
                </p>

                {/* Quick Interactive Reservation Panel */}
                <div className="w-full max-w-lg p-5 rounded-2xl glass-card-dark shadow-2xl border border-white/10 animate-fade-in-up [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Первая линия</div>
                        <div>10м до пляжа</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Безопасность</div>
                        <div>Охраняемая зона</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                      <Link href="/booking" className="flex items-center justify-center">
                        Забронировать отдых
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                      <Link href="/about">Узнать больше</Link>
                    </Button>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Asymmetrical Floating Visual Showcase */}
              <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-in-up [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
                <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl group hover:border-teal-400/50 transition-all duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                    alt="Luxury Seaside Dining"
                    fill
                    className="object-cover transition-all duration-[10s] group-hover:scale-110 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Floating Premium Rating Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-card-premium text-slate-900 border border-white/40 shadow-xl transition-all duration-300 group-hover:translate-y-[-5px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Рейтинг гостей</p>
                        <p className="text-sm font-extrabold text-slate-950">Превосходно</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-400 px-2.5 py-1 rounded-lg text-slate-950 font-bold text-sm">
                        <Star className="h-4 w-4 fill-slate-950" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra Floating Badge */}
                <div className="absolute -top-4 -right-4 p-4 rounded-2xl glass-card-dark text-white border border-white/10 shadow-xl animate-float hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-400/20 flex items-center justify-center">
                      <Waves className="h-5 w-5 text-teal-300" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">Температура воды</p>
                      <p className="text-sm font-extrabold text-white">+24°C</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Dynamic Layered Wave SVG Divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-background">
              <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-40 fill-sky-200/20" />
              <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
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
