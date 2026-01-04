import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://develop.matrixlab.work';
  
  // 定义所有支持的语言和路径
  const languages = ['zh', 'en'];
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/developers', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/developer', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/products/exchange', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/products/trace', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/products/game', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/blog/web3-security-trends-2025', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog/smart-contract-audit-guide', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog/defi-risk-management', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog/benign-arbitrage-theory', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 为每个语言生成条目
  for (const lang of languages) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
      });
    }
  }

  return sitemapEntries;
}
