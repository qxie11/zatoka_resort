import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

  const titles = {
    ru: "О нас",
    uk: "Про нас",
    en: "About Us",
  };

  const descriptions = {
    ru: "Узнайте об истории, миссии и команде, стоящей за 'Отдых в Затоке', ведущим отелем в Затоке, Одесская область.",
    uk: "Дізнайтеся про історію, місію та команду, що стоїть за 'Відпочинок в Затоці', провідним готелем у Затоці, Одеська область.",
    en: "Learn about the history, mission, and team behind 'Zatoka Resort', a leading hotel in Zatoka, Odesa region.",
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    keywords: ["о нас", "история отеля", "отель в Затоке", "курорт в Одессе", "наша миссия"],
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
