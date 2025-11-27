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
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
              <Megaphone size={40} className="text-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t('latest')}</h3>
            <p className="text-muted-foreground text-lg">{t('noAnnouncements')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
