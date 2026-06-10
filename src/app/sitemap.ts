import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// Recursively find all page files in the app directory to build paths dynamically
function getAppRoutes(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAppRoutes(filePath, baseDir));
    } else if (stat && stat.isFile()) {
      const fileName = path.basename(filePath);
      if (fileName.startsWith("page.tsx") || fileName.startsWith("page.ts") || fileName.startsWith("page.js")) {
        let routePath = path.relative(baseDir, path.dirname(filePath));
        
        // Normalize path separators to POSIX style
        routePath = routePath.replace(/\\/g, "/");

        // Filter out next.js route groups, e.g. (marketing), (auth)
        routePath = routePath
          .split("/")
          .filter((segment) => !segment.startsWith("(") && !segment.endsWith(")"))
          .join("/");

        results.push(routePath);
      }
    }
  }
  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const appDirectory = path.join(process.cwd(), "src/app");

  // Get all routes dynamically from filesystem
  const allRoutes = getAppRoutes(appDirectory);

  // Filter out internal routes, admin panel, api, and login routes
  const publicRoutes = allRoutes.filter((route) => {
    const lowerRoute = route.toLowerCase();
    return (
      !lowerRoute.startsWith("admin") &&
      !lowerRoute.startsWith("_") &&
      !lowerRoute.startsWith("api") &&
      lowerRoute !== "not-found" &&
      lowerRoute !== "login"
    );
  });

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of publicRoutes) {
    if (route.includes("[roomId]")) {
      // Dynamic room page: fetch active rooms from DB
      try {
        const rooms = await prisma.room.findMany({
          select: { id: true, updatedAt: true },
        });
        for (const room of rooms) {
          sitemapEntries.push({
            url: `${baseUrl}/booking/${room.id}`,
            lastModified: room.updatedAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      } catch (error) {
        console.error("Error fetching rooms for dynamic sitemap paths:", error);
      }
    } else if (route.includes("[slug]")) {
      // Dynamic blog page
      try {
        const posts = await prisma.blogPost.findMany({
          select: { slug: true, updatedAt: true },
        });
        for (const post of posts) {
          sitemapEntries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      } catch (error) {
        console.error("Error fetching blog posts for dynamic sitemap paths:", error);
      }
    } else {
      // Static routes (like "", "about", "booking")
      const isHome = route === "";
      sitemapEntries.push({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: isHome ? "daily" : "weekly",
        priority: isHome ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
