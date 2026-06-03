import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Waves, Home } from "lucide-react";
import { WaveDivider } from "@/components/decorative/SeaDecorations";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 animate-float-slow">
          <Anchor className="h-16 w-16 text-teal-400" />
        </div>
        <div className="absolute top-40 right-20 animate-float-slow" style={{ animationDelay: "1s" }}>
          <Waves className="h-12 w-12 text-teal-400" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float-slow" style={{ animationDelay: "2s" }}>
          <Waves className="h-10 w-10 text-teal-400" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <Waves className="h-24 w-24 text-teal-400 mx-auto mb-6 animate-wave" />
        </div>
        
        <Card className="max-w-md mx-auto shadow-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
          <CardHeader>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 bg-clip-text text-transparent">
              404
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-slate-300 font-light">
              Страница не найдена
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400 text-sm font-light">
              Похоже, вы заблудились в море страниц. Давайте вернемся на берег!
            </p>
            <Button asChild className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 hover:scale-105 transition-smooth">
              <Link href="/">
                <Home className="mr-2 h-4 w-4 text-slate-950" />
                Вернуться на главную
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider color="rgb(15, 23, 42)" height={80} />
      </div>
    </div>
  );
}

