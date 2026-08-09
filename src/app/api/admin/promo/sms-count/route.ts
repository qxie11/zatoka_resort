import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Collect phones from bookings
    const bookings = await prisma.booking.findMany({
      select: { phone: true },
      where: { phone: { not: "" } },
    });

    // Collect phones from callback requests
    const callbacks = await prisma.contactRequest.findMany({
      select: { phone: true },
      where: { phone: { not: "" } },
    });

    // Extract raw phone numbers
    const rawPhones = [
      ...bookings.map((b) => b.phone),
      ...callbacks.map((c) => c.phone),
    ].filter(Boolean);

    // Normalize phones (remove all non-digit characters except the leading +)
    // and use a Set to get unique numbers.
    const uniquePhones = new Set<string>();
    
    rawPhones.forEach((phone) => {
      // Remove spaces, dashes, brackets, etc.
      let cleaned = phone.replace(/[^\d+]/g, '');
      
      // Ensure it starts with + if it looks like a full number, 
      // or just keep it as is if it's already somewhat normalized.
      // E.g. 0669212275 vs +380669212275
      // To be safe, we'll just use the digits to deduplicate if the country code is tricky,
      // but keeping the + is better for SMS gateways.
      if (cleaned.length >= 9) {
        // Simple normalization: if it starts with 380 but missing +, add it
        if (cleaned.startsWith('380') && !cleaned.startsWith('+')) {
          cleaned = '+' + cleaned;
        } else if (cleaned.startsWith('0') && cleaned.length === 10) {
          // Local format 066... -> +38066...
          cleaned = '+38' + cleaned;
        }
        uniquePhones.add(cleaned);
      }
    });

    return NextResponse.json({ count: uniquePhones.size });
  } catch (error) {
    console.error("Error getting SMS phones count:", error);
    return NextResponse.json({ count: 0 });
  }
}
