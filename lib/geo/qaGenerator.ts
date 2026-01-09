/**
 * Q&A Generator - Automatically generates Q&A pairs from article content
 * 
 * This module implements the Question Coverage Matrix system for GEO optimization.
 * It generates common questions that users might ask LLMs about the article content,
 * ensuring comprehensive coverage of definition, comparison, application, and limitation questions.
 */

import type {
  QAPair,
  QuestionCoverageMatrix,
  AISummary,
  KnowledgeBlock,
} from '@/types/geo';

/**
 * Article input for Q&A generation
 */
export interface ArticleInput {
  id: string;
  title: string;
  content: string;
  aiSummary?: AISummary;
  knowledgeBlocks?: KnowledgeBlock[];
  keywords?: string[];
}

/**
 * Q&A Generator Configuration
 */
export interface QAGeneratorConfig {
  /** Maximum number of Q&A pairs to generate */
  maxQAPairs?: number;
  
  /** Whether to include definition questions */
  includeDefinition?: boolean;
  
  /** Whether to include comparison questions */
  includeComparison?: boolean;
  
  /** Whether to include application questions */
  includeApplication?: boolean;
  
  /** Whether to include limitation questions */
  includeLimitation?: boolean;
}

/**
 * Default configuration for Q&A generation
 */
const DEFAULT_CONFIG: Required<QAGeneratorConfig> = {
  maxQAPairs: 10,
  includeDefinition: true,
  includeComparison: true,
  includeApplication: true,
  includeLimitation: true,
};

/**
 * Q&A Generator Class
 * 
 * Generates structured Q&A pairs from article content to improve LLM understanding
 * and citation probability.
 */
export class QAGenerator {
  private config: Required<QAGeneratorConfig>;

