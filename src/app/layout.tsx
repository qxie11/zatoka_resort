import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
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

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-slate-950 font-sans antialiased text-slate-100 overflow-x-hidden",
          fontSans.variable,
          fontHeading.variable
        )}
        suppressHydrationWarning
      >
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
            <GlobalMarineBackground />
            <main className="relative flex-1 z-10">{children}</main>
          </div>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
