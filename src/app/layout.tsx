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

const fontSans = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const fontHeading = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
});

const APP_NAME = "Отдых в Затоке";
const APP_DEFAULT_TITLE =
  "Отдых в Затоке | Ваш морской отель в Одесской области";
const APP_TITLE_TEMPLATE = "%s | Отдых в Затоке";
const APP_DESCRIPTION =
  "Забронируйте свой идеальный пляжный отдых в 'Отдых в Затоке', премиум-отеле в Затоке, Одесса. Наслаждайтесь потрясающими видами на море, отличным сервисом и современными удобствами.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
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

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-slate-950 font-sans antialiased text-slate-100",
          fontSans.variable,
          fontHeading.variable
        )}
        suppressHydrationWarning
      >
        <StoreProvider>
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
          <div className="relative flex min-h-dvh flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
            <GlobalMarineBackground />
            <Header />
            <main className="relative flex-1 z-10">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
