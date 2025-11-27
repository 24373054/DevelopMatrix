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
    url: 'https://matrixlab.work/'
  },
  {
    key: 'exchange',
    icon: Wallet,
    url: 'https://exchange.matrixlab.work/'
  },
  {
    key: 'game',
    icon: Gamepad2,
    url: 'https://immortal.matrixlab.work/'
  },
  {
    key: 'community',
    icon: Users,
    url: 'https://open.matrixlab.work/'
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
                className="glass rounded-2xl p-8 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:bg-foreground/10 transition-colors duration-300">
                  <Icon size={28} className="text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                </div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground/90">{t(`${item.key}.title`)}</h3>
                  <ExternalLink size={18} className="text-muted-foreground/50 group-hover:text-foreground/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                <p className="text-muted-foreground/80 text-sm leading-relaxed">{t(`${item.key}.description`)}</p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
