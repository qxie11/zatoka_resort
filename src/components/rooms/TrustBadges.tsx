import React from 'react';
import { ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function TrustBadges({ lang }: { lang: string }) {
  const t = {
    bestPrice: { ru: "Гарантия лучшей цены", uk: "Гарантія кращої ціни", en: "Best Price Guarantee" },
    noHidden: { ru: "Без скрытых комиссий", uk: "Без прихованих комісій", en: "No hidden fees" },
    directBooking: { ru: "Прямое бронирование", uk: "Пряме бронювання", en: "Direct booking" },
  };

  const currentLang = lang as keyof typeof t.bestPrice;

  return (
    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/5">
      <div className="flex items-center gap-3 text-slate-300">
        <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0" />
        <span className="text-sm">{t.bestPrice[currentLang] || t.bestPrice.ru}</span>
      </div>
      <div className="flex items-center gap-3 text-slate-300">
        <CreditCard className="h-5 w-5 text-teal-400 shrink-0" />
        <span className="text-sm">{t.noHidden[currentLang] || t.noHidden.ru}</span>
      </div>
      <div className="flex items-center gap-3 text-slate-300">
        <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
        <span className="text-sm">{t.directBooking[currentLang] || t.directBooking.ru}</span>
      </div>
    </div>
  );
}
