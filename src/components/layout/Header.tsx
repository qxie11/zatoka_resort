"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Menu, Waves, LogOut, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export const GreanBeamLogo = ({ className, scrolled = false }: { className?: string; scrolled?: boolean }) => (
  <span className={cn("relative flex h-8 w-8 items-center justify-center shrink-0 select-none", className)}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <defs>
        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#00c9a7" />
        </linearGradient>
        <linearGradient id="beamGrad" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <radialGradient id="auraGlow" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Soft emerald glow behind beam */}
      <circle cx="16" cy="13" r="10" fill="url(#auraGlow)" />
      
      {/* Vertical Green Beam */}
      <path d="M14.2 23.5 L15.4 3 L16.6 3 L17.8 23.5 Z" fill="url(#beamGrad)" />
      <path d="M15.4 23.5 L15.8 3 L16.2 3 L16.6 23.5 Z" fill="#ffffff" opacity="0.7" />
      
      {/* Arch / Sun Dome */}
      <path d="M10 23.5 C10 18.5 22 18.5 22 23.5" stroke="url(#emeraldGrad)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      
      {/* Bottom Wave Line */}
      <path d="M4 27.5 C10 25.5 22 29.5 28 27.5" stroke="url(#emeraldGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  </span>
);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState("ru");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".lang-select-container")) {
        setIsLangOpen(false);
      }
    };
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkAuth);
    document.addEventListener("click", handleOutsideClick);
    
    handleScroll(); // Check initial scroll

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
      document.removeEventListener("click", handleOutsideClick);
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

  const getLocalizedHref = (href: string) => {
    const langPrefix = `/${currentLang}`;
    if (href === "/") return langPrefix;
    return `${langPrefix}${href}`;
  };

  const langNames: Record<string, { label: string; flag?: string }> = {
    ru: { label: "RU" },
    uk: { label: "UA", flag: "🇺🇦" },
    en: { label: "EN", flag: "🇬🇧" },
  };

  const renderLanguageSelector = () => (
    <div className="relative lang-select-container">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 focus:outline-none backdrop-blur-md",
          scrolled 
            ? "bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 hover:text-white shadow-lg" 
            : "bg-black/30 hover:bg-black/50 border border-white/20 text-white"
        )}
      >
        {langNames[currentLang.startsWith("uk") ? "uk" : currentLang]?.flag && (
          <span className="text-sm leading-none">
            {langNames[currentLang.startsWith("uk") ? "uk" : currentLang].flag}
          </span>
        )}
        <span className="uppercase tracking-wider">
          {currentLang.startsWith("uk") ? "UA" : currentLang}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-300",
            scrolled ? "text-slate-400" : "text-white/70",
            isLangOpen && "transform rotate-180"
          )}
        />
      </button>

      {isLangOpen && (
        <div className="absolute right-0 mt-3 w-28 rounded-2xl bg-slate-950/95 border border-white/10 p-1.5 backdrop-blur-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-50 animate-fade-in origin-top-right">
          {(["uk", "ru", "en"] as const).map((lang) => (
            <Link
              key={lang}
              href={getLanguageHref(lang)}
              onClick={() => {
                document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
                setIsLangOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-255",
                currentLang.startsWith(lang)
                  ? "bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-teal-300 border border-teal-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {langNames[lang].flag ? (
                <>
                  <span className="text-base leading-none">{langNames[lang].flag}</span>
                  <span>{langNames[lang].label}</span>
                </>
              ) : (
                <span className="w-full text-center">{langNames[lang].label}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700 pointer-events-none",
      scrolled ? "pt-4" : "pt-0"
    )}>
      <div className={cn(
        "relative flex items-center justify-between transition-all duration-700 pointer-events-auto",
        scrolled 
          ? "w-full max-w-6xl mx-4 lg:mx-auto h-16 rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] px-4 lg:px-6"
          : "w-full container px-4 lg:px-8 h-16 border-transparent bg-transparent"
      )}>
        
        {/* Brand / Logo */}
        <Link
          href={getLocalizedHref("/")}
          className="flex items-center gap-2.5 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <GreanBeamLogo scrolled={scrolled} className="group-hover:scale-110 transition-transform duration-300" />
          <div className="flex flex-col text-left hidden sm:flex">
            <span className={cn(
              "text-[13px] font-black tracking-[0.25em] uppercase transition-colors duration-500",
              scrolled 
                ? "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:from-emerald-300 group-hover:to-teal-300" 
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            )}>
              {t("brandName")}
            </span>
            <span className={cn(
              "text-[7px] font-bold tracking-[0.45em] uppercase -mt-0.5 transition-colors duration-500",
              scrolled ? "text-slate-400" : "text-white/80 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
            )}>
              Seaside Family Hotel
            </span>
          </div>
        </Link>
 
        {/* Desktop Navigation Capsule */}
        <nav className={cn(
          "hidden lg:flex items-center gap-1 p-1 rounded-full transition-all duration-700 lg:absolute lg:left-1/2 lg:-translate-x-1/2",
          scrolled ? "bg-white/5 border border-white/5 shadow-inner" : "bg-black/20 backdrop-blur-md border border-white/10"
        )}>
          {navLinks.map((link) => {
            const localizedHref = getLocalizedHref(link.href);
            const isActive = pathname === localizedHref;
            return (
              <Link
                key={link.href}
                href={localizedHref}
                className={cn(
                  "text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 px-4 py-2 rounded-full relative overflow-hidden group/link",
                  isActive
                    ? (scrolled ? "bg-white/10 text-white shadow-sm" : "bg-white text-slate-950 shadow-lg")
                    : (scrolled ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-white/90 hover:text-white hover:bg-white/20")
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Glow effect on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/20 to-sky-500/0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                )}
              </Link>
            );
          })}
          {mounted && isAuthenticated && (
            <Link
              href="/admin"
              className={cn(
                "text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 px-4 py-2 rounded-full",
                pathname === "/admin"
                  ? (scrolled ? "bg-white/10 text-white shadow-sm" : "bg-white text-slate-950 shadow-lg")
                  : (scrolled ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-white/90 hover:text-white hover:bg-white/20")
              )}
            >
              {t("admin")}
            </Link>
          )}
        </nav>
 
        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {mounted && renderLanguageSelector()}
 
          {mounted && isAuthenticated && (
            <div className="hidden lg:flex items-center gap-3">
              <span className={cn(
                "text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border transition-colors",
                scrolled ? "bg-white/5 border-white/5 text-slate-300" : "bg-black/30 border-white/10 text-white backdrop-blur-sm"
              )}>
                {t("welcomeAdmin")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label={t("logout")}
                className={cn(
                  "rounded-full transition-all duration-300 h-9 w-9",
                  scrolled 
                    ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10" 
                    : "text-white hover:text-rose-400 hover:bg-black/40 backdrop-blur-md"
                )}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}

          <a
            href="tel:+380669212275"
            className={cn(
              "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-95 shrink-0",
              scrolled
                ? "bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30"
                : "bg-black/25 hover:bg-black/40 text-white border border-white/25 backdrop-blur-sm"
            )}
          >
            <Phone className="h-3.5 w-3.5 shrink-0 opacity-80" />
            <span className="font-semibold opacity-75">
              {currentLang === "uk" ? "Бронь:" : currentLang === "en" ? "Book:" : "Бронь:"}
            </span>
            <span className="font-bold tracking-tight">066 921-22-75</span>
          </a>
          
          {/* Mobile Actions and Hamburger */}
          <div className="lg:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full h-9 w-9 transition-all backdrop-blur-md border",
                    scrolled
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-white/20 bg-black/30 text-white hover:bg-black/50"
                  )}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t("openMenu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-slate-950/95 backdrop-blur-3xl text-white border-none w-full sm:w-[400px] p-0 shadow-2xl flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-sky-500/10 pointer-events-none" />
                <SheetHeader className="p-6 border-b border-white/5 relative z-10">
                  <VisuallyHidden>
                    <SheetTitle>{t("navMenu")}</SheetTitle>
                  </VisuallyHidden>
                  <Link
                    href={getLocalizedHref("/")}
                    className="flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <GreanBeamLogo scrolled={true} className="h-6 w-6" />
                    <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                      {t("brandName")}
                    </span>
                  </Link>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
                  {navLinks.map((link) => {
                    const localizedHref = getLocalizedHref(link.href);
                    const isActive = pathname === localizedHref;
                    return (
                      <Link
                        key={link.href}
                        href={localizedHref}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "group flex items-center gap-4 transition-all duration-500",
                          isActive ? "text-teal-300" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <span className={cn(
                          "h-px transition-all duration-500 bg-gradient-to-r from-teal-400 to-sky-400",
                          isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                        )} />
                        <span className="text-2xl sm:text-3xl uppercase tracking-widest font-black">
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                  {mounted && isAuthenticated && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center gap-4 transition-all duration-500",
                        pathname === "/admin" ? "text-teal-300" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <span className={cn(
                        "h-px transition-all duration-500 bg-gradient-to-r from-teal-400 to-sky-400",
                        pathname === "/admin" ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                      )} />
                      <span className="text-2xl sm:text-3xl uppercase tracking-widest font-black">
                        {t("admin")}
                      </span>
                    </Link>
                  )}
                </div>

                <div className="p-6 border-t border-white/5 bg-slate-900/50 relative z-10 flex flex-col gap-4">
                  {mounted && isAuthenticated ? (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-950 border border-white/10 text-white hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 rounded-2xl py-7 text-sm font-bold uppercase tracking-wider transition-all"
                    >
                      <LogOut className="mr-2 h-5 w-5 text-rose-400" /> {t("logout")}
                    </Button>
                  ) : (
                    <a
                      href="tel:+380669212275"
                      className="flex items-center justify-center gap-2.5 w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl py-4 text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                      <Phone className="h-4 w-4" />
                      <span>+38 (066) 921-22-75</span>
                    </a>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
