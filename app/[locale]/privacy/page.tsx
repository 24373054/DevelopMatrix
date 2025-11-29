import LegalPage from '@/components/LegalPage';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  return {
    title: `${t('title')} - Ke Entropy Technology`,
    description: t('intro')
  };
}

export default function PrivacyPage() {
  return <LegalPage translationNamespace="legal.privacy" />;
}
