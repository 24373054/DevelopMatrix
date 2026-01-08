# GEO 优化设计文档

## Overview

本设计文档详细说明了如何为刻熵科技官网实施专业级的生成式引擎优化（GEO）。GEO 的核心目标是让网站内容成为大语言模型（LLM）在回答问题时"最省力、最可信、最安全的引用对象"。

与传统 SEO 不同，GEO 优化的对象是 AI 模型而非搜索引擎爬虫。我们需要从可抽取性、语义确定性、权威信号、可验证性和 LLM 友好结构五个核心维度进行系统性优化。

本设计基于网站现有的 Next.js 14 + next-intl 技术栈，采用渐进式优化策略，确保在不破坏现有 SEO 成果的前提下，显著提升 AI 引用率。

## Architecture

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Content Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Blog Articles│  │  Product Docs│  │  About Pages │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              GEO Enhancement Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AI Summary   │  │ Knowledge    │  │  Q&A         │  │
│  │ Generator    │  │ Block Parser │  │  Generator   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Structured Data Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Schema.org   │  │  Metadata    │  │  Hreflang    │  │
│  │ Enhanced     │  │  Enrichment  │  │  Relations   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Rendering Layer                         │
│              (Next.js Server Components)                 │
└─────────────────────────────────────────────────────────┘
```

### 技术栈选择

- **内容管理**: JSON-based i18n messages (现有)
- **结构化数据**: Schema.org JSON-LD
- **AI Summary 生成**: 服务端组件 + 工具函数
- **知识块解析**: 自定义 Markdown/HTML 解析器
- **测试验证**: 自动化 LLM 测试脚本

## Components and Interfaces

### 1. AI Summary Component

为每篇核心文章生成专门为 AI 设计的结构化摘要。


**接口定义**:

```typescript
interface AISummary {
  whatIs: string;           // X 是什么
  whyImportant: string;     // 为什么重要
  useCases: string[];       // 适用场景
  keyTakeaways: string[];   // 核心要点
}

