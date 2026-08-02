import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, Calendar, ArrowRight, Compass, Waves } from "lucide-react";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import BackgroundBubbles from "@/components/decorative/BackgroundBubbles";
import { getBlogPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const { category } = await searchParams;

  const titles = {
    ru: "Блог и полезные советы | Отдых в Затоке",
    uk: "Блог та корисні поради | Відпочинок в Затоці",
    en: "Blog & Travel Tips | Zatoka Resort",
  };

  const currentYear = new Date().getFullYear();

  const descriptions = {
    ru: `Полезные статьи и советы для отдыха в Затоке ${currentYear}. Узнайте про отели у моря, рестораны, уютные номера, развлечения и секреты прямого бронирования без переплат.`,
    uk: `Корисні статті та поради для відпочинку в Затоці ${currentYear}. Дізнайтеся про готелі біля моря, ресторани, затишні номери, розваги та секрети прямого бронювання без переплат.`,
    en: `Helpful travel tips and guides for your Zatoka vacation ${currentYear}. Explore seaside hotels, comfortable rooms, dining options, and direct booking tips.`,
  };

  const categorySuffix = category ? `?category=${category}` : "";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zatoka-hotel.com";
  const canonicalPath = `${baseUrl}/${lang}/blog${categorySuffix}`;
  const title = titles[lang as keyof typeof titles] || titles.ru;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.ru;

  const keywords = {
    ru: ["блог затока", "новости затоки", "советы туристам затока", "отдых в затоке статьи", "гид по затоке"],
    uk: ["блог затока", "новини затоки", "поради туристам затока", "відпочинок в затоці статті", "гід по затоці"],
    en: ["zatoka blog", "zatoka travel guide", "black sea vacation tips", "zatoka resort news"]
  };

  return {
    title,
    description,
    keywords: keywords[lang as keyof typeof keywords] || keywords.ru,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "x-default": `${baseUrl}/ru/blog${categorySuffix}`,
        ru: `${baseUrl}/ru/blog${categorySuffix}`,
        uk: `${baseUrl}/uk/blog${categorySuffix}`,
        en: `${baseUrl}/en/blog${categorySuffix}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "Zatoka Resort",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { lang } = await params;
  const blogPosts = await getBlogPosts();

  const { search = "", category = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const POSTS_PER_PAGE = 6;

  // Translation helpers
  const allTranslations = {
    ru: {
      blogTitle: "Блог и полезные советы",
      searchPlaceholder: "Поиск статей...",
      allCategories: "Все категории",
      readMore: "Читать далее",
      noArticles: "Статьи не найдены.",
      readTimeSuffix: "мин",
      prev: "Назад",
      next: "Вперед",
      heroBadge: "Блог и советы",
      heroTitle1: "Истории &",
      heroTitle2: "путеводитель",
      heroDesc: "Полезные статьи, скрытые жемчужины побережья и лайфхаки для безупречного отпуска. Читайте и вдохновляйтесь.",
      card1Title: "События",
      card1Desc: "и мероприятия",
      card2Title: "Гид по региону",
      card2Desc: "куда сходить",
    },
    uk: {
      blogTitle: "Блог та корисні поради",
      searchPlaceholder: "Пошук статей...",
      allCategories: "Всі категорії",
      readMore: "Читати далі",
      noArticles: "Статті не знайдено.",
      readTimeSuffix: "хв",
      prev: "Назад",
      next: "Вперед",
      heroBadge: "Блог та поради",
      heroTitle1: "Історії &",
      heroTitle2: "путівник",
      heroDesc: "Корисні статті, приховані перлини узбережжя та лайфхаки для бездоганної відпустки. Читайте та надихайтесь.",
      card1Title: "Події",
      card1Desc: "та заходи",
      card2Title: "Гід по регіону",
      card2Desc: "куди піти",
    },
    en: {
      blogTitle: "Blog & Helpful Tips",
      searchPlaceholder: "Search articles...",
      allCategories: "All Categories",
      readMore: "Read More",
      noArticles: "No articles found.",
      readTimeSuffix: "min",
      prev: "Previous",
      next: "Next",
      heroBadge: "Blog & Tips",
      heroTitle1: "Stories &",
      heroTitle2: "travel guide",
      heroDesc: "Helpful articles, hidden coastal gems, and life hacks for a flawless vacation. Read and get inspired.",
      card1Title: "Events",
      card1Desc: "and activities",
      card2Title: "Region Guide",
      card2Desc: "where to go",
    },
  };

  const translations = allTranslations[lang as "ru" | "uk" | "en"] || allTranslations.ru;

  // Get unique categories (in current language)
  const categoriesMap = blogPosts.map((post) => {
    const category = lang === "en" ? post.categoryEn : lang === "uk" ? post.categoryUk : post.categoryRu;
    const categoryEn = post.categoryEn || "activities";
    return {
      display: category,
      slug: categoryEn.toLowerCase(),
    };
  });

  const uniqueCategories = Array.from(
    new Map(categoriesMap.map((item) => [item.slug, item])).values()
  );

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const title = lang === "en" ? post.titleEn : lang === "uk" ? post.titleUk : post.titleRu;
    const excerpt = lang === "en" ? post.excerptEn : lang === "uk" ? post.excerptUk : post.excerptRu;
    const categoryEn = post.categoryEn || "activities";

    const postTitle = title.toLowerCase();
    const postExcerpt = excerpt.toLowerCase();
    const postCategorySlug = categoryEn.toLowerCase();

    const matchesSearch =
      !search ||
      postTitle.includes(search.toLowerCase()) ||
      postExcerpt.includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || postCategorySlug === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const activePage = Math.min(currentPage, totalPages || 1);
  const paginatedPosts = filteredPosts.slice(
    (activePage - 1) * POSTS_PER_PAGE,
    activePage * POSTS_PER_PAGE
  );

  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    params.set("page", pageNumber.toString());
    return `/${lang}/blog?${params.toString()}`;
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-12">
      {/* --- PREMIUM SPLIT HERO HEADER --- */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-slate-950 pt-24 sm:pt-28 lg:pt-32">
        <BackgroundBubbles count={15} />
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
            alt="Beach background"
            fill
            className="object-cover scale-105 animate-float-slow opacity-50"
            priority
          />
          {/* Gradient fade to right to allow text on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-8 items-center h-full pt-10 pb-12">
          
          <div className="flex flex-col items-start text-left animate-fade-in-up space-y-8 max-w-xl">
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-md">
              <Compass className="h-4 w-4" />
              <span>{translations.heroBadge}</span>
            </div>

            {/* Premium Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight [text-shadow:_0_10px_40px_rgb(0_0_0_/_80%)]">
              <span className="block mb-2">{translations.heroTitle1}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400 drop-shadow-sm">
                {translations.heroTitle2}
              </span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
              {translations.heroDesc}
            </p>
          </div>
          
          {/* Decorative Right Area */}
          <div className="hidden lg:flex flex-col justify-center items-end gap-6 relative h-full">
             <div className="glass-card-dark p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float-slow max-w-[280px] w-full backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{translations.card1Title}</h3>
                    <p className="text-slate-400 text-sm">{translations.card1Desc}</p>
                  </div>
                </div>
             </div>
             
             <div className="glass-card-dark p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float max-w-xs w-full backdrop-blur-xl mr-12 delay-150">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{translations.card2Title}</h3>
                    <p className="text-slate-400 text-xs">{translations.card2Desc}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Elegant Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-px">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-24 fill-slate-950 scale-x-[-1]">
            <path d="M0,60 C300,20 600,100 900,60 C1050,40 1125,50 1200,60 L1200,120 L0,120 Z" className="opacity-30 fill-teal-200/10" />
            <path d="M0,80 C300,40 600,120 900,80 C1050,60 1125,70 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Main Blog Catalog Area */}
      <section className="container mx-auto px-4 mt-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
          {/* Category Selector Links */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Link
              href={`/${lang}/blog?category=all${search ? `&search=${search}` : ""}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${category === "all"
                ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/20 font-bold"
                : "bg-slate-900/80 border border-white/5 text-slate-300 hover:bg-slate-800"
                }`}
            >
              {translations.allCategories}
            </Link>
            {uniqueCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${lang}/blog?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${category === cat.slug
                  ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/20 font-bold"
                  : "bg-slate-900/80 border border-white/5 text-slate-300 hover:bg-slate-800"
                  }`}
              >
                {cat.display}
              </Link>
            ))}
          </div>

          {/* Search bar (native form submitting to GET /blog) */}
          <form method="GET" action={`/${lang}/blog`} className="relative w-full md:w-80">
            {category !== "all" && (
              <input type="hidden" name="category" value={category} />
            )}
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder={translations.searchPlaceholder}
              className="w-full bg-slate-900/80 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </form>
        </div>

        {/* Grid of articles */}
        {paginatedPosts.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => {
                const title = lang === "en" ? post.titleEn : lang === "uk" ? post.titleUk : post.titleRu;
                const excerpt = lang === "en" ? post.excerptEn : lang === "uk" ? post.excerptUk : post.excerptRu;
                const postCatDisplay = lang === "en" ? post.categoryEn : lang === "uk" ? post.categoryUk : post.categoryRu;

                return (
                  <article
                    key={post.slug}
                    className="flex flex-col rounded-3xl overflow-hidden glass-card-dark border border-white/10 shadow-2xl hover-lift transition-smooth hover:border-teal-500/40 group"
                  >
                    {/* Cover Image */}
                    <div className="relative h-[220px] w-full overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-smooth duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/40 text-xs font-semibold rounded-lg px-2.5 py-1 shadow-lg">
                        {postCatDisplay}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime} {translations.readTimeSuffix}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">
                          {title}
                        </h2>
                        <p className="text-slate-300 text-base font-light leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      </div>

                      <div>
                        <Link
                          href={`/${lang}/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-teal-300 hover:text-teal-200 font-medium text-sm group/btn"
                        >
                          <span>{translations.readMore}</span>
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Link
                  href={buildPageUrl(activePage - 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/5 ${activePage > 1
                    ? "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "bg-slate-900/40 text-slate-600 pointer-events-none"
                    }`}
                >
                  {translations.prev}
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={buildPageUrl(pageNum)}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ${pageNum === activePage
                      ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                      : "bg-slate-900/80 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                <Link
                  href={buildPageUrl(activePage + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/5 ${activePage < totalPages
                    ? "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "bg-slate-900/40 text-slate-600 pointer-events-none"
                    }`}
                >
                  {translations.next}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 glass-card-dark border border-white/5 rounded-3xl">
            <Compass className="h-12 w-12 text-slate-500 mx-auto mb-4 animate-pulse" />
            <p className="text-slate-400 text-lg">
              {translations.noArticles}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
