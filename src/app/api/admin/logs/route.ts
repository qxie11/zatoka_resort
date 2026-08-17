import { NextRequest, NextResponse } from "next/server";
import { getBookingLogs } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await getBookingLogs();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении логов" },
      { status: 500 }
    );
  }
}
