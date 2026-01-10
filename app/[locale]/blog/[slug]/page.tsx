import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/Blog/ArticleContent';
import AISummary from '@/components/Blog/AISummary';
import QASection from '@/components/Blog/QASection';
import Citations from '@/components/Blog/Citations';
import { Metadata } from 'next';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  generateEnhancedSchema,
  extractCoreConcepts,
  extractMentionedTechnologies,
  determineArticleSeries,
} from '@/lib/geo/schemaGenerator';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';
import type { AISummary as AISummaryType, QAPair, Citation } from '@/types/geo';

// Generate static params for all article pages
export async function generateStaticParams() {
  // Common articles available in both languages
  const commonArticles = [
    'web3-security-trends-2025',
    'smart-contract-audit-guide',
    'defi-risk-management',
    'benign-arbitrage-theory',
    'otc-compliance-aml-imperative',  // English version of OTC article
    'did-the-id-for-ai-agents',  // English version of DID article
    'dao-blockchain-s-communist-vision',  // English version of DAO article
    'privacy-computing-s-role-in-blockchain-era',  // English version of 隐私计算在区块链时代的真正意义与商业价值
    'global-web3-regulatory-trends-compliance-guide',  // English version of 全球Web3监管趋势与企业上链合规指南
    'smart-contract-authorization-hidden-asset-risks'  // English version of 你的私钥没丢，资产却没了？深挖智能合约授权的“隐形陷阱”
  ];
  
  // Chinese-only articles
  const zhOnlyArticles = [
    'otc的尽头是合规化-反洗钱正成为行业亟须',  // Chinese version of OTC article
    'didai-agent的身份证',  // Chinese version of DID article
    '把dao打造成区块链的共产主义',  // Chinese version of DAO article
    '隐私计算在区块链时代的真正意义与商业价值',  // Chinese version of 隐私计算在区块链时代的真正意义与商业价值
    '全球web3监管趋势与企业上链合规指南',  // Chinese version of 全球Web3监管趋势与企业上链合规指南
    '你的私钥没丢资产却没了深挖智能合约授权的隐形陷阱'  // Chinese version of 你的私钥没丢，资产却没了？深挖智能合约授权的“隐形陷阱”
  ];

  const params = [];
  
  // Add common articles for both locales
  for (const locale of ['zh', 'en']) {
    for (const slug of commonArticles) {
      params.push({ locale, slug });
    }
  }
  
  // Add Chinese-only articles
  for (const slug of zhOnlyArticles) {
    params.push({ locale: 'zh', slug });
  }

  return params;
}

export async function generateMetadata({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const { unstable_setRequestLocale } = await import('next-intl/server');
  unstable_setRequestLocale(locale);
  
  // Decode the slug if it's URL encoded
  const decodedSlug = decodeURIComponent(slug);
  
  const t = await getTranslations({ locale, namespace: `blog.articles.${decodedSlug}` });
  
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
      canonical: generateCanonicalUrl(locale, `blog/${slug}`),
      languages: generateHreflangAlternates({ path: `blog/${slug}` }),
    },
  };
}

export default async function BlogArticlePage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  const { unstable_setRequestLocale } = await import('next-intl/server');
  unstable_setRequestLocale(locale);
  
  // Decode the slug if it's URL encoded
  const decodedSlug = decodeURIComponent(slug);
  
  const t = await getTranslations({ locale, namespace: `blog.articles.${decodedSlug}` });
  const common = await getTranslations({ locale, namespace: 'blog' });

  // Get article data
  const aiSummary = t.raw('aiSummary') as AISummaryType | undefined;
  const qaPairs = t.raw('qaPairs') as QAPair[] | undefined;
  const citations = t.raw('citations') as Citation[] | undefined;
  const keywords = t('keywords');
  const category = t('category');
  
  // Get date and ensure ISO 8601 format
  const rawDate = t('date');
  const datePublished = rawDate.includes('T') ? rawDate : `${rawDate}T00:00:00Z`;
  const dateModified = datePublished; // Use same date if no modification date available

  // Extract GEO enhancements
  const coreConcepts = extractCoreConcepts(aiSummary, keywords);
  const mentionedTechnologies = extractMentionedTechnologies(keywords, aiSummary);
  const seriesName = determineArticleSeries(category, locale as 'zh' | 'en');

  // Generate enhanced Schema.org structured data
  const enhancedSchema = generateEnhancedSchema({
    slug: decodedSlug,
    title: t('title'),
    description: t('excerpt'),
    category,
    keywords,
    author: t('author'),
    authorBio: t('authorBio'),
    datePublished,
    dateModified,
    locale: locale as 'zh' | 'en',
    aiSummary,
    qaPairs,
    seriesName,
    mentionedTechnologies,
    coreConcepts,
  });

  // Add @context, @id, and mainEntityOfPage for complete JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@id': `https://develop.matrixlab.work/${locale}/blog/${decodedSlug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://develop.matrixlab.work/${locale}/blog/${decodedSlug}`,
    },
    ...enhancedSchema,
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 transition-colors duration-300">
      {/* Preload hero image */}
      <link rel="preload" as="image" href={`/blog-images/${decodedSlug}-hero.png`} type="image/png" />
      
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
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12 group bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <Image
                src={`/blog-images/${decodedSlug}-hero.png`}
                alt={t('title')}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
              />
              {/* 底部渐变遮罩 */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>

          {/* AI Summary - Placed after Featured Image, before Article Content */}
          <div className="max-w-4xl mb-16">
            {aiSummary && (
              <AISummary summary={aiSummary} />
            )}
            
            {/* Visual separator */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Article Content</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
            </div>
          </div>

          {/* Article Content with TOC - 移除宽度限制 */}
          <ArticleContent content={t.raw('content')} />

          <div className="max-w-4xl">
            {/* Q&A Section - Placed after Article Content, before Citations */}
            {qaPairs && Array.isArray(qaPairs) && qaPairs.length > 0 && (
              <QASection 
                qaPairs={qaPairs} 
                title={locale === 'zh' ? '常见问题解答' : 'Frequently Asked Questions'}
                subtitle={locale === 'zh' ? '深入解答核心问题' : 'In-depth answers to key questions'}
              />
            )}

            {/* Citations Section - Placed after Q&A, before Author Bio */}
            {citations && citations.length > 0 && (
              <Citations 
                citations={citations}
                title={locale === 'zh' ? '参考文献与引用' : 'References & Citations'}
                subtitle={locale === 'zh' ? '本文引用的外部资源和参考文献' : 'External resources and references cited in this article'}
              />
            )}

            {/* Author Bio */}
            <div className="mt-12 fusion-glass rounded-2xl p-8 border border-foreground/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
              <h3 className="text-xl font-bold text-foreground mb-4 relative">{common('aboutAuthor')}</h3>
              <div className="flex items-start gap-4 relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 ring-2 ring-blue-500/20">
                  <User size={32} className="text-blue-500/50" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">{t('author')}</p>
                  <p className="text-sm text-muted-foreground">{t('authorBio')}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 fusion-glass rounded-2xl p-8 md:p-12 border border-foreground/5 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {common('cta.title')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {common('cta.description')}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  {common('cta.button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
