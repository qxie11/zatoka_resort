import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Создаем директорию, если её нет
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        continue; // Пропускаем не-изображения
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Генерируем уникальное имя файла
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomStr}.${extension}`;
      const filePath = join(uploadDir, fileName);

      // Сохраняем файл
      await writeFile(filePath, buffer);

      // Сохраняем путь относительно public (будет доступен как /uploads/filename)
      uploadedPaths.push(`/uploads/${fileName}`);
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
      { error: "Ошибка при загрузке файла" },
      { status: 500 }
    );
  }
}

