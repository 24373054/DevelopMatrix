import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import dynamic from 'next/dynamic';

// 动态导入非首屏组件
const Business = dynamic(() => import('@/components/Business'), {
  loading: () => <div className="min-h-screen" />,
});
const Team = dynamic(() => import('@/components/Team'), {
  loading: () => <div className="min-h-screen" />,
});
const Announcements = dynamic(() => import('@/components/Announcements'), {
  loading: () => <div className="min-h-screen" />,
});
const Links = dynamic(() => import('@/components/Links'), {
  loading: () => <div className="min-h-screen" />,
});
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Business />
      <Team />
      <Announcements />
      <Links />
      <Footer />
    </main>
  );
}
