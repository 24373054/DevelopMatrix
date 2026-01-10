/**
 * Property-Based Test Generators for Structured Data (Schema.org)
 * 
 * These generators create random but valid structured data for property-based testing
 * of Schema.org BlogPosting and enhanced GEO structured data.
 */

import * as fc from 'fast-check';
import type {
  EnhancedBlogPosting,
  SchemaPerson,
  SchemaOrganization,
  SchemaDefinedTerm,
  SchemaThing,
  SchemaQuestion,
  SchemaCreativeWorkSeries,
  SchemaImageObject,
} from '@/types/geo';

/**
 * Generate safe text content for schema fields
 */
function safeTextGenerator(minLength: number, maxLength: number): fc.Arbitrary<string> {
  return fc.string({ 
    minLength, 
    maxLength,
    unit: fc.constantFrom(
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      ' ', ' ', ' ', '.', ',', '-', ':', ';'
    )
  }).map(s => s.trim()).filter(s => s.length >= minLength);
}

/**
 * Generate a valid ISO 8601 date string
 */
export function iso8601DateGenerator(): fc.Arbitrary<string> {
  return fc.date({ min: new Date('2020-01-01T00:00:00Z'), max: new Date('2026-12-31T23:59:59Z') })
    .map(date => {
      try {
        return date.toISOString();
      } catch {
        // Fallback to a valid date if toISOString fails
        return new Date('2024-01-01T00:00:00Z').toISOString();
      }
    });
}

/**
 * Generate Schema.org Person
 */
export function schemaPersonGenerator(): fc.Arbitrary<SchemaPerson> {
  return fc.record({
    '@type': fc.constant('Person' as const),
    name: safeTextGenerator(5, 50),
    description: fc.option(safeTextGenerator(20, 200), { nil: undefined }),
    jobTitle: fc.option(safeTextGenerator(10, 50), { nil: undefined }),
    url: fc.option(fc.webUrl(), { nil: undefined }),
  });
}

/**
 * Generate Schema.org ImageObject
 */
export function schemaImageObjectGenerator(): fc.Arbitrary<SchemaImageObject> {
  return fc.record({
    '@type': fc.constant('ImageObject' as const),
    url: fc.webUrl(),
    width: fc.option(fc.integer({ min: 100, max: 2000 }), { nil: undefined }),
    height: fc.option(fc.integer({ min: 100, max: 2000 }), { nil: undefined }),
  });
}

/**
 * Generate Schema.org Organization
 */
export function schemaOrganizationGenerator(): fc.Arbitrary<SchemaOrganization> {
  return fc.record({
    '@type': fc.constant('Organization' as const),
    name: safeTextGenerator(5, 50),
    logo: fc.option(schemaImageObjectGenerator(), { nil: undefined }),
    url: fc.option(fc.webUrl(), { nil: undefined }),
  });
}

/**
 * Generate Schema.org DefinedTerm
 */
export function schemaDefinedTermGenerator(): fc.Arbitrary<SchemaDefinedTerm> {
  return fc.record({
    '@type': fc.constant('DefinedTerm' as const),
    name: safeTextGenerator(5, 50),
    description: safeTextGenerator(20, 200),
    inDefinedTermSet: fc.option(safeTextGenerator(5, 50), { nil: undefined }),
  });
}

/**
 * Generate Schema.org Thing
 */
export function schemaThingGenerator(): fc.Arbitrary<SchemaThing> {
  return fc.record({
    '@type': fc.constantFrom('Thing', 'SoftwareApplication', 'Product'),
    name: safeTextGenerator(5, 50),
    description: fc.option(safeTextGenerator(20, 200), { nil: undefined }),
  });
}

/**
 * Generate Schema.org Question
 */
export function schemaQuestionGenerator(): fc.Arbitrary<SchemaQuestion> {
  return fc.record({
    '@type': fc.constant('Question' as const),
    name: safeTextGenerator(10, 100),
    acceptedAnswer: fc.record({
      '@type': fc.constant('Answer' as const),
      text: safeTextGenerator(20, 300),
    }),
  });
}

/**
 * Generate Schema.org CreativeWorkSeries
 */
