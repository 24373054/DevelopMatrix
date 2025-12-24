'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import Image from 'next/image';

export default function Team() {
  const t = useTranslations('team');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showVeritasModal, setShowVeritasModal] = useState(false);
  const [showCassidyModal, setShowCassidyModal] = useState(false);

  return (
    <section id="team" className="min-h-screen flex items-center py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
            {t('intro')}
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          {/* Advisor Card */}
          <motion.div
            onClick={() => setShowAdvisorModal(true)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="fusion-glass rounded-3xl p-8 md:p-12 hover:scale-[1.01] transition-all duration-500 group max-w-4xl w-full border border-foreground/5 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-foreground/30">QZ</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-1 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Advisor</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t('advisor.name')}</h3>
                </div>
                
                <p className="text-sm font-medium text-foreground/60 mb-6 uppercase tracking-wider">
                  {t('advisor.title')}
                </p>

                <p className="text-muted-foreground/90 leading-relaxed text-lg font-light">
                  {t('advisor.shortIntro')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Founder Card */}
          <motion.a
            href="https://yz.matrixlab.work/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="fusion-glass rounded-3xl p-8 md:p-12 hover:scale-[1.01] transition-all duration-500 group max-w-4xl w-full border border-foreground/5"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-2xl">
                  <Image
                    src="/team/sealwax.png"
                    alt="Seal Wax"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-1 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Founder</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t('founder.name')}</h3>
                  <ExternalLink size={20} className="text-muted-foreground/50 group-hover:text-foreground/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                
                <p className="text-sm font-medium text-foreground/60 mb-6 uppercase tracking-wider">
                  {t('founder.title')}
                </p>

                <p className="text-muted-foreground/90 leading-relaxed text-lg font-light">
                  {t('founder.desc')}
                </p>
              </div>
            </div>
          </motion.a>

          {/* Veritas Card */}
          <motion.div
            onClick={() => setShowVeritasModal(true)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="fusion-glass rounded-3xl p-8 md:p-12 hover:scale-[1.01] transition-all duration-500 group max-w-4xl w-full border border-foreground/5 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-foreground/30">V</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-1 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Member</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t('veritas.name')}</h3>
                </div>
                
                <p className="text-sm font-medium text-foreground/60 mb-6 uppercase tracking-wider">
                  {t('veritas.title')}
                </p>

                <p className="text-muted-foreground/90 leading-relaxed text-lg font-light">
                  {t('veritas.about')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cassidy Card */}
          <motion.div
            onClick={() => setShowCassidyModal(true)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="fusion-glass rounded-3xl p-8 md:p-12 hover:scale-[1.01] transition-all duration-500 group max-w-4xl w-full border border-foreground/5 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-foreground/30">C</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-1 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Member</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t('cassidy.name')}</h3>
                </div>
                
                <p className="text-sm font-medium text-foreground/60 mb-6 uppercase tracking-wider">
                  {t('cassidy.title')}
                </p>

                <p className="text-muted-foreground/90 leading-relaxed text-lg font-light">
                  {t('cassidy.about')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Advisor Detail Modal */}
      <AnimatePresence>
        {showAdvisorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdvisorModal(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-foreground/10 relative shadow-2xl"
            >
              <button
                onClick={() => setShowAdvisorModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X size={24} className="text-foreground/70" />
              </button>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-foreground/30">QZ</span>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t('advisor.name')}
                  </h3>
                  <p className="text-lg font-medium text-foreground/60 mb-4 uppercase tracking-wider">
                    {t('advisor.title')}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-muted-foreground/90 leading-relaxed">
                <p className="text-lg">{t('advisor.background')}</p>
                <p className="text-lg">{t('advisor.research')}</p>
                <p className="text-lg">{t('advisor.lab')}</p>
                <p className="text-lg">{t('advisor.vision')}</p>
                <p className="text-lg">{t('advisor.contact')}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Veritas Detail Modal */}
      <AnimatePresence>
        {showVeritasModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVeritasModal(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-foreground/10 relative shadow-2xl"
            >
              <button
                onClick={() => setShowVeritasModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X size={24} className="text-foreground/70" />
              </button>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-foreground/30">V</span>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t('veritas.name')}
                  </h3>
                  <p className="text-lg font-medium text-foreground/60 mb-4 uppercase tracking-wider">
                    {t('veritas.title')}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-muted-foreground/90 leading-relaxed">
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t('veritas.aboutLabel')}</h4>
                  <p className="text-lg">{t('veritas.about')}</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t('veritas.skillsLabel')}</h4>
                  <p className="text-lg">{t('veritas.skills')}</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t('veritas.contactLabel')}</h4>
                  <p className="text-lg">{t('veritas.contact')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cassidy Detail Modal */}
      <AnimatePresence>
        {showCassidyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCassidyModal(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-foreground/10 relative shadow-2xl"
            >
              <button
                onClick={() => setShowCassidyModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X size={24} className="text-foreground/70" />
              </button>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-foreground/30">C</span>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t('cassidy.name')}
                  </h3>
                  <p className="text-lg font-medium text-foreground/60 mb-4 uppercase tracking-wider">
                    {t('cassidy.title')}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-muted-foreground/90 leading-relaxed">
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t('cassidy.aboutLabel')}</h4>
                  <p className="text-lg">{t('cassidy.about')}</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t('cassidy.skillsLabel')}</h4>
                  <p className="text-lg">{t('cassidy.skills')}</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t('cassidy.contactLabel')}</h4>
                  <p className="text-lg">{t('cassidy.contact')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
