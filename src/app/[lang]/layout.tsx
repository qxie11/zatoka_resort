import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StickyBookingBar } from "@/components/conversion/StickyBookingBar";
import { CallbackForm } from "@/components/conversion/CallbackForm";
import { SeasonBanner } from "@/components/conversion/SeasonBanner";
import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const appNames = {
    ru: "Отдых в Затоке",
    uk: "Відпочинок в Затоці",
    en: "Zatoka Resort",
  };

  const titles = {
    ru: "Отдых в Затоке | Ваш морской отель в Одесской области",
    uk: "Відпочинок в Затоці | Ваш морський готель в Одеській області",
    en: "Zatoka Resort | Your seaside hotel in Odesa region",
  };

  const titleTemplates = {
    ru: "%s | Отдых в Затоке",
    uk: "%s | Відпочинок в Затоці",
    en: "%s | Zatoka Resort",
  };

  const descriptions = {
    ru: "Отдых в Затоке: семейный отель Zatoka Resort на первой линии с собственным бассейном. Прямое бронирование номеров у самого моря, оптимальные цены 2026.",
    uk: "Забронюйте відпочинок в Затоці: готель Zatoka Resort на першій лінії з власним басейном. Оптимальні ціни 2026, комфортні номери, сімейний відпочинок біля моря.",
    en: "Book your holiday at Zatoka Resort: a beachfront hotel in Zatoka with a swimming pool. Direct booking, best prices 2026, comfortable rooms, and family seaside vacation.",
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const appName = appNames[lang as keyof typeof appNames] || appNames.ru;
  const defaultTitle = titles[lang as keyof typeof titles] || titles.ru;
  const titleTemplate = titleTemplates[lang as keyof typeof titleTemplates] || titleTemplates.ru;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  const ogImageUrl = `${baseUrl}/og-image.png`;
  const canonicalUrl = `${baseUrl}/${lang}`;

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/`,
        ru: `${baseUrl}/ru`,
        uk: `${baseUrl}/uk`,
        en: `${baseUrl}/en`,
      },
    },
    applicationName: appName,
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: description,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: defaultTitle,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: appName,
      title: {
        default: defaultTitle,
        template: titleTemplate,
      },
      description: description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: defaultTitle,
        template: titleTemplate,
      },
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <SeasonBanner />
      {children}
      <Footer />
      <StickyBookingBar />
      <CallbackForm />
      <ExitIntentPopup />
    </>
  );
}
