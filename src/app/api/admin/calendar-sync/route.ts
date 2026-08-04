import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBooking, getBookings, updateBooking } from "@/lib/db";

interface FeedConfig {
  id: string; // unique feed id
  roomId: string;
  roomName: string;
  sourceName: string; // e.g. "Booking.com"
  url: string; // https://admin.booking.com/ical/....ics
  lastSyncedAt?: string;
  status?: "SUCCESS" | "ERROR";
  errorMessage?: string;
}

function parseICSDate(icsDateStr: string): Date | null {
  if (!icsDateStr) return null;
  // Format examples: 20260810, 20260810T120000Z, VALUE=DATE:20260810
  const cleanStr = icsDateStr.replace(/^.*:/, "").trim();
  const match = cleanStr.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)));
}

function parseICSEvents(icsText: string) {
  const events: Array<{ uid: string; startDate: Date; endDate: Date; summary: string }> = [];
  const lines = icsText.split(/\r?\n/);
  
  let currentEvent: any = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    // Handle line unfolding (lines starting with space or tab)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(" ") || lines[i + 1].startsWith("\t"))) {
      i++;
      line += lines[i].substring(1);
    }

    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
    } else if (line === "END:VEVENT" && currentEvent) {
      if (currentEvent.startDate && currentEvent.endDate) {
        events.push({
          uid: currentEvent.uid || `event-${Date.now()}-${Math.random()}`,
          startDate: currentEvent.startDate,
          endDate: currentEvent.endDate,
          summary: currentEvent.summary || "External Reservation",
        });
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith("DTSTART")) {
        currentEvent.startDate = parseICSDate(line);
      } else if (line.startsWith("DTEND")) {
        currentEvent.endDate = parseICSDate(line);
      } else if (line.startsWith("UID:")) {
        currentEvent.uid = line.replace("UID:", "").trim();
      } else if (line.startsWith("SUMMARY:")) {
        currentEvent.summary = line.replace("SUMMARY:", "").trim();
      }
    }
  }

  return events;
}

export async function GET() {
  try {
    const cache = await prisma.systemCache.findUnique({
      where: { key: "ical_feeds_config" },
    });

    const feeds: FeedConfig[] = cache ? JSON.parse(cache.value) : [];
    return NextResponse.json({ feeds });
  } catch (error) {
    console.error("Error loading calendar sync config:", error);
    return NextResponse.json({ feeds: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, feeds } = body;

    if (action === "save_feeds") {
      await prisma.systemCache.upsert({
        where: { key: "ical_feeds_config" },
        update: { value: JSON.stringify(feeds), expiresAt: new Date(Date.now() + 365 * 86400000) },
        create: { key: "ical_feeds_config", value: JSON.stringify(feeds), expiresAt: new Date(Date.now() + 365 * 86400000) },
      });
      return NextResponse.json({ success: true, feeds });
    }

    if (action === "sync_now") {
      const cache = await prisma.systemCache.findUnique({
        where: { key: "ical_feeds_config" },
      });

      const currentFeeds: FeedConfig[] = cache ? JSON.parse(cache.value) : feeds || [];
      const updatedFeeds: FeedConfig[] = [];
      let totalImported = 0;

      const existingBookings = await getBookings();

      for (const feed of currentFeeds) {
        if (!feed.url || !feed.url.startsWith("http")) {
          updatedFeeds.push(feed);
          continue;
        }

        try {
          const res = await fetch(feed.url, { cache: "no-store", headers: { "User-Agent": "ZatokaResortCalendarSync/1.0" } });
          if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
          }
          const text = await res.text();
          const parsedEvents = parseICSEvents(text);

          for (const ev of parsedEvents) {
            // Check if booking already exists for this room and date range from this feed
            const existing = existingBookings.find((b) => {
              if (b.roomId !== feed.roomId) return false;
              const bStart = new Date(b.startDate).getTime();
              const bEnd = new Date(b.endDate).getTime();
              const evStart = ev.startDate.getTime();
              const evEnd = ev.endDate.getTime();
              return Math.abs(bStart - evStart) < 86400000 && Math.abs(bEnd - evEnd) < 86400000;
            });

            if (!existing) {
              await createBooking({
                roomId: feed.roomId,
                startDate: ev.startDate,
                endDate: ev.endDate,
                name: `Бронь ${feed.sourceName || "Booking.com"}`,
                phone: "Синхронизация",
                email: "ical-sync@zatoka-hotel.com",
                status: "CONFIRMED",
                adminComment: `[iCal Sync] Автоматически загружено из ${feed.sourceName || "Booking.com"}. UID: ${ev.uid}`,
              });
              totalImported++;
            }
          }

          updatedFeeds.push({
            ...feed,
            lastSyncedAt: new Date().toISOString(),
            status: "SUCCESS",
            errorMessage: undefined,
          });
        } catch (err: any) {
          console.error(`Error syncing feed ${feed.id}:`, err);
          updatedFeeds.push({
            ...feed,
            lastSyncedAt: new Date().toISOString(),
            status: "ERROR",
            errorMessage: err.message || "Ошибка подключения",
          });
        }
      }

      // Save updated sync statuses
      await prisma.systemCache.upsert({
        where: { key: "ical_feeds_config" },
        update: { value: JSON.stringify(updatedFeeds), expiresAt: new Date(Date.now() + 365 * 86400000) },
        create: { key: "ical_feeds_config", value: JSON.stringify(updatedFeeds), expiresAt: new Date(Date.now() + 365 * 86400000) },
      });

      return NextResponse.json({ success: true, totalImported, feeds: updatedFeeds });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in calendar sync route:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
