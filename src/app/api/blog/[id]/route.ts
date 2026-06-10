import { NextRequest, NextResponse } from "next/server";
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getBlogPostById(id);
    if (!post) {
      return NextResponse.json(
        { error: "Статья не найдена" },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении статьи" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existing = await getBlogPostById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Статья не найдена" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (slug !== undefined) updateData.slug = slug;
    if (date !== undefined) updateData.date = date;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (readTime !== undefined) updateData.readTime = Number(readTime);
    if (categoryRu !== undefined) updateData.categoryRu = categoryRu;
    if (categoryUk !== undefined) updateData.categoryUk = categoryUk;
    if (categoryEn !== undefined) updateData.categoryEn = categoryEn;
    if (titleRu !== undefined) updateData.titleRu = titleRu;
    if (titleUk !== undefined) updateData.titleUk = titleUk;
    if (titleEn !== undefined) updateData.titleEn = titleEn;
    if (excerptRu !== undefined) updateData.excerptRu = excerptRu;
    if (excerptUk !== undefined) updateData.excerptUk = excerptUk;
    if (excerptEn !== undefined) updateData.excerptEn = excerptEn;
    if (contentRu !== undefined) updateData.contentRu = Array.isArray(contentRu) ? contentRu : [contentRu];
    if (contentUk !== undefined) updateData.contentUk = Array.isArray(contentUk) ? contentUk : [contentUk];
    if (contentEn !== undefined) updateData.contentEn = Array.isArray(contentEn) ? contentEn : [contentEn];

    const updated = await updateBlogPost(id, updateData);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Ошибка при обновлении статьи", message: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteBlogPost(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Статья не найдена" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при удалении статьи" },
      { status: 500 }
    );
  }
}
