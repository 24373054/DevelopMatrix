import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AgentContent from '@/components/Products/AgentContent';
import { Metadata } from 'next';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'agent.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'blockchain forensics, AML, risk control, OTC security, USDT tracking, crypto compliance, on-chain analysis, 区块链取证, 反洗钱, 风控, OTC安全, USDT追踪, 加密合规, 链上分析',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Ke Entropy Technology',
      url: `https://develop.matrixlab.work/${locale}/products/agent`,
      images: [
        {
          url: 'https://develop.matrixlab.work/og-agent.jpg',
          width: 1200,
          height: 630,
          alt: 'MatrixAgent - Blockchain Forensics AI',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: generateCanonicalUrl(locale, 'products/agent'),
      languages: generateHreflangAlternates({ path: 'products/agent' }),
    },
  };
}

export default function AgentPage({ params: { locale } }: { params: { locale: string } }) {
  const agentJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MatrixAgent",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US',
    "description": locale === 'zh'
      ? "专业的区块链取证 AI 智能体，专注于链上风险评估、交易追踪和智能合约审计"
      : "Professional blockchain forensics AI agent for on-chain risk assessment, transaction tracking and smart contract auditing",
    "url": "https://agent.matrixlab.work",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentJsonLd) }}
      />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      <div className="relative z-10">
        <AgentContent />
      </div>
      <Footer />
    </main>
  );
}
