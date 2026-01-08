'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // 解析标题并添加 ID
    const headingElements = contentRef.current.querySelectorAll('h2, h3, h4');
    const headingData: Heading[] = [];

    headingElements.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      headingData.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      });
    });

    setHeadings(headingData);

    // 设置第一个标题为默认激活
    if (headingData.length > 0) {
      setActiveId(headingData[0].id);
    }

    // 创建 IntersectionObserver 监听标题
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 找到所有正在显示的标题
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // 选择最上面的可见标题
          const topEntry = visibleEntries.reduce((top, entry) => {
            return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
          });
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // 观察所有标题
    headingElements.forEach((heading) => {
      observerRef.current?.observe(heading);
    });

    return () => {
      if (observerRef.current) {
        headingElements.forEach((heading) => {
          observerRef.current?.unobserve(heading);
        });
        observerRef.current.disconnect();
      }
    };
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 暂时禁用 observer 避免冲突
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const headerOffset = 120; // 导航栏高度 + 额外间距
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      
      // 立即更新激活状态
      setActiveId(id);
      setTocOpen(false);

      // 重新启用 observer
      setTimeout(() => {
        if (observerRef.current && contentRef.current) {
          const headingElements = contentRef.current.querySelectorAll('h2, h3, h4');
          headingElements.forEach((heading) => {
            observerRef.current?.observe(heading);
          });
        }
      }, 1000);
    }
  };

  return (
    <div className="relative">
      {/* 移动端目录按钮 */}
      {headings.length > 0 && (
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"
          aria-label="Toggle table of contents"
        >
          <List size={24} />
        </button>
      )}

      {/* 移动端目录弹窗 */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setTocOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-foreground/10 z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">目录</h3>
                <button
                  onClick={() => setTocOpen(false)}
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <nav>
                <ul className="space-y-1">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`text-left w-full py-2 px-3 rounded-lg transition-all text-sm ${
                          activeId === heading.id
                            ? 'bg-blue-500/10 text-blue-500 font-medium border-l-2 border-blue-500'
                            : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                        }`}
                        style={{ paddingLeft: `${(heading.level - 2) * 12 + 12}px` }}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 桌面端：左右布局 - 文章占据主要空间 */}
      <div className="relative max-w-6xl">
        {/* 文章内容区域 - 为右侧目录留出空间 */}
        <div className="lg:mr-48">
          <div className="fusion-glass rounded-2xl p-8 md:p-12 border border-foreground/5">
            <div
              ref={contentRef}
              className="article-content max-w-4xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {/* 桌面端侧边目录 - fixed 定位跟随视窗 */}
        {headings.length > 0 && (
          <aside 
            className="hidden lg:block fixed w-44" 
            style={{ 
              top: '6rem',
              right: 'max(1rem, calc((100vw - 1152px) / 2))'
            }}
          >
            <div className="relative h-[calc(100vh-8rem)]">
              {/* 目录内容 - 可滚动 */}
              <nav className="h-full overflow-y-auto scrollbar-hide pb-20">
                <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider px-3">
                  目录
                </h3>
                <ul className="space-y-1">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`text-left w-full py-2 px-3 rounded-lg transition-all text-sm relative ${
                          activeId === heading.id
                            ? 'text-blue-500 font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        style={{ paddingLeft: `${(heading.level - 2) * 12 + 12}px` }}
                      >
                        {activeId === heading.id && (
                          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r" />
                        )}
                        <span className="line-clamp-2 block">{heading.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* 底部渐变遮罩 - 固定在视窗底部 */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
