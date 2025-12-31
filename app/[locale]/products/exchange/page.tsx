import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ExchangeContent from '@/components/Products/ExchangeContent';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'exchange.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'cryptocurrency exchange, digital asset trading, crypto trading platform, blockchain exchange, Bitcoin trading, Ethereum trading, 加密货币交易所, 数字资产交易, 区块链交易平台',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Ke Entropy Technology',
      url: `https://develop.matrixlab.work/${locale}/products/exchange`,
      images: [
        {
          url: 'https://develop.matrixlab.work/og-exchange.jpg',
          width: 1200,
          height: 630,
          alt: 'Matrix Lab Exchange',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `/${locale}/products/exchange`,
      languages: {
        'en': '/en/products/exchange',
        'zh': '/zh/products/exchange',
      },
    },
  };
}

export default function ExchangePage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      <div className="relative z-10">
        <ExchangeContent />
      </div>
      <Footer />
    </main>
  );
}
