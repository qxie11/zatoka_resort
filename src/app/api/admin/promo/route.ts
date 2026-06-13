import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all promo codes
export async function GET() {
  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(promos);
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}

// POST create or update
export async function POST(req: Request) {
  try {
    const { id, code, discount, isActive, isGift } = await req.json();

    if (!code || typeof discount !== "number") {
      return NextResponse.json({ error: "Code and discount are required" }, { status: 400 });
    }

    const formattedCode = code.trim().toUpperCase();

    if (id) {
      // Update
      const updated = await prisma.promoCode.update({
        where: { id },
        data: {
          code: formattedCode,
          discount,
          isActive: isActive ?? true,
          isGift: isGift ?? false,
        },
      });
      return NextResponse.json(updated);
    } else {
      // Create
      const created = await prisma.promoCode.create({
        data: {
          code: formattedCode,
          discount,
          isActive: isActive ?? true,
          isGift: isGift ?? false,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating/updating promo code:", error);
    return NextResponse.json({ error: "Failed to save promo code" }, { status: 500 });
  }
}

// DELETE a promo code
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting promo code:", error);
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
