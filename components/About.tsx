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
    <section id="about" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-foreground/90">{t('title')}</h2>
          <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
            {t('content')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
