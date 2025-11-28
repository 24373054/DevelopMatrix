'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const t = useTranslations('nav');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-2xl/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-lg font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105"
            >
              刻熵科技
            </button>
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm hover:text-foreground/80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-foreground/30 hover:after:w-full after:transition-all after:duration-300"
              >
                {t('about')}
              </button>
              <button
                onClick={() => scrollToSection('business')}
                className="text-sm hover:text-foreground/80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-foreground/30 hover:after:w-full after:transition-all after:duration-300"
              >
                {t('business')}
              </button>
              <button
                onClick={() => scrollToSection('announcements')}
                className="text-sm hover:text-foreground/80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-foreground/30 hover:after:w-full after:transition-all after:duration-300"
              >
                {t('announcements')}
              </button>
              <button
                onClick={() => scrollToSection('links')}
                className="text-sm hover:text-foreground/80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-foreground/30 hover:after:w-full after:transition-all after:duration-300"
              >
                {t('links')}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}
