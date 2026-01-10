/**
 * Schema.org Generator for GEO Optimization
 * 
 * This module generates enhanced Schema.org structured data for blog articles,
 * optimized for Large Language Model (LLM) understanding and extraction.
 * 
 * Key enhancements over basic BlogPosting schema:
 * - about: Core concepts discussed (DefinedTerm array)
 * - teaches: Knowledge points taught in the article
 * - mentions: Technologies, tools, and concepts mentioned
 * - isPartOf: Article series information
 * - mainEntity: Q&A structure for common questions
 */

import type {
  EnhancedBlogPosting,
  QAPair,
  AISummary,
  SchemaDefinedTerm,
  SchemaThing,
  SchemaQuestion,
  SchemaCreativeWorkSeries,
} from '@/types/geo';

/**
 * Options for generating enhanced schema
 */
export interface SchemaGeneratorOptions {
  /** Article slug/identifier */
  slug: string;
  
  /** Article title */
  title: string;
  
  /** Article description/excerpt */
  description: string;
  
  /** Article category */
  category: string;
  
  /** Keywords array */
  keywords: string;
  
  /** Author name */
  author: string;
  
  /** Author bio */
  authorBio?: string;
  
  /** Publication date (ISO 8601) */
  datePublished: string;
  
  /** Last modification date (ISO 8601) */
  dateModified?: string;
  
  /** Language locale */
  locale: 'zh' | 'en';
  
  /** AI Summary data */
  aiSummary?: AISummary;
  
  /** Q&A pairs */
  qaPairs?: QAPair[];
  
  /** Article series name (if part of a series) */
  seriesName?: string;
  
  /** Technologies/tools mentioned in the article */
  mentionedTechnologies?: string[];
  
  /** Core concepts defined in the article */
  coreConcepts?: Array<{ name: string; definition: string }>;
}

/**
 * Generate enhanced Schema.org BlogPosting structured data
 * 
 * This function creates a comprehensive Schema.org object that includes
 * all standard BlogPosting fields plus GEO-specific enhancements.
 * 
 * @param options - Configuration options for schema generation
 * @returns Enhanced BlogPosting schema object
 */
export function generateEnhancedSchema(
  options: SchemaGeneratorOptions
): EnhancedBlogPosting {
  const {
    slug,
    title,
    description,
    category,
    keywords,
    author,
    authorBio,
    datePublished,
    dateModified,
    locale,
    aiSummary,
    qaPairs,
    seriesName,
    mentionedTechnologies,
    coreConcepts,
  } = options;

  // Base URL for the site
  const baseUrl = 'https://develop.matrixlab.work';
  const languageCode = locale === 'zh' ? 'zh-CN' : 'en-US';

  // Build the enhanced schema
  const schema: EnhancedBlogPosting = {
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: `${baseUrl}/blog-images/${slug}-hero.webp`,
    datePublished: ensureISO8601(datePublished),
    dateModified: ensureISO8601(dateModified || datePublished),
    
    // Author information with complete professional details
    author: {
      '@type': 'Person',
      name: author,
      description: authorBio,
      url: author === 'Seal Wax' ? 'https://yz.matrixlab.work' : undefined,
      // Add jobTitle for professional context
      jobTitle: author === 'Seal Wax' 
        ? (locale === 'zh' ? '创始人 & 首席架构师' : 'Founder & Chief Architect')
        : author === 'Matrix Lab 安全团队'
        ? (locale === 'zh' ? '安全研究团队' : 'Security Research Team')
        : author === 'Matrix Lab 研究团队'
        ? (locale === 'zh' ? '研究团队' : 'Research Team')
        : undefined,
    },
    
    // Publisher information
    publisher: {
      '@type': 'Organization',
      name: locale === 'zh' ? '刻熵科技' : 'Ke Entropy Technology',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
      url: baseUrl,
    },
    
    // Language
    inLanguage: languageCode,
  };

  // Add 'about' field: Core concepts as DefinedTerms
  if (coreConcepts && Array.isArray(coreConcepts) && coreConcepts.length > 0) {
    schema.about = coreConcepts.map((concept) => ({
      '@type': 'DefinedTerm',
      name: concept.name,
      description: concept.definition,
      inDefinedTermSet: category,
    }));
  } else if (aiSummary) {
    // Fallback: Extract core concept from AI Summary
    schema.about = [
      {
        '@type': 'DefinedTerm',
        name: title,
        description: aiSummary.whatIs,
        inDefinedTermSet: category,
      },
    ];
  }

  // Add 'teaches' field: Knowledge points from AI Summary
  if (aiSummary && aiSummary.keyTakeaways && Array.isArray(aiSummary.keyTakeaways)) {
    schema.teaches = aiSummary.keyTakeaways;
  }

  // Add 'mentions' field: Technologies and tools
  if (mentionedTechnologies && Array.isArray(mentionedTechnologies) && mentionedTechnologies.length > 0) {
    schema.mentions = mentionedTechnologies.map((tech) => ({
      '@type': 'SoftwareApplication',
      name: tech,
    }));
  } else {
    // Extract from keywords as fallback
    const keywordArray = keywords.split(',').map((k) => k.trim());
    schema.mentions = keywordArray.slice(0, 5).map((keyword) => ({
      '@type': 'Thing',
      name: keyword,
    }));
  }

  // Add 'isPartOf' field: Article series
  if (seriesName) {
    schema.isPartOf = {
      '@type': 'CreativeWorkSeries',
      name: seriesName,
    };
  }

  // Add 'mainEntity' field: Q&A structure
  if (qaPairs && Array.isArray(qaPairs) && qaPairs.length > 0) {
    schema.mainEntity = qaPairs.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    }));
  }

  return schema;
}

