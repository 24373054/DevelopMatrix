'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

export default function BlogList() {
  const t = useTranslations('blog');
  const locale = useLocale();

  // 分类映射：中文 -> 英文 key
  const categoryMap: Record<string, string> = {
    '安全': 'security',
    '教程': 'tutorial',
    '研究': 'research',
    '分析': 'analysis',
    'Security': 'security',
    'Tutorial': 'tutorial',
    'Research': 'research',
    'Analysis': 'analysis',
  };

  // 动态读取所有文章
  const articles = useMemo(() => {
    try {
      const articlesData = t.raw('articles');
      if (!articlesData || typeof articlesData !== 'object') {
        return [];
      }

      const articlesList = Object.keys(articlesData)
        .map((id) => {
          const article = articlesData[id];
          if (!article || typeof article !== 'object') {
            return null;
          }
          // 将中文分类转换为英文 key
          const rawCategory = article.category || 'analysis';
          const categoryKey = categoryMap[rawCategory] || rawCategory.toLowerCase();
          
          return {
            id,
            category: categoryKey,
            readTime: article.readTime || 10,
            date: article.datePublished || article.date || '2024-01-01',
          };
        })
        .filter((article): article is NonNullable<typeof article> => article !== null);

      return articlesList.sort((a, b) => {
        // 按日期降序排序（最新的在前）
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } catch (error) {
      console.error('Error loading articles:', error);
      return [];
    }
  }, [t]);

  const categories = [
    { key: 'all', color: 'bg-blue-500' },
    { key: 'research', color: 'bg-cyan-500' },
    { key: 'security', color: 'bg-red-500' },
    { key: 'tutorial', color: 'bg-green-500' },
    { key: 'analysis', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="px-6 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium"
            >
              {t(`categories.${cat.key}`)}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link href={`/${locale}/blog/${article.id}`}>
                <div className="fusion-glass rounded-2xl overflow-hidden border border-foreground/5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group h-full flex flex-col hover:-translate-y-1">
                  {/* Featured Image Placeholder */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={`/blog-images/${article.id}-hero.png`}
                      alt={t(`articles.${article.id}.title`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* 装饰性渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={14} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t(`categories.${article.category}`)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
                      {t(`articles.${article.id}.title`)}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                      {t(`articles.${article.id}.excerpt`)}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-foreground/5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{article.readTime} {t('minRead')}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="fusion-glass rounded-3xl p-12 border border-foreground/5">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('cta.title')}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              {t('cta.button')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
