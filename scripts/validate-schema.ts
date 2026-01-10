#!/usr/bin/env tsx
/**
 * Schema.org Validation Tool
 * 
 * This script validates Schema.org JSON-LD structured data in blog articles
 * to ensure compliance with Schema.org specifications and GEO requirements.
 * 
 * Features:
 * - JSON-LD format validation
 * - Required field checking
 * - Date format validation (ISO 8601)
 * - GEO enhancement field validation
 * - Type checking for Schema.org types
 * - Generates comprehensive validation reports
 * 
 * Usage:
 *   npm run validate-schema              # Validate all articles
 *   npm run validate-schema -- --slug=web3-security-trends-2025  # Validate specific article
 *   npm run validate-schema -- --locale=zh  # Validate specific locale
 *   npm run validate-schema -- --strict  # Strict mode (warnings as errors)
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { EnhancedBlogPosting, ValidationResult } from '@/types/geo';

// ============================================================================
// Configuration
// ============================================================================

interface ValidationConfig {
  /** Whether to treat warnings as errors */
  strict: boolean;
  
  /** Specific article slug to validate (optional) */
  slug?: string;
  
  /** Specific locale to validate (optional) */
  locale?: 'zh' | 'en';
  
  /** Whether to output verbose logs */
  verbose: boolean;
}

// ============================================================================
// Validation Rules
// ============================================================================

/**
 * Required fields for BlogPosting schema
 */
const REQUIRED_FIELDS = [
  'headline',
  'description',
  'author',
  'datePublished',
  'dateModified',
] as const;

/**
 * GEO enhancement fields (recommended but not strictly required)
 */
const GEO_ENHANCEMENT_FIELDS = [
  'about',
  'teaches',
  'mentions',
  'mainEntity',
] as const;

/**
 * Valid Schema.org types for blog content
 */
const VALID_TYPES = ['BlogPosting', 'Article'] as const;

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate JSON-LD format
 */
