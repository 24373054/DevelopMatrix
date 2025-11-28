'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const t = useTranslations('about');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="min-h-screen flex items-center py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fusion-glass rounded-3xl p-8 md:p-16 border border-foreground/5"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground tracking-tight">{t('title')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-relaxed max-w-4xl">
            {t('content')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
