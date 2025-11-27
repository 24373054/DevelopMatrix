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
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            {t('subtitle')}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <button
            onClick={scrollToAbout}
            className="px-8 py-3 rounded-lg glass hover:bg-muted/50 transition-all duration-300 border border-border"
          >
            {t('cta')}
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
