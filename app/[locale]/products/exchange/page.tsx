import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ExchangeContent from '@/components/Products/ExchangeContent';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'exchange.metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ExchangePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black pointer-events-none" />
      
      <Navigation />
      <div className="relative z-10">
        <ExchangeContent />
      </div>
      <Footer />
    </main>
  );
}
