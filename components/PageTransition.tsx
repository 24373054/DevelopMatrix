'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon } from 'lucide-react'; // 使用一个抽象的几何图形作为Logo示意

export default function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');

  // 路由变化时触发（语言切换等）
  useEffect(() => {
    triggerTransition();
  }, [pathname, searchParams]);

  // 监听自定义跳转事件（用于页面内锚点切换）
  useEffect(() => {
    const handleStart = (e: CustomEvent) => {
      if (e.detail?.text) setText(e.detail.text); // 可选：根据跳转目标改变文字
      triggerTransition();
    };
    window.addEventListener('transition-start', handleStart as EventListener);
    return () => window.removeEventListener('transition-start', handleStart as EventListener);
  }, []);

  const triggerTransition = () => {
    setIsVisible(true);
    // 停留短暂时间后消失，给动画展示的机会
    setTimeout(() => {
      setIsVisible(false);
      setText('');
    }, 1200); 
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // 简约的淡出，或者可以用 y: '-100%' 做上滑效果
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 装饰背景纹理 */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(120,119,198,0.1)_0%,transparent_50%)] animate-spin-slow" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo 动画 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-2xl">
                <Hexagon size={32} strokeWidth={1.5} />
              </div>
              {/* 脉冲光晕 */}
              <div className="absolute inset-0 bg-foreground/30 blur-xl rounded-full animate-pulse" />
            </motion.div>

            {/* 文字 (可选) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-foreground font-medium tracking-[0.2em] text-sm uppercase"
            >
              {text || 'Ke Entropy'}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 辅助函数：触发转场
export const startTransition = (text?: string) => {
  window.dispatchEvent(new CustomEvent('transition-start', { detail: { text } }));
};
