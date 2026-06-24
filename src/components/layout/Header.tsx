"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Menu, Waves, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState("ru");

  useEffect(() => {
    setMounted(true);
    setCurrentLang(i18n.language || "ru");

    const handleLangChange = (lng: string) => {
      setTimeout(() => {
        setCurrentLang(lng);
      }, 0);
    };

    i18n.on("languageChanged", handleLangChange);

    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authStatus);
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/booking", label: t("booking") },
    { href: "/blog", label: t("blog") },
    { href: "/quiz", label: t("quiz") },
  ];

  const getLanguageHref = (lang: string) => {
    const segments = pathname.split("/");
    if (segments.length > 1 && ["ru", "uk", "en"].includes(segments[1])) {
      const newSegments = [...segments];
      newSegments[1] = lang;
      return newSegments.join("/");
    }
    return `/${lang}`;
  };

  const LanguageSelector = () => (
    <div className="flex items-center gap-1 bg-slate-950/60 border border-white/10 p-1 rounded-xl text-xs font-semibold backdrop-blur-xl shadow-inner">
      {(["uk", "ru", "en"] as const).map((lang) => (
        <Link
          key={lang}
          href={getLanguageHref(lang)}
          onClick={() => {
            document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
          }}
          className={cn(
            "px-2.5 py-1 rounded-lg transition-all uppercase duration-300 relative text-xs",
            currentLang.startsWith(lang)
              ? "bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_12px_rgba(20,184,166,0.25)] font-bold"
              : "text-slate-400 hover:text-white border border-transparent"
          )}
        >
          {lang === "uk" ? "UA" : lang}
        </Link>
      ))}
    </div>
  );

  const getLocalizedHref = (href: string) => {
    const langPrefix = `/${currentLang}`;
    if (href === "/") return langPrefix;
    return `${langPrefix}${href}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500">
      {/* Premium Glassmorphism and Backdrop Blur Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/75 backdrop-blur-xl -z-10 border-b border-white/10" />
      
      {/* Elegant Sea-Glow Bottom Border with Pulse Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent -z-10 animate-pulse" />
      
      {/* Light shimmer line effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/30 to-transparent -z-10" />
 
      <div className="container relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand / Logo */}
        <Link
          href={getLocalizedHref("/")}
          className="flex items-center gap-3 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
            <Waves className="h-5 w-5 text-teal-400 group-hover:animate-coral-sway glow-teal" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-200 group-hover:animate-ocean-shimmer">
              {t("brandName")}
            </span>
            <span className="text-[7px] font-bold tracking-[0.35em] text-teal-400/80 uppercase -mt-0.5">
              Seaside Family Hotel
            </span>
          </div>
        </Link>
 
        {/* Desktop Navigation Capsule */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/40 border border-white/5 px-4 py-1.5 rounded-full backdrop-blur-xl shadow-lg">
          {navLinks.map((link) => {
            const localizedHref = getLocalizedHref(link.href);
            const isActive = pathname === localizedHref;
            return (
              <Link
                key={link.href}
                href={localizedHref}
                className={cn(
                  "text-xs uppercase tracking-widest font-semibold transition-colors duration-300 px-4 py-2 relative group/link",
                  isActive
                    ? "text-teal-300 font-bold"
                    : "text-slate-350 hover:text-white"
                )}
              >
                <span>{link.label}</span>
                <span
                  className={cn(
                    "absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-400 to-sky-400 transform origin-left transition-transform duration-350 ease-out rounded-full",
                    isActive ? "scale-x-100 shadow-[0_0_8px_rgba(20,184,166,0.5)]" : "scale-x-0 group-hover/link:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
          {mounted && isAuthenticated && (
            <Link
              href="/admin"
              className={cn(
                "text-xs uppercase tracking-widest font-semibold transition-colors duration-300 px-4 py-2 relative group/link",
                pathname === "/admin"
                  ? "text-teal-300 font-bold"
                  : "text-slate-350 hover:text-white"
              )}
            >
              <span>{t("admin")}</span>
              <span
                className={cn(
                  "absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-400 to-sky-400 transform origin-left transition-transform duration-350 ease-out rounded-full",
                  pathname === "/admin" ? "scale-x-100 shadow-[0_0_8px_rgba(20,184,166,0.5)]" : "scale-x-0 group-hover/link:scale-x-100"
                )}
              />
            </Link>
          )}
        </nav>
 
        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {mounted && <LanguageSelector />}
 
          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wider text-slate-300 hidden lg:inline bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                {t("welcomeAdmin")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label={t("logout")}
                className="text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all duration-300 h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="relative overflow-hidden bg-gradient-to-r from-teal-400 via-sky-400 to-sky-500 hover:from-teal-300 hover:via-sky-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 rounded-xl px-5 h-9 text-[10px] uppercase tracking-wider flex items-center gap-1.5"
            >
              <Link href={getLocalizedHref("/booking")}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-950"></span>
                </span>
                {t("booking")}
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Actions and Hamburger */}
        <div className="lg:hidden flex items-center gap-3">
          {mounted && <LanguageSelector />}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-white/10 bg-slate-900/60 text-white hover:bg-slate-800/80 rounded-xl h-9 w-9 backdrop-blur-md transition-all"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-slate-950/98 backdrop-blur-2xl text-white border-l border-white/10 w-[280px] p-6 shadow-2xl"
            >
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Навигационное меню</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              
              <div className="flex flex-col gap-6 h-full pt-6">
                <Link
                  href={getLocalizedHref("/")}
                  className="flex items-center gap-2.5 mb-2 pb-4 border-b border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <Waves className="h-5 w-5 text-teal-400" />
                  </div>
                  <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-200">
                    {t("brandName")}
                  </span>
                </Link>

                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => {
                    const localizedHref = getLocalizedHref(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={localizedHref}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-sm uppercase tracking-widest font-bold py-2 px-3 rounded-xl transition-all duration-300 border border-transparent",
                          pathname === localizedHref
                            ? "text-teal-300 bg-teal-500/5 border-teal-500/10"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  {mounted && isAuthenticated && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-sm uppercase tracking-widest font-bold py-2 px-3 rounded-xl transition-all duration-300 border border-transparent",
                        pathname === "/admin"
                          ? "text-teal-300 bg-teal-500/5 border-teal-500/10"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {t("admin")}
                    </Link>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
                  {mounted && isAuthenticated ? (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-slate-900 border border-white/10 text-white hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 rounded-xl py-5 text-xs font-bold uppercase tracking-wider"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-rose-400" /> {t("logout")}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl py-5 text-xs uppercase tracking-widest"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={getLocalizedHref("/booking")}>{t("booking")}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
