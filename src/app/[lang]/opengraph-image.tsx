import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Grean Beam — Семейный отель у моря";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const i18n: Record<string, { title: string; subtitle: string; tagline: string }> = {
    ru: {
      title: "GREAN BEAM",
      subtitle: "Уютный летний отдых для всей вашей семьи",
      tagline: "Семейный отель • Зеленый двор • 5 минут до моря",
    },
    uk: {
      title: "GREAN BEAM",
      subtitle: "Затишний літній відпочинок для всієї вашої родини",
      tagline: "Сімейний готель • Зелений двір • 5 хвилин до моря",
    },
    en: {
      title: "GREAN BEAM",
      subtitle: "Cozy summer getaway for your entire family",
      tagline: "Family Hotel • Green Yard • 5 min to the beach",
    },
  };

  const t = i18n[lang] || i18n.ru;

  // Helper to get TTF font from Google Fonts (Satori only supports TTF/OTF)
  async function loadGoogleFont(fontFamily: string, weight: number): Promise<ArrayBuffer> {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weight}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+" } }
    ).then((res) => res.text());

    const match = css.match(/src:\s*url\(([^)]+)\)/);
    if (!match || !match[1]) {
      throw new Error(`Failed to load font ${fontFamily}`);
    }
    return fetch(match[1]).then((res) => res.arrayBuffer());
  }

  const [comfortaaBold, nunitoBold] = await Promise.all([
    loadGoogleFont("Comfortaa", 700),
    loadGoogleFont("Nunito", 700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          // Dark marine background
          backgroundColor: "#020617",
        }}
      >
        {/* Base gradient layer — deep ocean feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 120% 80% at 60% 100%, rgba(20,184,166,0.18) 0%, transparent 60%), radial-gradient(ellipse 100% 60% at 20% 20%, rgba(14,116,144,0.22) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 80% 30%, rgba(56,189,248,0.12) 0%, transparent 50%)",
          }}
        />

        {/* Subtle light rays */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            width: 120,
            height: "100%",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(45,212,191,0.06) 0%, rgba(56,189,248,0.03) 40%, transparent 80%)",
            transform: "skewX(12deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "45%",
            width: 80,
            height: "100%",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(56,189,248,0.05) 0%, rgba(45,212,191,0.02) 40%, transparent 80%)",
            transform: "skewX(-8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "20%",
            width: 100,
            height: "100%",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(20,184,166,0.04) 0%, transparent 60%)",
            transform: "skewX(6deg)",
          }}
        />

        {/* Bottom wave shapes */}
        <svg
          viewBox="0 0 1200 160"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 1200,
            height: 160,
          }}
        >
          <path
            d="M0,100 C150,70 300,130 450,90 C600,50 750,120 900,85 C1050,50 1150,100 1200,80 L1200,160 L0,160 Z"
            fill="rgba(20,184,166,0.08)"
          />
          <path
            d="M0,120 C200,90 400,140 600,110 C800,80 1000,130 1200,100 L1200,160 L0,160 Z"
            fill="rgba(14,116,144,0.06)"
          />
          <path
            d="M0,140 C250,120 500,150 750,130 C1000,110 1100,140 1200,125 L1200,160 L0,160 Z"
            fill="rgba(45,212,191,0.04)"
          />
        </svg>

        {/* Top-left decorative waves icon */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Small wave icon matching favicon */}
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#og-grad)" />
            <path
              d="M4 18C7 16 10 18 13 17C16 16 19 18 22 17C25 16 28 18 28 17.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <path
              d="M4 22C7 20 10 22 13 21C16 20 19 22 22 21C25 20 28 22 28 21.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M4 26C7 24 10 26 13 25C16 24 19 26 22 25C25 24 28 26 28 25.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
            <defs>
              <linearGradient id="og-grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#1e90ff" />
                <stop offset="50%" stopColor="#00bfff" />
                <stop offset="100%" stopColor="#0080ff" />
              </linearGradient>
            </defs>
          </svg>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Comfortaa",
              color: "rgba(148,163,184,0.7)",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
            }}
          >
            zatoka-hotel.com
          </span>
        </div>

        {/* Floating teal dot accents */}
        <div
          style={{
            position: "absolute",
            top: 120,
            right: 140,
            width: 8,
            height: 8,
            borderRadius: "50%",
            display: "flex",
            background: "#2dd4bf",
            boxShadow: "0 0 20px rgba(45,212,191,0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 80,
            width: 5,
            height: 5,
            borderRadius: "50%",
            display: "flex",
            background: "#38bdf8",
            boxShadow: "0 0 15px rgba(56,189,248,0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 100,
            width: 6,
            height: 6,
            borderRadius: "50%",
            display: "flex",
            background: "#2dd4bf",
            boxShadow: "0 0 15px rgba(45,212,191,0.4)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            gap: 0,
            padding: "0 80px",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              fontFamily: "Comfortaa",
              letterSpacing: "0.1em",
              lineHeight: 1.1,
              textAlign: "center",
              display: "flex",
              background: "linear-gradient(135deg, #2dd4bf 0%, #22d3ee 40%, #38bdf8 70%, #3b82f6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t.title}
          </div>

          {/* Decorative wave divider */}
          <svg
            viewBox="0 0 300 20"
            style={{
              width: 300,
              height: 20,
              marginTop: 16,
              marginBottom: 24,
            }}
          >
            <path
              d="M0,10 C25,4 50,16 75,10 C100,4 125,16 150,10 C175,4 200,16 225,10 C250,4 275,16 300,10"
              stroke="url(#wave-line)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="wave-line" x1="0" y1="0" x2="300" y2="0">
                <stop offset="0%" stopColor="rgba(45,212,191,0.1)" />
                <stop offset="30%" stopColor="rgba(45,212,191,0.5)" />
                <stop offset="50%" stopColor="rgba(34,211,238,0.6)" />
                <stop offset="70%" stopColor="rgba(56,189,248,0.5)" />
                <stop offset="100%" stopColor="rgba(56,189,248,0.1)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 400,
              fontFamily: "Nunito",
              color: "#e2e8f0",
              textAlign: "center",
              lineHeight: 1.4,
              maxWidth: 900,
              display: "flex",
            }}
          >
            {t.subtitle}
          </div>

          {/* Tagline badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 32,
              padding: "10px 28px",
              borderRadius: 9999,
              border: "1px solid rgba(45,212,191,0.2)",
              background: "rgba(45,212,191,0.06)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                display: "flex",
                background: "#2dd4bf",
                boxShadow: "0 0 10px rgba(45,212,191,0.6)",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Nunito",
                color: "#5eead4",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
              }}
            >
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Border glow at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            display: "flex",
            background:
              "linear-gradient(90deg, transparent, rgba(45,212,191,0.4), rgba(56,189,248,0.4), transparent)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Comfortaa",
          data: comfortaaBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Nunito",
          data: nunitoBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
