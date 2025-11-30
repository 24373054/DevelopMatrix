import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://matrixlab.work';
  
  // 定义所有支持的语言和路径
  const languages = ['zh', 'en'];
  const routes = [
    '',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const sitemapEntries = [];

  // 为每个语言生成条目
  for (const lang of languages) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
