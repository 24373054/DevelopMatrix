import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameContent from '@/components/Products/GameContent';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'game.metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function GamePage({ params: { locale } }: { params: { locale: string } }) {
  const gameJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": locale === 'zh' ? "瀛州纪" : "Immortal Ledger",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web Browser",
    "description": locale === 'zh'
      ? "基于区块链的元宇宙游戏，融合传统文化与Web3技术"
      : "Blockchain-based metaverse game combining traditional culture with Web3 technology",
    "url": "https://immortal.matrixlab.work",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2026-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "ratingCount": "100",
      "bestRating": "5",
      "worstRating": "1"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      <div className="relative z-10">
        <GameContent />
      </div>
      <Footer />
    </main>
  );
}
