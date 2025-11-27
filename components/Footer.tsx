'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-sm text-muted-foreground text-center">
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
              className="inline-block"
            />
            {t('beian')}
          </a>
        </div>
      </div>
    </footer>
  );
}
