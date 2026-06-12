import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/db";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleMetrics } from "@/components/blog/ArticleMetrics";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

function cleanTruncate(text: string, maxLength: number = 155): string {
  if (text.length <= maxLength) return text;
  const sub = text.substring(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  if (lastSpace > 100) {
    return sub.substring(0, lastSpace).replace(/[.,:;!?]+$/, "") + "...";
  }
  return sub + "...";
}

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = await getBlogPostBySlug(slug);

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
  const canonicalUrl = `${baseUrl}/${lang}/blog/${slug}`;
  const absoluteImageUrl = post.imageUrl.startsWith("http") ? post.imageUrl : `${baseUrl}${post.imageUrl}`;

  return {
    title,
    description: cleanTruncate(excerpt, 155),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/ru/blog/${slug}`,
        ru: `${baseUrl}/ru/blog/${slug}`,
        uk: `${baseUrl}/uk/blog/${slug}`,
        en: `${baseUrl}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description: cleanTruncate(excerpt, 155),
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: absoluteImageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanTruncate(excerpt, 155),
      images: [absoluteImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const post = await getBlogPostBySlug(slug);

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

  const fullContent = Array.isArray(contentParagraphs) ? contentParagraphs.join('\n\n') : contentParagraphs;

  const blogPosts = await getBlogPosts();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && (p.categoryRu === post.categoryRu || p.categoryEn === post.categoryEn))
    .slice(0, 3);

  const finalRelated = relatedPosts.length ? relatedPosts : blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

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
  const canonicalUrl = `${baseUrl}/${lang}/blog/${slug}`;
  const absoluteImageUrl = post.imageUrl.startsWith("http") ? post.imageUrl : `${baseUrl}${post.imageUrl}`;

  const homeLabel = { ru: "Главная", uk: "Головна", en: "Home" }[lang] || "Главная";
  const blogLabel = { ru: "Блог", uk: "Блог", en: "Blog" }[lang] || "Блог";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": absoluteImageUrl,
    "datePublished": post.date,
    "dateModified": post.updatedAt ? post.updatedAt.toISOString() : post.date,
    "description": cleanTruncate(excerpt, 155),
    "articleSection": category,
    "keywords": `${category}, hotel resort, zatoka, beachfront hotel`,
    "author": {
      "@type": "Organization",
      "name": "Zatoka Resort",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zatoka Resort",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": homeLabel,
        "item": baseUrl + (lang === "ru" ? "" : `/${lang}`)
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": blogLabel,
        "item": `${baseUrl}/${lang}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category,
        "item": `${baseUrl}/${lang}/blog?category=${(post.categoryEn || "activities").toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-slate-950 text-slate-100 min-h-screen pb-20">
      <section className="relative h-[60vh] min-h-[400px] flex items-end justify-start overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.imageUrl}
            alt={title}
            fill
            className="object-cover scale-105 opacity-60 brightness-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-12 z-10 max-w-4xl">
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-teal-200/90 font-medium">
            <Link
              href={`/${lang}`}
              className="hover:text-teal-300 hover:underline transition-colors"
            >
              {homeLabel}
            </Link>
            <span className="text-slate-500">/</span>
            <Link
              href={`/${lang}/blog`}
              className="hover:text-teal-300 hover:underline transition-colors"
            >
              {blogLabel}
            </Link>
            <span className="text-slate-500">/</span>
            <Link
              href={`/${lang}/blog?category=${(post.categoryEn || "activities").toLowerCase()}`}
              className="hover:text-teal-300 hover:underline transition-colors"
            >
              {category}
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400 font-light truncate max-w-[120px] md:max-w-xs" title={title}>
              {title}
            </span>
          </nav>

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
              <ArticleMetrics 
                postId={post.id} 
                initialViews={post.views} 
                initialLikes={post.likes} 
                variant="hero" 
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
          <div className="glass-card-dark border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative">
            <div className="prose prose-invert prose-teal max-w-none text-slate-200 font-light text-lg md:text-xl leading-relaxed prose-headings:font-bold prose-headings:text-white prose-headings:mt-12 prose-headings:mb-6 prose-p:mb-8 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-img:rounded-xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h2 {...props} />,
                }}
              >
                {fullContent}
              </ReactMarkdown>
            </div>
          </div>
          
          <ArticleMetrics 
            postId={post.id} 
            initialViews={post.views} 
            initialLikes={post.likes} 
            variant="bottom" 
          />
        </section>

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
                    href={`/${lang}/blog/${rel.slug}`}
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
