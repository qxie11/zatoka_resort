"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, X, Phone, User, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

export function CallbackForm() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [, setLangUpdate] = useState(i18n.language || "ru");

  useEffect(() => {
    const handleLangChange = (lng: string) => {
      setLangUpdate(lng);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, message }),
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
    <div className="fixed bottom-16 right-3 md:bottom-20 md:right-6 z-[95] flex flex-col items-end">
      {/* Expanded Form Card */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[360px] glass-card-dark border border-white/10 rounded-3xl p-5 shadow-2xl animate-fade-in-up backdrop-blur-xl relative overflow-hidden">
          {/* Header shimmer */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {success ? (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-white">
                {t("callbackTitle")}
              </h4>
              <p className="text-sm text-slate-300 px-2 leading-relaxed">
                {t("callbackSuccess")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-400" />
                  {t("callbackTitle")}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
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
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
                />
              </div>

              {/* Message field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {t("callbackMessage")}
                </label>
                <textarea
                  placeholder={t("callbackMessage")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-medium">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 rounded-xl shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2"
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
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative group overflow-hidden"
        style={{
          boxShadow: "0 0 20px rgba(45, 212, 191, 0.4)",
        }}
        aria-label="Связаться с консьержем"
      >
        <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
        {isOpen ? (
          <X className="h-6 w-6 font-bold" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
