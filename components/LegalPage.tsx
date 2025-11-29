'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageProps {
  translationNamespace: 'legal.privacy' | 'legal.terms';
}

export default function LegalPage({ translationNamespace }: LegalPageProps) {
  const t = useTranslations(translationNamespace);
  
  // 获取 sections 数组
  // 注意：next-intl 的 useTranslations 在处理数组时需要特殊技巧，或者我们直接遍历预定义的索引
  // 这里简化处理，假设我们知道有4个章节
  const sections = [0, 1, 2, 3].map(i => ({
    title: t(`sections.${i}.title`),
    content: t(`sections.${i}.content`)
  }));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="fusion-glass rounded-3xl p-8 md:p-12 border border-foreground/5">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {t('lastUpdated')}
          </p>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-8 text-foreground/90">
              {t('intro')}
            </p>
            
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h3>
                  <p className="text-muted-foreground/80 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
