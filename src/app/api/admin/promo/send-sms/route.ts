import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPromoSMS } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const { promoId, customMessage } = await req.json();

    if (!promoId) {
      return NextResponse.json({ error: "Promo ID is required" }, { status: 400 });
    }

    // Fetch the promo code details
    const promo = await prisma.promoCode.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
    }

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

    // Normalize and deduplicate phones
    const uniquePhones = new Set<string>();
    
    rawPhones.forEach((phone) => {
      let cleaned = phone.replace(/[^\d+]/g, '');
      if (cleaned.length >= 9) {
        if (cleaned.startsWith('380') && !cleaned.startsWith('+')) {
          cleaned = '+' + cleaned;
        } else if (cleaned.startsWith('0') && cleaned.length === 10) {
          cleaned = '+38' + cleaned;
        }
        uniquePhones.add(cleaned);
      }
    });

    const phones = Array.from(uniquePhones);

    if (phones.length === 0) {
      return NextResponse.json({ error: "No phone numbers found" }, { status: 400 });
    }

    // Send SMS
    const result = await sendPromoSMS({
      phones,
      promoCode: promo.code,
      discount: promo.discount,
      customMessage,
    });

    return NextResponse.json({
      success: true,
      totalCount: phones.length,
      successCount: result.successCount,
      errorCount: result.errorCount,
    });
  } catch (error) {
    console.error("Error sending promo SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
