import LegalPage from '@/components/LegalPage';
import { getTranslations } from 'next-intl/server';
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  return {
    title: `${t('title')} - Ke Entropy Technology`,
    description: t('intro'),
    alternates: {
      canonical: generateCanonicalUrl(locale, 'privacy'),
      languages: generateHreflangAlternates({ path: 'privacy' }),
    },
  };
}

export default function PrivacyPage() {
  return <LegalPage translationNamespace="legal.privacy" />;
}
