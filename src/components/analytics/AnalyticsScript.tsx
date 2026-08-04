"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function AnalyticsScript() {
  const pathname = usePathname();

  // Do not load tracking scripts on admin dashboard or API routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/api")) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJSF2635');`,
        }}
      />
      {/* Google Ads & GA4 Tag */}
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
    </>
  );
}
