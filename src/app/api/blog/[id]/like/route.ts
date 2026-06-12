import { NextResponse } from "next/server";
import { incrementBlogPostLike } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isLike = body.action !== "unlike"; // default to like if not specified

    const post = await incrementBlogPostLike(id, isLike);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: post.likes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
