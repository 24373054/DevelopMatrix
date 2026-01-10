# Schema.org Enhancements for GEO Optimization

This document describes the enhanced Schema.org structured data implementation for blog articles, optimized for Large Language Model (LLM) understanding.

## Overview

The `schemaGenerator.ts` module extends the basic BlogPosting schema with GEO-specific fields that help LLMs better understand and extract information from our content.

## Enhanced Fields

### 1. `about` - Core Concepts (DefinedTerm[])

Defines the core concepts discussed in the article using Schema.org DefinedTerm.

**Example:**
```json
"about": [
  {
    "@type": "DefinedTerm",
    "name": "Web3安全",
    "description": "Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究",
    "inDefinedTermSet": "安全"
  }
]
```

**Purpose:** Helps LLMs identify the main topics and their authoritative definitions.

### 2. `teaches` - Knowledge Points (string[])

Lists the key knowledge points and takeaways taught in the article.

**Example:**
```json
"teaches": [
  "智能合约漏洞仍是最主要的攻击向量",
  "跨链桥因锁定大量资产成为黑客的主要目标",
  "Web3 安全需要持续演进的多层防御策略"
]
```

**Purpose:** Provides LLMs with a quick summary of what readers will learn.

### 3. `mentions` - Technologies and Tools (Thing[])

Identifies technologies, tools, frameworks, and concepts mentioned in the article.

**Example:**
```json
"mentions": [
  {
    "@type": "SoftwareApplication",
    "name": "Ethereum"
  },
  {
    "@type": "SoftwareApplication",
    "name": "Solidity"
  }
]
```

**Purpose:** Helps LLMs understand the technical context and related technologies.

### 4. `isPartOf` - Article Series (CreativeWorkSeries)

Indicates if the article is part of a series or collection.

**Example:**
```json
"isPartOf": {
  "@type": "CreativeWorkSeries",
  "name": "Web3 安全系列"
}
```

**Purpose:** Helps LLMs understand the broader context and find related articles.

### 5. `mainEntity` - Q&A Structure (Question[])

Embeds the Q&A structure directly in the schema for easy extraction.

**Example:**
```json
"mainEntity": [
  {
    "@type": "Question",
    "name": "什么是 Web3 安全趋势分析？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究..."
    }
  }
]
```

**Purpose:** Provides LLMs with structured Q&A data for direct answering.

## Usage

### Basic Usage

```typescript
import { generateEnhancedSchema } from '@/lib/geo/schemaGenerator';

const schema = generateEnhancedSchema({
  slug: 'article-slug',
  title: 'Article Title',
  description: 'Article description',
  category: 'Security',
  keywords: 'Web3, Security, Blockchain',
  author: 'Author Name',
  authorBio: 'Author biography',
  datePublished: '2024-12-30',
  locale: 'zh',
  aiSummary: {
    whatIs: '...',
    whyImportant: '...',
    useCases: [...],
    keyTakeaways: [...],
  },
  qaPairs: [...],
});
```

### With Helper Functions

```typescript
import {
  generateEnhancedSchema,
  extractCoreConcepts,
  extractMentionedTechnologies,
  determineArticleSeries,
} from '@/lib/geo/schemaGenerator';

// Extract core concepts from AI Summary
const coreConcepts = extractCoreConcepts(aiSummary, keywords);

// Extract mentioned technologies
const mentionedTechnologies = extractMentionedTechnologies(keywords, aiSummary);

// Determine article series from category
const seriesName = determineArticleSeries(category, locale);

// Generate schema with enhancements
const schema = generateEnhancedSchema({
  // ... basic options
  coreConcepts,
  mentionedTechnologies,
  seriesName,
});
```

### Validation

```typescript
import { validateEnhancedSchema } from '@/lib/geo/schemaGenerator';

const validation = validateEnhancedSchema(schema);

if (!validation.valid) {
  console.error('Schema validation errors:', validation.errors);
}
```

## Implementation in Blog Pages

The enhanced schema is automatically generated in `app/[locale]/blog/[slug]/page.tsx`:

```typescript
// Generate enhanced Schema.org structured data
const enhancedSchema = generateEnhancedSchema({
  slug,
  title: t('title'),
  description: t('excerpt'),
  category,
  keywords,
  author: t('author'),
  authorBio: t('authorBio'),
  datePublished: t('date'),
  locale: locale as 'zh' | 'en',
  aiSummary,
  qaPairs,
  seriesName,
  mentionedTechnologies,
  coreConcepts,
});

// Add to page as JSON-LD
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@id': `https://develop.matrixlab.work/${locale}/blog/${slug}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://develop.matrixlab.work/${locale}/blog/${slug}`,
  },
  ...enhancedSchema,
};
```

## Benefits for GEO

1. **Improved Extractability**: LLMs can easily identify and extract core concepts
2. **Better Context**: Technologies and series information provide context
3. **Direct Q&A Access**: Q&A structure enables direct answering without parsing HTML
4. **Knowledge Points**: Key takeaways are immediately accessible
5. **Semantic Clarity**: DefinedTerm provides authoritative definitions

## Validation

The schema generator includes validation to ensure:
- All required fields are present
- Date formats are valid (ISO 8601)
- GEO enhancement fields are populated
- Schema structure is correct

## Future Enhancements

Potential future additions:
- `citation`: References and sources
- `hasPart`: Sub-sections or chapters
- `workExample`: Code examples or demos
- `educationalLevel`: Target audience level
- `learningResourceType`: Type of educational content

## References

- [Schema.org BlogPosting](https://schema.org/BlogPosting)
- [Schema.org DefinedTerm](https://schema.org/DefinedTerm)
- [Schema.org Question](https://schema.org/Question)
- [Schema.org CreativeWorkSeries](https://schema.org/CreativeWorkSeries)
- [GEO Design Document](../../.kiro/specs/geo-optimization/design.md)
