
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
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/admin" className="flex items-center gap-2 font-semibold">
                <LayoutDashboard className="h-6 w-6" />
                <span>Админ-панель</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === link.href && "bg-muted text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
             <div className="mt-auto p-4 border-t">
               <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    На главный сайт
                  </Link>
               </Button>
               <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
               </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-w-0 overflow-x-hidden">
           {children}
          </main>
        </div>
      </div>
  );
}
