import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";

  const currentYear = new Date().getFullYear();

  const data = {
    ru: {
      title: "О Нас — Семейный Отель Zatoka Resort в Затоке",
      desc: `Узнайте больше о семейном отеле Zatoka Resort в Затоке: 5 минут до пляжа, мангалы, детская зона, Wi-Fi. Прямое бронирование по ценам ${currentYear}.`,
      keywords: [
        "о нас затока ресорт",
        "отель в затоке информация",
        "гостиница затока лиманская",
        "отдых в затоке отель"
      ]
    },
    uk: {
      title: "Про Нас — Сімейний Готель Zatoka Resort у Затоці",
      desc: `Дізнайтеся більше про сімейний готель Zatoka Resort у Затоці: 5 хвилин до пляжу, мангали, дитяча зона, Wi-Fi. Пряме бронювання за цінами ${currentYear}.`,
      keywords: [
        "про нас затока ресорт",
        "готель в затоці інформація",
        "готель затока лиманська",
        "відпочинок в затоці готель"
      ]
    },
    en: {
      title: "About Us — Family Hotel Zatoka Resort in Ukraine",
      desc: `Learn more about Zatoka Resort: peaceful seaside location 5 minutes walk to the Black Sea, cozy air-conditioned rooms, barbecue area, best rates ${currentYear}.`,
      keywords: [
        "about zatoka resort",
        "zatoka hotel info",
        "seaside hotel ukraine",
        "zatoka accommodation overview"
      ]
    },
  };

  const meta = data[lang as keyof typeof data] || data.ru;
  const canonicalUrl = `${baseUrl}/${lang}/about`;

  return {
    title: meta.title,
    description: meta.desc,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ru: `${baseUrl}/ru/about`,
        uk: `${baseUrl}/uk/about`,
        en: `${baseUrl}/en/about`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang,
      url: canonicalUrl,
      title: meta.title,
      description: meta.desc,
      siteName: "Zatoka Resort",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.desc,
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Zatoka Resort",
    "url": `${baseUrl}/${lang}/about`,
    "mainEntity": {
      "@type": "Hotel",
      "name": "Zatoka Resort",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Садовая, 1835, станция Лиманская",
        "addressLocality": "Затока",
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
      <AboutClient lang={lang} />
    </>
  );
}