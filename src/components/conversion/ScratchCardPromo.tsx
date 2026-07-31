"use client";

import { useState, useRef, useEffect } from "react";
import { Gift, X, Check, Copy, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ScratchCardPromoProps {
  lang: string;
}

export default function ScratchCardPromo({ lang }: ScratchCardPromoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Delay the gift button appearance (15s) to avoid clutter initially
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  // Disable background scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("scratch-promo-revealed") === "true";
    }
    return false;
  });
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const t = {
    ru: {
      btnTitle: "Подарок",
      modalTitle: "Сотрите защитный слой",
      modalDesc: "Проведите пальцем или мышкой по карточке, чтобы стереть слой и забрать ваш секретный подарок при бронировании!",
      congrats: "Поздравляем!",
      promoDesc: "Используйте этот промокод при бронировании для получения гарантированной скидки 5%:",
      copyBtn: "Копировать код",
      copied: "Скопировано!",
      timerDesc: "Промокод сгорит через:",
    },
    uk: {
      btnTitle: "Подарунок",
      modalTitle: "Зітріть захисний шар",
      modalDesc: "Проведіть пальцем або мишкою по картці, щоб стерти шар і забрати ваш секретний подарунок при бронюванні!",
      congrats: "Вітаємо!",
      promoDesc: "Використовуйте цей промокод при бронюванні для отримання гарантованої знижки 5%:",
      copyBtn: "Копіювати код",
      copied: "Скопійовано!",
      timerDesc: "Промокод згорить через:",
    },
    en: {
      btnTitle: "Gift",
      modalTitle: "Scratch to Reveal",
      modalDesc: "Drag your mouse or finger over the card to scratch off the layer and claim your secret booking reward!",
      congrats: "Congratulations!",
      promoDesc: "Use this promo code during booking to get a guaranteed 5% discount:",
      copyBtn: "Copy Code",
      copied: "Copied!",
      timerDesc: "Code expires in:",
    }
  };

  const current = t[lang as keyof typeof t] || t.ru;
  const [promoCode, setPromoCode] = useState("ZATOKAWAVE");
  const [promoDiscount, setPromoDiscount] = useState(5);

  useEffect(() => {
    fetch("/api/promo/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.code) setPromoCode(data.code);
        if (typeof data.discount === "number") setPromoDiscount(data.discount);
      })
      .catch((err) => console.error("Error fetching active promo:", err));
  }, []);

  // Countdown timer once revealed
  useEffect(() => {
    if (!isRevealed) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRevealed]);

  // Initialize Canvas
  useEffect(() => {
    if (!isOpen || isRevealed) return;

    // Timeout to ensure modal rendering is done and canvas has size
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fit to container size
      canvas.width = canvas.parentElement?.clientWidth || 320;
      canvas.height = 160;

      // Fill with silver scratch layer
      ctx.fillStyle = "#475569";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text/pattern to scratch layer
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCRATCH HERE / СТЕРЕТЬ ТУТ", canvas.width / 2, canvas.height / 2);

      // Small shiny pattern dots
      ctx.fillStyle = "#64748b";
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, isRevealed]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkScratchedPercent();
  };

  const checkScratchedPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) {
        transparentPixels++;
      }
    }

    const percent = (transparentPixels / (canvas.width * canvas.height)) * 100;
    setScratchedPercent(percent);

    if (percent > 45) {
      setIsRevealed(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("scratch-promo-revealed", "true");
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      {/* Floating Gift Button — appears after 15s */}
      {showButton && (
        <div className="fixed bottom-32 right-3 md:bottom-36 md:right-6 z-40 select-none animate-tide-in">
          <div className="relative group">
            {/* Glowing outer pulse aura (only before promo code is revealed) */}
            {!isRevealed && (
              <>
                <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 opacity-60 blur-lg animate-ping pointer-events-none" />
                <span className="absolute -inset-1 rounded-full bg-amber-400/40 blur-sm animate-pulse pointer-events-none" />
              </>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`relative h-14 w-14 hover:w-[155px] rounded-full flex items-center justify-center hover:justify-start hover:px-4 transition-all duration-500 ease-out hover:scale-105 active:scale-95 group overflow-hidden ${
                isRevealed
                  ? "bg-slate-900/90 backdrop-blur-xl border border-white/15 text-amber-300 shadow-xl"
                  : "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-amber-200/60"
              }`}
            >
              {/* Shimmer overlay (only before reveal) */}
              {!isRevealed && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              
              {/* Icon Container with Sparkles (sparkles only before reveal) */}
              <div className="relative shrink-0 flex items-center justify-center">
                <Gift className={`h-6 w-6 group-hover:rotate-12 transition-transform duration-300 ${isRevealed ? "text-amber-400" : "text-slate-950"}`} />
                {!isRevealed && (
                  <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-white animate-spin-slow drop-shadow" />
                )}
              </div>

              {/* Text label revealed on hover: "Подарок" */}
              <span className={`max-w-0 overflow-hidden group-hover:max-w-[100px] group-hover:ml-2.5 transition-all duration-500 ease-out font-black text-xs uppercase tracking-wider whitespace-nowrap ${isRevealed ? "text-slate-200" : "text-slate-950"}`}>
                {current.btnTitle}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent aria-describedby={undefined} className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden space-y-6 text-white sm:rounded-3xl focus:outline-none">
          <DialogTitle className="sr-only">Сотрите защитный слой для получения скидки</DialogTitle>
          {/* Glowing accents */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Text description inside the modal above the scratch card */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-white">{current.modalTitle}</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm mx-auto">
              {current.modalDesc}
            </p>
          </div>
 
          {/* Scratch Arena Container */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500/10 to-sky-500/10 border border-teal-500/20 flex flex-col items-center justify-center p-4">
            
            {/* Promo Code view (rendered behind canvas, always present in DOM) */}
            <div className="text-center space-y-3 select-none">
              <div className="inline-flex items-center gap-1 bg-teal-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-teal-300 uppercase tracking-widest">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>{current.congrats}</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-slate-300">
                  {lang === "uk"
                    ? `Використовуйте цей промокод при бронюванні для отримання гарантованої знижки ${promoDiscount}%:`
                    : lang === "en"
                    ? `Use this promo code during booking to get a guaranteed ${promoDiscount}% discount:`
                    : `Используйте этот промокод при бронировании для гарантированной скидки ${promoDiscount}%:`}
                </span>
                <div className="flex items-center gap-2 bg-slate-950/60 border border-white/10 px-4 py-2.5 rounded-xl text-lg font-black tracking-widest text-teal-300">
                  <span>{promoCode}</span>
                </div>
              </div>
 
              {isRevealed && (
                <Button 
                  onClick={copyToClipboard} 
                  className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 mx-auto animate-scale-in"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? current.copied : current.copyBtn}</span>
                </Button>
              )}
            </div>
 
            {/* Interactive Canvas (absolutely positioned on top of the text) */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                onMouseDown={(e) => {
                  isDrawingRef.current = true;
                  scratch(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (!isDrawingRef.current) return;
                  scratch(e.clientX, e.clientY);
                }}
                onMouseUp={() => (isDrawingRef.current = false)}
                onMouseLeave={() => (isDrawingRef.current = false)}
                onTouchStart={(e) => {
                  isDrawingRef.current = true;
                  const touch = e.touches[0];
                  scratch(touch.clientX, touch.clientY);
                }}
                onTouchMove={(e) => {
                  if (!isDrawingRef.current) return;
                  const touch = e.touches[0];
                  scratch(touch.clientX, touch.clientY);
                }}
                onTouchEnd={() => (isDrawingRef.current = false)}
                className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
              />
            )}
          </div>

          {/* Countdown / Status Bar */}
          {isRevealed && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/5 border border-amber-400/10 p-3 rounded-xl">
              <Timer className="h-4 w-4 animate-pulse" />
              <span>{current.timerDesc}</span>
              <span className="font-mono text-sm font-black">{formatTime(timeLeft)}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
