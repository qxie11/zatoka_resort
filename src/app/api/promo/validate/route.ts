import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
    }

    const formattedCode = code.trim().toUpperCase();

    // Auto-seed ZATOKAWAVE if the table is empty
    const count = await prisma.promoCode.count();
    if (count === 0) {
      await prisma.promoCode.create({
        data: {
          code: "ZATOKAWAVE",
          discount: 5,
          isActive: true,
        },
      });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: formattedCode },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ valid: false, message: "Invalid or inactive promo code" });
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discount: promo.discount,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 });
  }
}