interface ArticleWithAISummary {
  title: string;
  content: string;
  aiSummary: AISummary;
  structuredContent: KnowledgeBlock[];
}
```

**组件实现**:

```typescript
// components/Blog/AISummary.tsx
export function AISummary({ summary }: { summary: AISummary }) {
  return (
    <section 
      className="ai-summary" 
      itemScope 
      itemType="https://schema.org/DefinedTerm"
      aria-label="AI Summary"
    >
      <h2>AI Summary</h2>
      <div className="summary-content">
        <div className="what-is">
          <h3>What is it?</h3>
          <p>{summary.whatIs}</p>
        </div>
        <div className="why-important">
          <h3>Why Important?</h3>
          <p>{summary.whyImportant}</p>
        </div>
        <div className="use-cases">
          <h3>Use Cases</h3>
          <ul>
            {summary.useCases.map((useCase, i) => (
              <li key={i}>{useCase}</li>
            ))}
          </ul>
        </div>
        <div className="key-takeaways">
          <h3>Key Takeaways</h3>
          <ul>
            {summary.keyTakeaways.map((takeaway, i) => (
              <li key={i}>{takeaway}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

### 2. Knowledge Block Parser

将长文内容拆分为可独立引用的知识块。

**数据模型**:

```typescript
interface KnowledgeBlock {
  id: string;
  type: 'definition' | 'explanation' | 'comparison' | 'example' | 'conclusion';
  title: string;
  content: string;
  relatedBlocks: string[];  // 关联的其他知识块 ID
  extractability: number;   // 可抽取性评分 0-1
}
```


**解析器实现**:

```typescript
// lib/geo/knowledgeBlockParser.ts
export class KnowledgeBlockParser {
  parse(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    const dom = parseHTML(htmlContent);
    
    // 识别定义块 (包含 "是什么"、"指的是" 等关键词)
    const definitions = this.extractDefinitions(dom);
    blocks.push(...definitions);
    
    // 识别解释块 (包含 "因此"、"结论是" 等)
    const explanations = this.extractExplanations(dom);
    blocks.push(...explanations);
    
    // 识别对比块 (表格、列表对比)
    const comparisons = this.extractComparisons(dom);
    blocks.push(...comparisons);
    
    return blocks;
  }
  
  private extractDefinitions(dom: Document): KnowledgeBlock[] {
    // 查找包含定义句式的段落
    const definitionPatterns = [
      /(.+)是指(.+)/,
      /(.+)指的是(.+)/,
      /(.+)定义为(.+)/,
    ];
    // 实现逻辑...
  }
}
```

### 3. Q&A Generator

基于文章内容自动生成常见问题及答案。

**数据模型**:

```typescript
interface QAPair {
  question: string;
  answer: string;
  category: 'definition' | 'comparison' | 'application' | 'limitation';
  relatedConcepts: string[];
}

interface QuestionCoverageMatrix {
  article: string;
  qaPairs: QAPair[];
  coverage: {
    hasDefinition: boolean;
    hasComparison: boolean;
    hasApplication: boolean;
    hasLimitation: boolean;
  };
}
```

**生成器实现**:

```typescript
// lib/geo/qaGenerator.ts
export class QAGenerator {
  generateFromArticle(article: ArticleWithAISummary): QAPair[] {
    const qaPairs: QAPair[] = [];
    
    // 1. 生成定义类问题
    qaPairs.push({
      question: `什么是${article.title}？`,
      answer: article.aiSummary.whatIs,
      category: 'definition',
      relatedConcepts: []
    });
    
    // 2. 生成应用场景问题
    qaPairs.push({
      question: `${article.title}适用于哪些场景？`,
      answer: article.aiSummary.useCases.join('；'),
      category: 'application',
      relatedConcepts: []
    });
    
    // 3. 从内容中提取对比问题
    const comparisons = this.extractComparisons(article.content);
    qaPairs.push(...comparisons);
    
    return qaPairs;
  }
}
```


### 4. Concept Authority Marker

为核心概念添加权威信号标记。

**数据模型**:

```typescript
interface ConceptAuthority {
  concept: string;
  definition: string;
  source: {
    type: 'research' | 'experience' | 'academic';
    description: string;
    evidence?: string;  // 如 "20+ 项目经验"
  };
  context: string;  // 使用场景，如 "在 Web3 智能合约审计中"
  firstMentionedIn: string;  // 首次定义的文章
}
```

**标记组件**:

```typescript
// components/Blog/ConceptMarker.tsx
export function ConceptMarker({ 
  concept, 
  authority 
}: { 
  concept: string; 
  authority: ConceptAuthority 
}) {
  return (
    <span 
      className="concept-marker"
      itemScope
      itemType="https://schema.org/DefinedTerm"
      data-concept={concept}
    >
      <span itemProp="name">{concept}</span>
      <meta itemProp="description" content={authority.definition} />
      <meta itemProp="inDefinedTermSet" content={authority.context} />
    </span>
  );
}
```

### 5. Enhanced Schema.org Generator

增强现有的结构化数据，添加更多 GEO 相关的元数据。

**增强的 Schema.org 类型**:

```typescript
interface EnhancedBlogPosting extends BlogPosting {
  // 标准字段
  headline: string;
  description: string;
  author: Person;
  datePublished: string;
  
  // GEO 增强字段
  about: DefinedTerm[];  // 文章涉及的核心概念
  teaches: string[];     // 文章教授的知识点
  mentions: Thing[];     // 提及的技术、工具、概念
  isPartOf: {
    "@type": "CreativeWorkSeries";
    name: string;  // 如 "Web3 安全系列"
  };
  citation: CreativeWork[];  // 引用的来源
  
  // 问答结构
  mainEntity?: Question[];
}

interface Question {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}
```


## Data Models

### 1. GEO-Optimized Article Structure

```typescript
interface GEOArticle {
  // 基础信息
  id: string;
  title: string;
  slug: string;
  locale: 'zh' | 'en';
  
  // 内容
  content: string;  // HTML 格式
  rawContent: string;  // 原始 Markdown
  
  // GEO 增强
  aiSummary: AISummary;
  knowledgeBlocks: KnowledgeBlock[];
  qaCoverage: QuestionCoverageMatrix;
  concepts: ConceptAuthority[];
  
  // 元数据
  metadata: {
    author: AuthorInfo;
    datePublished: string;
    dateModified: string;
    category: string;
    keywords: string[];
    readTime: number;
  };
  
  // 结构化数据
  structuredData: EnhancedBlogPosting;
  
  // 多语言
  alternateVersions: {
    locale: string;
    url: string;
  }[];
}
```

### 2. Author Authority Profile

```typescript
interface AuthorInfo {
  name: string;
  role: string;
  bio: string;
  expertise: string[];  // 专业领域
  credentials: {
    type: 'academic' | 'professional' | 'research';
    description: string;
    institution?: string;
  }[];
  publications?: string[];  // 发表的论文、文章
  projects?: {
    name: string;
    description: string;
    count?: number;  // 如 "20+ 项目"
  }[];
  contact: {
    email?: string;
    website?: string;
  };
}
```

### 3. Terminology Dictionary

全站统一的术语词典，确保概念主权。

```typescript
interface TerminologyEntry {
  term: string;
  canonicalName: string;  // 规范名称
  aliases: string[];      // 同义词（避免使用）
  definition: string;
  context: string;        // 使用上下文
  relatedTerms: string[];
  firstDefinedIn: string; // 首次定义的文章 URL
  category: 'web3' | 'defi' | 'security' | 'blockchain';
}

interface TerminologyDictionary {
  version: string;
  lastUpdated: string;
  entries: TerminologyEntry[];
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

基于需求分析，我们识别出以下可测试的正确性属性。这些属性将通过属性测试来验证系统的正确性。

### Content Structure Properties

**Property 1: Definition sentence presence**
*For any* blog article, the content should contain at least one clear definition sentence using patterns like "X 是什么", "X 指的是", or "X 定义为"
**Validates: Requirements 1.1**

**Property 2: Conclusion marker presence**
*For any* blog article with conclusions, the content should use explicit conclusion markers like "因此", "结论是", or "综上所述"
**Validates: Requirements 1.2**

**Property 3: List structure formatting**
*For any* content containing list information, the HTML should use proper `<ul>` or `<ol>` tags rather than plain text enumeration
**Validates: Requirements 1.3**

**Property 4: Paragraph length constraint**
*For any* blog article, individual paragraphs should not exceed 300 characters to avoid long散文式 expressions
**Validates: Requirements 1.4**

### Semantic Certainty Properties

**Property 5: Declarative sentence usage**
*For any* blog article, the content should minimize rhetorical questions (sentences ending with "吗？" or "？" in interrogative form)
**Validates: Requirements 2.1**

**Property 6: Vague term avoidance**
*For any* blog article, the content should avoid vague terms like "可能", "也许", "大概" in technical descriptions
**Validates: Requirements 2.2**

### Authority Signal Properties

**Property 7: Author information completeness**
*For any* blog article, the metadata should include both author name and authorBio fields
**Validates: Requirements 3.1**

**Property 8: Context specification**
*For any* technical article, the content should include context markers like "在...中" to specify use cases
**Validates: Requirements 3.2**

**Property 9: Quantified experience evidence**
*For any* article claiming experience, the content should include quantified evidence patterns like "N+ 项目" or "N 年经验"
**Validates: Requirements 3.3**

**Property 10: Knowledge source attribution**
*For any* technical article, the metadata or content should indicate knowledge source (research team, project experience, etc.)
**Validates: Requirements 3.4**

### Verifiability Properties

**Property 11: Hyperbole avoidance**
*For any* blog article, the content should avoid hyperbolic marketing terms like "颠覆", "史无前例", "革命性"
**Validates: Requirements 4.2**

**Property 12: Citation presence**
*For any* article making technical claims, the content should include citations, references, or external links
**Validates: Requirements 4.3**


### LLM-Friendly Structure Properties

**Property 13: Q&A component presence**
*For any* core blog article, the page should include a Q&A component or FAQ section
**Validates: Requirements 5.1**

**Property 14: Definition block structure**
*For any* knowledge block of type "definition", it should follow the "Definition → Explanation → Use cases" structure
**Validates: Requirements 5.2**

**Property 15: Comparison table usage**
*For any* article containing comparisons between concepts, the content should use HTML table structures
**Validates: Requirements 5.3**

**Property 16: Bullet-point summary presence**
*For any* blog article, the content should include at least one section with bullet-point formatted key takeaways
**Validates: Requirements 5.4**

**Property 17: Knowledge block decomposition**
*For any* blog article, the content should be parseable into multiple independent knowledge blocks
**Validates: Requirements 5.5**

### AI Summary Properties

**Property 18: AI Summary component presence**
*For any* blog article, the page should render an AI Summary component
**Validates: Requirements 6.1**

**Property 19: AI Summary whatIs field**
*For any* AI Summary, it should contain a non-empty whatIs field defining the core concept
**Validates: Requirements 6.2**

**Property 20: AI Summary whyImportant field**
*For any* AI Summary, it should contain a non-empty whyImportant field explaining significance
**Validates: Requirements 6.3**

**Property 21: AI Summary useCases field**
*For any* AI Summary, it should contain a useCases array with at least one use case
**Validates: Requirements 6.4**

**Property 22: AI Summary structured format**
*For any* AI Summary, the useCases and keyTakeaways fields should be arrays (not plain strings)
**Validates: Requirements 6.5**

### Question Coverage Properties

**Property 23: Comparison question coverage**
*For any* article discussing multiple related concepts, the Q&A coverage matrix should include at least one comparison-type question
**Validates: Requirements 7.1**

**Property 24: Application scenario coverage**
*For any* technical article, the Q&A coverage matrix should include at least one application-type question
**Validates: Requirements 7.2**

**Property 25: Limitation discussion coverage**
*For any* technical article, the Q&A coverage matrix should include at least one limitation-type question
**Validates: Requirements 7.3**

**Property 26: Implementation steps presence**
*For any* how-to article, the content should include ordered lists or step-by-step instructions
**Validates: Requirements 7.4**

**Property 27: Best practices section**
*For any* technical guide article, the content should include a section discussing best practices
**Validates: Requirements 7.5**


### Concept Sovereignty Properties

**Property 28: First-mention definition**
*For any* core concept in the terminology dictionary, its first mention in an article should include an explicit definition
**Validates: Requirements 8.1**

**Property 29: Terminology consistency**
*For any* concept in the terminology dictionary, all articles should use the canonical name rather than aliases
**Validates: Requirements 8.2, 8.5**

**Property 30: Definition sentence format**
*For any* concept definition, it should use the format "在本文中，XXX 指的是……" or similar explicit patterns
**Validates: Requirements 8.3**

### Structured Data Properties

**Property 31: Schema.org JSON-LD presence**
*For any* blog article page, the HTML should contain a valid Schema.org JSON-LD script tag
**Validates: Requirements 10.1**

**Property 32: BlogPosting type usage**
*For any* blog article's structured data, the @type field should be "BlogPosting" or "Article"
**Validates: Requirements 10.2**

**Property 33: Author structured data completeness**
*For any* blog article's structured data, the author field should include name, type, and description
**Validates: Requirements 10.3**

**Property 34: Relationship markup presence**
*For any* blog article's structured data, it should include at least one relationship field (isPartOf, mentions, or about)
**Validates: Requirements 10.4**

**Property 35: Date fields presence**
*For any* blog article's structured data, it should include both datePublished and dateModified fields in ISO 8601 format
**Validates: Requirements 10.5**

### Multilingual Properties

**Property 36: Feature parity across languages**
*For any* blog article, both Chinese and English versions should have equivalent GEO features (AI Summary, knowledge blocks, Q&A)
**Validates: Requirements 11.1**

**Property 37: Language metadata presence**
*For any* page, the HTML should include lang attribute and structured data should include inLanguage field
**Validates: Requirements 11.2**

**Property 38: Terminology translation consistency**
*For any* concept in the terminology dictionary, the definition should be semantically equivalent across language versions
**Validates: Requirements 11.3**

**Property 39: Hreflang link presence**
*For any* page with multiple language versions, the HTML should include hreflang link tags for all alternate versions
**Validates: Requirements 11.4**

**Property 40: English term preservation in Chinese**
*For any* technical term in Chinese articles, the first mention should include the English original in parentheses
**Validates: Requirements 11.5**


## Error Handling

### Content Parsing Errors

**场景**: 解析 HTML 内容时遇到格式错误或不完整的标签

**处理策略**:
- 使用容错的 HTML 解析器（如 jsdom 或 cheerio）
- 记录解析警告但不中断流程
- 对于无法解析的内容块，标记为 `extractability: 0`
- 提供详细的错误日志供内容团队修复

**示例**:

```typescript
try {
  const blocks = parser.parse(htmlContent);
} catch (error) {
  logger.warn('Failed to parse article', { 
    articleId, 
    error: error.message 
  });
  // 返回空的知识块数组，但不阻止页面渲染
  return [];
}
```

### Missing AI Summary

**场景**: 文章缺少 AI Summary 数据

**处理策略**:
- 在开发环境显示警告提示
- 在生产环境优雅降级，不显示 AI Summary 组件
- 提供自动生成 AI Summary 的工具脚本
- 在构建时检查并报告缺失的 AI Summary

**示例**:

```typescript
export function ArticleWithAISummary({ article }: Props) {
  if (!article.aiSummary) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing AI Summary for article: ${article.id}`);
    }
    return <ArticleContent content={article.content} />;
  }
  
  return (
    <>
      <AISummary summary={article.aiSummary} />
      <ArticleContent content={article.content} />
    </>
  );
}
```

### Terminology Dictionary Conflicts

**场景**: 不同文章对同一概念使用了不同的定义

**处理策略**:
- 在构建时检测术语冲突
- 生成冲突报告供内容团队审查
- 优先使用术语词典中的规范定义
- 提供术语一致性检查工具

**示例**:

```typescript
function detectTerminologyConflicts(
  dictionary: TerminologyDictionary,
  articles: GEOArticle[]
): ConflictReport[] {
  const conflicts: ConflictReport[] = [];
  
  for (const article of articles) {
    for (const concept of article.concepts) {
      const canonical = dictionary.entries.find(
        e => e.term === concept.concept
      );
      
      if (canonical && canonical.definition !== concept.definition) {
        conflicts.push({
          term: concept.concept,
          canonicalDefinition: canonical.definition,
          articleDefinition: concept.definition,
          articleId: article.id
        });
      }
    }
  }
  
  return conflicts;
}
```

### Schema.org Validation Errors

**场景**: 生成的结构化数据不符合 Schema.org 规范

**处理策略**:
- 使用 schema-dts 类型定义确保类型安全
- 在构建时验证 JSON-LD 格式
- 提供详细的验证错误信息
- 对于非关键字段，允许缺失但记录警告

**示例**:

```typescript
import { BlogPosting } from 'schema-dts';

function validateStructuredData(data: BlogPosting): ValidationResult {
  const errors: string[] = [];
  
  if (!data.headline) {
    errors.push('Missing required field: headline');
  }
  
  if (!data.author) {
    errors.push('Missing required field: author');
  }
  
  if (data.datePublished && !isValidISO8601(data.datePublished)) {
    errors.push('Invalid datePublished format');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Multilingual Sync Issues

**场景**: 中英文版本的 GEO 特性不一致

**处理策略**:
- 在构建时比较两个语言版本的特性
- 生成差异报告
- 提供自动同步工具
- 允许某些内容的语言特定差异（如文化相关的例子）

**示例**:

```typescript
function checkMultilingualParity(
  zhArticle: GEOArticle,
  enArticle: GEOArticle
): ParityReport {
  const issues: string[] = [];
  
  if (!zhArticle.aiSummary && enArticle.aiSummary) {
    issues.push('Chinese version missing AI Summary');
  }
  
  if (zhArticle.knowledgeBlocks.length !== enArticle.knowledgeBlocks.length) {
    issues.push('Knowledge block count mismatch');
  }
  
  return {
    hasParity: issues.length === 0,
    issues
  };
}
```


## Testing Strategy

本项目采用双重测试策略：单元测试验证具体功能，属性测试验证通用正确性。

### Unit Testing

单元测试覆盖以下方面：

**1. 组件渲染测试**
- AI Summary 组件正确渲染所有字段
- Knowledge Block 组件正确显示不同类型的块
- Q&A 组件正确展示问答对

**2. 解析器功能测试**
- Knowledge Block Parser 正确识别定义句
- Knowledge Block Parser 正确识别结论句
- Q&A Generator 正确生成不同类型的问题

**3. 数据转换测试**
- 文章内容正确转换为 GEO 结构
- 术语词典正确加载和查询
- 结构化数据正确生成 JSON-LD

**4. 边界情况测试**
- 空内容的处理
- 缺失字段的降级
- 格式错误的容错

**测试框架**: Jest + React Testing Library

**示例**:

```typescript
describe('AISummary Component', () => {
  it('should render all required fields', () => {
    const summary: AISummary = {
      whatIs: 'GEO 是生成式引擎优化',
      whyImportant: '提高 AI 引用率',
      useCases: ['技术博客', '产品文档'],
      keyTakeaways: ['优化结构', '增强元数据']
    };
    
    const { getByText } = render(<AISummary summary={summary} />);
    
    expect(getByText('GEO 是生成式引擎优化')).toBeInTheDocument();
    expect(getByText('提高 AI 引用率')).toBeInTheDocument();
    expect(getByText('技术博客')).toBeInTheDocument();
  });
});
```

### Property-Based Testing

属性测试验证系统的通用正确性属性。我们使用 **fast-check** 作为属性测试库。

**配置要求**:
- 每个属性测试至少运行 100 次迭代
- 每个测试必须标注对应的设计文档中的属性编号
- 使用明确的注释格式：`// Feature: geo-optimization, Property N: [property text]`

**测试组织**:

```typescript
// __tests__/properties/content-structure.test.ts

import fc from 'fast-check';

describe('Content Structure Properties', () => {
  
  // Feature: geo-optimization, Property 1: Definition sentence presence
  it('should contain definition sentences in all articles', () => {
    fc.assert(
      fc.property(
        articleGenerator(),
        (article) => {
          const hasDefinition = containsDefinitionPattern(article.content);
          return hasDefinition;
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Feature: geo-optimization, Property 4: Paragraph length constraint
  it('should not have paragraphs exceeding 300 characters', () => {
    fc.assert(
      fc.property(
        articleGenerator(),
        (article) => {
          const paragraphs = extractParagraphs(article.content);
          return paragraphs.every(p => p.length <= 300);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**生成器设计**:

为了有效测试，我们需要设计智能的数据生成器：

```typescript
// __tests__/generators/article.generator.ts

function articleGenerator(): fc.Arbitrary<GEOArticle> {
  return fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 10, maxLength: 100 }),
    content: htmlContentGenerator(),
    aiSummary: aiSummaryGenerator(),
    knowledgeBlocks: fc.array(knowledgeBlockGenerator(), { minLength: 1 }),
    metadata: metadataGenerator()
  });
}

function htmlContentGenerator(): fc.Arbitrary<string> {
  return fc.array(
    fc.oneof(
      definitionParagraphGenerator(),
      explanationParagraphGenerator(),
      listGenerator(),
      tableGenerator()
    ),
    { minLength: 3, maxLength: 10 }
  ).map(blocks => blocks.join('\n'));
}

function definitionParagraphGenerator(): fc.Arbitrary<string> {
  return fc.tuple(
    fc.string({ minLength: 5, maxLength: 20 }),
    fc.string({ minLength: 20, maxLength: 100 })
  ).map(([term, definition]) => 
    `<p>${term}是指${definition}。</p>`
  );
}
```

**属性测试覆盖**:

根据设计文档中的 40 个正确性属性，我们将实现以下属性测试：

1. **Content Structure Properties** (Properties 1-4): 4 个测试
2. **Semantic Certainty Properties** (Properties 5-6): 2 个测试
3. **Authority Signal Properties** (Properties 7-10): 4 个测试
4. **Verifiability Properties** (Properties 11-12): 2 个测试
5. **LLM-Friendly Structure Properties** (Properties 13-17): 5 个测试
6. **AI Summary Properties** (Properties 18-22): 5 个测试
7. **Question Coverage Properties** (Properties 23-27): 5 个测试
8. **Concept Sovereignty Properties** (Properties 28-30): 3 个测试
9. **Structured Data Properties** (Properties 31-35): 5 个测试
10. **Multilingual Properties** (Properties 36-40): 5 个测试

**总计**: 40 个属性测试

### Integration Testing

集成测试验证完整的 GEO 优化流程：

**1. 端到端文章处理**
- 从原始 JSON 到完整的 GEO 优化页面
- 验证所有组件正确集成
- 检查结构化数据正确嵌入

**2. 构建时验证**
- 术语一致性检查
- 多语言对等性检查
- Schema.org 验证

**3. LLM 引用测试（手动）**
- 在 ChatGPT/Claude/Perplexity 中测试关键问题
- 验证网站内容是否被正确引用
- 记录引用质量和准确性

**测试框架**: Playwright (E2E)

### Test Coverage Goals

- 单元测试覆盖率: > 80%
- 属性测试: 100% 覆盖所有正确性属性
- 集成测试: 覆盖所有关键用户路径
- 手动 LLM 测试: 每月至少一次


## Implementation Considerations

### Content Migration Strategy

现有博客文章需要逐步迁移到 GEO 优化格式：

**Phase 1: 基础设施搭建**
- 实现 AI Summary 组件
- 实现 Knowledge Block Parser
- 建立术语词典

**Phase 2: 核心文章优化**
- 优先优化访问量最高的文章
- 为每篇文章添加 AI Summary
- 重构内容结构以提高可抽取性

**Phase 3: 全站推广**
- 优化所有现有文章
- 建立新文章的 GEO 规范
- 培训内容团队

### Performance Optimization

GEO 优化不应影响页面性能：

**1. 服务端渲染**
- 所有 GEO 处理在构建时完成
- 不在客户端进行复杂解析
- 使用 Next.js 静态生成

**2. 数据缓存**
- 缓存解析后的知识块
- 缓存生成的结构化数据
- 使用增量静态再生成（ISR）

**3. 代码分割**
- AI Summary 组件按需加载
- Q&A 组件懒加载
- 减少初始 bundle 大小

### Content Authoring Workflow

为内容团队提供友好的创作流程：

**1. 模板系统**
```markdown
---
title: 文章标题
category: 技术分析
author: Seal Wax
---

## AI Summary
- **What is it**: [核心定义]
- **Why Important**: [重要性说明]
- **Use Cases**: 
  - [场景1]
  - [场景2]

## 核心概念定义

在本文中，[概念名称]指的是[明确定义]。

## 主要内容

[使用清晰的段落和列表...]

## 结论

因此，我们可以得出结论：[明确的结论]。
```

**2. 验证工具**
- 实时检查 GEO 规范遵守情况
- 提示缺失的必需元素
- 评估内容的可抽取性评分

**3. 预览功能**
- 显示 AI Summary 渲染效果
- 显示知识块分解结果
- 显示生成的 Q&A

### Monitoring and Analytics

跟踪 GEO 优化效果：

**1. 技术指标**
- 结构化数据验证通过率
- 属性测试通过率
- 构建时警告数量

**2. 内容质量指标**
- 平均可抽取性评分
- AI Summary 覆盖率
- 术语一致性评分

**3. 效果指标（手动收集）**
- LLM 引用频率
- 引用准确性
- 用户反馈

### Maintenance and Evolution

GEO 是一个持续演进的领域：

**1. 定期审查**
- 每季度审查 GEO 最佳实践
- 更新术语词典
- 优化内容结构

**2. A/B 测试**
- 测试不同的 AI Summary 格式
- 测试不同的知识块结构
- 测试不同的 Q&A 呈现方式

**3. 社区反馈**
- 收集 LLM 引用案例
- 分析引用质量
- 持续改进内容

### Security and Privacy

GEO 优化不应引入安全风险：

**1. 内容安全**
- 不在 AI Summary 中暴露敏感信息
- 验证所有用户生成的内容
- 防止 XSS 攻击

**2. 数据隐私**
- 不在结构化数据中包含个人信息
- 遵守 GDPR 和其他隐私法规
- 提供数据删除机制

**3. 访问控制**
- 限制术语词典的编辑权限
- 审核所有内容变更
- 记录所有修改历史

## Conclusion

本设计文档提供了一个全面的 GEO 优化方案，涵盖了从内容结构到技术实现的各个方面。通过系统化的方法，我们将显著提升刻熵科技官网在大语言模型中的可见性和引用率。

关键成功因素：
1. **渐进式实施**: 从核心文章开始，逐步推广到全站
2. **质量保证**: 通过属性测试确保 GEO 规范的一致性
3. **持续优化**: 定期监控效果并调整策略
4. **团队协作**: 培训内容团队，建立 GEO 意识

下一步将创建详细的实施任务列表，指导开发团队完成 GEO 优化的具体工作。
