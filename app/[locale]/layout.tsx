import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Inter } from 'next/font/google';
import PageTransition from '@/components/PageTransition';
import CookieConsent from '@/components/CookieConsent';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import '@/app/globals.css';
import { Metadata } from 'next';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

const inter = Inter({ subsets: ['latin'] });

// Generate static params for all locales
export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
 
  return {
    title: {
      default: t('title'),
      template: '%s | 刻熵科技 Ke Entropy Technology'
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Ke Entropy Technology', url: 'https://develop.matrixlab.work' }],
    creator: 'Ke Entropy Technology',
    publisher: 'Ke Entropy Technology',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Ke Entropy Technology',
      url: 'https://develop.matrixlab.work',
      images: [
        {
          url: 'https://develop.matrixlab.work/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Ke Entropy Technology - Web3 Ecosystem',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['https://develop.matrixlab.work/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: new URL('https://develop.matrixlab.work'),
    alternates: {
      canonical: generateCanonicalUrl(locale, ''),
      languages: generateHreflangAlternates({ path: '' }),
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      other: {
        'baidu-site-verification': 'your-baidu-verification-code',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering for next-intl
  const { unstable_setRequestLocale } = await import('next-intl/server');
  unstable_setRequestLocale(locale);
  
  const messages = await getMessages();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "刻熵科技",
    "alternateName": "Ke Entropy Technology",
    "url": "https://develop.matrixlab.work",
    "logo": "https://develop.matrixlab.work/logo.png",
    "description": locale === 'zh' 
      ? "刻熵科技是一家致力于构建全景式 Web3 生态的综合性科技企业，涵盖 Matrix Lab 实验室、MATRIXLAB EXCHANGE 金融平台、MatrixTrace 区块链安全分析平台、MatrixAgent 链上风控系统及《瀛州纪》元宇宙游戏。"
      : "Ke Entropy Technology is a comprehensive Web3 enterprise, encompassing Matrix Lab, MATRIXLAB EXCHANGE, MatrixTrace blockchain security platform, MatrixAgent on-chain risk control system, and Immortal Ledger metaverse game.",
    "foundingDate": "2024",
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US',
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "北四环中路辅路238号柏彦大厦12F",
      "addressLocality": "北京市",
      "addressRegion": "海淀区",
      "postalCode": "100000",
      "addressCountry": "CN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "email": "24373054@buaa.edu.cn",
        "contactType": "customer support",
        "availableLanguage": ["Chinese", "English"]
      },
      {
        "@type": "ContactPoint",
        "email": "2315766973@qq.com",
        "contactType": "technical support",
        "availableLanguage": ["Chinese", "English"]
      }
    ],
    "sameAs": [
      "https://github.com/24373054/Web3-games",
      "https://matrixlab.work",
      "https://exchange.matrixlab.work",
      "https://immortal.matrixlab.work",
      "https://trace.matrixlab.work"
    ],
    "founder": {
      "@type": "Person",
      "name": "Seal Wax",
      "url": "https://yz.matrixlab.work"
    },
    "employee": [
      {
        "@type": "Person",
        "name": "张沁楠",
        "alternateName": "Qinnan Zhang",
        "jobTitle": "Academic Advisor & Assistant Professor",
        "affiliation": {
          "@type": "Organization",
          "name": "北京航空航天大学人工智能学院"
        },
        "email": "zhangqn@buaa.edu.cn"
      }
    ],
    "knowsAbout": [
      "Web3",
      "Blockchain",
      "区块链",
      "Cryptocurrency",
      "加密货币",
      "DeFi",
      "去中心化金融",
      "NFT",
      "GameFi",
      "Metaverse",
      "元宇宙",
      "Smart Contracts",
      "智能合约",
      "Blockchain Security",
      "区块链安全",
      "AI",
      "人工智能"
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    }
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US',
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === 'zh' ? "首页" : "Home",
        "item": `https://develop.matrixlab.work/${locale}`
      }
    ]
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "刻熵科技",
    "alternateName": "Ke Entropy Technology",
    "url": "https://develop.matrixlab.work",
    "inLanguage": locale === 'zh' ? 'zh-CN' : 'en-US',
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://develop.matrixlab.work/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Convert locale to BCP 47 compliant language code
  const langCode = locale === 'zh' ? 'zh-CN' : 'en-US';

  return (
    <html lang={langCode} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="刻熵科技" />
        
        {/* DNS 预取和预连接 */}
        <link rel="dns-prefetch" href="https://matrixlab.work" />
        <link rel="dns-prefetch" href="https://exchange.matrixlab.work" />
        <link rel="dns-prefetch" href="https://trace.matrixlab.work" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
        />
        <div className="ambient-light" />
        <PageTransition />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
