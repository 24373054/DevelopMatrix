'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Megaphone } from 'lucide-react';

export default function Announcements() {
  const t = useTranslations('announcements');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="announcements" className="min-h-screen flex items-center py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-foreground"
        >
          {t('title')}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fusion-glass rounded-3xl p-10 md:p-16 border border-foreground/5"
        >
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mb-8">
              <Megaphone size={36} className="text-foreground/60" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground tracking-tight">{t('latest')}</h3>
            <p className="text-muted-foreground/60 text-lg">{t('noAnnouncements')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
