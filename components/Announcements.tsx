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
    <section id="announcements" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          {t('title')}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
              <Megaphone size={32} className="text-foreground/70" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground/90">{t('latest')}</h3>
            <p className="text-muted-foreground/70 text-base">{t('noAnnouncements')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
