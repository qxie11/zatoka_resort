import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Waves, Home } from "lucide-react";
import { WaveDivider } from "@/components/decorative/SeaDecorations";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-sea-foam relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 animate-float-slow">
          <Anchor className="h-16 w-16 text-primary" />
        </div>
        <div className="absolute top-40 right-20 animate-float-slow" style={{ animationDelay: "1s" }}>
          <Waves className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float-slow" style={{ animationDelay: "2s" }}>
          <Waves className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <Waves className="h-24 w-24 text-primary mx-auto mb-6 animate-wave" />
        </div>
        
        <Card className="max-w-md mx-auto shadow-gentle border-0 bg-white/90 backdrop-blur-sm animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
          <CardHeader>
            <CardTitle className="text-4xl font-bold gradient-ocean bg-clip-text text-transparent">
              404
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Страница не найдена
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Похоже, вы заблудились в море страниц. Давайте вернемся на берег!
            </p>
            <Button asChild className="gradient-ocean text-white hover-lift">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider color="hsl(var(--accent))" height={80} />
      </div>
    </div>
  );
}

