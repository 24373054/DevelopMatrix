# GEO Library

This library provides tools for Generative Engine Optimization (GEO) - optimizing content for Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity.

## Components

### 1. Terminology Manager (`terminology.ts`)
Manages a centralized terminology dictionary to ensure consistent use of technical terms across all content.

```typescript
import { TerminologyManager, loadTerminologyDictionary } from '@/lib/geo';

const dictionary = await loadTerminologyDictionary();
const manager = new TerminologyManager(dictionary);

// Check if a term is defined
const hasTerm = manager.hasTerm('Web3');

// Get canonical name
const canonical = manager.getCanonicalName('web3'); // Returns 'Web3'

// Validate term usage
const isValid = manager.validateTermUsage('Web3', 'Some context');
```

### 2. Knowledge Block Parser (`knowledgeBlockParser.ts`)
Parses HTML content into structured knowledge blocks that are easily extractable by LLMs.

```typescript
import { KnowledgeBlockParser } from '@/lib/geo';

const parser = new KnowledgeBlockParser();
const blocks = parser.parse(htmlContent);

// Blocks are categorized as:
// - definition: Contains "X 是什么", "X 指的是"
// - explanation: Contains "因此", "结论是"
// - comparison: Contains tables or comparison structures
// - example: Contains examples
// - conclusion: Contains conclusion markers
```

### 3. Content Validator (`contentValidator.ts`)
Validates content quality for GEO optimization.

```typescript
import { ContentValidator } from '@/lib/geo';

const validator = new ContentValidator();
const report = validator.validate({
  id: 'article-1',
  title: 'Article Title',
  content: htmlContent,
  aiSummary: { /* ... */ },
});

// Check specific issues
console.log(report.metrics.paragraphLengthOk); // true/false
console.log(report.issues); // Array of quality issues
```

### 4. Q&A Generator (`qaGenerator.ts`)
Automatically generates Q&A pairs from article content to improve LLM understanding.

```typescript
import { QAGenerator, generateQA } from '@/lib/geo';

// Using the class
const generator = new QAGenerator({
  maxQAPairs: 10,
  includeDefinition: true,
  includeComparison: true,
  includeApplication: true,
  includeLimitation: true,
});

const qaCoverage = generator.generateFromArticle({
  id: 'web3-security',
  title: 'Web3 安全',
  content: htmlContent,
  aiSummary: {
    whatIs: 'Web3 安全是指...',
    whyImportant: '因为...',
    useCases: ['场景1', '场景2'],
    keyTakeaways: ['要点1', '要点2'],
  },
  keywords: ['Web3', '安全', '区块链'],
});

// Or using the convenience function
const qaCoverage = generateQA(article, { maxQAPairs: 5 });

// Access generated Q&A pairs
console.log(qaCoverage.qaPairs);
// [
//   {
//     question: '什么是Web3 安全？',
//     answer: 'Web3 安全是指...',
//     category: 'definition',
//     relatedConcepts: ['Web3', '安全']
//   },
//   // ...
// ]

// Check coverage
console.log(qaCoverage.coverage);
// {
//   hasDefinition: true,
//   hasComparison: true,
//   hasApplication: true,
//   hasLimitation: true
// }
```

## Q&A Generator Features

The Q&A Generator automatically creates four types of questions:

### 1. Definition Questions
- "什么是X？" (What is X?)
- "为什么X很重要？" (Why is X important?)

Generated from the `aiSummary.whatIs` and `aiSummary.whyImportant` fields.

### 2. Comparison Questions
- "X和Y有什么区别？" (What's the difference between X and Y?)

Automatically extracted from content patterns like:
- "X 和 Y 的区别"
- "X vs Y"
- "X 对比 Y"

### 3. Application Questions
- "X适用于哪些场景？" (What are the use cases for X?)
- "什么时候应该使用X？" (When should I use X?)

Generated from the `aiSummary.useCases` array.

### 4. Limitation Questions
- "X有哪些局限性？" (What are the limitations of X?)
- "使用X时需要注意什么？" (What should I be careful about when using X?)

Automatically extracted from content containing keywords like:
- 局限性 (limitations)
- 缺点 (disadvantages)
- 风险 (risks)
- 注意事项 (precautions)

## Configuration Options

### QAGeneratorConfig

```typescript
interface QAGeneratorConfig {
  maxQAPairs?: number;          // Maximum number of Q&A pairs (default: 10)
  includeDefinition?: boolean;  // Include definition questions (default: true)
  includeComparison?: boolean;  // Include comparison questions (default: true)
  includeApplication?: boolean; // Include application questions (default: true)
  includeLimitation?: boolean;  // Include limitation questions (default: true)
}
```

## Complete Example

```typescript
import { 
  QAGenerator, 
  ContentValidator, 
  KnowledgeBlockParser 
} from '@/lib/geo';

// 1. Parse knowledge blocks
const parser = new KnowledgeBlockParser();
const knowledgeBlocks = parser.parse(articleContent);

// 2. Generate Q&A pairs
const qaGenerator = new QAGenerator({ maxQAPairs: 8 });
const qaCoverage = qaGenerator.generateFromArticle({
  id: article.id,
  title: article.title,
  content: article.content,
  aiSummary: article.aiSummary,
  knowledgeBlocks: knowledgeBlocks,
  keywords: article.keywords,
});

// 3. Validate content quality
const validator = new ContentValidator();
const qualityReport = validator.validate({
  id: article.id,
  title: article.title,
  content: article.content,
  aiSummary: article.aiSummary,
  qaCoverage: qaCoverage,
});

// 4. Use the results
console.log('Generated Q&A pairs:', qaCoverage.qaPairs.length);
console.log('Coverage:', qaCoverage.coverage);
console.log('Quality score:', qualityReport.overallScore);
console.log('Issues:', qualityReport.issues);
```

## Testing

Run tests for the GEO library:

```bash
npm test -- lib/geo/__tests__
```

## Requirements Validation

The Q&A Generator validates the following requirements from the GEO specification:

- **Requirement 7.1**: Generates comparison questions ("X 和 Y 的区别")
- **Requirement 7.2**: Generates application scenario questions ("X 适用于哪些场景")
- **Requirement 7.3**: Generates limitation questions ("X 的局限性")
- **Requirement 7.4**: Supports step-by-step implementation questions
- **Requirement 7.5**: Supports best practices questions

## Property-Based Testing

The Q&A Generator will be validated using property-based tests to ensure:

- **Property 23**: Comparison question coverage for articles with multiple concepts
- **Property 24**: Application scenario coverage for technical articles
- **Property 25**: Limitation discussion coverage for technical articles
- **Property 26**: Implementation steps presence in how-to articles
- **Property 27**: Best practices section in technical guides

See `__tests__/properties/` for property-based test implementations.
