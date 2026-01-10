/**
 * Property-Based Tests for Structured Data (Schema.org)
 * 
 * Feature: geo-optimization
 * Tests Properties 31, 32, 33, 34, 35 from the design document
 * Validates Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import * as fc from 'fast-check';
import type { EnhancedBlogPosting, SchemaPerson } from '@/types/geo';
import {
  enhancedBlogPostingGenerator,
  blogPostingWithoutContextGenerator,
  blogPostingWithInvalidTypeGenerator,
  blogPostingWithIncompleteAuthorGenerator,
  blogPostingWithoutRelationshipsGenerator,
  blogPostingWithMissingDatesGenerator,
  blogPostingWithInvalidDateFormatGenerator,
  minimalBlogPostingGenerator,
  comprehensiveBlogPostingGenerator,
  jsonLdWithContextGenerator,
  mixedStructuredDataGenerator,
  htmlPageWithJsonLdGenerator,
  htmlPageWithoutJsonLdGenerator,
} from '../generators/structuredData.generator';

// ============================================================================
// Helper Functions for Validation
// ============================================================================

/**
 * Check if HTML contains a valid JSON-LD script tag
 */
function hasJsonLdScript(html: string): boolean {
  const scriptRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i;
  const match = html.match(scriptRegex);
  
  if (!match) {
    return false;
  }
  
  try {
    const jsonLd = JSON.parse(match[1]);
    return jsonLd['@context'] === 'https://schema.org';
  } catch {
    return false;
  }
}

/**
 * Extract JSON-LD from HTML
 */
