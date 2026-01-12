'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import ChristmasDecoration from './ChristmasDecoration';

export default function Hero() {
  const t = useTranslations('hero');
  const tFeatured = useTranslations('featuredProduct');
  const locale = useLocale();
  const productUrl = `https://develop.matrixlab.work/${locale}/products/agent`;

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 w-full h-full bg-background" />
      
      {/* 圣诞背景图 - 优化加载 */}
      <div className="absolute inset-0 w-full h-full opacity-35 dark:opacity-25 overflow-hidden">
        <Image
          src="/christmas-bg.webp"
          alt="Christmas Background"
          fill
          className="object-cover"
          style={{ 
            width: '100%', 
            height: '100%',
            minWidth: '100vw',
            minHeight: '100vh'
          }}
          loading="eager"
          sizes="100vw"
          quality={75}
        />
      </div>
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.06),transparent_50%)]" />
      
      {/* 圣诞节特效背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.04),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.04),transparent_60%)]" />
      
      {/* 圣诞装饰 - 仅在首屏 */}
      <ChristmasDecoration />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 新年标题装饰 - 简化动画 */}
          <div className="mb-4 text-4xl md:text-5xl animate-pulse">
            🎆✨
          </div>
          
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-red-500/15 to-yellow-500/15 border border-red-500/30 dark:border-red-500/20 backdrop-blur-sm">
            <span className="text-sm md:text-base font-semibold bg-gradient-to-r from-red-600 to-yellow-600 dark:from-red-400 dark:to-yellow-400 bg-clip-text text-transparent">
              🎉 Happy New Year 2026 🧧
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4">
            {t('subtitle')}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto px-4">
            {t('description')}
          </p>
          <button
            onClick={scrollToAbout}
            aria-label={t('cta')}
            className="px-8 py-3 rounded-lg glass hover:shadow-lg hover:scale-105 transition-all duration-500 group relative overflow-hidden"
          >
            <span className="relative inline-flex items-center">
              {t('cta')}
              <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>

          {/* 最新产品推荐 */}
          <motion.a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/featured"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-red-500"
            >
              <Sparkles size={14} />
            </motion.span>
            <span>{tFeatured('badge')}</span>
            <span className="text-foreground font-medium">{tFeatured('productName')}</span>
            <ArrowRight size={14} className="group-hover/featured:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={32} className="text-muted-foreground" />
      </motion.button>
    </section>
  );
}
