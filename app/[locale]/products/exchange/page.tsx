import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ExchangeContent from '@/components/Products/ExchangeContent';
import { Metadata } from 'next';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

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
      canonical: generateCanonicalUrl(locale, 'products/exchange'),
      languages: generateHreflangAlternates({ path: 'products/exchange' }),
    },
  };
}

export default function ExchangePage({ params: { locale } }: { params: { locale: string } }) {
  const exchangeJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MATRIXLAB EXCHANGE",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US',
    "description": locale === 'zh'
      ? "去中心化金融交易平台，提供安全、高效的数字资产交易服务"
      : "Decentralized financial exchange platform for secure digital asset trading",
    "url": "https://exchange.matrixlab.work",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "刻熵科技",
      "url": "https://develop.matrixlab.work"
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(exchangeJsonLd) }}
      />
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
