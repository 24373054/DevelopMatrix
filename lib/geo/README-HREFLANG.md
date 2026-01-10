# Hreflang Utility - Quick Reference

## Overview

This utility provides functions for generating proper hreflang alternate links for multilingual pages. It ensures compliance with BCP 47 standards and Google's hreflang guidelines.

## Quick Start

### Basic Usage

```typescript
import { generateHreflangAlternates, generateCanonicalUrl } from '@/lib/geo/hreflang';

export async function generateMetadata({ params: { locale } }) {
  return {
    title: 'Your Page Title',
    description: 'Your page description',
    alternates: {
      canonical: generateCanonicalUrl(locale, 'your/page/path'),
      languages: generateHreflangAlternates({ path: 'your/page/path' }),
    },
  };
}
```

## Functions

### `generateHreflangAlternates(config)`

Generates hreflang alternate links for a given path.

**Parameters**:
- `config.path` (string): Page path without locale prefix (e.g., 'blog/article-slug')
- `config.locales` (string[]): Optional. Array of locales. Default: ['zh', 'en']
- `config.includeDefault` (boolean): Optional. Include x-default tag. Default: true

**Returns**: Object with language codes as keys and URLs as values

**Example**:
```typescript
const alternates = generateHreflangAlternates({ path: 'blog' });
// Returns:
// {
//   'zh-CN': 'https://develop.matrixlab.work/zh/blog',
//   'en-US': 'https://develop.matrixlab.work/en/blog',
//   'x-default': 'https://develop.matrixlab.work/zh/blog'
// }
```

### `generateCanonicalUrl(locale, path)`

Generates canonical URL for a given locale and path.

**Parameters**:
- `locale` (string): Current locale ('zh' or 'en')
- `path` (string): Page path without locale prefix

**Returns**: Canonical URL string

**Example**:
```typescript
const canonical = generateCanonicalUrl('zh', 'blog/article');
// Returns: 'https://develop.matrixlab.work/zh/blog/article'
```

### `generateHreflangLinks(config)`

Generates array of hreflang link objects (useful for manual insertion).

**Parameters**: Same as `generateHreflangAlternates`

**Returns**: Array of `{ hreflang: string, href: string }` objects

**Example**:
```typescript
const links = generateHreflangLinks({ path: 'blog' });
// Returns:
// [
//   { hreflang: 'zh-CN', href: 'https://develop.matrixlab.work/zh/blog' },
//   { hreflang: 'en-US', href: 'https://develop.matrixlab.work/en/blog' },
//   { hreflang: 'x-default', href: 'https://develop.matrixlab.work/zh/blog' }
// ]
```

### `validateHreflangUrl(url)`

Validates hreflang URL format.

**Parameters**:
- `url` (string): URL to validate

**Returns**: boolean

**Example**:
```typescript
const isValid = validateHreflangUrl('https://develop.matrixlab.work/zh/blog');
// Returns: true
```

### `validateHreflangCode(langCode)`

Validates hreflang language code (BCP 47).

**Parameters**:
- `langCode` (string): Language code to validate

**Returns**: boolean

**Example**:
```typescript
const isValid = validateHreflangCode('zh-CN');
// Returns: true
```

## Common Patterns

### Home Page
```typescript
alternates: {
  canonical: generateCanonicalUrl(locale, ''),
  languages: generateHreflangAlternates({ path: '' }),
}
```

### Blog List
```typescript
alternates: {
  canonical: generateCanonicalUrl(locale, 'blog'),
  languages: generateHreflangAlternates({ path: 'blog' }),
}
```

### Blog Article (Dynamic Route)
```typescript
alternates: {
  canonical: generateCanonicalUrl(locale, `blog/${slug}`),
  languages: generateHreflangAlternates({ path: `blog/${slug}` }),
}
```

### Product Page
```typescript
alternates: {
  canonical: generateCanonicalUrl(locale, 'products/exchange'),
  languages: generateHreflangAlternates({ path: 'products/exchange' }),
}
```

## HTML Output

The metadata API automatically generates these HTML tags:

```html
<link rel="canonical" href="https://develop.matrixlab.work/zh/blog" />
<link rel="alternate" hreflang="zh-CN" href="https://develop.matrixlab.work/zh/blog" />
<link rel="alternate" hreflang="en-US" href="https://develop.matrixlab.work/en/blog" />
<link rel="alternate" hreflang="x-default" href="https://develop.matrixlab.work/zh/blog" />
```

## Validation

Run validation scripts to check implementation:

```bash
# Validate all pages
npx tsx scripts/validate-hreflang.ts

# Test metadata generation
npx tsx scripts/test-hreflang-metadata.ts

# See HTML output demo
npx tsx scripts/demo-hreflang-output.ts
```

## Best Practices

1. **Always use absolute URLs**: The utility automatically generates absolute URLs
2. **Include x-default**: Always include x-default tag (default behavior)
3. **Use BCP 47 codes**: Use 'zh-CN' and 'en-US', not just 'zh' and 'en'
4. **Bidirectional links**: Both language versions should link to each other
5. **Consistent paths**: Use the same path structure across languages

## Troubleshooting

### Issue: Hreflang tags not appearing
**Solution**: Check that you're using `generateMetadata` function, not inline metadata

### Issue: Wrong URLs generated
**Solution**: Verify the path parameter doesn't include leading slash or locale

### Issue: x-default missing
**Solution**: Ensure `includeDefault: true` (or omit, as it's the default)

### Issue: Language codes incorrect
**Solution**: The utility automatically converts 'zh' to 'zh-CN' and 'en' to 'en-US'

## Configuration

The base URL is configured in `lib/geo/hreflang.ts`:

```typescript
const BASE_URL = 'https://develop.matrixlab.work';
```

To change the base URL, update this constant.

## Related Documentation

- [Full Implementation Guide](../../.kiro/specs/geo-optimization/HREFLANG-IMPLEMENTATION.md)
- [Task Summary](../../.kiro/specs/geo-optimization/TASK-25-SUMMARY.md)
- [Verification Report](../../.kiro/specs/geo-optimization/TASK-25-VERIFICATION.md)

## Support

For issues or questions:
1. Check validation scripts output
2. Review implementation documentation
3. Verify URL format and language codes
4. Check Next.js metadata API documentation

---

**Version**: 1.0.0  
**Last Updated**: January 10, 2026  
**Status**: Production Ready
