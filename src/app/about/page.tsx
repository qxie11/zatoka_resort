import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";
import { cookies, headers } from "next/headers";

interface AboutPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: AboutPageProps): Promise<Metadata> {
  const { lang: queryLang } = await searchParams;
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = queryLang || headerList.get("x-lang") || cookieStore.get("lang")?.value || "ru";

  const titles = {
    ru: "О нас | Отдых в Затоке",
    uk: "Про нас | Відпочинок в Затоці",
    en: "About Us | Zatoka Resort",
  };

  const descriptions = {
    ru: "Узнайте об истории, миссии и команде, стоящей за 'Отдых в Затоке', ведущим отелем в Затоке, Одесская область.",
    uk: "Дізнайтеся про історію, місію та команду, що стоїть за 'Відпочинок в Затоці', провідним готелем у Затоці, Одеська область.",
    en: "Learn about the history, mission, and team behind 'Zatoka Resort', a leading hotel in Zatoka, Odesa region.",
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/about${lang !== "ru" ? `?lang=${lang}` : ""}`;

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    keywords: ["о нас", "история отеля", "отель в Затоке", "курорт в Одессе", "наша миссия"],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/about`,
        uk: `${baseUrl}/about?lang=uk`,
        en: `${baseUrl}/about?lang=en`,
      },
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
