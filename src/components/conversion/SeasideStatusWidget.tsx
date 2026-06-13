"use client";

import { useState, useEffect } from "react";
import { Sun, Waves, Thermometer, Sunset, Sparkles, Wind } from "lucide-react";

interface SeasideStatusWidgetProps {
  lang: string;
}

export default function SeasideStatusWidget({ lang }: SeasideStatusWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState({
    temp: 28,
    seaTemp: 24,
    waveHeight: "0.2м",
    windSpeed: 8,
  });

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(lang === "en" ? "en-US" : "uk-UA", {
        hour: "2-digit",
        minute: "2-digit"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Fetch live weather
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.temp === "number") {
          setWeather(data);
        }
      })
      .catch((err) => console.error("Error fetching weather in client:", err));

    return () => clearInterval(interval);
  }, [lang]);

  if (!mounted) return null;

  const t = {
    ru: {
      title: "Черное море сейчас",
      weather: "Солнечно, штиль",
      air: "Воздух",
      water: "Вода",
      waves: "Волны",
      sunset: "Закат",
      recommendationTitle: "Рекомендация дня",
      recommendationText: "Идеальная температура воды для вечернего купания и катания на сапбордах. Закат обещает быть невероятно красочным!",
    },
    uk: {
      title: "Чорне море зараз",
      weather: "Сонячно, штиль",
      air: "Повітря",
      water: "Вода",
      waves: "Хвилі",
      sunset: "Захід",
      recommendationTitle: "Рекомендація дня",
      recommendationText: "Ідеальна температура води для вечірнього купання та катання на сапбордах. Захід сонця обіцяє бути неймовірно яскравим!",
    },
    en: {
      title: "Black Sea Live Status",
      weather: "Sunny & calm",
      air: "Air Temp",
      water: "Sea Temp",
      waves: "Waves",
      sunset: "Sunset",
      recommendationTitle: "Today's Tip",
      recommendationText: "Perfect water temperature for evening swimming and paddleboarding. The sunset is going to be incredibly scenic!",
    }
  };

  const current = t[lang as keyof typeof t] || t.ru;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card-dark border border-white/10 p-6 shadow-2xl transition-all duration-300 hover:border-teal-400/30">
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <p className="font-extrabold text-sm uppercase tracking-widest text-slate-300">{current.title}</p>
        </div>
        <span className="text-xs font-mono text-teal-300/80">{time}</span>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Air Temp */}
        <div className="flex items-center gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Sun className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{current.air}</p>
            <p className="text-lg font-black text-white">+{weather.temp}°C</p>
          </div>
        </div>

        {/* Sea Temp */}
        <div className="flex items-center gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
            <Thermometer className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{current.water}</p>
            <p className="text-lg font-black text-teal-300">+{weather.seaTemp}°C</p>
          </div>
        </div>

        {/* Wave Height */}
        <div className="flex items-center gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
            <Waves className="h-5 w-5 animate-float" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{current.waves}</p>
            <p className="text-lg font-black text-white">{weather.waveHeight}</p>
          </div>
        </div>

        {/* Sunset Time */}
        <div className="flex items-center gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
            <Sunset className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{current.sunset}</p>
            <p className="text-lg font-black text-purple-300">20:46</p>
          </div>
        </div>
      </div>

      {/* Daily recommendation banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/5 to-sky-500/5 border border-teal-500/10 flex gap-3">
        <Sparkles className="h-5 w-5 text-teal-300 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-teal-300">{current.recommendationTitle}</p>
          <p className="text-xs text-slate-300 font-light leading-relaxed">{current.recommendationText}</p>
        </div>
      </div>
    </div>
  );
}
