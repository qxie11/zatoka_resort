"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ruTranslation from "../locales/ru.json";
import ukTranslation from "../locales/uk.json";
import enTranslation from "../locales/en.json";

export const resources = {
  ru: {
    translation: ruTranslation
  },
  uk: {
    translation: ukTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    supportedLngs: ["ru", "uk", "en"],
    debug: false,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ["path", "cookie", "htmlTag", "localStorage", "subdomain"],
      caches: ["cookie"],
    },
  });

export default i18n;
