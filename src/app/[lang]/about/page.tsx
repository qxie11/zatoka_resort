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
    ru: "Узнайте больше о семейном отеле Zatoka Resort в Затоке: первая линия, чистый песчаный пляж, бассейн и лучший сервис для отдыха у моря. Бронируйте напрямую по лучшим ценам 2026!",
    uk: "Дізнайтеся більше про сімейний готель Zatoka Resort у Затоці: перша лінія, чистий піщаний пляж, басейн та найкращий сервіс для відпочинку біля моря. Бронюйте напряму за цінами 2026!",
    en: "Discover more about Zatoka Resort hotel: prime beachfront location, private swimming pool, and top-tier hospitality in Zatoka. Direct booking 2026 at the best rates.",
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/about${lang !== "ru" ? `?lang=${lang}` : ""}`;
  const title = titles[lang as keyof typeof titles] || titles.ru;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/about`,
        ru: `${baseUrl}/about`,
        uk: `${baseUrl}/about?lang=uk`,
        en: `${baseUrl}/about?lang=en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zatoka Resort",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const { lang: queryLang } = await searchParams;
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = queryLang || headerList.get("x-lang") || cookieStore.get("lang")?.value || "ru";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/about${lang !== "ru" ? `?lang=${lang}` : ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": lang === "ru" ? "О нас - Отдых в Затоке" : lang === "uk" ? "Про нас - Відпочинок в Затоці" : "About Us - Zatoka Resort",
    "description": lang === "ru" ? "История и ценности отеля Zatoka Resort" : lang === "uk" ? "Історія та цінності готелю Zatoka Resort" : "History and values of Zatoka Resort hotel",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "Hotel",
      "name": lang === "en" ? "Zatoka Resort" : lang === "uk" ? "Відпочинок в Затоці" : "Отдых в Затоке",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "бульвар Золотой Берег, 42",
        "addressLocality": "Затока",
        "addressRegion": "Одесская область",
        "postalCode": "67772",
        "addressCountry": "UA"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}
