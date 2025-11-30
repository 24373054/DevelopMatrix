'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Scale, ArrowRight, PlayCircle, Activity } from 'lucide-react';

export default function ExchangeContent() {
  const t = useTranslations('exchange');

  const features = [
    {
      key: 'security',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
    },
    {
      key: 'performance',
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
    },
    {
      key: 'compliance',
      icon: <Scale className="w-10 h-10 text-blue-400" />,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {t('hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mt-2">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <span>{t('hero.cta_start')}</span>
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
                <PlayCircle size={20} />
                <span>{t('hero.cta_demo')}</span>
              </button>
            </div>
          </motion.div>

          {/* Visual/Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 w-full max-w-xl"
          >
             <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl p-4 overflow-hidden group">
                {/* 模拟交易界面 UI */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="relative h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500" />
                       <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">BTC/USDT • 24h Vol: $1.2B</div>
                  </div>
                  <div className="flex-1 flex gap-4">
                    <div className="flex-1 bg-white/5 rounded-lg p-4 animate-pulse"></div>
                    <div className="w-1/3 flex flex-col gap-2">
                       <div className="h-8 bg-green-500/20 rounded w-full"></div>
                       <div className="h-8 bg-red-500/20 rounded w-full"></div>
                       <div className="flex-1 bg-white/5 rounded mt-2"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-8 right-8 px-6 py-3 bg-black/80 backdrop-blur-xl border border-green-500/30 rounded-xl flex items-center gap-3 shadow-xl">
                   <Activity className="text-green-400" size={20} />
                   <div>
                      <div className="text-xs text-muted-foreground">System Status</div>
                      <div className="text-sm font-bold text-green-400">100% Uptime</div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/5 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {features.map((feature, index) => (
                  <motion.div
                    key={feature.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center md:text-left"
                  >
                     <div className="mb-6 inline-flex p-4 rounded-2xl bg-black border border-white/10 shadow-xl">
                        {feature.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-4">{t(`features.${feature.key}.title`)}</h3>
                     <p className="text-muted-foreground leading-relaxed">
                        {t(`features.${feature.key}.desc`)}
                     </p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
