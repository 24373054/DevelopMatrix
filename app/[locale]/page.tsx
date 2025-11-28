import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Business from '@/components/Business';
import Announcements from '@/components/Announcements';
import Links from '@/components/Links';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Business />
      <Announcements />
      <Links />
      <Footer />
    </main>
  );
}
