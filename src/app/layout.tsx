import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StoreProvider from "@/components/providers/StoreProvider";
import { Comfortaa, Nunito } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { GlobalMarineBackground } from "@/components/decorative/GlobalMarineBackground";
import { StickyBookingBar } from "@/components/conversion/StickyBookingBar";
import { CallbackForm } from "@/components/conversion/CallbackForm";
import { SeasonBanner } from "@/components/conversion/SeasonBanner";
import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";

import { cookies } from "next/headers";

const fontSans = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const fontHeading = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

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
    ru: "Забронируйте свой идеальный пляжный отдых в 'Отдых в Затоке', премиум-отеле в Затоке, Одесса. Наслаждайтесь потрясающими видами на море, отличным сервисом и современными удобствами.",
    uk: "Забронюйте свій ідеальний пляжний відпочинок у 'Відпочинок в Затоці', преміум-готелі в Затоці, Одеса. Насолоджуйтесь приголомшливими видами на море, чудовим сервісом та сучасними зручностями.",
    en: "Book your perfect beach holiday at 'Zatoka Resort', a premium hotel in Zatoka, Odesa. Enjoy stunning sea views, excellent service, and modern amenities.",
  };

  const appName = appNames[lang as keyof typeof appNames] || appNames.ru;
  const defaultTitle = titles[lang as keyof typeof titles] || titles.ru;
  const titleTemplate = titleTemplates[lang as keyof typeof titleTemplates] || titleTemplates.ru;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  return {
    metadataBase: new URL("https://zatokaresort.com"),
    alternates: {
      canonical: "/",
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
          url: "/og-image.png",
          width: 1200,
          height: 630,
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
      images: ["/og-image.png"],
    },
    keywords: [
      "отель",
      "Затока",
      "Одесса",
      "пляжный курорт",
      "Черное море",
      "отдых",
      "бронирование",
    ],
  };
}

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-slate-950 font-sans antialiased text-slate-100 overflow-x-hidden",
          fontSans.variable,
          fontHeading.variable
        )}
        suppressHydrationWarning
      >
        <StoreProvider lang={lang}>
          <NextTopLoader 
            color="#2dd4bf" 
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2dd4bf,0 0 5px #2dd4bf"
          />
          <div className="relative flex min-h-dvh flex-col bg-slate-950 text-slate-100">
            <GlobalMarineBackground />
            <Header />
            <SeasonBanner />
            <main className="relative flex-1 z-10">{children}</main>
            <Footer />
          </div>
          <StickyBookingBar />
          <CallbackForm />
          <ExitIntentPopup />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
