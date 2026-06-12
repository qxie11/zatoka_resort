import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, Calendar, ArrowRight, Compass, Waves } from "lucide-react";
import { WavyUnderline } from "@/components/ui/wavy-underline";
import { getBlogPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string; lang?: string }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { lang: queryLang, category } = await searchParams;
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = queryLang || headerList.get("x-lang") || cookieStore.get("lang")?.value || "ru";

  const titles = {
    ru: "Блог и полезные советы | Отдых в Затоке",
    uk: "Блог та корисні поради | Відпочинок в Затоці",
    en: "Blog & Travel Tips | Zatoka Resort",
  };

  const descriptions = {
    ru: "Читайте последние новости, путеводители, гастрономические гиды и полезные советы для идеального отдыха в Затоке.",
    uk: "Читайте останні новини, путівники, гастрономічні гіди та корисні поради для ідеального відпочинку в Затоці.",
    en: "Read the latest news, travel guides, seafood recommendations, and helpful tips for a perfect holiday in Zatoka.",
  };

  const categorySuffix = category ? `?category=${category}` : "";
  const categoryAndLangUk = category ? `?category=${category}&lang=uk` : "?lang=uk";
  const categoryAndLangEn = category ? `?category=${category}&lang=en` : "?lang=en";
  const canonicalPath = `/blog${categorySuffix}${lang !== "ru" ? (categorySuffix ? `&lang=${lang}` : `?lang=${lang}`) : ""}`;

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ru: `/blog${categorySuffix}`,
        uk: `/blog${categoryAndLangUk}`,
        en: `/blog${categoryAndLangEn}`,
      },
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const blogPosts = await getBlogPosts();
  const headerList = await headers();
  const cookieStore = await cookies();
  const lang = ((headerList.get("x-lang") || cookieStore.get("lang")?.value) as "ru" | "uk" | "en") || "ru";

  const { search = "", category = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const POSTS_PER_PAGE = 6;

  // Translation helpers
  const translations = {
    ru: {
      blogTitle: "Блог и полезные советы",
      searchPlaceholder: "Поиск статей...",
      allCategories: "Все категории",
      readMore: "Читать далее",
      noArticles: "Статьи не найдены.",
      readTimeSuffix: "мин",
      prev: "Назад",
      next: "Вперед",
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
    },
  }[lang];

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
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Beach background"
            fill
            className="object-cover scale-105 animate-float-slow opacity-65 brightness-[0.6]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Waves decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute top-1/4 left-10 animate-float">
            <Waves className="h-24 w-24 text-teal-300" />
          </div>
          <div className="absolute bottom-1/4 right-10 animate-float-slow" style={{ animationDelay: "3s" }}>
            <Waves className="h-20 w-20 text-sky-300" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 text-center z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark text-xs font-semibold text-teal-300 uppercase tracking-widest animate-fade-in mb-6">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>{translations.blogTitle}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300 drop-shadow-md py-2 px-1">
            {translations.blogTitle}
          </h1>
          <WavyUnderline colorClassName="text-teal-300" />
        </div>
      </section>

      {/* Main Blog Catalog Area */}
      <section className="container mx-auto px-4 mt-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
          {/* Category Selector Links */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Link
              href={`/blog?category=all${search ? `&search=${search}` : ""}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                category === "all"
                  ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/20 font-bold"
                  : "bg-slate-900/80 border border-white/5 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {translations.allCategories}
            </Link>
            {uniqueCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  category === cat.slug
                    ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/20 font-bold"
                    : "bg-slate-900/80 border border-white/5 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {cat.display}
              </Link>
            ))}
          </div>

          {/* Search bar (native form submitting to GET /blog) */}
          <form method="GET" action="/blog" className="relative w-full md:w-80">
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
                    <div className="relative h-48 w-full overflow-hidden">
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
                          href={`/blog/${post.slug}`}
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/5 ${
                    activePage > 1
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
                    className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ${
                      pageNum === activePage
                        ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                        : "bg-slate-900/80 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                <Link
                  href={buildPageUrl(activePage + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/5 ${
                    activePage < totalPages
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
          <div className="text-center py-20 glass-card-dark border border-white/5 rounded-3xl">
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