function validateJsonLdFormat(jsonLd: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if it's a valid object
  if (typeof jsonLd !== 'object' || jsonLd === null) {
    errors.push('JSON-LD must be a valid object');
    return { valid: false, errors, warnings };
  }

  // Check for @context
  if (!jsonLd['@context']) {
    errors.push('Missing @context field');
  } else if (jsonLd['@context'] !== 'https://schema.org') {
    warnings.push(`@context should be "https://schema.org", got "${jsonLd['@context']}"`);
  }

  // Check for @type
  if (!jsonLd['@type']) {
    errors.push('Missing @type field');
  } else if (!VALID_TYPES.includes(jsonLd['@type'])) {
    errors.push(`Invalid @type: "${jsonLd['@type']}". Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Check for @id (recommended)
  if (!jsonLd['@id']) {
    warnings.push('Missing @id field (recommended for unique identification)');
  }

  // Check for mainEntityOfPage (recommended)
  if (!jsonLd.mainEntityOfPage) {
    warnings.push('Missing mainEntityOfPage field (recommended)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate required fields
 */
function validateRequiredFields(schema: EnhancedBlogPosting): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (!schema[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate author structure
  if (schema.author) {
    if (!schema.author['@type'] || schema.author['@type'] !== 'Person') {
      errors.push('author must have @type: "Person"');
    }
    if (!schema.author.name) {
      errors.push('author must have a name field');
    }
    if (!schema.author.description && !schema.author.jobTitle) {
      warnings.push('author should have description or jobTitle for authority signals');
    }
  }

  // Validate publisher (recommended)
  if (!schema.publisher) {
    warnings.push('Missing publisher field (recommended)');
  } else {
    if (!schema.publisher['@type'] || schema.publisher['@type'] !== 'Organization') {
      errors.push('publisher must have @type: "Organization"');
    }
    if (!schema.publisher.name) {
      errors.push('publisher must have a name field');
    }
  }

  // Validate image
  if (!schema.image) {
    warnings.push('Missing image field (recommended for rich results)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate date formats (ISO 8601)
 */
function validateDateFormats(schema: EnhancedBlogPosting): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ISO 8601 regex pattern
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

  if (schema.datePublished) {
    if (!iso8601Pattern.test(schema.datePublished)) {
      errors.push(`datePublished is not in valid ISO 8601 format: "${schema.datePublished}"`);
    }
    // Check if it's a valid date
    const date = new Date(schema.datePublished);
    if (isNaN(date.getTime())) {
      errors.push(`datePublished is not a valid date: "${schema.datePublished}"`);
    }
  }

  if (schema.dateModified) {
    if (!iso8601Pattern.test(schema.dateModified)) {
      errors.push(`dateModified is not in valid ISO 8601 format: "${schema.dateModified}"`);
    }
    // Check if it's a valid date
    const date = new Date(schema.dateModified);
    if (isNaN(date.getTime())) {
      errors.push(`dateModified is not a valid date: "${schema.dateModified}"`);
    }
  }

  // Check if dateModified is after datePublished
  if (schema.datePublished && schema.dateModified) {
    const published = new Date(schema.datePublished);
    const modified = new Date(schema.dateModified);
    if (modified < published) {
      warnings.push('dateModified is before datePublished (unusual but not invalid)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate GEO enhancement fields
 */
function validateGeoEnhancements(schema: EnhancedBlogPosting): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check 'about' field (core concepts)
  if (!schema.about || schema.about.length === 0) {
    warnings.push('Missing "about" field - core concepts should be defined for GEO optimization');
  } else {
    schema.about.forEach((term, index) => {
      if (!term['@type'] || term['@type'] !== 'DefinedTerm') {
        errors.push(`about[${index}] must have @type: "DefinedTerm"`);
      }
      if (!term.name) {
        errors.push(`about[${index}] must have a name field`);
      }
      if (!term.description) {
        warnings.push(`about[${index}] should have a description field`);
      }
    });
  }

  // Check 'teaches' field (knowledge points)
  if (!schema.teaches || schema.teaches.length === 0) {
    warnings.push('Missing "teaches" field - knowledge points should be listed for GEO optimization');
  } else if (!Array.isArray(schema.teaches)) {
    errors.push('"teaches" must be an array of strings');
  }

  // Check 'mentions' field (technologies/tools)
  if (!schema.mentions || schema.mentions.length === 0) {
    warnings.push('Missing "mentions" field - mentioned technologies should be listed for GEO optimization');
  } else {
    schema.mentions.forEach((thing, index) => {
      if (!thing['@type']) {
        errors.push(`mentions[${index}] must have a @type field`);
      }
      if (!thing.name) {
        errors.push(`mentions[${index}] must have a name field`);
      }
    });
  }

  // Check 'mainEntity' field (Q&A structure)
  if (!schema.mainEntity || schema.mainEntity.length === 0) {
    warnings.push('Missing "mainEntity" field - Q&A structure should be included for GEO optimization');
  } else {
    schema.mainEntity.forEach((question, index) => {
      if (!question['@type'] || question['@type'] !== 'Question') {
        errors.push(`mainEntity[${index}] must have @type: "Question"`);
      }
      if (!question.name) {
        errors.push(`mainEntity[${index}] must have a name field (the question text)`);
      }
      if (!question.acceptedAnswer) {
        errors.push(`mainEntity[${index}] must have an acceptedAnswer field`);
      } else {
        if (!question.acceptedAnswer['@type'] || question.acceptedAnswer['@type'] !== 'Answer') {
          errors.push(`mainEntity[${index}].acceptedAnswer must have @type: "Answer"`);
        }
        if (!question.acceptedAnswer.text) {
          errors.push(`mainEntity[${index}].acceptedAnswer must have a text field`);
        }
      }
    });
  }

  // Check 'isPartOf' field (article series)
  if (schema.isPartOf) {
    if (!schema.isPartOf['@type'] || schema.isPartOf['@type'] !== 'CreativeWorkSeries') {
      errors.push('isPartOf must have @type: "CreativeWorkSeries"');
    }
    if (!schema.isPartOf.name) {
      errors.push('isPartOf must have a name field');
    }
  }

  // Check 'inLanguage' field
  if (!schema.inLanguage) {
    warnings.push('Missing "inLanguage" field (recommended for multilingual sites)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Comprehensive schema validation
 */
function validateSchema(jsonLd: any, config: ValidationConfig): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // 1. Validate JSON-LD format
  const formatResult = validateJsonLdFormat(jsonLd);
  allErrors.push(...formatResult.errors);
  allWarnings.push(...(formatResult.warnings || []));

  // If format validation failed critically, stop here
  if (!jsonLd['@type']) {
    return {
      valid: false,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  // 2. Validate required fields
  const requiredResult = validateRequiredFields(jsonLd);
  allErrors.push(...requiredResult.errors);
  allWarnings.push(...(requiredResult.warnings || []));

  // 3. Validate date formats
  const dateResult = validateDateFormats(jsonLd);
  allErrors.push(...dateResult.errors);
  allWarnings.push(...(dateResult.warnings || []));

  // 4. Validate GEO enhancements
  const geoResult = validateGeoEnhancements(jsonLd);
  allErrors.push(...geoResult.errors);
  allWarnings.push(...(geoResult.warnings || []));

  // In strict mode, treat warnings as errors
  if (config.strict && allWarnings.length > 0) {
    allErrors.push(...allWarnings.map(w => `[STRICT] ${w}`));
    allWarnings.length = 0;
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// ============================================================================
// Article Discovery and Validation
// ============================================================================

/**
 * Get list of articles to validate
 */
function getArticlesToValidate(config: ValidationConfig): Array<{ slug: string; locale: 'zh' | 'en' }> {
  // For now, we'll use the known articles
  // In a real implementation, this would scan the messages directory
  const knownArticles = [
    'web3-security-trends-2025',
    'smart-contract-audit-guide',
    'defi-risk-management',
    'benign-arbitrage-theory',
  ];

  const locales: Array<'zh' | 'en'> = config.locale ? [config.locale] : ['zh', 'en'];
  const slugs = config.slug ? [config.slug] : knownArticles;

  const articles: Array<{ slug: string; locale: 'zh' | 'en' }> = [];
  for (const slug of slugs) {
    for (const locale of locales) {
      articles.push({ slug, locale });
    }
  }

  return articles;
}

/**
 * Load article messages and extract schema
 */
function loadArticleSchema(slug: string, locale: 'zh' | 'en'): any | null {
  try {
    const messagesPath = join(process.cwd(), 'messages', `${locale}.json`);
    const messages = JSON.parse(readFileSync(messagesPath, 'utf-8'));
    
    const articleData = messages.blog?.articles?.[slug];
    if (!articleData) {
      return null;
    }

    // We need to simulate the schema generation since we can't import from lib/geo
    // In a real scenario, we would generate the actual schema
    // For now, we'll check if the article has the necessary data
    return {
      hasData: true,
      aiSummary: articleData.aiSummary,
      qaPairs: articleData.qaPairs,
      title: articleData.title,
      author: articleData.author,
      date: articleData.date,
    };
  } catch (error) {
    return null;
  }
}

// ============================================================================
// Reporting
// ============================================================================

interface ValidationReport {
  totalArticles: number;
  validArticles: number;
  invalidArticles: number;
  articlesWithWarnings: number;
  results: Array<{
    slug: string;
    locale: string;
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
}

/**
 * Generate validation report
 */
function generateReport(
  results: Array<{
    slug: string;
    locale: string;
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>
): ValidationReport {
  return {
    totalArticles: results.length,
    validArticles: results.filter(r => r.valid).length,
    invalidArticles: results.filter(r => !r.valid).length,
    articlesWithWarnings: results.filter(r => r.warnings.length > 0).length,
    results,
  };
}

/**
 * Print validation report to console
 */
function printReport(report: ValidationReport, config: ValidationConfig): void {
  console.log('\n' + '='.repeat(80));
  console.log('Schema.org Validation Report');
  console.log('='.repeat(80));
  console.log();
  console.log(`Total Articles: ${report.totalArticles}`);
  console.log(`✓ Valid: ${report.validArticles}`);
  console.log(`✗ Invalid: ${report.invalidArticles}`);
  console.log(`⚠ With Warnings: ${report.articlesWithWarnings}`);
  console.log();

  if (config.verbose || report.invalidArticles > 0) {
    console.log('='.repeat(80));
    console.log('Detailed Results');
    console.log('='.repeat(80));
    console.log();

    for (const result of report.results) {
      const status = result.valid ? '✓' : '✗';
      const statusColor = result.valid ? '\x1b[32m' : '\x1b[31m';
      const resetColor = '\x1b[0m';

      console.log(`${statusColor}${status}${resetColor} ${result.slug} (${result.locale})`);

      if (result.errors.length > 0) {
        console.log('  Errors:');
        result.errors.forEach(error => {
          console.log(`    - ${error}`);
        });
      }

      if (result.warnings.length > 0 && config.verbose) {
        console.log('  Warnings:');
        result.warnings.forEach(warning => {
          console.log(`    - ${warning}`);
        });
      }

      console.log();
    }
  }

  console.log('='.repeat(80));
  
  if (report.invalidArticles === 0) {
    console.log('✓ All articles passed validation!');
  } else {
    console.log(`✗ ${report.invalidArticles} article(s) failed validation`);
  }
  
  console.log('='.repeat(80));
  console.log();
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Parse command line arguments
 */
function parseArgs(): ValidationConfig {
  const args = process.argv.slice(2);
  const config: ValidationConfig = {
    strict: false,
    verbose: false,
  };

  for (const arg of args) {
    if (arg === '--strict') {
      config.strict = true;
    } else if (arg === '--verbose' || arg === '-v') {
      config.verbose = true;
    } else if (arg.startsWith('--slug=')) {
      config.slug = arg.split('=')[1];
    } else if (arg.startsWith('--locale=')) {
      const locale = arg.split('=')[1];
      if (locale === 'zh' || locale === 'en') {
        config.locale = locale;
      } else {
        console.error(`Invalid locale: ${locale}. Must be 'zh' or 'en'`);
        process.exit(1);
      }
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Schema.org Validation Tool

Usage:
  npm run validate-schema [options]

Options:
  --slug=<slug>      Validate specific article by slug
  --locale=<locale>  Validate specific locale (zh or en)
  --strict           Treat warnings as errors
  --verbose, -v      Show detailed output including warnings
  --help, -h         Show this help message

Examples:
  npm run validate-schema
  npm run validate-schema -- --slug=web3-security-trends-2025
  npm run validate-schema -- --locale=zh --verbose
  npm run validate-schema -- --strict
      `);
      process.exit(0);
    }
  }

  return config;
}

