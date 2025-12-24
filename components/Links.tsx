'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, FlaskConical, Wallet, Gamepad2, Users, Github, User } from 'lucide-react';
import Link from 'next/link';

export default function Links() {
  const t = useTranslations('links');
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const links = [
    { key: 'lab', icon: FlaskConical, url: 'https://matrixlab.work/', external: true },
    { key: 'platform', icon: Wallet, url: 'https://exchange.matrixlab.work/', external: true },
    { key: 'game', icon: Gamepad2, url: 'https://immortal.matrixlab.work/', external: true },
    { key: 'community', icon: Users, url: 'https://open.matrixlab.work/', external: true },
    { key: 'github', icon: Github, url: 'https://github.com/24373054/Web3-games', external: true },
    { key: 'founder', icon: User, url: `/${locale}/developer`, external: false }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName('spotlight-link-card');
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
      id="links" 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 group">
          {links.map((link, index) => {
            const Icon = link.icon;
            
            if (link.external) {
              return (
                <motion.a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="spotlight-card spotlight-link-card p-6 group/card flex items-center justify-between"
                >
                  <div className="relative z-10 flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center group-hover/card:bg-foreground/10 transition-colors duration-500">
                      <Icon size={22} className="text-foreground/60 group-hover/card:text-foreground transition-colors duration-500" />
                    </div>
                    <span className="font-medium text-foreground/90 text-lg group-hover/card:text-foreground transition-colors duration-500">{t(link.key)}</span>
                  </div>
                  <ExternalLink size={18} className="relative z-10 text-muted-foreground/40 group-hover/card:text-foreground/70 group-hover/card:translate-x-1 group-hover/card:-translate-y-1 transition-all duration-500" />
                </motion.a>
              );
            } else {
              return (
                <Link key={link.key} href={link.url}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="spotlight-card spotlight-link-card p-6 group/card flex items-center justify-between cursor-pointer"
                  >
                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center group-hover/card:bg-foreground/10 transition-colors duration-500">
                        <Icon size={22} className="text-foreground/60 group-hover/card:text-foreground transition-colors duration-500" />
                      </div>
                      <span className="font-medium text-foreground/90 text-lg group-hover/card:text-foreground transition-colors duration-500">{t(link.key)}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}
