import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an array of objects." },
        { status: 400 }
      );
    }
    
    // Using a transaction to update all room orders atomically
    await prisma.$transaction(
      body.map((item: { id: string; order: number }) =>
        prisma.room.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering rooms:", error);
    return NextResponse.json(
      { error: "Failed to reorder rooms" },
      { status: 500 }
    );
  }
}
