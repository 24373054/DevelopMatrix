'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MapPin, Headphones, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();

  const contactInfo = [
    {
      key: 'address',
      icon: MapPin,
      color: 'text-blue-500'
    },
    {
      key: 'email',
      icon: Mail,
      color: 'text-purple-500'
    },
    {
      key: 'support',
      icon: Headphones,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="fusion-glass rounded-2xl p-8 border border-foreground/5 text-center hover:border-foreground/10 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-foreground/80" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  {t(`info.${item.key}.label`)}
                </h3>
                <p className="text-lg font-semibold text-foreground break-words">
                  {t(`info.${item.key}.value`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
