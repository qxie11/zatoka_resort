import { getBlogPosts } from "@/lib/db";
import BlogAdminClient from "./BlogAdminClient";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await getBlogPosts();
  return <BlogAdminClient initialData={posts} />;
}
