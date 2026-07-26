import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zatoka-hotel.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/api/', 
        '/*/booking/success' // Prevent indexing of success pages
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
