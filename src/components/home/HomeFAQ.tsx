import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function HomeFAQ({ lang }: { lang: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const t = {
    title: { ru: "Частые вопросы", uk: "Часті запитання", en: "Frequently Asked Questions" },
    q1: { ru: "Как далеко находится пляж?", uk: "Як далеко знаходиться пляж?", en: "How far is the beach?" },
    a1: { 
      ru: "Всего в 5 минутах приятной прогулки. Пляж песчаный, чистый и идеально подходит для отдыха с детьми.", 
      uk: "Всього за 5 хвилин приємної прогулянки. Пляж піщаний, чистий та ідеально підходить для відпочинку з дітьми.", 
      en: "Just a 5-minute pleasant walk away. The beach is sandy, clean, and perfectly suited for family holidays." 
    },
    q2: { ru: "Какие варианты питания доступны?", uk: "Які варіанти харчування доступні?", en: "What dining options are available?" },
    a2: { 
      ru: "У нас есть собственное кафе с домашней кухней, а также общие кухни для самостоятельного приготовления пищи.", 
      uk: "У нас є власне кафе з домашньою кухнею, а також загальні кухні для самостійного приготування їжі.", 
      en: "We have our own cafe with home-cooked meals, as well as shared kitchens for self-catering." 
    },
    q3: { ru: "Есть ли парковка на территории?", uk: "Чи є парковка на території?", en: "Is parking available on site?" },
    a3: { 
      ru: "Да, для наших гостей доступна бесплатная охраняемая парковка прямо на территории.", 
      uk: "Так, для наших гостей доступна безкоштовна автостоянка, що охороняється, прямо на території.", 
      en: "Yes, free secure parking is available for our guests right on the territory." 
    },
    q4: { ru: "В какое время заезд и выезд?", uk: "О котрій годині заїзд та виїзд?", en: "What are the check-in and check-out times?" },
    a4: { 
      ru: "Стандартное время заезда — с 14:00, время выезда — до 12:00. Возможен ранний заезд или поздний выезд по предварительному согласованию.", 
      uk: "Стандартний час заїзду — з 14:00, час виїзду — до 12:00. Можливий ранній заїзд або пізній виїзд за попереднім погодженням.", 
      en: "Standard check-in is from 14:00, check-out is until 12:00. Early check-in or late check-out is possible by prior arrangement." 
    }
  };

  const currentLang = lang as keyof typeof t.title;

  const faqs = [
    { q: t.q1[currentLang] || t.q1.ru, a: t.a1[currentLang] || t.a1.ru },
    { q: t.q2[currentLang] || t.q2.ru, a: t.a2[currentLang] || t.a2.ru },
    { q: t.q3[currentLang] || t.q3.ru, a: t.a3[currentLang] || t.a3.ru },
    { q: t.q4[currentLang] || t.q4.ru, a: t.a4[currentLang] || t.a4.ru }
  ];

  return (
    <section className="py-20 bg-slate-950 relative border-t border-white/5">
      <div className="absolute inset-0 texture-dots opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12 drop-shadow-md">
          {t.title[currentLang] || t.title.ru}
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-bold text-lg text-white pr-8">{faq.q}</span>
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
                    <div className="p-6 pt-0 text-slate-300 leading-relaxed border-t border-white/5">
                      {faq.a}
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