export function schemaCreativeWorkSeriesGenerator(): fc.Arbitrary<SchemaCreativeWorkSeries> {
  return fc.record({
    '@type': fc.constant('CreativeWorkSeries' as const),
    name: safeTextGenerator(10, 100),
  });
}

/**
 * Generate a complete, valid Enhanced BlogPosting
 * Properties 31, 32, 33, 34, 35: Structured data validation
 */
export function enhancedBlogPostingGenerator(): fc.Arbitrary<EnhancedBlogPosting> {
  return fc.record({
    '@type': fc.constantFrom('BlogPosting' as const, 'Article' as const),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: schemaPersonGenerator(),
    datePublished: iso8601DateGenerator(),
    dateModified: iso8601DateGenerator(),
    image: fc.oneof(fc.webUrl(), schemaImageObjectGenerator()),
    publisher: fc.option(schemaOrganizationGenerator(), { nil: undefined }),
    about: fc.option(fc.array(schemaDefinedTermGenerator(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
    teaches: fc.option(fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }), { nil: undefined }),
    mentions: fc.option(fc.array(schemaThingGenerator(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
    isPartOf: fc.option(schemaCreativeWorkSeriesGenerator(), { nil: undefined }),
    mainEntity: fc.option(fc.array(schemaQuestionGenerator(), { minLength: 1, maxLength: 10 }), { nil: undefined }),
    inLanguage: fc.option(fc.constantFrom('zh-CN', 'en-US', 'en', 'zh'), { nil: undefined }),
  });
}

/**
 * Generate BlogPosting without JSON-LD context
 * Property 31: Schema.org JSON-LD presence
 */
export function blogPostingWithoutContextGenerator(): fc.Arbitrary<EnhancedBlogPosting> {
  return enhancedBlogPostingGenerator();
}

/**
 * Generate BlogPosting with invalid @type
 * Property 32: BlogPosting type usage
 */
export function blogPostingWithInvalidTypeGenerator(): fc.Arbitrary<any> {
  return fc.record({
    '@type': fc.constantFrom('WebPage', 'Thing', 'CreativeWork'),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: schemaPersonGenerator(),
    datePublished: iso8601DateGenerator(),
  });
}

/**
 * Generate BlogPosting with incomplete author data
 * Property 33: Author structured data completeness
 */
export function blogPostingWithIncompleteAuthorGenerator(): fc.Arbitrary<any> {
  return fc.record({
    '@type': fc.constant('BlogPosting' as const),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: fc.oneof(
      // Missing name
      fc.record({
        '@type': fc.constant('Person' as const),
        description: safeTextGenerator(20, 200),
      }),
      // Missing @type
      fc.record({
        name: safeTextGenerator(5, 50),
        description: safeTextGenerator(20, 200),
      }),
      // Just a string (invalid)
      safeTextGenerator(5, 50)
    ),
    datePublished: iso8601DateGenerator(),
  });
}

/**
 * Generate BlogPosting without relationship markup
 * Property 34: Relationship markup presence
 */
export function blogPostingWithoutRelationshipsGenerator(): fc.Arbitrary<EnhancedBlogPosting> {
  return fc.record({
    '@type': fc.constant('BlogPosting' as const),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: schemaPersonGenerator(),
    datePublished: iso8601DateGenerator(),
    dateModified: iso8601DateGenerator(),
    // Explicitly omit about, mentions, isPartOf
    about: fc.constant(undefined),
    mentions: fc.constant(undefined),
    isPartOf: fc.constant(undefined),
  });
}

/**
 * Generate BlogPosting with missing date fields
 * Property 35: Date fields presence
 */
export function blogPostingWithMissingDatesGenerator(): fc.Arbitrary<any> {
  return fc.oneof(
    // Missing datePublished
    fc.record({
      '@type': fc.constant('BlogPosting' as const),
      headline: safeTextGenerator(10, 200),
      description: safeTextGenerator(50, 500),
      author: schemaPersonGenerator(),
      dateModified: iso8601DateGenerator(),
    }),
    // Missing dateModified
    fc.record({
      '@type': fc.constant('BlogPosting' as const),
      headline: safeTextGenerator(10, 200),
      description: safeTextGenerator(50, 500),
      author: schemaPersonGenerator(),
      datePublished: iso8601DateGenerator(),
    }),
    // Missing both
    fc.record({
      '@type': fc.constant('BlogPosting' as const),
      headline: safeTextGenerator(10, 200),
      description: safeTextGenerator(50, 500),
      author: schemaPersonGenerator(),
    })
  );
}

/**
 * Generate BlogPosting with invalid date format
 * Property 35: Date fields presence (format validation)
 */
export function blogPostingWithInvalidDateFormatGenerator(): fc.Arbitrary<any> {
  return fc.record({
    '@type': fc.constant('BlogPosting' as const),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: schemaPersonGenerator(),
    datePublished: fc.constantFrom(
      '2024-13-01', // Invalid month
      '2024-01-32', // Invalid day
      '01/01/2024', // Wrong format
      '2024-1-1',   // Missing leading zeros
      'January 1, 2024', // Text format
    ),
    dateModified: fc.constantFrom(
      '2024-13-01',
      '2024-01-32',
      '01/01/2024',
      '2024-1-1',
      'January 1, 2024',
    ),
  });
}

/**
 * Generate minimal valid BlogPosting (only required fields)
 */
export function minimalBlogPostingGenerator(): fc.Arbitrary<EnhancedBlogPosting> {
  return fc.record({
    '@type': fc.constant('BlogPosting' as const),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: schemaPersonGenerator(),
    datePublished: iso8601DateGenerator(),
    dateModified: iso8601DateGenerator(),
  });
}

/**
 * Generate comprehensive BlogPosting (all fields populated)
 */
export function comprehensiveBlogPostingGenerator(): fc.Arbitrary<EnhancedBlogPosting> {
  return fc.record({
    '@type': fc.constant('BlogPosting' as const),
    headline: safeTextGenerator(10, 200),
    description: safeTextGenerator(50, 500),
    author: schemaPersonGenerator(),
    datePublished: iso8601DateGenerator(),
    dateModified: iso8601DateGenerator(),
    image: schemaImageObjectGenerator(),
    publisher: schemaOrganizationGenerator(),
    about: fc.array(schemaDefinedTermGenerator(), { minLength: 1, maxLength: 5 }),
    teaches: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
    mentions: fc.array(schemaThingGenerator(), { minLength: 1, maxLength: 5 }),
    isPartOf: schemaCreativeWorkSeriesGenerator(),
    mainEntity: fc.array(schemaQuestionGenerator(), { minLength: 1, maxLength: 10 }),
    inLanguage: fc.constantFrom('zh-CN', 'en-US'),
  });
}

/**
 * Generate JSON-LD with @context
 */
export function jsonLdWithContextGenerator(): fc.Arbitrary<any> {
  return enhancedBlogPostingGenerator().map(schema => ({
    '@context': 'https://schema.org',
    ...schema,
  }));
}

/**
 * Generate mixed structured data (valid and invalid)
 */
export function mixedStructuredDataGenerator(): fc.Arbitrary<any> {
  return fc.oneof(
    enhancedBlogPostingGenerator(),
    blogPostingWithInvalidTypeGenerator(),
    blogPostingWithIncompleteAuthorGenerator(),
    blogPostingWithoutRelationshipsGenerator(),
    blogPostingWithMissingDatesGenerator()
  );
}

/**
 * Generate HTML page with JSON-LD script
 */
export function htmlPageWithJsonLdGenerator(): fc.Arbitrary<string> {
  return jsonLdWithContextGenerator().map(jsonLd => `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body>
  <article>
    <h1>${jsonLd.headline}</h1>
    <p>${jsonLd.description}</p>
  </article>
</body>
</html>
  `.trim());
}

/**
 * Generate HTML page without JSON-LD script
 */
export function htmlPageWithoutJsonLdGenerator(): fc.Arbitrary<string> {
  return fc.record({
    title: safeTextGenerator(10, 100),
    content: safeTextGenerator(50, 500),
  }).map(({ title, content }) => `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
</head>
<body>
  <article>
    <h1>${title}</h1>
    <p>${content}</p>
  </article>
</body>
</html>
  `.trim());
}
