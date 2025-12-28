"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function SuccessMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      // Удаляем параметр success из URL через 5 секунд
      const timer = setTimeout(() => {
        router.replace("/booking");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (success !== "true") {
    return null;
  }

  return (
    <Alert className="max-w-4xl mx-auto mt-8 bg-green-50 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Бронирование успешно создано!</AlertTitle>
      <AlertDescription className="text-green-700">
        Ваше бронирование было успешно создано. Мы свяжемся с вами в ближайшее время для подтверждения.
      </AlertDescription>
    </Alert>
  );
}

