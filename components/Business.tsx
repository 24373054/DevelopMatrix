'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Wallet, Gamepad2, Users, FlaskConical, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Business() {
  const t = useTranslations('business');
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const businessItems = [
    {
      key: 'lab',
      icon: FlaskConical,
      url: `/${locale}/developers`,
      internal: true
    },
    {
      key: 'exchange',
      icon: Wallet,
      url: `/${locale}/products/exchange`,
      internal: true
    },
    {
      key: 'trace',
      icon: Search,
      url: `/${locale}/products/trace`,
      internal: true
    },
    {
      key: 'blog',
      icon: BookOpen,
      url: `/${locale}/blog`,
      internal: true
    },
    {
      key: 'game',
      icon: Gamepad2,
      url: `/${locale}/products/game`,
      internal: true
    },
    {
      key: 'community',
      icon: Users,
      url: 'https://open.matrixlab.work/',
      internal: false
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName('spotlight-card');
    Array.from(cards).forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    });
  };

  return (
    <section 
      id="business" 
      className="min-h-screen flex items-center py-24"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-center tracking-tight text-foreground"
        >
          {t('title')}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 group">
          {businessItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.key}
                href={item.url}
                target={item.internal ? "_self" : "_blank"}
                rel={item.internal ? "" : "noopener noreferrer"}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="spotlight-card p-10 group/card"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover/card:bg-foreground/10 transition-colors duration-500">
                    <Icon size={28} className="text-foreground/60 group-hover/card:text-foreground transition-colors duration-500" />
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-foreground/90 group-hover/card:text-foreground transition-colors duration-500">{t(`${item.key}.title`)}</h3>
                    <ExternalLink size={20} className={`text-muted-foreground/40 group-hover/card:text-foreground/70 group-hover/card:translate-x-1 group-hover/card:-translate-y-1 transition-all duration-500 ${item.internal ? 'hidden' : ''}`} />
                  </div>
                  <p className="text-muted-foreground/70 text-base leading-relaxed group-hover/card:text-muted-foreground/90 transition-colors duration-500">{t(`${item.key}.description`)}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
