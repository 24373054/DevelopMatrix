'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, FlaskConical, Wallet, Gamepad2, Users, Github, User } from 'lucide-react';

const links = [
  { key: 'lab', icon: FlaskConical, url: 'https://matrixlab.work/' },
  { key: 'platform', icon: Wallet, url: 'https://exchange.matrixlab.work/' },
  { key: 'game', icon: Gamepad2, url: 'https://immortal.matrixlab.work/' },
  { key: 'community', icon: Users, url: 'https://open.matrixlab.work/' },
  { key: 'github', icon: Github, url: 'https://github.com/24373054/Web3-games' },
  { key: 'founder', icon: User, url: 'https://24373054.github.io/' }
];

export default function Links() {
  const t = useTranslations('links');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="links" className="min-h-screen flex items-center py-20">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Icon size={24} className="text-foreground" />
                  </div>
                  <span className="font-medium">{t(link.key)}</span>
                </div>
                <ExternalLink size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
