import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/db";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang: queryLang } = await searchParams;
  const post = await getBlogPostBySlug(slug);
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = queryLang || headerList.get("x-lang") || cookieStore.get("lang")?.value || "ru";

  if (!post) {
    return {
      title: "Статья не найдена",
    };
  }

  const title = {
    ru: post.titleRu,
    uk: post.titleUk,
    en: post.titleEn,
  }[lang as "ru" | "uk" | "en"] || post.titleRu;

  const excerpt = {
    ru: post.excerptRu,
    uk: post.excerptUk,
    en: post.excerptEn,
  }[lang as "ru" | "uk" | "en"] || post.excerptRu;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/blog/${slug}${lang !== "ru" ? `?lang=${lang}` : ""}`;

  return {
    title,
    description: excerpt.substring(0, 150),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/blog/${slug}`,
        ru: `${baseUrl}/blog/${slug}`,
        uk: `${baseUrl}/blog/${slug}?lang=uk`,
        en: `${baseUrl}/blog/${slug}?lang=en`,
      },
    },
    openGraph: {
      title,
      description: excerpt.substring(0, 150),
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: post.imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt.substring(0, 150),
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = ((headerList.get("x-lang") || cookieStore.get("lang")?.value) as "ru" | "uk" | "en") || "ru";

  if (!post) {
    notFound();
  }

  const title = {
    ru: post.titleRu,
    uk: post.titleUk,
    en: post.titleEn,
  }[lang] || post.titleRu;

  const category = {
    ru: post.categoryRu,
    uk: post.categoryUk,
    en: post.categoryEn,
  }[lang] || post.categoryRu;

  const contentParagraphs = {
    ru: post.contentRu,
    uk: post.contentUk,
    en: post.contentEn,
  }[lang] || post.contentRu;

  const excerpt = {
    ru: post.excerptRu,
    uk: post.excerptUk,
    en: post.excerptEn,
  }[lang] || post.excerptRu;

  // Join paragraphs for markdown rendering
  const fullContent = Array.isArray(contentParagraphs) ? contentParagraphs.join('\n\n') : contentParagraphs;

  // Fetch all posts to determine related ones
  const blogPosts = await getBlogPosts();

  // Filter out current post to find related ones
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && (p.categoryRu === post.categoryRu || p.categoryEn === post.categoryEn))
    .slice(0, 3);

  // If no related posts in same category, just take first 3 posts
  const finalRelated = relatedPosts.length ? relatedPosts : blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const backLinkText = {
    ru: "Назад в блог",
    uk: "Назад до блогу",
    en: "Back to Blog",
  }[lang];

  const relatedTitleText = {
    ru: "Похожие статьи",
    uk: "Схожі статті",
    en: "Related Articles",
  }[lang];

  const readMoreText = {
    ru: "Читать далее",
    uk: "Читати далі",
    en: "Read More",
  }[lang];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatokaresort.com";
  const canonicalUrl = `${baseUrl}/blog/${slug}${lang !== "ru" ? `?lang=${lang}` : ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": post.imageUrl,
    "datePublished": post.date,
    "description": excerpt,
    "author": {
      "@type": "Organization",
      "name": "Zatoka Resort"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zatoka Resort",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/og-image.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-950 text-slate-100 min-h-screen pb-20">
      {/* Article Header Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end justify-start overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.imageUrl}
            alt={title}
            fill
            className="object-cover scale-100 opacity-60 brightness-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-12 z-10 max-w-4xl">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLinkText}</span>
            </Link>
          </div>

          <div className="inline-flex bg-teal-500/20 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs font-semibold rounded-lg px-2.5 py-1 mb-4">
            {category}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} мин чтения
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-card-dark border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative">
          <div className="prose prose-invert prose-teal max-w-none text-slate-200 font-light text-lg md:text-xl leading-relaxed prose-headings:font-bold prose-headings:text-white prose-headings:mt-12 prose-headings:mb-6 prose-p:mb-8 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {fullContent}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="container mx-auto px-4 py-8 max-w-5xl border-t border-white/5 mt-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center md:text-left">
          {relatedTitleText}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {finalRelated.map((rel) => {
            const relTitle = {
              ru: rel.titleRu,
              uk: rel.titleUk,
              en: rel.titleEn,
            }[lang] || rel.titleRu;

            const relCategory = {
              ru: rel.categoryRu,
              uk: rel.categoryUk,
              en: rel.categoryEn,
            }[lang] || rel.categoryRu;

            return (
              <article
                key={rel.slug}
                className="flex flex-col rounded-2xl overflow-hidden glass-card-dark border border-white/5 hover:border-teal-500/40 hover-lift transition-smooth group"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={rel.imageUrl}
                    alt={relTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs font-medium rounded px-2 py-0.5 shadow-md">
                    {relCategory}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {relTitle}
                  </h3>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="inline-flex items-center gap-1.5 text-teal-300 text-xs font-semibold group/btn"
                  >
                    <span>{readMoreText}</span>
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
    </>
  );
}
