"use client";

import { useEffect } from "react";
import i18n from "@/lib/i18n";

interface LanguageSyncProps {
  lang: string;
}

export default function LanguageSync({ lang }: LanguageSyncProps) {
  // Sync language if the route parameter changes dynamically
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return null;
}
