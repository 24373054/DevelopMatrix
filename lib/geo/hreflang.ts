/**
 * Hreflang Utility Functions
 * 
 * Generates proper hreflang alternate links for multilingual pages
 * according to Google's best practices and BCP 47 standards.
 */

const BASE_URL = 'https://develop.matrixlab.work';

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

export interface HreflangConfig {
  path: string;
  locales?: string[];
  includeDefault?: boolean;
}

/**
 * Generate hreflang alternates for a given path
 * 
 * @param config - Configuration object
 * @returns Object with languages and canonical URL
 */
export function generateHreflangAlternates(config: HreflangConfig) {
  const { path, locales = ['zh', 'en'], includeDefault = true } = config;
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Build alternates object
  const languages: Record<string, string> = {};
  
  // Add language-specific alternates
  locales.forEach(locale => {
    const langCode = locale === 'zh' ? 'zh-CN' : 'en-US';
    const url = `${BASE_URL}/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
    languages[langCode] = url;
  });
  
  // Add x-default (typically points to default language)
  if (includeDefault) {
    const defaultLocale = locales[0] || 'zh';
    languages['x-default'] = `${BASE_URL}/${defaultLocale}${cleanPath ? `/${cleanPath}` : ''}`;
  }
  
  return languages;
}

/**
 * Generate canonical URL for a given locale and path
 * 
 * @param locale - Current locale (zh or en)
 * @param path - Page path (without locale prefix)
 * @returns Canonical URL
 */
export function generateCanonicalUrl(locale: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
}

/**
 * Generate hreflang link tags for HTML head
 * Useful for manual insertion if needed
 * 
 * @param config - Configuration object
 * @returns Array of hreflang link objects
 */
export function generateHreflangLinks(config: HreflangConfig): HreflangAlternate[] {
  const { path, locales = ['zh', 'en'], includeDefault = true } = config;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  const links: HreflangAlternate[] = [];
  
  // Add language-specific links
  locales.forEach(locale => {
    const langCode = locale === 'zh' ? 'zh-CN' : 'en-US';
    const url = `${BASE_URL}/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
    links.push({
      hreflang: langCode,
      href: url,
    });
  });
  
  // Add x-default
  if (includeDefault) {
    const defaultLocale = locales[0] || 'zh';
    links.push({
      hreflang: 'x-default',
      href: `${BASE_URL}/${defaultLocale}${cleanPath ? `/${cleanPath}` : ''}`,
    });
  }
  
  return links;
}

/**
 * Validate hreflang URL format
 * 
 * @param url - URL to validate
 * @returns true if valid, false otherwise
 */
export function validateHreflangUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Check if URL is absolute and uses https
    return parsed.protocol === 'https:' && parsed.hostname === 'develop.matrixlab.work';
  } catch {
    return false;
  }
}

/**
 * Validate hreflang language code (BCP 47)
 * 
 * @param langCode - Language code to validate
 * @returns true if valid, false otherwise
 */
export function validateHreflangCode(langCode: string): boolean {
  // Accept standard language codes and x-default
  const validCodes = ['zh-CN', 'en-US', 'x-default', 'zh', 'en'];
  return validCodes.includes(langCode);
}