/**
 * Extract core concepts from article content
 * 
 * This helper function attempts to identify core concepts from the article
 * by analyzing the AI Summary and keywords.
 * 
 * @param aiSummary - AI Summary data
 * @param keywords - Article keywords
 * @returns Array of core concepts with definitions
 */
export function extractCoreConcepts(
  aiSummary?: AISummary,
  keywords?: string
): Array<{ name: string; definition: string }> {
  const concepts: Array<{ name: string; definition: string }> = [];

  if (!aiSummary || !keywords) {
    return concepts;
  }

  // Extract primary concept from whatIs
  const keywordArray = keywords.split(',').map((k) => k.trim());
  
  // Use the first keyword as the primary concept
  if (keywordArray.length > 0 && aiSummary.whatIs) {
    concepts.push({
      name: keywordArray[0],
      definition: aiSummary.whatIs,
    });
  }

  return concepts;
}

/**
 * Extract mentioned technologies from article content
 * 
 * This helper function identifies technologies, tools, and frameworks
 * mentioned in the article based on keywords and AI Summary.
 * 
 * @param keywords - Article keywords
 * @param aiSummary - AI Summary data
 * @returns Array of technology names
 */
export function extractMentionedTechnologies(
  keywords?: string,
  aiSummary?: AISummary
): string[] {
  const technologies = new Set<string>();

  if (!keywords) {
    return [];
  }

  // Common Web3/blockchain technologies
  const techKeywords = [
    'Web3',
    'DeFi',
    'NFT',
    'Ethereum',
    'Solidity',
    'Smart Contract',
    'Blockchain',
    'Bitcoin',
    'Polygon',
    'Arbitrum',
    'Optimism',
    'IPFS',
    'MetaMask',
    'OpenZeppelin',
    'Hardhat',
    'Truffle',
    'Foundry',
  ];

  const keywordArray = keywords.split(',').map((k) => k.trim());

  // Check if any keyword matches known technologies
  keywordArray.forEach((keyword) => {
    techKeywords.forEach((tech) => {
      if (keyword.toLowerCase().includes(tech.toLowerCase())) {
        technologies.add(tech);
      }
    });
  });

  // Also check AI Summary use cases for technology mentions
  if (aiSummary?.useCases) {
    aiSummary.useCases.forEach((useCase) => {
      techKeywords.forEach((tech) => {
        if (useCase.includes(tech)) {
          technologies.add(tech);
        }
      });
    });
  }

  return Array.from(technologies);
}

/**
 * Determine article series from category
 * 
 * This helper function maps article categories to series names.
 * 
 * @param category - Article category
 * @param locale - Language locale
 * @returns Series name or undefined
 */