  constructor(config: QAGeneratorConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate Q&A pairs from an article
   * 
   * @param article - Article input with content and metadata
   * @returns Question Coverage Matrix with generated Q&A pairs
   */
  generateFromArticle(article: ArticleInput): QuestionCoverageMatrix {
    const qaPairs: QAPair[] = [];

    // Generate definition questions from AI Summary
    if (this.config.includeDefinition && article.aiSummary) {
      qaPairs.push(...this.generateDefinitionQuestions(article));
    }

    // Generate comparison questions from content
    if (this.config.includeComparison) {
      qaPairs.push(...this.generateComparisonQuestions(article));
    }

    // Generate application questions from AI Summary use cases
    if (this.config.includeApplication && article.aiSummary) {
      qaPairs.push(...this.generateApplicationQuestions(article));
    }

    // Generate limitation questions from content
    if (this.config.includeLimitation) {
      qaPairs.push(...this.generateLimitationQuestions(article));
    }

    // Limit to max Q&A pairs
    const limitedQAPairs = qaPairs.slice(0, this.config.maxQAPairs);

    // Calculate coverage
    const coverage = this.calculateCoverage(limitedQAPairs);

    return {
      article: article.id,
      qaPairs: limitedQAPairs,
      coverage,
    };
  }

  /**
   * Generate definition-type questions
   * 
   * Questions like "What is X?", "How is X defined?"
   */
  private generateDefinitionQuestions(article: ArticleInput): QAPair[] {
    const questions: QAPair[] = [];

    if (!article.aiSummary) {
      return questions;
    }

    // Main "What is X?" question
    questions.push({
      question: `什么是${article.title}？`,
      answer: article.aiSummary.whatIs,
      category: 'definition',
      relatedConcepts: this.extractConcepts(article),
    });

    // "Why is X important?" question
    if (article.aiSummary.whyImportant) {
      questions.push({
        question: `为什么${article.title}很重要？`,
        answer: article.aiSummary.whyImportant,
        category: 'definition',
        relatedConcepts: this.extractConcepts(article),
      });
    }

    return questions;
  }

  /**
   * Generate comparison-type questions
   * 
   * Questions like "What's the difference between X and Y?"
   */
  private generateComparisonQuestions(article: ArticleInput): QAPair[] {
    const questions: QAPair[] = [];

    // Extract comparison patterns from content
    const comparisons = this.extractComparisons(article.content);

    for (const comparison of comparisons) {
      questions.push({
        question: `${comparison.termA}和${comparison.termB}有什么区别？`,
        answer: comparison.explanation,
        category: 'comparison',
        relatedConcepts: [comparison.termA, comparison.termB],
      });
    }

    return questions;
  }

  /**
   * Generate application-type questions
   * 
   * Questions like "When should I use X?", "What are the use cases for X?"
   */
  private generateApplicationQuestions(article: ArticleInput): QAPair[] {
    const questions: QAPair[] = [];

    if (!article.aiSummary?.useCases || article.aiSummary.useCases.length === 0) {
      return questions;
    }

    // "What are the use cases?" question
    questions.push({
      question: `${article.title}适用于哪些场景？`,
      answer: article.aiSummary.useCases.join('；'),
      category: 'application',
      relatedConcepts: this.extractConcepts(article),
    });

    // "When should I use X?" question
    questions.push({
      question: `什么时候应该使用${article.title}？`,
      answer: `${article.title}主要适用于以下场景：${article.aiSummary.useCases.join('、')}。`,
      category: 'application',
      relatedConcepts: this.extractConcepts(article),
    });

    return questions;
  }

  /**
   * Generate limitation-type questions
   * 
   * Questions like "What are the limitations of X?", "What should I be careful about?"
   */
  private generateLimitationQuestions(article: ArticleInput): QAPair[] {
    const questions: QAPair[] = [];

    // Extract limitation patterns from content
    const limitations = this.extractLimitations(article.content);

    if (limitations.length > 0) {
      questions.push({
        question: `${article.title}有哪些局限性？`,
        answer: limitations.join('；'),
        category: 'limitation',
        relatedConcepts: this.extractConcepts(article),
      });

      questions.push({
        question: `使用${article.title}时需要注意什么？`,
        answer: `使用${article.title}时需要注意以下几点：${limitations.join('；')}。`,
        category: 'limitation',
        relatedConcepts: this.extractConcepts(article),
      });
    }

    return questions;
  }

  /**
   * Extract concepts from article (keywords or title-based)
   */
  private extractConcepts(article: ArticleInput): string[] {
    const concepts: string[] = [];

    // Add title as primary concept
    concepts.push(article.title);

    // Add keywords if available
    if (article.keywords) {
      concepts.push(...article.keywords);
    }

    return concepts;
  }

  /**
   * Extract comparison patterns from content
   * 
   * Looks for patterns like "X vs Y", "X 和 Y 的区别", "相比于 X，Y..."
   */
  private extractComparisons(content: string): Array<{
    termA: string;
    termB: string;
    explanation: string;
  }> {
    const comparisons: Array<{
      termA: string;
      termB: string;
      explanation: string;
    }> = [];

    // Pattern 1: "X 和 Y 的区别"
    const pattern1 = /([^，。；！？\s]+)和([^，。；！？\s]+)的区别/g;
    let match1;
    while ((match1 = pattern1.exec(content)) !== null) {
      comparisons.push({
        termA: match1[1],
        termB: match1[2],
        explanation: this.extractSurroundingText(content, match1.index, 200),
      });
    }

    // Pattern 2: "X vs Y" or "X 对比 Y"
    const pattern2 = /([^，。；！？\s]+)\s*(?:vs|对比)\s*([^，。；！？\s]+)/gi;
    let match2;
    while ((match2 = pattern2.exec(content)) !== null) {
      comparisons.push({
        termA: match2[1],
        termB: match2[2],
        explanation: this.extractSurroundingText(content, match2.index, 200),
      });
    }

    return comparisons;
  }

  /**
   * Extract limitation patterns from content
   * 
   * Looks for patterns like "局限性", "缺点", "注意事项", "风险"
   */
  private extractLimitations(content: string): string[] {
    const limitations: string[] = [];

    // Keywords that indicate limitations
    const limitationKeywords = [
      '局限性',
      '缺点',
      '不足',
      '注意事项',
      '风险',
      '挑战',
      '问题',
      '限制',
    ];

    // Find sections containing limitation keywords
    for (const keyword of limitationKeywords) {
      const regex = new RegExp(`[^。！？]*${keyword}[^。！？]*[。！？]`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        limitations.push(...matches.map(m => m.trim()));
      }
    }

    // Remove duplicates and limit to 5 most relevant
    return Array.from(new Set(limitations)).slice(0, 5);
  }

  /**
   * Extract surrounding text from a position in content
   */
  private extractSurroundingText(
    content: string,
    position: number,
    maxLength: number
  ): string {
    const start = Math.max(0, position - maxLength / 2);
    const end = Math.min(content.length, position + maxLength / 2);
    
    let text = content.substring(start, end).trim();
    
    // Clean up HTML tags if present
    text = text.replace(/<[^>]+>/g, '');
    
    return text;
  }

  /**
   * Calculate coverage metrics for Q&A pairs
   */
  private calculateCoverage(qaPairs: QAPair[]): QuestionCoverageMatrix['coverage'] {
    return {
      hasDefinition: qaPairs.some(qa => qa.category === 'definition'),
      hasComparison: qaPairs.some(qa => qa.category === 'comparison'),
      hasApplication: qaPairs.some(qa => qa.category === 'application'),
      hasLimitation: qaPairs.some(qa => qa.category === 'limitation'),
    };
  }
}

/**
 * Convenience function to generate Q&A from an article
 * 
 * @param article - Article input
 * @param config - Optional configuration
 * @returns Question Coverage Matrix
 */
export function generateQA(
  article: ArticleInput,
  config?: QAGeneratorConfig
): QuestionCoverageMatrix {
  const generator = new QAGenerator(config);
  return generator.generateFromArticle(article);
}