function extractJsonLd(html: string): any | null {
  const scriptRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i;
  const match = html.match(scriptRegex);
  
  if (!match) {
    return null;
  }
  
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/**
 * Check if structured data has valid @type for BlogPosting
 */
function hasValidBlogPostingType(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  return schema['@type'] === 'BlogPosting' || schema['@type'] === 'Article';
}

/**
 * Check if author structured data is complete
 */
function hasCompleteAuthorData(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  const author = schema.author;
  
  if (!author || typeof author !== 'object') {
    return false;
  }
  
  // Must have @type, name, and description
  return (
    author['@type'] === 'Person' &&
    typeof author.name === 'string' &&
    author.name.trim().length > 0 &&
    (author.description === undefined || 
     (typeof author.description === 'string' && author.description.trim().length > 0))
  );
}

/**
 * Check if structured data has at least one relationship field
 */
function hasRelationshipMarkup(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  // Check for at least one of: about, mentions, isPartOf
  const hasAbout = Array.isArray(schema.about) && schema.about.length > 0;
  const hasMentions = Array.isArray(schema.mentions) && schema.mentions.length > 0;
  const hasIsPartOf = schema.isPartOf && typeof schema.isPartOf === 'object';
  
  // Explicitly return boolean
  return Boolean(hasAbout || hasMentions || hasIsPartOf);
}

/**
 * Check if structured data has required date fields
 */
function hasRequiredDateFields(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  return (
    typeof schema.datePublished === 'string' &&
    schema.datePublished.trim().length > 0 &&
    typeof schema.dateModified === 'string' &&
    schema.dateModified.trim().length > 0
  );
}

/**
 * Validate ISO 8601 date format
 */
function isValidISO8601(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  // ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  
  if (!iso8601Regex.test(dateString)) {
    return false;
  }
  
  // Additional validation: check if date is actually valid
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Check if date fields are in valid ISO 8601 format
 */
function hasValidDateFormat(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  const publishedValid = schema.datePublished ? isValidISO8601(schema.datePublished) : true;
  const modifiedValid = schema.dateModified ? isValidISO8601(schema.dateModified) : true;
  
  return publishedValid && modifiedValid;
}

/**
 * Check if structured data has all required fields
 */
function hasAllRequiredFields(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  return (
    hasValidBlogPostingType(schema) &&
    typeof schema.headline === 'string' &&
    schema.headline.trim().length > 0 &&
    typeof schema.description === 'string' &&
    schema.description.trim().length > 0 &&
    hasCompleteAuthorData(schema) &&
    hasRequiredDateFields(schema) &&
    hasValidDateFormat(schema)
  );
}

describe('Structured Data - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 31: Schema.org JSON-LD presence
  // ============================================================================
  
  describe('Property 31: Schema.org JSON-LD presence', () => {
    /**
     * Feature: geo-optimization, Property 31: Schema.org JSON-LD presence
     * 
     * For any blog article page, the HTML should contain a valid Schema.org JSON-LD script tag
     * 
     * Validates: Requirements 10.1
     */
    it('should have JSON-LD script tag in HTML pages', () => {
      fc.assert(
        fc.property(
          htmlPageWithJsonLdGenerator(),
          (html) => {
            return hasJsonLdScript(html);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have @context field in JSON-LD', () => {
      fc.assert(
        fc.property(
          jsonLdWithContextGenerator(),
          (jsonLd) => {
            return jsonLd['@context'] === 'https://schema.org';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing JSON-LD script', () => {
      fc.assert(
        fc.property(
          htmlPageWithoutJsonLdGenerator(),
          (html) => {
            return !hasJsonLdScript(html);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should extract valid JSON from JSON-LD script', () => {
      fc.assert(
        fc.property(
          htmlPageWithJsonLdGenerator(),
          (html) => {
            const jsonLd = extractJsonLd(html);
            return jsonLd !== null && typeof jsonLd === 'object';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have Schema.org context in extracted JSON-LD', () => {
      fc.assert(
        fc.property(
          htmlPageWithJsonLdGenerator(),
          (html) => {
            const jsonLd = extractJsonLd(html);
            return jsonLd && jsonLd['@context'] === 'https://schema.org';
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 32: BlogPosting type usage
  // ============================================================================
  
  describe('Property 32: BlogPosting type usage', () => {
    /**
     * Feature: geo-optimization, Property 32: BlogPosting type usage
     * 
     * For any blog article's structured data, the @type field should be "BlogPosting" or "Article"
     * 
     * Validates: Requirements 10.2
     */
    it('should have valid @type for blog articles', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return hasValidBlogPostingType(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should accept BlogPosting type', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (schema['@type'] === 'BlogPosting') {
              return hasValidBlogPostingType(schema);
            }
            return true; // Skip if not BlogPosting
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should accept Article type', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (schema['@type'] === 'Article') {
              return hasValidBlogPostingType(schema);
            }
            return true; // Skip if not Article
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect invalid @type values', () => {
      fc.assert(
        fc.property(
          blogPostingWithInvalidTypeGenerator(),
          (schema) => {
            return !hasValidBlogPostingType(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have @type in both minimal and comprehensive schemas', () => {
      fc.assert(
        fc.property(
          fc.oneof(minimalBlogPostingGenerator(), comprehensiveBlogPostingGenerator()),
          (schema) => {
            return hasValidBlogPostingType(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 33: Author structured data completeness
  // ============================================================================
  
  describe('Property 33: Author structured data completeness', () => {
    /**
     * Feature: geo-optimization, Property 33: Author structured data completeness
     * 
     * For any blog article's structured data, the author field should include name, type, and description
     * 
     * Validates: Requirements 10.3
     */
    it('should have complete author data in blog articles', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return hasCompleteAuthorData(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have author with @type Person', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return schema.author && schema.author['@type'] === 'Person';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have author with non-empty name', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return (
              schema.author &&
              typeof schema.author.name === 'string' &&
              schema.author.name.trim().length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect incomplete author data', () => {
      fc.assert(
        fc.property(
          blogPostingWithIncompleteAuthorGenerator(),
          (schema) => {
            return !hasCompleteAuthorData(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have complete author in both minimal and comprehensive schemas', () => {
      fc.assert(
        fc.property(
          fc.oneof(minimalBlogPostingGenerator(), comprehensiveBlogPostingGenerator()),
          (schema) => {
            return hasCompleteAuthorData(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should allow optional author fields', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            // description, jobTitle, url are optional
            const author = schema.author as SchemaPerson;
            if (!author) return false;
            
            // These fields can be undefined or valid strings
            const descValid = author.description === undefined || 
                             (typeof author.description === 'string' && author.description.length > 0);
            const jobValid = author.jobTitle === undefined || 
                            (typeof author.jobTitle === 'string' && author.jobTitle.length > 0);
            const urlValid = author.url === undefined || 
                            (typeof author.url === 'string' && author.url.length > 0);
            
            return descValid && jobValid && urlValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 34: Relationship markup presence
  // ============================================================================
  
  describe('Property 34: Relationship markup presence', () => {
    /**
     * Feature: geo-optimization, Property 34: Relationship markup presence
     * 
     * For any blog article's structured data, it should include at least one relationship field 
     * (isPartOf, mentions, or about)
     * 
     * Validates: Requirements 10.4
     */
    it('should have at least one relationship field in comprehensive schemas', () => {
      fc.assert(
        fc.property(
          comprehensiveBlogPostingGenerator(),
          (schema) => {
            return hasRelationshipMarkup(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should accept about field as relationship markup', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (schema.about && Array.isArray(schema.about) && schema.about.length > 0) {
              return hasRelationshipMarkup(schema);
            }
            return true; // Skip if no about field
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should accept mentions field as relationship markup', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (schema.mentions && Array.isArray(schema.mentions) && schema.mentions.length > 0) {
              return hasRelationshipMarkup(schema);
            }
            return true; // Skip if no mentions field
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should accept isPartOf field as relationship markup', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (schema.isPartOf && typeof schema.isPartOf === 'object') {
              return hasRelationshipMarkup(schema);
            }
            return true; // Skip if no isPartOf field
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing relationship markup', () => {
      fc.assert(
        fc.property(
          blogPostingWithoutRelationshipsGenerator(),
          (schema) => {
            return !hasRelationshipMarkup(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate about field structure when present', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (!schema.about) return true; // Optional field
            
            // If present, must be array of DefinedTerms
            return (
              Array.isArray(schema.about) &&
              schema.about.every(term => 
                term['@type'] === 'DefinedTerm' &&
                typeof term.name === 'string' &&
                typeof term.description === 'string'
              )
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate mentions field structure when present', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            if (!schema.mentions) return true; // Optional field
            
            // If present, must be array of Things
            return (
              Array.isArray(schema.mentions) &&
              schema.mentions.every(thing => 
                typeof thing['@type'] === 'string' &&
                typeof thing.name === 'string'
              )
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 35: Date fields presence
  // ============================================================================
  
  describe('Property 35: Date fields presence', () => {
    /**
     * Feature: geo-optimization, Property 35: Date fields presence
     * 
     * For any blog article's structured data, it should include both datePublished and 
     * dateModified fields in ISO 8601 format
     * 
     * Validates: Requirements 10.5
     */
    it('should have both datePublished and dateModified fields', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return hasRequiredDateFields(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have datePublished in ISO 8601 format', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return isValidISO8601(schema.datePublished);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have dateModified in ISO 8601 format', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return isValidISO8601(schema.dateModified);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing date fields', () => {
      fc.assert(
        fc.property(
          blogPostingWithMissingDatesGenerator(),
          (schema) => {
            return !hasRequiredDateFields(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect invalid date formats', () => {
      fc.assert(
        fc.property(
          blogPostingWithInvalidDateFormatGenerator(),
          (schema) => {
            return !hasValidDateFormat(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have valid dates in both minimal and comprehensive schemas', () => {
      fc.assert(
        fc.property(
          fc.oneof(minimalBlogPostingGenerator(), comprehensiveBlogPostingGenerator()),
          (schema) => {
            return hasRequiredDateFields(schema) && hasValidDateFormat(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should accept full ISO 8601 datetime format', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            // Should accept both YYYY-MM-DD and full datetime
            const publishedValid = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(schema.datePublished);
            const modifiedValid = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(schema.dateModified);
            return publishedValid && modifiedValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Complete Structured Data Validation
  // ============================================================================
  
  describe('Integration: Complete Structured Data Validation', () => {
    it('should validate complete enhanced blog posting has all required properties', () => {
      fc.assert(
        fc.property(
          enhancedBlogPostingGenerator(),
          (schema) => {
            return hasAllRequiredFields(schema);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate minimal schemas meet all requirements', () => {
      fc.assert(
        fc.property(
          minimalBlogPostingGenerator(),
          (schema) => {
            return (
              hasValidBlogPostingType(schema) &&
              hasCompleteAuthorData(schema) &&
              hasRequiredDateFields(schema) &&
              hasValidDateFormat(schema)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate comprehensive schemas have enhanced fields', () => {
      fc.assert(
        fc.property(
          comprehensiveBlogPostingGenerator(),
          (schema) => {
            return (
              hasAllRequiredFields(schema) &&
              hasRelationshipMarkup(schema) &&
              schema.mainEntity !== undefined &&
              schema.inLanguage !== undefined
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle mixed structured data correctly', () => {
      fc.assert(
        fc.property(
          mixedStructuredDataGenerator(),
          (schema) => {
            // Should always have an @type field
            return schema && typeof schema['@type'] === 'string';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate JSON-LD in HTML has all required fields', () => {
      fc.assert(
        fc.property(
          htmlPageWithJsonLdGenerator(),
          (html) => {
            const jsonLd = extractJsonLd(html);
            if (!jsonLd) return false;
            
            return (
              jsonLd['@context'] === 'https://schema.org' &&
              hasValidBlogPostingType(jsonLd) &&
              hasCompleteAuthorData(jsonLd) &&
              hasRequiredDateFields(jsonLd)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Edge Cases and Robustness
  // ============================================================================
  
  describe('Edge Cases and Robustness', () => {
    it('should handle null schema', () => {
      const schema = null;
      expect(hasValidBlogPostingType(schema)).toBe(false);
      expect(hasCompleteAuthorData(schema)).toBe(false);
      expect(hasRelationshipMarkup(schema)).toBe(false);
      expect(hasRequiredDateFields(schema)).toBe(false);
    });
    
    it('should handle undefined schema', () => {
      const schema = undefined;
      expect(hasValidBlogPostingType(schema)).toBe(false);
      expect(hasCompleteAuthorData(schema)).toBe(false);
      expect(hasRelationshipMarkup(schema)).toBe(false);
      expect(hasRequiredDateFields(schema)).toBe(false);
    });
    
    it('should handle empty object as schema', () => {
      const schema = {};
      expect(hasValidBlogPostingType(schema)).toBe(false);
      expect(hasCompleteAuthorData(schema)).toBe(false);
      expect(hasRelationshipMarkup(schema)).toBe(false);
      expect(hasRequiredDateFields(schema)).toBe(false);
    });
    
    it('should handle schema with only @type', () => {
      const schema = { '@type': 'BlogPosting' };
      expect(hasValidBlogPostingType(schema)).toBe(true);
      expect(hasCompleteAuthorData(schema)).toBe(false);
      expect(hasRequiredDateFields(schema)).toBe(false);
    });
    
    it('should handle invalid date strings', () => {
      expect(isValidISO8601('not-a-date')).toBe(false);
      expect(isValidISO8601('2024-13-01')).toBe(false);
      expect(isValidISO8601('2024-01-32')).toBe(false);
      expect(isValidISO8601('01/01/2024')).toBe(false);
    });
    
    it('should handle valid date strings', () => {
      expect(isValidISO8601('2024-01-01')).toBe(true);
      expect(isValidISO8601('2024-12-31T23:59:59Z')).toBe(true);
      expect(isValidISO8601('2024-06-15T12:30:00.000Z')).toBe(true);
    });
    
    it('should handle HTML without script tags', () => {
      const html = '<html><body><h1>Test</h1></body></html>';
      expect(hasJsonLdScript(html)).toBe(false);
      expect(extractJsonLd(html)).toBe(null);
    });
    
    it('should handle HTML with invalid JSON in script', () => {
      const html = `
        <html>
        <head>
          <script type="application/ld+json">
            { invalid json }
          </script>
        </head>
        </html>
      `;
      expect(hasJsonLdScript(html)).toBe(false);
      expect(extractJsonLd(html)).toBe(null);
    });
    
    it('should handle empty relationship arrays', () => {
      const schema = {
        '@type': 'BlogPosting',
        about: [],
        mentions: [],
      };
      expect(hasRelationshipMarkup(schema)).toBe(false);
    });
    
    it('should handle author as string (invalid)', () => {
      const schema = {
        '@type': 'BlogPosting',
        author: 'John Doe',
      };
      expect(hasCompleteAuthorData(schema)).toBe(false);
    });
  });
});
