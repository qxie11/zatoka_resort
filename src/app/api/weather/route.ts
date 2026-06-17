import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cacheKey = "weather_zatoka";

  try {
    // 1. Check database cache
    const cached = await prisma.systemCache.findUnique({
      where: { key: cacheKey },
    });

    if (cached && cached.expiresAt > new Date()) {
      return NextResponse.json(JSON.parse(cached.value));
    }

    // 2. Fetch fresh data from Open-Meteo
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=46.158222&longitude=30.541194&current=temperature_2m,relative_humidity_2m,wind_speed_10m",
      { next: { revalidate: 0 } } // Disable next built-in fetch cache to manage it ourselves
    );

    if (!res.ok) {
      throw new Error("Failed to fetch weather from Open-Meteo");
    }

    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 28);
    const windSpeed = data.current?.wind_speed_10m ?? 10;
    
    // Simulate some seaside specific values based on temperature / wind
    const seaTemp = temp >= 25 ? 24 : temp >= 20 ? 21 : 18;
    const waveHeight = windSpeed > 25 ? "0.8м" : windSpeed > 15 ? "0.5м" : "0.2м";

    const weatherPayload = {
      temp,
      seaTemp,
      waveHeight,
      windSpeed,
    };

    // 3. Save to database cache (2 hours duration)
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await prisma.systemCache.upsert({
      where: { key: cacheKey },
      update: {
        value: JSON.stringify(weatherPayload),
        expiresAt,
      },
      create: {
        key: cacheKey,
        value: JSON.stringify(weatherPayload),
        expiresAt,
      },
    });

    return NextResponse.json(weatherPayload);
  } catch (error) {
    console.error("Error in weather API:", error);
    // Safe fallback if API is down
    return NextResponse.json({
      temp: 28,
      seaTemp: 24,
      waveHeight: "0.2м",
      windSpeed: 8,
    });
  }
}
