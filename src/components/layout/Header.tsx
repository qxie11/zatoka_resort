"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Waves, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";


const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О нас" },
  { href: "/booking", label: "Бронирование" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <Waves className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">Отдых в Затоке</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {session && (
             <Link
              href="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Админка
            </Link>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <span className="text-sm font-medium text-muted-foreground hidden lg:inline">Добро пожаловать, {session.user?.name}</span>
                <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Выйти">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                    <Link href="/booking">Забронировать</Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/login">Войти</Link>
                </Button>
              </>
            )}
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <Waves className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold">Отдых в Затоке</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium",
                      pathname === link.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {session && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium",
                      pathname === "/admin" ? "text-primary" : "text-foreground"
                    )}
                  >
                    Админка
                  </Link>
                )}
                <div className="mt-4 flex flex-col gap-2">
                  {session ? (
                    <Button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false);}}>
                      <LogOut className="mr-2 h-4 w-4" /> Выйти
                    </Button>
                  ) : (
                    <>
                      <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/booking">Забронировать</Link>
                      </Button>
                      <Button asChild variant="secondary" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/login">Войти</Link>
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
