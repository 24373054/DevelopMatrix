'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import Image from 'next/image';

// 成员ID列表和对应的头像路径
const memberIds = [
  'zhanghuan',
  'liusiyu', 
  'wenxin',
  'yangyi',
  'yanghaofu',
  'wangyuhua',
  'lindaozhou',
  'denghanyue',
  'irpoun',
  'liuzhanbo',
  'yueyue',
  'duanjunkun',
  'veritas',
  'cassidy'
];

const memberPhotos: Record<string, string> = {
  zhanghuan: '/team/zhanghuan.jpg',
  liusiyu: '/team/liusiyu.jpeg',
  wenxin: '/team/wenxin.gif',
  yangyi: '/team/yangyi.jpeg',
  yanghaofu: '/team/yanghaofu.jpg',
  wangyuhua: '/team/wangyuhua.jpg',
  lindaozhou: '/team/lindaozhou.jpg',
  denghanyue: '/team/denghanyue.jpeg',
  irpoun: '/team/irpoun.jpeg',
  liuzhanbo: '/team/liuzhanbo.jpg',
  yueyue: '/team/yueyue.jpg',
  duanjunkun: '/team/duanjunkun.jpg',
  veritas: '',
  cassidy: ''
};

export default function Team() {
  const t = useTranslations('team');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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

        {/* Members Grid - 所有成员都以网格形式展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {/* Advisor Card */}
          <motion.div
            onClick={() => setShowAdvisorModal(true)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="fusion-glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-500 group border border-foreground/5 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-xl">
                  <Image
                    src="/team/zhangqinnan.jpg"
                    alt={t('advisor.name')}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/80">Advisor</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                {t('advisor.name')}
              </h3>
              <p className="text-xs font-medium text-foreground/60 mb-2">
                {t('advisor.title')}
              </p>
              <p className="text-sm text-muted-foreground/80 line-clamp-2">
                {t('advisor.shortIntro')}
              </p>
            </div>
          </motion.div>

          {/* Founder Card */}
          <motion.div
            onClick={() => setShowFounderModal(true)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="fusion-glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-500 group border border-foreground/5 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-xl">
                  <Image
                    src="/team/sealwax.jpg"
                    alt={t('founder.name')}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-foreground/10 shadow-lg">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/80">Founder</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                {t('founder.name')}
              </h3>
              <p className="text-xs font-medium text-foreground/60 mb-2">
                {t('founder.title')}
              </p>
              <p className="text-sm text-muted-foreground/80 line-clamp-2">
                {t('founder.desc')}
              </p>
            </div>
          </motion.div>

          {/* Other Members */}
          {memberIds.map((memberId, index) => {
            const photo = memberPhotos[memberId];
            const hasPhoto = photo && photo.length > 0;
            
            return (
              <motion.div
                key={memberId}
                onClick={() => setSelectedMemberId(memberId)}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                className="fusion-glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-500 group border border-foreground/5 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-foreground/20 transition-colors duration-300 shadow-xl">
                      {hasPhoto ? (
                        <Image
                          src={photo}
                          alt={t(`${memberId}.name`)}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-foreground/30">
                            {t(`${memberId}.name`).charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                    {t(`${memberId}.name`)}
                  </h3>
                  <p className="text-xs font-medium text-foreground/60 mb-2">
                    {t(`${memberId}.skills`)}
                  </p>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2">
                    {t(`${memberId}.about`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
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
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl">
                    <Image
                      src="/team/zhangqinnan.jpg"
                      alt={t('advisor.name')}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
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

      {/* Founder Detail Modal */}
      <AnimatePresence>
        {showFounderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFounderModal(false)}
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
                onClick={() => setShowFounderModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X size={24} className="text-foreground/70" />
              </button>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl">
                    <Image
                      src="/team/sealwax.jpg"
                      alt={t('founder.name')}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t('founder.name')}
                  </h3>
                  <p className="text-lg font-medium text-foreground/60 mb-4 uppercase tracking-wider">
                    {t('founder.title')}
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    {t('founder.education')}
                  </p>
                </div>
              </div>
              <div className="space-y-6 text-muted-foreground/90 leading-relaxed">
                <p className="text-lg">{t('founder.desc')}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
                  <a
                    href="https://yz.matrixlab.work/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} />
                    {t('founder.contact.website')}
                  </a>
                  <a
                    href={`mailto:${t('founder.contact.email')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium"
                  >
                    {t('founder.contact.email')}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMemberId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemberId(null)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-foreground/10 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedMemberId(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X size={24} className="text-foreground/70" />
              </button>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl mb-4">
                  {memberPhotos[selectedMemberId] ? (
                    <Image
                      src={memberPhotos[selectedMemberId]}
                      alt={t(`${selectedMemberId}.name`)}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground/30">
                        {t(`${selectedMemberId}.name`).charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
                  {t(`${selectedMemberId}.name`)}
                </h3>
                <p className="text-sm font-medium text-foreground/60 uppercase tracking-wider">
                  {t(`${selectedMemberId}.title`)}
                </p>
              </div>
              <div className="space-y-4 text-muted-foreground/90">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{t(`${selectedMemberId}.aboutLabel`)}</h4>
                  <p>{t(`${selectedMemberId}.about`)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{t(`${selectedMemberId}.skillsLabel`)}</h4>
                  <p>{t(`${selectedMemberId}.skills`)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{t(`${selectedMemberId}.contactLabel`)}</h4>
                  <p>{t(`${selectedMemberId}.contact`)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
