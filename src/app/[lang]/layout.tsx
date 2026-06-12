import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StickyBookingBar } from "@/components/conversion/StickyBookingBar";
import { SeasonBanner } from "@/components/conversion/SeasonBanner";
import { CallbackForm } from "@/components/conversion/CallbackForm";
import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";
import ScratchCardPromo from "@/components/conversion/ScratchCardPromo";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";

  const currentYear = new Date().getFullYear();

  const i18n = {
    ru: { title: "Отдых в Затоке | Zatoka Resort", desc: `Семейный отель в Затоке на первой линии. Бассейн, комфортные номера, цены ${currentYear}.` },
    uk: { title: "Відпочинок в Затоці | Zatoka Resort", desc: `Сімейний готель в Затоці на першій лінії. Басейн, комфортні номери, ціни ${currentYear}.` },
    en: { title: "Zatoka Resort | Seaside Hotel", desc: `Beachfront family hotel in Zatoka. Pool, comfortable rooms, best rates ${currentYear}.` },
  };

  const { title, desc } = i18n[lang as keyof typeof i18n] || i18n.ru;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Zatoka Resort",
    },
    description: desc,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        "x-default": `${baseUrl}/ru`,
        ru: `${baseUrl}/ru`,
        uk: `${baseUrl}/uk`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang,
      siteName: "Zatoka Resort",
      title,
      description: desc,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <Header />

        <main className="min-h-screen">
          <SeasonBanner />
          {children}
        </main>

        <Footer />

        <StickyBookingBar />
        <CallbackForm />
        <ExitIntentPopup />
        <ScratchCardPromo lang={lang} />
      </body>
    </html>
  );
}