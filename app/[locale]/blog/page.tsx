import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogList from '@/components/Blog/BlogList';
import { Metadata } from 'next';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'Web3 blog, blockchain technology, smart contract security, DeFi analysis, Web3技术博客, 区块链技术, 智能合约安全, DeFi分析',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Ke Entropy Technology',
      url: `https://develop.matrixlab.work/${locale}/blog`,
    },
    alternates: {
      canonical: generateCanonicalUrl(locale, 'blog'),
      languages: generateHreflangAlternates({ path: 'blog' }),
    },
  };
}

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": locale === 'zh' ? "刻熵科技技术博客" : "Ke Entropy Technology Blog",
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US',
    "description": locale === 'zh' 
      ? "分享Web3、区块链安全、DeFi等领域的技术见解和行业动态"
      : "Technical insights on Web3, blockchain security, DeFi and industry trends",
    "url": `https://develop.matrixlab.work/${locale}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "刻熵科技",
      "logo": {
        "@type": "ImageObject",
        "url": "https://develop.matrixlab.work/logo.png"
      }
    },
    "blogPost": [
      {
        "@type": "BlogPosting",
        "headline": locale === 'zh' ? "OTC的尽头是合规化，反洗钱正成为行业亟须" : "OTC Compliance: AML Becoming Industry Imperative",
        "url": locale === 'zh' 
          ? `https://develop.matrixlab.work/${locale}/blog/otc的尽头是合规化-反洗钱正成为行业亟须`
          : `https://develop.matrixlab.work/${locale}/blog/otc-compliance-aml-imperative`,
        "datePublished": "2026-01-10"
      },
      {
        "@type": "BlogPosting",
        "headline": locale === 'zh' ? "良性套利论：当\"贪婪\"成为去中心化世界的稳定器" : "Benign Arbitrage Theory: When 'Greed' Becomes the Stabilizer of Decentralized World",
        "url": `https://develop.matrixlab.work/${locale}/blog/benign-arbitrage-theory`,
        "datePublished": "2026-01-04"
      },
      {
        "@type": "BlogPosting",
        "headline": locale === 'zh' ? "2025年Web3安全趋势展望" : "Web3 Security Trends 2025",
        "url": `https://develop.matrixlab.work/${locale}/blog/web3-security-trends-2025`,
        "datePublished": "2024-12-30"
      },
      {
        "@type": "BlogPosting",
        "headline": locale === 'zh' ? "智能合约审计完全指南" : "Complete Guide to Smart Contract Auditing",
        "url": `https://develop.matrixlab.work/${locale}/blog/smart-contract-audit-guide`,
        "datePublished": "2024-12-28"
      },
      {
        "@type": "BlogPosting",
        "headline": locale === 'zh' ? "DeFi风险管理最佳实践" : "DeFi Risk Management Best Practices",
        "url": `https://develop.matrixlab.work/${locale}/blog/defi-risk-management`,
        "datePublished": "2024-12-25"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-40 invert dark:invert-0 transition-all duration-300" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none transition-colors duration-300" />
      
      <Navigation />
      <div className="relative z-10">
        <BlogList />
      </div>
      <Footer />
    </main>
  );
}