export function determineArticleSeries(
  category: string,
  locale: 'zh' | 'en'
): string | undefined {
  const seriesMap: Record<string, { zh: string; en: string }> = {
    '安全': { zh: 'Web3 安全系列', en: 'Web3 Security Series' },
    'Security': { zh: 'Web3 安全系列', en: 'Web3 Security Series' },
    'DeFi': { zh: 'DeFi 深度解析系列', en: 'DeFi Deep Dive Series' },
    '技术': { zh: '区块链技术系列', en: 'Blockchain Technology Series' },
    'Technology': { zh: '区块链技术系列', en: 'Blockchain Technology Series' },
  };

  const series = seriesMap[category];
  return series ? series[locale] : undefined;
}

/**
 * Generate complete JSON-LD script tag content
 * 
 * This function generates the complete JSON-LD string that can be
 * inserted into a script tag in the HTML head.
 * 
 * @param options - Schema generation options
 * @returns JSON-LD string ready for insertion
 */
export function generateSchemaJsonLd(
  options: SchemaGeneratorOptions
): string {
  const schema = generateEnhancedSchema(options);
  
  // Add @context
  const jsonLd = {
    '@context': 'https://schema.org',
    ...schema,
  };

  return JSON.stringify(jsonLd, null, 2);
}

/**
 * Validate enhanced schema
 * 
 * This function performs basic validation on the generated schema
 * to ensure all required fields are present.
 * 
 * @param schema - Enhanced schema to validate
 * @returns Validation result with errors if any
 */
export function validateEnhancedSchema(schema: EnhancedBlogPosting): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!schema.headline) {
    errors.push('Missing required field: headline');
  }

  if (!schema.description) {
    errors.push('Missing required field: description');
  }

  if (!schema.author) {
    errors.push('Missing required field: author');
  }

  if (!schema.datePublished) {
    errors.push('Missing required field: datePublished');
  }

  // Check date format (basic ISO 8601 check)
  if (schema.datePublished && !isValidISO8601(schema.datePublished)) {
    errors.push('Invalid datePublished format (must be ISO 8601)');
  }

  if (schema.dateModified && !isValidISO8601(schema.dateModified)) {
    errors.push('Invalid dateModified format (must be ISO 8601)');
  }

  // Check GEO enhancement fields
  if (!schema.about || schema.about.length === 0) {
    errors.push('Warning: Missing "about" field (core concepts)');
  }

  if (!schema.teaches || schema.teaches.length === 0) {
    errors.push('Warning: Missing "teaches" field (knowledge points)');
  }

  if (!schema.mainEntity || schema.mainEntity.length === 0) {
    errors.push('Warning: Missing "mainEntity" field (Q&A structure)');
  }

  return {
    valid: errors.filter((e) => !e.startsWith('Warning')).length === 0,
    errors,
  };
}

/**
 * Ensure a date string is in valid ISO 8601 format with time component
 * 
 * @param dateString - Date string to format
 * @returns ISO 8601 formatted date string with time
 */
function ensureISO8601(dateString: string): string {
  // If already in full ISO 8601 format with time, return as is
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)) {
    return dateString;
  }
  
  // If it's just a date (YYYY-MM-DD), add time component
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return `${dateString}T00:00:00Z`;
  }
  
  // Try to parse and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    // If parsing fails, return original with warning
    console.warn(`Invalid date format: ${dateString}`);
  }
  
  return dateString;
}

/**
 * Check if a string is a valid ISO 8601 date
 * 
 * @param dateString - Date string to validate
 * @returns True if valid ISO 8601 format
 */
function isValidISO8601(dateString: string): boolean {
  // ISO 8601 formats:
  // - YYYY-MM-DD
  // - YYYY-MM-DDTHH:mm:ss
  // - YYYY-MM-DDTHH:mm:ss.sss
  // - YYYY-MM-DDTHH:mm:ssZ
  // - YYYY-MM-DDTHH:mm:ss.sssZ
  // - YYYY-MM-DDTHH:mm:ss+HH:mm
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  return iso8601Regex.test(dateString);
}
