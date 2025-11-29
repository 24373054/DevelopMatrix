import LegalPage from '@/components/LegalPage';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  return {
    title: `${t('title')} - Ke Entropy Technology`,
    description: t('intro')
  };
}

export default function TermsPage() {
  return <LegalPage translationNamespace="legal.terms" />;
}
