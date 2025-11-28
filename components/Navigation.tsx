'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const t = useTranslations('nav');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split('/')[1] || 'zh';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLocale = () => {
    const newLocale = currentLocale === 'zh' ? 'en' : 'zh';
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isMenuOpen ? 'fusion-glass border-b border-foreground/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-lg font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105 tracking-tight"
            >
              刻熵科技
            </button>
            <div className="hidden md:flex space-x-6">
              {['about', 'business', 'announcements', 'links'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-sm hover:text-foreground/80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-foreground/30 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={toggleLocale}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-all duration-300 hover:scale-110 flex items-center space-x-1"
                aria-label="Toggle language"
              >
                <Globe size={18} />
                <span className="text-sm">{currentLocale === 'zh' ? 'EN' : '中'}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-foreground/5 bg-background/80 backdrop-blur-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col">
              {['about', 'business', 'announcements', 'links'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-left py-2 px-2 text-base font-medium hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  {t(item)}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-foreground/5 mt-2 px-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={toggleLocale}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <Globe size={20} />
                  <span>{currentLocale === 'zh' ? 'English' : '中文'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
