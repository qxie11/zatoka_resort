"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Waves, Compass } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Hardcoded check
    if (username === 'admin' && password === '123456') {
      localStorage.setItem('isAuthenticated', 'true');
      router.push("/admin");
    } else {
      setError("Неверное имя пользователя или пароль.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card-dark text-white border-white/10 shadow-2xl relative z-10">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-teal-400/20 flex items-center justify-center">
            <Compass className="h-6 w-6 text-teal-300 animate-spin-slow" />
          </div>
        </div>
        <CardTitle className="text-2xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300">
          Вход в панель управления
        </CardTitle>
        <CardDescription className="text-slate-300 text-center font-light">
          Пожалуйста, введите учетные данные для доступа к админ-панели.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive" className="bg-rose-500/20 border-rose-500/30 text-rose-200">
              <AlertCircle className="h-4 w-4 text-rose-300" />
              <AlertTitle className="font-bold">Ошибка</AlertTitle>
              <AlertDescription className="text-rose-100">{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-slate-200 font-medium">Имя пользователя</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-slate-200 font-medium">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button type="submit" className="w-full h-11 bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-900 py-12 px-4 overflow-hidden">
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
          alt="Sunset beach backdrop"
          fill
          className="object-cover scale-105 animate-float-slow opacity-60 brightness-[0.5]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950" />
      </div>

      {/* Floating waves in background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 animate-float">
          <Waves className="h-24 w-24 text-teal-300" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-slow" style={{ animationDelay: "3s" }}>
          <Waves className="h-16 w-16 text-sky-300" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: "5s" }}>
          <Waves className="h-20 w-20 text-teal-200" />
        </div>
      </div>

      <Suspense fallback={
        <Card className="w-full max-w-md p-6 text-center glass-card-dark text-white border-white/10 relative z-10">
          <p className="text-teal-300 animate-pulse font-light">Загрузка формы входа...</p>
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
