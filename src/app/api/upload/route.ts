import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
// @ts-ignore
import sharp from "sharp";

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

      let fileBuffer = Buffer.from(await file.arrayBuffer());
      let contentType = file.type;
      let fileName = file.name;

      // Skip animated GIFs to avoid losing frames
      if (file.type !== "image/gif") {
        try {
          const sharpImg = sharp(fileBuffer);
          const metadata = await sharpImg.metadata();

          if (metadata.width && metadata.height) {
            const maxWidth = 1600;
            const maxHeight = 1600;
            if (metadata.width > maxWidth || metadata.height > maxHeight) {
              sharpImg.resize({
                width: maxWidth,
                height: maxHeight,
                fit: "inside",
                withoutEnlargement: true,
              });
            }
          }

          const optimizedBuffer = await sharpImg
            .jpeg({ quality: 80, mozjpeg: true })
            .toBuffer();

          if (optimizedBuffer.length < fileBuffer.length) {
            fileBuffer = optimizedBuffer;
            contentType = "image/jpeg";
            fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          }
        } catch (err) {
          console.error("Ошибка при оптимизации изображения sharp:", err);
        }
      }

      // Upload file directly to Vercel Blob storage
      const blob = await put(fileName, fileBuffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: contentType,
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
