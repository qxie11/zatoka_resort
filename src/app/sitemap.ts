import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 43200; // Revalidate sitemap every 12 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const locales = ['ru', 'uk', 'en'];

  // 1. Define static paths (relative)
  const staticPaths = [
    '',
    '/about',
    '/booking',
    '/blog',
    '/quiz',
  ];

  // 2. Fetch rooms and posts from database with try-catch to prevent build-time crashes
  let rooms: Array<{ id: string; slug: string; updatedAt: Date }> = [];
  let posts: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    rooms = await prisma.room.findMany({
      select: { id: true, slug: true, updatedAt: true }
    });
    posts = await prisma.blogPost.findMany({
      select: { slug: true, updatedAt: true }
    });
  } catch (error) {
    console.error('Failed to fetch dynamic paths for sitemap:', error);
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate sitemap items for static pages
  for (const path of staticPaths) {
    for (const locale of locales) {
      const pathWithLocale = `/${locale}${path}`;
      const url = `${baseUrl}${pathWithLocale}`;

      // Build alternates
      const languages: Record<string, string> = {};
      locales.forEach(loc => {
        languages[loc] = `${baseUrl}/${loc}${path}`;
      });

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  // Generate sitemap items for dynamic rooms
  for (const room of rooms) {
    for (const locale of locales) {
      const pathWithLocale = `/${locale}/booking/${room.slug}`;
      const url = `${baseUrl}${pathWithLocale}`;

      const languages: Record<string, string> = {};
      locales.forEach(loc => {
        languages[loc] = `${baseUrl}/${loc}/booking/${room.slug}`;
      });

      sitemapEntries.push({
        url,
        lastModified: room.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages,
        },
      });
    }
  }

  // Generate sitemap items for dynamic blog posts
  for (const post of posts) {
    for (const locale of locales) {
      const pathWithLocale = `/${locale}/blog/${post.slug}`;
      const url = `${baseUrl}${pathWithLocale}`;

      const languages: Record<string, string> = {};
      locales.forEach(loc => {
        languages[loc] = `${baseUrl}/${loc}/blog/${post.slug}`;
      });

      sitemapEntries.push({
        url,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages,
        },
      });
    }
  }

  return sitemapEntries;
}
