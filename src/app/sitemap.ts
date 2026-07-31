import { MetadataRoute } from 'next';
import { getRooms } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zatoka-hotel.com';
  const langs = ['ru', 'uk', 'en'];

  // Static routes
  const staticRoutes = ['', '/about', '/rooms', '/booking', '/blog', '/quiz'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes for all languages
  langs.forEach((lang) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ru: `${baseUrl}/ru${route}`,
            uk: `${baseUrl}/uk${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    });
  });

  // Add dynamic rooms
  try {
    const rooms = await getRooms();
    rooms.forEach((room) => {
      langs.forEach((lang) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/rooms/${room.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: {
            languages: {
              ru: `${baseUrl}/ru/rooms/${room.slug}`,
              uk: `${baseUrl}/uk/rooms/${room.slug}`,
              en: `${baseUrl}/en/rooms/${room.slug}`,
            },
          },
        });
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/booking/${room.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: {
            languages: {
              ru: `${baseUrl}/ru/booking/${room.slug}`,
              uk: `${baseUrl}/uk/booking/${room.slug}`,
              en: `${baseUrl}/en/booking/${room.slug}`,
            },
          },
        });
      });
    });
  } catch (error) {
    console.error('Failed to generate sitemap for rooms:', error);
  }

  // Add dynamic blog posts
  try {
    const { getBlogPosts } = await import('@/lib/db');
    const posts = await getBlogPosts();
    posts.forEach((post) => {
      langs.forEach((lang) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.date),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              ru: `${baseUrl}/ru/blog/${post.slug}`,
              uk: `${baseUrl}/uk/blog/${post.slug}`,
              en: `${baseUrl}/en/blog/${post.slug}`,
            },
          },
        });
      });
    });
  } catch (error) {
    console.error('Failed to generate sitemap for blog posts:', error);
  }

  return sitemapEntries;
}