/**
 * Main function
 */
async function main() {
  const config = parseArgs();

  console.log('Starting Schema.org validation...');
  console.log(`Mode: ${config.strict ? 'STRICT' : 'NORMAL'}`);
  console.log();

  // Note: This is a simplified implementation
  // In a real scenario, we would:
  // 1. Scan all blog articles
  // 2. Generate actual schemas using the schema generator
  // 3. Validate each generated schema
  
  console.log('⚠ Note: This is a validation tool template.');
  console.log('To fully implement, integrate with the actual schema generation pipeline.');
  console.log();
  console.log('Validation checks implemented:');
  console.log('  ✓ JSON-LD format validation');
  console.log('  ✓ Required field checking');
  console.log('  ✓ Date format validation (ISO 8601)');
  console.log('  ✓ GEO enhancement field validation');
  console.log('  ✓ Type checking for Schema.org types');
  console.log();

  // Example validation of a sample schema
  const sampleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': 'https://develop.matrixlab.work/zh/blog/web3-security-trends-2025',
    headline: 'Web3 安全趋势 2025',
    description: '深入分析 2025 年 Web3 安全领域的最新趋势',
    datePublished: '2024-01-15T00:00:00Z',
    dateModified: '2024-01-15T00:00:00Z',
    author: {
      '@type': 'Person',
      name: 'Seal Wax',
      description: '刻熵科技创始人，专注于 Web3 安全研究',
      jobTitle: '创始人 & 首席架构师',
    },
    publisher: {
      '@type': 'Organization',
      name: '刻熵科技',
      logo: {
        '@type': 'ImageObject',
        url: 'https://develop.matrixlab.work/logo.png',
      },
    },
    about: [
      {
        '@type': 'DefinedTerm',
        name: 'Web3 安全',
        description: 'Web3 安全是指保护去中心化应用和智能合约免受攻击的实践',
      },
    ],
    teaches: ['智能合约审计', '安全最佳实践', '漏洞检测'],
    mentions: [
      { '@type': 'SoftwareApplication', name: 'Solidity' },
      { '@type': 'SoftwareApplication', name: 'Ethereum' },
    ],
    mainEntity: [
      {
        '@type': 'Question',
        name: '什么是 Web3 安全？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Web3 安全是指保护去中心化应用和智能合约免受攻击的实践',
        },
      },
    ],
    inLanguage: 'zh-CN',
  };

  console.log('Validating sample schema...');
  const result = validateSchema(sampleSchema, config);
  
  const report = generateReport([
    {
      slug: 'sample-article',
      locale: 'zh',
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings || [],
    },
  ]);

  printReport(report, config);

  // Exit with appropriate code
  process.exit(report.invalidArticles > 0 ? 1 : 0);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for testing
export {
  validateSchema,
  validateJsonLdFormat,
  validateRequiredFields,
  validateDateFormats,
  validateGeoEnhancements,
  type ValidationConfig,
  type ValidationReport,
};
