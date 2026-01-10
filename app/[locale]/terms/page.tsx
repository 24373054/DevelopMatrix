import LegalPage from '@/components/LegalPage';
import { getTranslations } from 'next-intl/server';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  return {
    title: `${t('title')} - Ke Entropy Technology`,
    description: t('intro'),
    alternates: {
      canonical: generateCanonicalUrl(locale, 'terms'),
      languages: generateHreflangAlternates({ path: 'terms' }),
    },
  };
}

export default function TermsPage() {
  return <LegalPage translationNamespace="legal.terms" />;
}
