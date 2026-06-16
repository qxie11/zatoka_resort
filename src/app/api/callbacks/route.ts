import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCallbackNotification } from "@/lib/email";

export async function GET() {
  try {
    const requests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Failed to fetch contact requests:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заявок", message: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name,
        phone,
        message: message || "",
      },
    });

    // Send email notification (non-blocking)
    await sendCallbackNotification({ name, phone, message });

    return NextResponse.json(contactRequest, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create contact request:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке заявки", message: error?.message },
      { status: 500 }
    );
  }
}
