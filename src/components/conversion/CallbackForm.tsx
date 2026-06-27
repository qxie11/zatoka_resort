"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, X, Phone, User, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function CallbackForm() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLangUpdate] = useState(i18n.language || "ru");

  useEffect(() => {
    const handleLangChange = (lng: string) => {
      setLangUpdate(lng);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  const textMap = {
    ru: {
      conciergeName: "Владимир",
      conciergeTitle: "Администратор",
      status: "Онлайн",
      phoneError: "Пожалуйста, введите корректный номер телефона (минимум 9 цифр)",
      nameError: "Имя должно содержать не менее 2 букв",
    },
    uk: {
      conciergeName: "Володимир",
      conciergeTitle: "Адміністратор",
      status: "Онлайн",
      phoneError: "Будь ласка, введіть коректний номер телефону (мінімум 9 цифр)",
      nameError: "Ім'я має містити не менше 2 букв",
    },
    en: {
      conciergeName: "Vladimir",
      conciergeTitle: "Guesthouse Manager",
      status: "Online",
      phoneError: "Please enter a valid phone number (minimum 9 digits)",
      nameError: "Name must be at least 2 characters long",
    }
  };

  const currentText = textMap[lang as "ru" | "uk" | "en"] || textMap.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean name validation
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError(currentText.nameError);
      return;
    }

    // Phone validation: extract digits
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      setError(currentText.phoneError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, phone, message }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      setSuccess(true);
      setName("");
      setPhone("");
      setMessage("");
      
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 4000);
    } catch (err) {
      setError(t("callbackError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-sm bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl p-0 text-white sm:rounded-3xl focus:outline-none">
          <DialogTitle className="sr-only">Заказать обратный звонок</DialogTitle>
          
          {/* Header Card Band */}
          <div className="bg-gradient-to-r from-teal-900/60 via-slate-900 to-sky-950/60 p-5 border-b border-white/10 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-sky-400 to-teal-500" />
            
            {/* Personalized Concierge Profile */}
            <div className="flex items-center gap-3 pr-6">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-md border border-white/20">
                  {currentText.conciergeName[0]}
                </div>
                {/* Online Indicator Dot */}
                <span className="absolute bottom-[-1px] right-[-1px] flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {currentText.conciergeName}
                </h4>
                <p className="text-[11px] text-teal-400 font-medium">
                  {currentText.conciergeTitle}
                </p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  {currentText.status}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {success ? (
              <div className="py-8 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {t("callbackTitle")}
                  </h4>
                  <p className="text-sm text-slate-300 mt-2 px-2 leading-relaxed">
                    {t("callbackSuccess")}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center pb-1">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("callbackDesc")}
                  </p>
                </div>

                {/* Name field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-teal-400" />
                    {t("callbackName")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("callbackName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
                  />
                </div>

                {/* Phone field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-teal-400" />
                    {t("callbackPhone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+380..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-teal-400" />
                    {t("callbackMessage")}
                  </label>
                  <textarea
                    placeholder={t("callbackMessage")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400 font-medium text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 rounded-xl shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 py-2.5"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("callbackSubmit")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Trigger Button */}
      <div className="fixed bottom-16 right-3 md:bottom-20 md:right-6 z-[95] flex flex-col items-end font-sans">
        <div className="relative">
          {/* Soft breathing pulse behind the button */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 opacity-40 blur-sm animate-pulse z-0" />
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative group overflow-hidden z-10"
            style={{
              boxShadow: "0 0 25px rgba(45, 212, 191, 0.4)",
            }}
            aria-label="Связаться с консьержем"
          >
            <span className="absolute inset-0 bg-white/25 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
            {isOpen ? (
              <X className="h-6 w-6 font-bold" />
            ) : (
              <MessageSquare className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

