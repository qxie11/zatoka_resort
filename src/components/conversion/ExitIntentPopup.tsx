"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, Phone, User, Send, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { usePathname } from "next/navigation";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const [, setLangUpdate] = useState(i18n.language || "ru");
  const pathname = usePathname();
  const shown = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleLangChange = (lng: string) => {
      setLangUpdate(lng);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  const showPopup = useCallback(() => {
    if (shown.current) return;
    if (sessionStorage.getItem("exit-intent-shown")) return;
    // Don't show on booking page — they're already converting
    if (pathname?.startsWith("/booking")) return;
    // Don't show on admin
    if (pathname?.startsWith("/admin")) return;

    shown.current = true;
    sessionStorage.setItem("exit-intent-shown", "true");
    setIsOpen(true);
  }, [pathname]);

  useEffect(() => {
    // Show popup after 15 seconds of browsing
    timerRef.current = setTimeout(() => {
      showPopup();
    }, 15000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(t("callbackError"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: "Exit intent — помогите подобрать номер",
        }),
      });

      if (!res.ok) throw new Error("API request failed");

      setSuccess(true);
      setName("");
      setPhone("");
      setTimeout(() => {
        setIsOpen(false);
      }, 4000);
    } catch {
      setError(t("callbackError"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        style={{ animation: "fade-in 0.3s ease forwards" }}
      />

      {/* Popup */}
      <div
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-md glass-card-dark border border-white/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "exit-popup-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-sky-400 to-amber-400" />

          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {success ? (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t("exitSuccessTitle", "Отлично!")}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
                {t(
                  "exitSuccessDesc",
                  "Наш менеджер перезвонит вам в течение 10 минут и поможет подобрать идеальный номер."
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-teal-400/20 to-sky-400/20 text-teal-400 mx-auto">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {t("exitTitle", "Не нашли подходящий номер?")}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t(
                    "exitDesc",
                    "Оставьте номер — мы подберём лучший вариант и перезвоним за 10 минут. Бесплатно."
                  )}
                </p>
              </div>

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-teal-400" />
                  {t("callbackName", "Ваше имя")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("callbackName", "Ваше имя")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
                />
              </div>

              {/* Phone field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-teal-400" />
                  {t("callbackPhone", "Номер телефона")}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+380..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-medium">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <span className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("exitCta", "Перезвоните мне")}
                  </>
                )}
              </Button>

              <p className="text-[10px] text-slate-500 text-center">
                {t(
                  "exitPrivacy",
                  "Нажимая кнопку, вы соглашаетесь на обработку персональных данных"
                )}
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes exit-popup-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
