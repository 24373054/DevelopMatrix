'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Wallet, Gamepad2, Users, FlaskConical } from 'lucide-react';

const businessItems = [
  {
    key: 'lab',
    icon: FlaskConical,
    url: 'https://matrixlab.work/',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    key: 'exchange',
    icon: Wallet,
    url: 'https://exchange.matrixlab.work/',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    key: 'game',
    icon: Gamepad2,
    url: 'https://immortal.matrixlab.work/',
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    key: 'community',
    icon: Users,
    url: 'https://open.matrixlab.work/',
    color: 'from-orange-500/20 to-red-500/20'
  }
];

export default function Business() {
  const t = useTranslations('business');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="business" className="min-h-screen flex items-center py-20">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <Icon size={32} className="text-foreground" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold">{t(`${item.key}.title`)}</h3>
                  <ExternalLink size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-muted-foreground">{t(`${item.key}.description`)}</p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
