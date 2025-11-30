'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function Team() {
  const t = useTranslations('team');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="team" className="min-h-screen flex items-center py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
            {t('intro')}
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.a
            href="https://24373054.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="fusion-glass rounded-3xl p-8 md:p-12 hover:scale-[1.01] transition-all duration-500 group max-w-4xl w-full border border-foreground/5"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-2xl">
                  <Image
                    src="/team/sealwax.png"
                    alt="Seal Wax"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-1 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Founder</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t('founder.name')}</h3>
                  <ExternalLink size={20} className="text-muted-foreground/50 group-hover:text-foreground/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                
                <p className="text-sm font-medium text-foreground/60 mb-6 uppercase tracking-wider">
                  {t('founder.title')}
                </p>

                <p className="text-muted-foreground/90 leading-relaxed text-lg font-light">
                  {t('founder.desc')}
                </p>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
