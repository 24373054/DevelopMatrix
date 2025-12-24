'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Brain, Network, ArrowRight, PlayCircle, Shield } from 'lucide-react';

export default function TraceContent() {
  const t = useTranslations('trace');

  const features = [
    {
      key: 'tracking',
      icon: <Search className="w-10 h-10 text-blue-400" />,
    },
    {
      key: 'ai',
      icon: <Brain className="w-10 h-10 text-purple-400" />,
    },
    {
      key: 'visualization',
      icon: <Network className="w-10 h-10 text-green-400" />,
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
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {t('hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-2">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="https://trace.matrixlab.work/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>{t('hero.cta_start')}</span>
                <ArrowRight size={20} />
              </a>
              <button className="px-8 py-4 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
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
             <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-foreground/10 shadow-2xl p-4 overflow-hidden group">
                {/* 模拟区块链追踪界面 */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="relative h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                       <Search className="text-cyan-400" size={16} />
                       <div className="text-xs text-muted-foreground font-mono">Address: 0x742d...3f8a</div>
                    </div>
                    <div className="text-xs text-cyan-400 font-mono">Live Tracking</div>
                  </div>
                  
                  {/* Network Graph Simulation */}
                  <div className="flex-1 relative bg-white/5 rounded-lg p-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                        <div className="absolute inset-4 rounded-full bg-cyan-500/40 animate-pulse" />
                        <div className="absolute inset-8 rounded-full bg-cyan-500 flex items-center justify-center">
                          <Network className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    {/* Connecting nodes */}
                    <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-blue-500/30 border-2 border-blue-500" />
                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-purple-500/30 border-2 border-purple-500" />
                    <div className="absolute bottom-8 left-16 w-12 h-12 rounded-full bg-green-500/30 border-2 border-green-500" />
                    <div className="absolute bottom-8 right-16 w-12 h-12 rounded-full bg-red-500/30 border-2 border-red-500" />
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-8 right-8 px-6 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl flex items-center gap-3 shadow-xl">
                   <Shield className="text-cyan-400" size={20} />
                   <div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                      <div className="text-sm font-bold text-cyan-400">Low Risk</div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-foreground/5 border-y border-foreground/5">
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
                     <div className="mb-6 inline-flex p-4 rounded-2xl bg-zinc-950 dark:bg-black border border-foreground/10 shadow-xl">
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
