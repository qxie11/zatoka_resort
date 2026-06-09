"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Bed, LayoutDashboard, CalendarDays, PhoneCall } from 'lucide-react';

const navLinks = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Номера", icon: Bed },
  { href: "/admin/bookings", label: "Бронирования", icon: CalendarDays },
  { href: "/admin/callbacks", label: "Заявки", icon: PhoneCall },
];

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    if (!authStatus) {
       router.replace(`/login?error=${encodeURIComponent("Вам нужно войти, чтобы просмотреть эту страницу.")}`);
    } else {
       setIsAuthenticated(true);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  if (isAuthenticated === null) {
      return (
        <div className="container mx-auto py-10 min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center">
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
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-slate-950 text-slate-100 texture-sand">
        <div className="hidden border-r border-white/10 glass-card-dark md:block shadow-2xl bg-slate-900/60">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b border-white/10 px-4 lg:h-[60px] lg:px-6">
              <Link href="/admin" className="flex items-center gap-2 font-extrabold text-white">
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
        <div className="flex flex-col min-w-0 bg-slate-950">
          <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
  );
}
