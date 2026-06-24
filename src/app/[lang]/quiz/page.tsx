import { Metadata } from "next";
import QuizClient from "./QuizClient";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";

  const data = {
    ru: {
      title: "Квиз: Тест на знание Затоки",
      desc: "Пройдите увлекательный квиз-тест об истории, географии и секретах Затоки. Проверьте свои знания перед поездкой на море!",
    },
    uk: {
      title: "Квіз: Тест на знання Затоки",
      desc: "Пройдіть захоплюючий квіз-тест про історію, географію та секрети Затоки. Перевірте свої знання перед поїздкою на море!",
    },
    en: {
      title: "Quiz: How Well Do You Know Zatoka?",
      desc: "Take our fun quiz about the history, geography, and secrets of Zatoka. Test your knowledge before your seaside vacation!",
    },
  };

  const meta = data[lang as keyof typeof data] || data.ru;
  const canonicalUrl = `${baseUrl}/${lang}/quiz`;

  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/ru/quiz`,
        ru: `${baseUrl}/ru/quiz`,
        uk: `${baseUrl}/uk/quiz`,
        en: `${baseUrl}/en/quiz`,
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

export default async function QuizPage({ params }: PageProps) {
  const { lang } = await params;
  return <QuizClient lang={lang as "ru" | "uk" | "en"} />;
}
