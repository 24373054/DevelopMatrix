'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, User } from 'lucide-react';

export default function Team() {
  const t = useTranslations('team');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="team" className="min-h-screen flex items-center py-20">
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
        <div className="flex justify-center">
          <motion.a
            href="https://24373054.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 group max-w-md w-full"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <User size={48} className="text-foreground" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{t('founder.title')}</h3>
                <ExternalLink size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-muted-foreground">{t('founder.name')}</p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
