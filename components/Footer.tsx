'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { startTransition } from './PageTransition';

export default function Footer() {
  const t = useTranslations('footer');
  const router = useRouter();
  const locale = useLocale();

  const handleLinkClick = (e: React.MouseEvent, path: string, text: string) => {
    e.preventDefault();
    startTransition(text);
    // 延迟跳转，给动画展示时间，避免 Segment Mismatch
    setTimeout(() => {
      router.push(`/${locale}${path}`);
    }, 400);
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
            <a 
              href={`/${locale}/privacy`}
              onClick={(e) => handleLinkClick(e, '/privacy', t('privacy'))}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('privacy')}
            </a>
            <a 
              href={`/${locale}/terms`}
              onClick={(e) => handleLinkClick(e, '/terms', t('terms'))}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('terms')}
            </a>
            <a 
              href={`/${locale}/contact`}
              onClick={(e) => handleLinkClick(e, '/contact', t('contact'))}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('contact')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
