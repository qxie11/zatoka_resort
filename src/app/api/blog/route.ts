import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost } from "@/lib/db";

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении статей" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      date,
      imageUrl,
      readTime,
      categoryRu,
      categoryUk,
      categoryEn,
      titleRu,
      titleUk,
      titleEn,
      excerptRu,
      excerptUk,
      excerptEn,
      contentRu,
      contentUk,
      contentEn,
    } = body;

    if (!slug || !date || !titleRu || !contentRu) {
      return NextResponse.json(
        { error: "Необходимые поля: slug, date, titleRu, contentRu" },
        { status: 400 }
      );
    }

    const newPost = await createBlogPost({
      slug,
      date,
      imageUrl: imageUrl || "",
      readTime: Number(readTime) || 5,
      categoryRu: categoryRu || "",
      categoryUk: categoryUk || "",
      categoryEn: categoryEn || "",
      titleRu,
      titleUk: titleUk || titleRu,
      titleEn: titleEn || titleRu,
      excerptRu: excerptRu || "",
      excerptUk: excerptUk || excerptRu || "",
      excerptEn: excerptEn || excerptRu || "",
      contentRu: Array.isArray(contentRu) ? contentRu : [contentRu],
      contentUk: Array.isArray(contentUk) ? contentUk : [contentUk || contentRu],
      contentEn: Array.isArray(contentEn) ? contentEn : [contentEn || contentRu],
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Ошибка при создании статьи", message: error?.message },
      { status: 500 }
    );
  }
}
