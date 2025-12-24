'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function DeveloperPage() {
  const t = useTranslations('developer');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const wechatId = 'YZ2315766973';

  const handleCopyAndOpenWechat = async () => {
    try {
      // 复制微信号到剪贴板
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      
      // 3秒后重置复制状态
      setTimeout(() => setCopied(false), 3000);
      
      // 尝试打开微信（仅在移动端有效）
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // 尝试打开微信 App
        window.location.href = 'weixin://';
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
          {t('backToHome')}
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 二维码展示 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="fusion-glass rounded-3xl p-8 border border-foreground/5 flex flex-col items-center justify-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">{t('qrTitle')}</h3>
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-foreground/10 shadow-xl">
              <Image
                src="/wechat-qr.jpg"
                alt="WeChat QR Code"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground mt-6 text-center">{t('qrDesc')}</p>
          </motion.div>

          {/* 微信号复制 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="fusion-glass rounded-3xl p-8 border border-foreground/5 flex flex-col items-center justify-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">{t('wechatTitle')}</h3>
            
            <div className="w-full max-w-sm space-y-6">
              <div className="bg-foreground/5 rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">{t('wechatIdLabel')}</p>
                <p className="text-2xl font-bold text-foreground font-mono">{wechatId}</p>
              </div>

              <button
                onClick={handleCopyAndOpenWechat}
                className="w-full px-8 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 group"
              >
                {copied ? (
                  <>
                    <Check size={20} className="animate-bounce" />
                    <span>{t('copied', { id: wechatId })}</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} className="group-hover:scale-110 transition-transform" />
                    <span>{t('copyButton')}</span>
                  </>
                )}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">{t('step1')}</p>
                <p className="text-sm text-muted-foreground">{t('step2')}</p>
                <p className="text-sm text-muted-foreground">{t('step3')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 提示信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">{t('note')}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
