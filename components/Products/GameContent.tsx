'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Gamepad2, Coins, Users, ArrowRight, PlayCircle, Sparkles } from 'lucide-react';

export default function GameContent() {
  const t = useTranslations('game');

  const features = [
    {
      key: 'ownership',
      icon: <Coins className="w-10 h-10 text-amber-400" />,
    },
    {
      key: 'autonomous',
      icon: <Sparkles className="w-10 h-10 text-purple-400" />,
    },
    {
      key: 'community',
      icon: <Users className="w-10 h-10 text-green-400" />,
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
            <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {t('hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mt-2">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="https://immortal.matrixlab.work/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>{t('hero.cta_play')}</span>
                <ArrowRight size={20} />
              </a>
              <a
                href="https://open.matrixlab.work/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors flex items-center gap-2 backdrop-blur-sm"
              >
                <Users size={20} />
                <span>{t('hero.cta_community')}</span>
              </a>
            </div>
          </motion.div>

          {/* Visual/Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 w-full max-w-xl"
          >
             <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-foreground/10 shadow-2xl p-4 overflow-hidden group">
                {/* 游戏场景模拟 */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative h-full flex flex-col">
                  {/* 游戏标题栏 */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                       <Gamepad2 className="text-amber-400" size={20} />
                       <div className="text-sm font-bold text-amber-400">瀛州纪 · Immortal Ledger</div>
                    </div>
                    <div className="text-xs text-muted-foreground">On-Chain Civilization</div>
                  </div>
                  
                  {/* 游戏场景 */}
                  <div className="flex-1 relative bg-gradient-to-b from-amber-950/30 to-orange-950/30 rounded-lg overflow-hidden">
                    {/* 古风建筑剪影 */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* 漂浮的粒子效果 */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-400/60 animate-pulse" />
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-orange-400/60 animate-pulse delay-100" />
                    <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-yellow-400/60 animate-pulse delay-200" />
                    
                    {/* 中心图标 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/40 to-orange-500/40 border-2 border-amber-400/50 flex items-center justify-center backdrop-blur-sm">
                          <Sparkles className="text-amber-300" size={40} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 游戏信息栏 */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-muted-foreground">Players</div>
                      <div className="text-sm font-bold text-amber-400">1,234</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-muted-foreground">NFTs</div>
                      <div className="text-sm font-bold text-orange-400">5,678</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-xs text-muted-foreground">Blocks</div>
                      <div className="text-sm font-bold text-yellow-400">9,012</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute top-8 right-8 px-4 py-2 bg-black/80 backdrop-blur-xl border border-amber-500/30 rounded-xl flex items-center gap-2 shadow-xl">
                   <PlayCircle className="text-amber-400" size={16} />
                   <div className="text-xs font-bold text-amber-400">Play to Own</div>
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
