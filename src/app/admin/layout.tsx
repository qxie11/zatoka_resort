
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Bed, LayoutDashboard, CalendarDays } from 'lucide-react';

const navLinks = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Номера", icon: Bed },
  { href: "/admin/bookings", label: "Бронирования", icon: CalendarDays },
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
        <div className="container mx-auto py-10">
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="h-48 w-full" />
                    <div className="md:col-span-2">
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gradient-to-tr from-slate-50 via-sky-50/20 to-slate-100 texture-sand">
        <div className="hidden border-r border-white/50 glass-card-premium md:block shadow-gentle">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b border-slate-200/50 px-4 lg:h-[60px] lg:px-6">
              <Link href="/admin" className="flex items-center gap-2 font-bold">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span className="gradient-ocean bg-clip-text text-transparent">Админ-панель</span>
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
                          ? "gradient-ocean text-white shadow-soft font-semibold" 
                          : "text-slate-600 hover:bg-white/60 hover:text-slate-900 border border-transparent hover:border-white/50"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
             <div className="mt-auto p-4 border-t border-slate-200/50 space-y-2">
               <Button variant="ghost" className="w-full justify-start rounded-xl text-slate-600 hover:bg-white/60 hover:text-slate-900" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4 text-primary" />
                    На главный сайт
                  </Link>
               </Button>
               <Button variant="ghost" className="w-full justify-start rounded-xl text-rose-600 hover:bg-rose-50/50 hover:text-rose-700" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
               </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
  );
}
