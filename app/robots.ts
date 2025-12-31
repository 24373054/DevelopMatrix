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
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        crawlDelay: 1,
      }
    ],
    sitemap: 'https://develop.matrixlab.work/sitemap.xml',
    host: 'https://develop.matrixlab.work',
  };
}
