"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Menu, Waves, LogOut, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О нас" },
  { href: "/booking", label: "Бронирование" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authStatus);
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-card-dark backdrop-blur-md shadow-2xl transition-smooth bg-slate-950/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Waves className="h-6 w-6 text-teal-400 group-hover:animate-float" />
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300">
            Отдых в Затоке
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 border border-white/5 px-2.5 py-1.5 rounded-full backdrop-blur-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-wider font-bold transition-all duration-300 px-4 py-1.5 rounded-full",
                  isActive
                    ? "text-slate-950 bg-gradient-to-r from-teal-400 to-sky-400 shadow-md shadow-teal-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {mounted && isAuthenticated && (
            <Link
              href="/admin"
              className={cn(
                "text-xs uppercase tracking-wider font-bold transition-all duration-300 px-4 py-1.5 rounded-full",
                pathname === "/admin"
                  ? "text-slate-950 bg-gradient-to-r from-teal-400 to-sky-400 shadow-md shadow-teal-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              Админка
            </Link>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {mounted && isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-slate-300 hidden lg:inline mr-2">
                Привет, Admin
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Выйти"
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all duration-300 rounded-xl px-5 h-10">
                <Link href="/booking">Забронировать</Link>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/10 bg-slate-900/60 text-white hover:bg-slate-800">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 text-white border-l border-white/10">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Навигационное меню</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-10">
                <Link
                  href="/"
                  className="flex items-center gap-2 mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Waves className="h-6 w-6 text-teal-400" />
                  <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300">
                    Отдых в Затоке
                  </span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium",
                      pathname === link.href
                        ? "text-teal-300"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {mounted && isAuthenticated && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium",
                      pathname === "/admin" ? "text-teal-300" : "text-slate-300 hover:text-white"
                    )}
                  >
                    Админка
                  </Link>
                )}
                <div className="mt-4 flex flex-col gap-2">
                  {mounted && isAuthenticated ? (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-slate-900 border border-white/10 text-white hover:bg-slate-800"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-rose-400" /> Выйти
                    </Button>
                  ) : (
                    <>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/booking">Забронировать</Link>
                      </Button>
                    </>
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
