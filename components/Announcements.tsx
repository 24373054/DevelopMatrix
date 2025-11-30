'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Megaphone, Calendar, ChevronRight, X } from 'lucide-react';

export default function Announcements() {
  const t = useTranslations('announcements');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 解决 next-intl 数组获取问题
  useEffect(() => {
    const loadedItems = [];
    // 尝试获取前3条公告，如果没有则停止
    for (let i = 0; i < 3; i++) {
      try {
        // 这是一个hack，因为next-intl不直接支持返回数组对象，只能通过key索引
        const title = t(`items.${i}.title`);
        // 更稳健的检查：如果返回的字符串包含 items.i.title，说明没有翻译
        if (!title || title.includes(`items.${i}.title`)) break;
        
        loadedItems.push({
          id: i,
          date: t(`items.${i}.date`),
          title: title,
          summary: t(`items.${i}.summary`)
        });
      } catch (e) {
        break;
      }
    }
    setItems(loadedItems);
  }, [t]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="announcements" className="min-h-screen flex items-center py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-center tracking-tight text-foreground"
        >
          {t('title')}
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemAnim}
              onClick={() => setSelectedItem(item)}
              className="fusion-glass rounded-3xl p-8 border border-foreground/5 group hover:border-foreground/10 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground/80 font-medium bg-foreground/5 px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground text-foreground group-hover:text-background transition-colors duration-300">
                  <Megaphone size={16} />
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground tracking-tight group-hover:text-foreground/90 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground/80 leading-relaxed mb-6 line-clamp-4">
                {item.summary}
              </p>

              <div className="flex items-center text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors mt-auto pt-4 border-t border-foreground/5">
                <span>Read Detail</span>
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Announcement Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60]"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl max-h-[80vh] overflow-y-auto fusion-glass rounded-3xl p-8 md:p-12 border border-foreground/10 shadow-2xl pointer-events-auto relative"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 transition-colors"
                >
                  <X size={24} className="text-foreground/60" />
                </button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground/80 font-medium bg-foreground/5 px-3 py-1 rounded-full w-fit mb-6">
                  <Calendar size={14} />
                  <span>{selectedItem.date}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground tracking-tight">
                  {selectedItem.title}
                </h3>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {selectedItem.summary}
                  </p>
                  {/* 这里未来可以添加 content 字段来显示更详细的内容 */}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
