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
            className="glass rounded-2xl p-8 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 group max-w-md w-full"
          >
            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-foreground/10 transition-colors duration-300">
              <User size={40} className="text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-foreground/90">{t('founder.title')}</h3>
                <ExternalLink size={18} className="text-muted-foreground/50 group-hover:text-foreground/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>
              <p className="text-muted-foreground/80 text-sm">{t('founder.name')}</p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
