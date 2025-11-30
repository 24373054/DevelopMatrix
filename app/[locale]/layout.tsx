import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Inter } from 'next/font/google';
import PageTransition from '@/components/PageTransition';
import CookieConsent from '@/components/CookieConsent';
import '@/app/globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
 
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale,
      siteName: 'Ke Entropy Technology',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    metadataBase: new URL('https://matrixlab.work'),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'zh': '/zh',
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
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ke Entropy Technology",
    "url": "https://matrixlab.work",
    "sameAs": [
      "https://github.com/24373054"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "24373054@buaa.edu.cn",
      "contactType": "customer support"
    }
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
