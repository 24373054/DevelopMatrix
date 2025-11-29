'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { startTransition } from './PageTransition';

export default function Footer() {
  const t = useTranslations('footer');

  const handleLinkClick = (text: string) => {
    startTransition(text);
  };

  return (
    <footer className="border-t border-border/40 py-12 mt-20 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {t('copyright')}
            </p>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=11010802046489"
              rel="noreferrer"
              target="_blank"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Image
                src="/beian-icon.png"
                alt="备案图标"
                width={20}
                height={20}
                className="inline-block opacity-80"
              />
              {t('beian')}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium">
            <Link 
              href="/privacy" 
              onClick={() => handleLinkClick(t('privacy'))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link 
              href="/terms" 
              onClick={() => handleLinkClick(t('terms'))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('terms')}
            </Link>
            <Link 
              href="/contact" 
              onClick={() => handleLinkClick(t('contact'))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
