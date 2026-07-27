import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const rawParams = await context.params;
    const id = rawParams.id;
    const body = await request.json();

    const updated = await prisma.contactRequest.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.adminComment !== undefined ? { adminComment: body.adminComment } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update contact request:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении заявки", message: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const rawParams = await context.params;
    const id = rawParams.id;

    await prisma.contactRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete contact request:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении заявки", message: error?.message },
      { status: 500 }
    );
  }
}
