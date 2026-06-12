import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";

  const currentYear = new Date().getFullYear();

  const data = {
    ru: {
      title: "О нас | Отдых в Затоке",
      desc: `Узнайте больше о семейном отеле Zatoka Resort в Затоке: в 10 минутах от моря, бассейн и лучший сервис. Бронируйте напрямую по ценам ${currentYear}!`,
    },
    uk: {
      title: "Про нас | Відпочинок в Затоці",
      desc: `Дізнайтеся більше про сімейний готель Zatoka Resort у Затоці: в 10 хвилинах від моря, басейн та найкращий сервіс. Бронюйте напряму за цінами ${currentYear}!`,
    },
    en: {
      title: "About Us | Zatoka Resort",
      desc: `Discover more about Zatoka Resort: peaceful location just a 10-minute walk to the sea, pool, and top-tier hospitality. Direct booking ${currentYear} at best rates.`,
    },
  };

  const meta = data[lang as keyof typeof data] || data.ru;
  const canonicalUrl = `${baseUrl}/${lang}/about`;

  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/ru/about`,
        ru: `${baseUrl}/ru/about`,
        uk: `${baseUrl}/uk/about`,
        en: `${baseUrl}/en/about`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: canonicalUrl,
      siteName: "Zatoka Resort",
      locale: lang,
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";

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
        "streetAddress": "бульвар Золотой Берег, 42",
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