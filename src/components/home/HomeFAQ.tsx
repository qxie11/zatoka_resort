import React, { useState } from 'react';
import { ChevronDown, Utensils, Waves, Sun, Sparkles, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomeFAQ({ lang }: { lang: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentLang = (lang || 'ru').slice(0, 2) as 'ru' | 'uk' | 'en';

  const faqs = [
    {
      icon: MapPin,
      q: { ru: "Где находится отель Zatoka Resort?", uk: "Де знаходиться готель Zatoka Resort?", en: "Where is Zatoka Resort located?" },
      a: { 
        ru: "Отель расположен в Затоке (станция Лиманская) по адресу ул. Садовая, 1835. Всего 5 минут приятной прогулки до песчаного пляжа Чёрного моря.", 
        uk: "Готель розташований у Затоці (станція Лиманська) за адресою вул. Садова, 1835. Всього 5 хвилин приємної прогулянки до піщаного пляжу Чорного моря.", 
        en: "The resort is located in Zatoka (Lymanska station) at 1835 Sadovaya Street, just a 5-minute walk to the Black Sea sandy beach." 
      }
    },
    {
      icon: Utensils,
      q: { ru: "Есть ли в отеле номера со своей кухней?", uk: "Чи є в готелі номери зі своєю кухнею?", en: "Are there rooms with a private kitchen?" },
      a: { 
        ru: "Да! В номерах категорий 'Променад' и 'Коттедж' оборудована собственная индивидуальная кухня со всей необходимой кухонной техникой, плитой, холодильником и посудой.", 
        uk: "Так! У номерах категорій 'Променад' та 'Котедж' обладнана власна індивідуальна кухня з усією необхідною технікою, плитою, холодильником та посудом.", 
        en: "Yes! Rooms in the 'Promenade' and 'Cottage' categories feature a private fully equipped kitchen with appliances, stove, fridge, and cookware." 
      }
    },
    {
      icon: Sun,
      q: { ru: "Какие цены на проживание в 2026 году?", uk: "Які ціни на проживання у 2026 році?", en: "What are the room rates for 2026?" },
      a: { 
        ru: "Цены варьируются от 390 грн/сутки за Эконом до 2190 грн/сутки за Коттедж со своей кухней. Проверить свободные даты и цены можно в реальном времени в виджете бронирования.", 
        uk: "Ціни варіюються від 390 грн/добу за Економ до 2190 грн/добу за Котедж зі своєю кухнею. Перевірити вільні дати та ціни можна в реальному часі у віджеті бронювання.", 
        en: "Prices range from 390 UAH/night for Economy to 2190 UAH/night for the Cottage with private kitchen. Real-time rates can be checked in our booking calendar." 
      }
    },
    {
      icon: Sparkles,
      q: { ru: "Есть ли мангальная зона и BBQ?", uk: "Чи є мангальна зона та BBQ?", en: "Is there a barbecue / mangal area?" },
      a: { 
        ru: "Да, на территории отеля для всех гостей бесплатно предоставляется мангальная зона с грилем, шампурами и удобными беседками.", 
        uk: "Так, на території готелю для всіх гостей безкоштовно надається мангальна зона з грилем, шампурами та зручними альтанками.", 
        en: "Yes, a complimentary barbecue area with grills, skewers, and cozy gazebos is available for all guests." 
      }
    },
    {
      icon: Waves,
      q: { ru: "Подходит ли отель для отдыха с детьми?", uk: "Чи підходить готель для відпочинку з дітьми?", en: "Is the hotel suitable for families with children?" },
      a: { 
        ru: "Да, отель отлично подходит для семейного отдыха: есть открытый плавательный бассейн, детская игровая площадка и безопасная закрытая территория.", 
        uk: "Так, готель чудо підходить для сімейного відпочинку: є відкритий басейн, дитячий майданчик та безпечна закрита територія.", 
        en: "Yes, our resort is ideal for family holidays featuring an outdoor swimming pool, kids playground, and safe enclosed territory." 
      }
    },
    {
      icon: ShieldCheck,
      q: { ru: "Есть ли парковка и Wi-Fi?", uk: "Чи є безкоштовна автостоянка та Wi-Fi?", en: "Is parking and Wi-Fi free?" },
      a: { 
        ru: "Да, всем гостям бесплатно предоставляется охраняемая автостоянка на территории отеля и скоростной Wi-Fi в номерах и у бассейна.", 
        uk: "Так, для всіх гостей безкоштовно надається автостоянка на території готелю та швидкісний Wi-Fi у номерах та біля басейну.", 
        en: "Yes, free secure parking and high-speed Wi-Fi throughout the property and pool area are included for all guests." 
      }
    },
    {
      icon: PhoneCall,
      q: { ru: "Как забронировать номер без комиссии?", uk: "Як забронювати номер без комісії?", en: "How to book directly without extra fees?" },
      a: { 
        ru: "Забронировать номер напрямую от владельцев без комиссии можно на нашем официальном сайте или по телефону / Telegram: +38 (066) 921-22-75. Оплата при заезде!", 
        uk: "Забронювати номер напряму від власників без комісії можна на нашому офіційному сайті або за телефоном / Telegram: +38 (066) 921-22-75. Оплата при заїзді!", 
        en: "Book directly on our official website or contact us via Phone / Telegram +38 (066) 921-22-75 with zero booking fees. Pay upon arrival!" 
      }
    }
  ];

  const titleText = {
    ru: "Частые вопросы",
    uk: "Часті запитання",
    en: "Frequently Asked Questions"
  };

  return (
    <section className="py-20 bg-slate-950 relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 texture-dots opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12 drop-shadow-md font-heading">
          {titleText[currentLang] || titleText.ru}
        </h2>
        
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;
            const qStr = faq.q[currentLang] || faq.q.ru;
            const aStr = faq.a[currentLang] || faq.a.ru;

            return (
              <div 
                key={index} 
                className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-teal-500/30 shadow-lg"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-4">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="h-4 w-4 text-teal-400" />
                    </div>
                    <span className="font-bold text-base sm:text-lg text-white group-hover:text-teal-300 transition-colors">
                      {qStr}
                    </span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-teal-400 shrink-0 transition-transform duration-300", 
                      isOpen ? "rotate-180" : ""
                    )} 
                  />
                </button>
                
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 pt-0 text-slate-300 leading-relaxed border-t border-white/5 text-sm sm:text-base">
                      {aStr}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

