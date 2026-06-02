import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Файлы не были загружены" },
        { status: 400 }
      );
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Upload file directly to Vercel Blob storage
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
      });

      uploadedPaths.push(blob.url);
    }

    if (uploadedPaths.length === 0) {
      return NextResponse.json(
        { error: "Не удалось загрузить ни одного изображения" },
        { status: 400 }
      );
    }

    return NextResponse.json({ paths: uploadedPaths });
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);
    return NextResponse.json(
      { 
        error: "Ошибка при загрузке файла", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
