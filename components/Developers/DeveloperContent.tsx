'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Code2, Shield, Globe, Terminal, Box, Users, ArrowRight, Github, FileText, Layers, FlaskConical } from 'lucide-react';

export default function DeveloperContent() {
  const t = useTranslations('developers');

  const features = [
    {
      key: 'consensus',
      icon: <Layers className="w-8 h-8 text-blue-400" />,
    },
    {
      key: 'privacy',
      icon: <Shield className="w-8 h-8 text-purple-400" />,
    },
    {
      key: 'interop',
      icon: <Globe className="w-8 h-8 text-green-400" />,
    },
  ];

  const resources = [
    {
      key: 'api',
      icon: <Terminal className="w-6 h-6" />,
      link: '#', // 暂无链接，可指向 GitHub 或 建设中页面
      cta: 'cta_docs'
    },
    {
      key: 'sdk',
      icon: <Box className="w-6 h-6" />,
      link: 'https://github.com/24373054', // 指向 GitHub
      cta: 'cta_github'
    },
    {
      key: 'community',
      icon: <Users className="w-6 h-6" />,
      link: '#', 
      cta: 'hero.cta_github' // 复用 key
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm md:text-base font-bold tracking-[0.2em] text-blue-400 uppercase mb-6">
              {t('hero.subtitle')}
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://matrixlab.work/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <FlaskConical size={20} />
                <span>{t('hero.cta_lab')}</span>
              </a>
              <a
                href="#"
                className="px-8 py-4 rounded-full bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors flex items-center gap-2"
              >
                <FileText size={20} />
                <span>{t('hero.cta_docs')}</span>
              </a>
              <a
                href="https://github.com/24373054"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/20 hover:bg-foreground/20 transition-colors flex items-center gap-2"
              >
                <Github size={20} />
                <span>{t('hero.cta_github')}</span>
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 bg-foreground/5">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-16 text-center"
          >
            {t('features.title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="fusion-glass p-8 rounded-3xl border border-foreground/10 hover:border-foreground/20 transition-colors"
              >
                <div className="mb-6 p-4 rounded-2xl bg-foreground/5 w-fit">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{t(`features.${item.key}.title`)}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`features.${item.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-16 text-center"
          >
            {t('resources.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-3 rounded-xl bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      {item.icon}
                    </div>
                    <ArrowRight className="text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{t(`resources.${item.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground mb-0">
                    {t(`resources.${item.key}.desc`)}
                  </p>
                </div>
                <a href={item.link} className="absolute inset-0 z-10" aria-label={t(`resources.${item.key}.title`)}></a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
