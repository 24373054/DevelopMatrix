import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh'
});

export const config = {
  // Match only internationalized pathnames
  // Explicitly exclude the google verification file
  matcher: ['/((?!api|_next|_vercel|googleeb35aa150854bf0d\\.html|.*\\..*).*)']
};
