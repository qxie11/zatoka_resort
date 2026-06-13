import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Auto-seed ZATOKAWAVE if the table is empty
    const count = await prisma.promoCode.count();
    if (count === 0) {
      await prisma.promoCode.create({
        data: {
          code: "ZATOKAWAVE",
          discount: 5,
          isActive: true,
          isGift: true,
        },
      });
    }

    // Fetch the latest active gift promo code
    const activePromo = await prisma.promoCode.findFirst({
      where: { isActive: true, isGift: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activePromo) {
      return NextResponse.json({ code: "ZATOKAWAVE", discount: 5 });
    }

    return NextResponse.json({
      code: activePromo.code,
      discount: activePromo.discount,
    });
  } catch (error) {
    console.error("Error fetching active promo code:", error);
    return NextResponse.json({ code: "ZATOKAWAVE", discount: 5 });
  }
}
