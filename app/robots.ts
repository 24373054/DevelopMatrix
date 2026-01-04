import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        crawlDelay: 1,
      }
    ],
    sitemap: 'https://develop.matrixlab.work/sitemap.xml',
  };
}
