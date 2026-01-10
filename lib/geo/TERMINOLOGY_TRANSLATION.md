# Terminology Translation Consistency

## Overview

This document describes the terminology translation system implemented for GEO optimization. The system ensures that technical terms are used consistently across Chinese and English content, maintaining semantic equivalence and improving content quality for multilingual audiences.

**Requirements**: 11.3, 11.5

## Features

### 1. Bilingual Terminology Dictionary

The terminology dictionary (`data/terminology.json`) now includes translation information for each term:

```json
{
  "term": "智能合约",
  "canonicalName": "智能合约",
  "translation": {
    "en": "Smart Contract",
    "zh": "智能合约",
    "enDefinition": "Self-executing programs deployed on blockchain...",
    "zhDefinition": "部署在区块链上的自动执行程序..."
  }
}
```

### 2. Translation Lookup Functions

The `TerminologyManager` class provides several methods for working with translations:

#### Get Translation

```typescript
const manager = loadTerminologyDictionary(dictionaryData);

// Get English translation of a Chinese term
const enTranslation = manager.getTranslation('智能合约', 'en');
// Returns: { term: 'Smart Contract', definition: '...' }

// Get Chinese translation of an English term
const zhTranslation = manager.getTranslation('Smart Contract', 'zh');
// Returns: { term: '智能合约', definition: '...' }
```

#### Get Bilingual Pair

```typescript
const pair = manager.getBilingualPair('智能合约');
// Returns:
// {
//   zh: '智能合约',
//   en: 'Smart Contract',
//   zhDefinition: '...',
//   enDefinition: '...'
// }
```

#### Format with English (for Chinese content)

```typescript
const formatted = manager.formatWithEnglish('智能合约');
// Returns: "智能合约（Smart Contract）"
```

### 3. Translation Consistency Validation

The system can validate that terms are used consistently across language versions:

```typescript
const issues = manager.validateTranslationConsistency(
  zhContent,
  enContent
);

// Returns array of issues where terms appear in one language but not the other
```

## Usage Guidelines

### For Content Authors

When writing Chinese articles, include the English term in parentheses on first mention:

**Correct**:
```
智能合约（Smart Contract）是部署在区块链上的自动执行程序...
```

**Incorrect**:
```
智能合约是部署在区块链上的自动执行程序...
```

**Exception**: Terms that are the same in both languages (like "Web3", "DeFi", "NFT") don't need parentheses.

### For Developers

#### Adding New Terms

When adding a new term to the dictionary, always include translation information:

```json
{
  "term": "新术语",
  "canonicalName": "新术语",
  "aliases": ["New Term", "别名"],
  "definition": "中文定义",
  "context": "使用场景",
  "relatedTerms": [],
  "firstDefinedIn": "/blog/article-slug",
  "category": "blockchain",
  "translation": {
    "en": "New Term",
    "zh": "新术语",
    "enDefinition": "English definition",
    "zhDefinition": "中文定义"
  }
}
```

#### Validating Translations

Run the validation script to check translation consistency:

```bash
npm run validate:terminology-translation
```

Or using tsx directly:

```bash
tsx scripts/validate-terminology-translation.ts
```

## Validation Checks

The validation script performs four checks:

### Check 1: Translation Information Completeness

Ensures all terminology entries have complete translation information (both Chinese and English terms and definitions).

### Check 2: Chinese-English Term Mapping Table

Generates a mapping table showing the correspondence between Chinese and English terms.

### Check 3: Term Usage in Blog Articles

Validates that terms used in Chinese articles have corresponding usage in English articles and vice versa.

### Check 4: English Term Preservation in Chinese Content

Checks that Chinese articles include English terms in parentheses on first mention (e.g., "智能合约（Smart Contract）").

## Benefits

### For Users

- **Clarity**: Chinese readers can see the English original term, reducing ambiguity
- **Learning**: Helps readers learn technical English terminology
- **Verification**: Enables readers to verify translations by searching for English terms

### For LLMs

- **Consistency**: Ensures LLMs can map concepts across languages
- **Accuracy**: Reduces translation errors when LLMs cite content
- **Context**: Provides both language versions for better understanding

### For SEO

- **Multilingual Search**: Content can be found using either Chinese or English terms
- **Rich Snippets**: Search engines can better understand multilingual content
- **International Reach**: Improves discoverability for global audiences

## Examples

### Example 1: Blog Article with Proper Formatting

```markdown
## 什么是智能合约审计？

在本文中，智能合约审计（Smart Contract Audit）指的是对区块链智能合约代码进行系统性安全检查的专业流程。

在 Web3 安全保障体系中，审计的目的是发现潜在的安全漏洞、逻辑错误和性能问题。
```

### Example 2: Using Translation Functions

```typescript
import { loadTerminologyDictionary } from '@/lib/geo/terminology';
import terminologyData from '@/data/terminology.json';

const manager = loadTerminologyDictionary(terminologyData);

// Format Chinese term with English
const formatted = manager.formatWithEnglish('去中心化金融');
console.log(formatted); // "去中心化金融（DeFi）"

// Get bilingual pair for display
const pair = manager.getBilingualPair('区块链');
console.log(pair);
// {
//   zh: '区块链',
//   en: 'Blockchain',
//   zhDefinition: '一种分布式数据库技术...',
//   enDefinition: 'A distributed database technology...'
// }
```

## Integration with GEO System

The terminology translation system integrates with other GEO components:

1. **Content Validator**: Checks that terms are properly formatted with English
2. **Knowledge Block Parser**: Recognizes both Chinese and English terms
3. **Q&A Generator**: Generates questions using both language versions
4. **Schema.org Generator**: Includes multilingual term definitions

## Future Enhancements

Potential improvements to the system:

1. **Automatic Formatting**: Tool to automatically add English terms to Chinese content
2. **Translation Memory**: Track common translation patterns
3. **Glossary Export**: Generate printable glossary for reference
4. **API Integration**: Connect to translation APIs for validation
5. **Browser Extension**: Highlight terms and show translations on hover

## References

- Requirements: 11.3 (Terminology translation consistency)
- Requirements: 11.5 (English term preservation in Chinese)
- Design Document: Section on Multilingual GEO Optimization
- Tasks: Task 24 - Implement terminology translation consistency
