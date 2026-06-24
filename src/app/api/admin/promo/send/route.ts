import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPromoNewsletter } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { promoId, customSubject, customBody } = await req.json();

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

    // Fetch all subscriber emails
    const subscribers = await prisma.customerEmail.findMany({
      select: { email: true },
    });

    const emails = subscribers.map((s) => s.email).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
    }

    // Send emails
    const result = await sendPromoNewsletter({
      emails,
      promoCode: promo.code,
      discount: promo.discount,
      customSubject,
      customBody,
    });

    return NextResponse.json({
      success: true,
      totalCount: emails.length,
      successCount: result.successCount,
      errorCount: result.errorCount,
    });
  } catch (error) {
    console.error("Error sending promo newsletter:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}

// GET count of current subscribers
export async function GET() {
  try {
    const count = await prisma.customerEmail.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting subscribers count:", error);
    return NextResponse.json({ count: 0 });
  }
}
