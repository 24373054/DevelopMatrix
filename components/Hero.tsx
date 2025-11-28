'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.03),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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
            className="px-8 py-3 rounded-lg glass hover:shadow-lg hover:scale-105 transition-all duration-500 group"
          >
            <span className="relative inline-flex items-center">
              {t('cta')}
              <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={32} className="text-muted-foreground" />
      </motion.button>
    </section>
  );
}
