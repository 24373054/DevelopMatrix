/**
 * Tests for Schema.org Validation Tool
 */

import {
  validateSchema,
  validateJsonLdFormat,
  validateRequiredFields,
  validateDateFormats,
  validateGeoEnhancements,
  type ValidationConfig,
} from '../validate-schema';

describe('Schema.org Validation Tool', () => {
  const defaultConfig: ValidationConfig = {
    strict: false,
    verbose: false,
  };

  describe('validateJsonLdFormat', () => {
    it('should pass for valid JSON-LD with @context and @type', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Test Article',
      };

      const result = validateJsonLdFormat(jsonLd);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when @context is missing', () => {
      const jsonLd = {
        '@type': 'BlogPosting',
        headline: 'Test Article',
      };

      const result = validateJsonLdFormat(jsonLd);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing @context field');
    });

    it('should fail when @type is missing', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        headline: 'Test Article',
      };

      const result = validateJsonLdFormat(jsonLd);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing @type field');
    });

    it('should fail for invalid @type', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'InvalidType',
        headline: 'Test Article',
      };

      const result = validateJsonLdFormat(jsonLd);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid @type'))).toBe(true);
    });

    it('should warn when @id is missing', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Test Article',
      };

      const result = validateJsonLdFormat(jsonLd);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('@id'))).toBe(true);
    });
  });

  describe('validateRequiredFields', () => {
    it('should pass when all required fields are present', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test Article',
        description: 'Test description',
        author: {
          '@type': 'Person' as const,
          name: 'Test Author',
          description: 'Test bio',
        },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const result = validateRequiredFields(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when headline is missing', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        description: 'Test description',
        author: {
          '@type': 'Person' as const,
          name: 'Test Author',
        },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const result = validateRequiredFields(schema as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: headline');
    });

    it('should fail when author is missing name', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test Article',
        description: 'Test description',
        author: {
          '@type': 'Person' as const,
        },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const result = validateRequiredFields(schema as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('author must have a name field');
    });

    it('should warn when publisher is missing', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test Article',
        description: 'Test description',
        author: {
          '@type': 'Person' as const,
          name: 'Test Author',
        },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const result = validateRequiredFields(schema);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('publisher'))).toBe(true);
    });
  });

  describe('validateDateFormats', () => {
    it('should pass for valid ISO 8601 dates', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-02T00:00:00Z',
      };

      const result = validateDateFormats(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for invalid date format', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '01/01/2024',
        dateModified: '2024-01-02T00:00:00Z',
      };

      const result = validateDateFormats(schema);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('datePublished'))).toBe(true);
    });

    it('should warn when dateModified is before datePublished', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '2024-01-02T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const result = validateDateFormats(schema);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('before'))).toBe(true);
    });
  });

  describe('validateGeoEnhancements', () => {
    it('should warn when GEO fields are missing', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const result = validateGeoEnhancements(schema);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('about'))).toBe(true);
      expect(result.warnings?.some(w => w.includes('teaches'))).toBe(true);
      expect(result.warnings?.some(w => w.includes('mentions'))).toBe(true);
      expect(result.warnings?.some(w => w.includes('mainEntity'))).toBe(true);
    });

    it('should pass when all GEO fields are present and valid', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
        about: [
          {
            '@type': 'DefinedTerm' as const,
            name: 'Web3',
            description: 'Decentralized web',
          },
        ],
        teaches: ['Smart Contracts', 'Security'],
        mentions: [
          { '@type': 'SoftwareApplication', name: 'Solidity' },
        ],
        mainEntity: [
          {
            '@type': 'Question' as const,
            name: 'What is Web3?',
            acceptedAnswer: {
              '@type': 'Answer' as const,
              text: 'Web3 is the decentralized web',
            },
          },
        ],
        inLanguage: 'zh-CN',
      };

      const result = validateGeoEnhancements(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when about items are missing @type', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
        about: [
          {
            name: 'Web3',
            description: 'Decentralized web',
          },
        ],
      };

      const result = validateGeoEnhancements(schema as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('about[0]') && e.includes('@type'))).toBe(true);
    });

    it('should fail when mainEntity questions are missing acceptedAnswer', () => {
      const schema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        description: 'Test',
        author: { '@type': 'Person' as const, name: 'Test' },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
        mainEntity: [
          {
            '@type': 'Question' as const,
            name: 'What is Web3?',
          },
        ],
      };

      const result = validateGeoEnhancements(schema as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('acceptedAnswer'))).toBe(true);
    });
  });

  describe('validateSchema (comprehensive)', () => {
    it('should pass for a complete valid schema', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': 'https://example.com/article',
        headline: 'Test Article',
        description: 'Test description',
        author: {
          '@type': 'Person',
          name: 'Test Author',
          description: 'Test bio',
          jobTitle: 'Developer',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Test Org',
          logo: {
            '@type': 'ImageObject',
            url: 'https://example.com/logo.png',
          },
        },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
        image: 'https://example.com/image.jpg',
        about: [
          {
            '@type': 'DefinedTerm',
            name: 'Web3',
            description: 'Decentralized web',
          },
        ],
        teaches: ['Smart Contracts'],
        mentions: [
          { '@type': 'SoftwareApplication', name: 'Solidity' },
        ],
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Web3?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Web3 is the decentralized web',
            },
          },
        ],
        inLanguage: 'en-US',
      };

      const result = validateSchema(jsonLd, defaultConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should treat warnings as errors in strict mode', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Test Article',
        description: 'Test description',
        author: {
          '@type': 'Person',
          name: 'Test Author',
        },
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-01T00:00:00Z',
      };

      const strictConfig: ValidationConfig = {
        strict: true,
        verbose: false,
      };

      const result = validateSchema(jsonLd, strictConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('[STRICT]'))).toBe(true);
    });
  });
});
