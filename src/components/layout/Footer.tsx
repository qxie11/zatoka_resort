import Link from "next/link";
import { Waves, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Waves className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold">Отдых в Затоке</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Ваш безмятежный морской отдых на побережье Черного моря.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
             <div>
                <h3 className="font-semibold mb-4">Быстрые ссылки</h3>
                <ul className="space-y-2">
                    <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Главная</Link></li>
                    <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">О нас</Link></li>
                    <li><Link href="/booking" className="text-sm text-muted-foreground hover:text-primary">Бронирование</Link></li>
                </ul>
             </div>
             <div>
                <h3 className="font-semibold mb-4">Контакты</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>ул. Приморская, 1</li>
                    <li>Затока, Одесская область, 67772</li>
                    <li>contact@zatokagetaway.com</li>
                </ul>
             </div>
          </div>
          <div className="md:ml-auto">
             <h3 className="font-semibold mb-4">Следите за нами</h3>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                </Button>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Отдых в Затоке. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
