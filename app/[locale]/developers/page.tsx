import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DeveloperContent from '@/components/Developers/DeveloperContent';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'developers.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'Web3 development, blockchain API, SDK, developer tools, smart contracts, DApp development, Web3开发, 区块链API, 开发者工具, 智能合约',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Ke Entropy Technology',
      url: `https://develop.matrixlab.work/${locale}/developers`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `/${locale}/developers`,
      languages: {
        'en': '/en/developers',
        'zh': '/zh/developers',
      },
    },
  };
}

export default function DevelopersPage({ params: { locale } }: { params: { locale: string } }) {
  const labJsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    "name": "Matrix Lab",
    "description": locale === 'zh'
      ? "专注于区块链技术研究与开发的实验室，致力于推动 Web3 技术创新"
      : "Research lab focused on blockchain technology and Web3 innovation",
    "url": "https://matrixlab.work",
    "parentOrganization": {
      "@type": "Organization",
      "name": "刻熵科技",
      "url": "https://develop.matrixlab.work"
    },
    "member": {
      "@type": "Person",
      "name": "张沁楠",
      "jobTitle": "Academic Advisor & Assistant Professor",
      "affiliation": {
        "@type": "Organization",
        "name": "北京航空航天大学人工智能学院"
      }
    },
    "knowsAbout": [
      "Blockchain Security",
      "Web3 Technology",
      "Smart Contracts",
      "DeFi",
      "AI-powered Security"
    ]
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(labJsonLd) }}
      />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      <div className="relative z-10">
        <DeveloperContent />
      </div>
      <Footer />
    </main>
  );
}
