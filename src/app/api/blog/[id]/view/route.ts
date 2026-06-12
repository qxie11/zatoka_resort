import { NextResponse } from "next/server";
import { incrementBlogPostView } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await incrementBlogPostView(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, views: post.views });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to increment view" },
      { status: 500 }
    );
  }
}
