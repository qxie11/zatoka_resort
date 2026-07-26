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
        });
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/booking/${room.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.9,
        });
      });
    });
  } catch (error) {
    console.error('Failed to generate sitemap for rooms:', error);
  }

  // TODO: Add dynamic blog posts if they are stored in DB later

  return sitemapEntries;
}
