'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // 监听路由变化
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800); // 模拟加载完成
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // 监听自定义事件（用于锚点跳转）
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    window.addEventListener('loader-start', handleStart);
    window.addEventListener('loader-stop', handleStop);

    return () => {
      window.removeEventListener('loader-start', handleStart);
      window.removeEventListener('loader-stop', handleStop);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.8, opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left pointer-events-none"
        >
          {/* 进度条主体 - 冷白/灰色 */}
          <div className="absolute inset-0 bg-foreground/80 shadow-[0_0_10px_rgba(var(--foreground),0.5)]" />
          
          {/* 头部光晕 - 模拟极光流光 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-[4px] bg-white/50 blur-[4px] shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 辅助函数：手动触发加载条
export const startLoader = () => {
  window.dispatchEvent(new Event('loader-start'));
};

export const stopLoader = () => {
  setTimeout(() => {
    window.dispatchEvent(new Event('loader-stop'));
  }, 600); // 延迟结束，让动画跑一会儿
};
