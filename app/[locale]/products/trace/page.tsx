import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import TraceContent from '@/components/Products/TraceContent';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'trace.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'blockchain security, crypto tracking, fund tracing, blockchain forensics, AI fraud detection, 区块链安全, 链上追踪, 资金追踪, 区块链取证, AI欺诈检测',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Ke Entropy Technology',
      url: `https://develop.matrixlab.work/${locale}/products/trace`,
      images: [
        {
          url: 'https://develop.matrixlab.work/og-trace.jpg',
          width: 1200,
          height: 630,
          alt: 'MatrixTrace - Blockchain Security Analysis',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `/${locale}/products/trace`,
      languages: {
        'en': '/en/products/trace',
        'zh': '/zh/products/trace',
      },
    },
  };
}

export default function TracePage({ params: { locale } }: { params: { locale: string } }) {
  const traceJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MatrixTrace",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Web Browser",
    "description": locale === 'zh'
      ? "AI驱动的区块链安全分析平台，提供资金追踪和欺诈检测服务"
      : "AI-powered blockchain security analysis platform for fund tracking and fraud detection",
    "url": "https://trace.matrixlab.work",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(traceJsonLd) }}
      />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      <div className="relative z-10">
        <TraceContent />
      </div>
      <Footer />
    </main>
  );
}
