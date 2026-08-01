import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/components/providers/StoreProvider";
import { Comfortaa, Nunito } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { GlobalMarineBackground } from "@/components/decorative/GlobalMarineBackground";
import CursorTrail from "@/components/decorative/CursorTrail";

const fontSans = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const fontHeading = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" }
    ]
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const lang = headerList.get("x-lang") || "ru";

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJSF2635');`
          }}
        />
        {/* Google Ads Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18286115803"
          strategy="afterInteractive"
        />
        <Script
          id="google-ads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18286115803');
              gtag('config', 'G-DWTXJJNTJF');
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-slate-950 font-sans antialiased text-slate-100 overflow-x-hidden",
          fontSans.variable,
          fontHeading.variable
        )}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TJSF2635"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <StoreProvider lang="ru">
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
            <CursorTrail />
            <GlobalMarineBackground />
            <div className="relative flex-1 z-10">{children}</div>
          </div>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
