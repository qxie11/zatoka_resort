"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Bed, LayoutDashboard, CalendarDays, PhoneCall, BookOpen, MessageSquare, Menu, Tag, Waves } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Header from "@/components/layout/Header";

const navLinks = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Номера", icon: Bed },
  { href: "/admin/bookings", label: "Бронирования", icon: CalendarDays },
  { href: "/admin/callbacks", label: "Заявки", icon: PhoneCall },
  { href: "/admin/blog", label: "Блог", icon: BookOpen },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
  { href: "/admin/promo", label: "Промокоды", icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    if (!authStatus) {
       router.replace(`/login?error=${encodeURIComponent("Вам нужно войти, чтобы просмотреть эту страницу.")}`);
    } else {
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setIsAuthenticated(true);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  if (isAuthenticated === null) {
      return (
        <div className="container mx-auto py-10 min-h-screen flex flex-col justify-center items-center">
            <div className="w-full max-w-5xl space-y-4">
                <Skeleton className="h-8 w-1/4 bg-slate-800" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="h-48 w-full bg-slate-800" />
                    <div className="md:col-span-2">
                        <Skeleton className="h-96 w-full bg-slate-800" />
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="grid flex-1 w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] texture-sand pt-16">
        <div className="hidden border-r border-white/10 glass-card-dark md:block shadow-2xl bg-slate-900/60 sticky top-[96px] h-[calc(100vh-96px)] overflow-y-auto">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b border-white/10 px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-extrabold text-white">
                <LayoutDashboard className="h-5 w-5 text-teal-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300">
                  Админ-панель
                </span>
              </Link>
            </div>
            <div className="flex-1 px-2 py-4">
              <nav className="grid gap-1.5 items-start text-sm font-medium">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-smooth",
                        isActive 
                          ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/10 font-bold" 
                          : "text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-slate-950" : "text-teal-400")} />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
             <div className="mt-auto p-4 border-t border-white/10 space-y-2">
               <Button variant="ghost" className="w-full justify-start rounded-xl text-slate-300 hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4 text-teal-400" />
                    На главный сайт
                  </Link>
               </Button>
               <Button variant="ghost" className="w-full justify-start rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
               </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          {/* Header Bar */}
          <header className="flex h-14 items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 md:px-6 backdrop-blur-md sticky top-[96px] z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Logo & Brand (hidden on desktop) */}
            <Link href="/" className="flex items-center gap-2 font-extrabold text-white md:hidden">
              <Waves className="h-5 w-5 text-teal-400 shrink-0" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 text-sm">
                Админ-панель
              </span>
            </Link>

            {/* Desktop Breadcrumbs (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2.5 text-xs uppercase tracking-wider font-semibold text-slate-400">
              <LayoutDashboard className="h-4 w-4 text-teal-400" />
              <span>Панель управления</span>
              <span>/</span>
              <span className="text-teal-300 font-bold">
                {pathname === "/admin" 
                  ? "Обзор" 
                  : pathname.split("/").slice(2).map(seg => {
                      if (seg === "rooms") return "Номера";
                      if (seg === "bookings") return "Бронирования";
                      if (seg === "callbacks") return "Заявки";
                      if (seg === "blog") return "Блог";
                      if (seg === "reviews") return "Отзывы";
                      if (seg === "promo") return "Промокоды";
                      return seg;
                    }).join(" / ")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Welcome message */}
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Администратор: <span className="text-teal-300 font-bold">Admin</span>
            </span>

            {/* Sign Out Button for Desktop */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="hidden md:flex h-9 rounded-xl border-white/10 bg-white/5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Выйти
            </Button>

            {/* Mobile Burger Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/10 bg-slate-900/60 text-white hover:bg-slate-800 rounded-xl h-9 w-9 backdrop-blur-md transition-all md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-slate-950/98 backdrop-blur-2xl text-white border-r border-white/10 w-[280px] p-6 shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <SheetHeader>
                    <SheetTitle className="text-left font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-200">
                      Админ-панель
                    </SheetTitle>
                  </SheetHeader>
                  
                  <nav className="grid gap-1.5 items-start text-sm font-medium">
                    {navLinks.map(link => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-smooth",
                            isActive 
                              ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/10 font-bold" 
                              : "text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
                          )}
                        >
                          <Icon className={cn("h-4 w-4", isActive ? "text-slate-950" : "text-teal-400")} />
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
  
                <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
                  <Button variant="ghost" className="w-full justify-start rounded-xl text-slate-300 hover:bg-white/10 hover:text-white" asChild>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <Home className="mr-2 h-4 w-4 text-teal-400" />
                      На главный сайт
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
 
        <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  </div>
  );
}
