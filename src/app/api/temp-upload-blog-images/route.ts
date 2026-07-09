import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Simple security check
  if (secret !== 'zatoka2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = new PrismaClient();
  const results = [];

  const blogImages = [
    { slug: "how-to-get-to-zatoka-2026", localPath: "public/images/blog/how-to-get-to-zatoka.png", fileName: "how-to-get-to-zatoka.png" },
    { slug: "why-zatoka-is-perfect-for-families", localPath: "public/images/blog/why-zatoka-is-perfect-for-families.png", fileName: "why-zatoka-is-perfect-for-families.png" },
    { slug: "velvet-season-vs-summer", localPath: "public/images/blog/velvet-season-vs-summer.png", fileName: "velvet-season-vs-summer.png" },
    { slug: "zatoka-accommodation-types-2026", localPath: "public/images/blog/zatoka-accommodation-types.png", fileName: "zatoka-accommodation-types.png" },
    { slug: "zatoka-prices-budget-2026", localPath: "public/images/blog/zatoka-prices-budget.png", fileName: "zatoka-prices-budget.png" },
    { slug: "zatoka-excursions-shabo-akkerman-2026", localPath: "public/images/blog/zatoka-excursions-shabo-akkerman.png", fileName: "zatoka-excursions-shabo-akkerman.png" },
    { slug: "zatoka-districts-comparison-2026", localPath: "public/images/blog/zatoka-districts-comparison.png", fileName: "zatoka-districts-comparison.png" },
    { slug: "secrets-of-zatoka-beaches", localPath: "public/images/blog/secrets-of-zatoka-beaches.png", fileName: "secrets-of-zatoka-beaches.png" }
  ];

  try {
    for (const item of blogImages) {
      // Resolve path using process.cwd() to correctly locate the public folder on Vercel
      const fullPath = path.join(process.cwd(), item.localPath);
      
      if (!fs.existsSync(fullPath)) {
        results.push({ slug: item.slug, status: 'skipped', reason: `File not found at ${fullPath}` });
        continue;
      }

      const fileBuffer = fs.readFileSync(fullPath);
      
      // Upload to Vercel Blob (it will automatically use process.env.BLOB_READ_WRITE_TOKEN)
      const blob = await put(`blog/${item.fileName}`, fileBuffer, {
        access: 'public',
      });

      // Update database
      const updated = await prisma.blogPost.update({
        where: { slug: item.slug },
        data: { imageUrl: blob.url }
      });

      results.push({ slug: item.slug, status: 'success', url: blob.url });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
