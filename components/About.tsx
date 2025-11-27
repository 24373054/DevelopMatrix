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
          <h2 className="text-4xl md:text-5xl font-bold mb-8">{t('title')}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('content')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
