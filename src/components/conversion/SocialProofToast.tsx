"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "lucide-react";

const BOOKINGS = [
  { name: "Наталія К.", city: "Київ", room: "Люкс «Морський»", time: "2 год. тому" },
  { name: "Олексій Д.", city: "Харків", room: "Двомісний «Захід»", time: "4 год. тому" },
  { name: "Марина В.", city: "Дніпро", room: "Сімейний номер", time: "6 год. тому" },
  { name: "Іван С.", city: "Львів", room: "Стандарт з видом", time: "9 год. тому" },
  { name: "Оксана Т.", city: "Одеса", room: "Люкс «Морський»", time: "11 год. тому" },
  { name: "Дмитро П.", city: "Запоріжжя", room: "Двомісний «Захід»", time: "14 год. тому" },
];

export function SocialProofToast() {
  const [current, setCurrent] = useState<(typeof BOOKINGS)[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const showNext = useCallback(() => {
    setCurrent(BOOKINGS[index % BOOKINGS.length]);
    setVisible(true);
    setIndex(i => i + 1);

    setTimeout(() => setVisible(false), 5000);
  }, [index]);

  useEffect(() => {
    // First toast after 8s
    const first = setTimeout(showNext, 8000);
    return () => clearTimeout(first);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!visible && index > 0) {
      // Next one after 45s
      const next = setTimeout(showNext, 45000);
      return () => clearTimeout(next);
    }
  }, [visible, index, showNext]);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-20 left-4 z-[90] max-w-[280px] transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        {/* Accent */}
        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-slate-950" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">
              {current.name}
              <span className="text-slate-400 font-normal"> з {current.city}</span>
            </p>
            <p className="text-xs text-teal-300 mt-0.5 leading-tight">
              забронював(-ла) «{current.room}»
            </p>
            <p className="text-xs text-slate-500 mt-1">{current.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
