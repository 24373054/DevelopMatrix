'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const t = useTranslations('cookie');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查是否已经同意过
    const consented = localStorage.getItem('cookie-consent');
    if (!consented) {
      // 延迟显示，避免干扰首屏加载动画
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-50"
        >
          <div className="fusion-glass rounded-2xl p-6 border border-foreground/10 shadow-2xl backdrop-blur-xl bg-background/80">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-foreground/5 shrink-0">
                <Cookie size={24} className="text-foreground/80" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t('text')}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {t('accept')}
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 px-4 py-2 bg-foreground/5 text-foreground rounded-lg text-sm font-medium hover:bg-foreground/10 transition-colors"
                  >
                    {t('decline')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
