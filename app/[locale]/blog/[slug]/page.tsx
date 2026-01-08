import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/Blog/ArticleContent';
import { Metadata } from 'next';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `blog.articles.${slug}` });
  
  return {
    title: t('title'),
    description: t('excerpt'),
    keywords: t('keywords'),
    authors: [{ name: t('author') }],
    openGraph: {
      title: t('title'),
      description: t('excerpt'),
      type: 'article',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      publishedTime: t('date'),
      authors: [t('author')],
    },
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
    },
  };
}

export default async function BlogArticlePage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  const t = await getTranslations({ locale, namespace: `blog.articles.${slug}` });
  const common = await getTranslations({ locale, namespace: 'blog' });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": t('title'),
    "description": t('excerpt'),
    "image": `https://develop.matrixlab.work/og-blog-${slug}.jpg`,
    "datePublished": t('date'),
    "dateModified": t('date'),
    "author": {
      "@type": "Person",
      "name": t('author'),
      "url": t('author') === 'Seal Wax' ? 'https://yz.matrixlab.work' : undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "刻熵科技",
      "logo": {
        "@type": "ImageObject",
        "url": "https://develop.matrixlab.work/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://develop.matrixlab.work/${locale}/blog/${slug}`
    },
    "keywords": t('keywords'),
    "articleSection": t('category'),
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US'
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      
      <article className="relative pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header 部分保持原有宽度限制 */}
          <div className="max-w-4xl">
            {/* Back Button */}
            <Link 
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {common('backToBlog')}
            </Link>

            {/* Article Header */}
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium uppercase tracking-wider">
                  {t('category')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                {t('title')}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{t('author')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{t('date')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{t('readTime')} {common('minRead')}</span>
                </div>
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Share2 size={16} />
                  <span>{common('share')}</span>
                </button>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-9xl opacity-20">📝</div>
            </div>
          </div>

          {/* Article Content with TOC - 移除宽度限制 */}
          <ArticleContent content={t.raw('content')} />

          <div className="max-w-4xl">
            {/* Author Bio */}
            <div className="mt-12 fusion-glass rounded-2xl p-8 border border-foreground/5">
              <h3 className="text-xl font-bold text-foreground mb-4">{common('aboutAuthor')}</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                  <User size={32} className="text-foreground/30" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">{t('author')}</p>
                  <p className="text-sm text-muted-foreground">{t('authorBio')}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 fusion-glass rounded-2xl p-8 md:p-12 border border-foreground/5 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {common('cta.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {common('cta.description')}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                {common('cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
