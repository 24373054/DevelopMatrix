/**
 * Knowledge Block Parser
 * 
 * Parses HTML content and extracts structured knowledge blocks.
 * Identifies different types of content blocks (definitions, explanations, comparisons, etc.)
 * to improve content extractability for LLMs.
 * 
 * Requirements: 1.1, 1.2, 1.3, 5.5
 */

import type { KnowledgeBlock } from '@/types/geo';

/**
 * Knowledge Block Parser
 * 
 * Analyzes HTML content and breaks it down into independent, extractable knowledge blocks.
 * Each block is classified by type and scored for extractability.
 */
export class KnowledgeBlockParser {
  private blockIdCounter = 0;

  /**
   * Parse HTML content into knowledge blocks
   * 
   * @param htmlContent - The HTML content to parse
   * @returns Array of extracted knowledge blocks
   */
  parse(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    
    // Reset counter for each parse
    this.blockIdCounter = 0;

    // Extract different types of blocks
    const definitions = this.extractDefinitions(htmlContent);
    blocks.push(...definitions);
    
    const explanations = this.extractExplanations(htmlContent);
    blocks.push(...explanations);
    
    const comparisons = this.extractComparisons(htmlContent);
    blocks.push(...comparisons);
    
    const examples = this.extractExamples(htmlContent);
    blocks.push(...examples);
    
    const conclusions = this.extractConclusions(htmlContent);
    blocks.push(...conclusions);

    return blocks;
  }

  /**
   * Extract definition blocks from content
   * Looks for patterns like "X 是什么", "X 指的是", "X 定义为", etc.
   * 
   * Requirement 1.1: Provide clear definition sentence structures
   */
  private extractDefinitions(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    
    // Definition patterns in Chinese and English
    const definitionPatterns = [
      /([^<>。.!?！？]+?)是指([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /([^<>。.!?！？]+?)指的是([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /([^<>。.!?！？]+?)定义为([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /在本文中[，,]\s*([^<>。.!?！？]+?)指的是([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /([^<>。.!?！？]+?)\s+is\s+defined\s+as\s+([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
      /([^<>。.!?！？]+?)\s+refers\s+to\s+([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
      /([^<>。.!?！？]+?)\s+means\s+([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
      /What\s+is\s+([^<>。.!?！？]+?)\?\s*([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
    ];

    for (const pattern of definitionPatterns) {
      let match;
      // Reset lastIndex for each pattern
      pattern.lastIndex = 0;
      while ((match = pattern.exec(htmlContent)) !== null) {
        const fullMatch = match[0];
        const term = this.stripHtmlTags(match[1] || '').trim();
        const definition = this.stripHtmlTags(match[2] || '').trim();
        
        if (term && definition && definition.length > 5) {
          blocks.push({
            id: this.generateBlockId(),
            type: 'definition',
            title: `Definition: ${term}`,
            content: fullMatch,
            relatedBlocks: [],
            extractability: this.calculateExtractability(fullMatch, 'definition'),
          });
        }
      }
    }

    return blocks;
  }

  /**
   * Extract explanation blocks from content
   * Looks for explanatory content that elaborates on concepts
   */
  private extractExplanations(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    
    // Look for paragraphs that explain concepts
    // These typically follow definitions or introduce new ideas
    const paragraphPattern = /<p[^>]*>(.*?)<\/p>/gi;
    let match;
    
    while ((match = paragraphPattern.exec(htmlContent)) !== null) {
      const content = match[0];
      const text = this.stripHtmlTags(content);
      
      // Skip if it's a definition (already captured)
      if (this.isDefinitionSentence(text)) {
        continue;
      }
      
      // Skip if it's a conclusion (will be captured separately)
      if (this.isConclusionSentence(text)) {
        continue;
      }
      
      // Check if it's substantial enough to be an explanation
      if (text.length > 20 && text.length <= 300) {
        blocks.push({
          id: this.generateBlockId(),
          type: 'explanation',
          title: this.extractTitle(text),
          content: content,
          relatedBlocks: [],
          extractability: this.calculateExtractability(content, 'explanation'),
        });
      }
    }

    return blocks;
  }

  /**
   * Extract comparison blocks from content
   * Looks for tables and structured comparisons
   * 
   * Requirement 1.3: Use clear enumeration structures
   */
  private extractComparisons(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    
    // Extract tables (common for comparisons)
    const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
    let match;
    
    while ((match = tablePattern.exec(htmlContent)) !== null) {
      const content = match[0];
      
      blocks.push({
        id: this.generateBlockId(),
        type: 'comparison',
        title: 'Comparison Table',
        content: content,
        relatedBlocks: [],
        extractability: this.calculateExtractability(content, 'comparison'),
      });
    }
    
    // Look for comparison keywords in content
    const comparisonPatterns = [
      /(.+?)和(.+?)的区别/gi,
      /(.+?)与(.+?)的对比/gi,
      /(.+?)\s+vs\.?\s+(.+?)/gi,
      /(.+?)\s+versus\s+(.+?)/gi,
      /difference\s+between\s+(.+?)\s+and\s+(.+?)/gi,
    ];
    
    for (const pattern of comparisonPatterns) {
      let compMatch;
      while ((compMatch = pattern.exec(htmlContent)) !== null) {
        const fullMatch = compMatch[0];
        const item1 = this.stripHtmlTags(compMatch[1] || '').trim();
        const item2 = this.stripHtmlTags(compMatch[2] || '').trim();
        
        if (item1 && item2) {
          // Find the surrounding context (paragraph or section)
          const context = this.extractSurroundingContext(htmlContent, compMatch.index);
          
          blocks.push({
            id: this.generateBlockId(),
            type: 'comparison',
            title: `Comparison: ${item1} vs ${item2}`,
            content: context,
            relatedBlocks: [],
            extractability: this.calculateExtractability(context, 'comparison'),
          });
        }
      }
    }

    return blocks;
  }

  /**
   * Extract example blocks from content
   * Looks for code examples, use cases, and illustrative content
   */
  private extractExamples(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    
    // Extract code blocks
    const codePattern = /<pre[^>]*>[\s\S]*?<\/pre>/gi;
    let match;
    
    while ((match = codePattern.exec(htmlContent)) !== null) {
      const content = match[0];
      
      blocks.push({
        id: this.generateBlockId(),
        type: 'example',
        title: 'Code Example',
        content: content,
        relatedBlocks: [],
        extractability: this.calculateExtractability(content, 'example'),
      });
    }
    
    // Look for example keywords
    const examplePatterns = [
      /例如[：:]/gi,
      /举例来说/gi,
      /比如说/gi,
      /for\s+example/gi,
      /for\s+instance/gi,
    ];
    
    for (const pattern of examplePatterns) {
      let exMatch;
      while ((exMatch = pattern.exec(htmlContent)) !== null) {
        const context = this.extractSurroundingContext(htmlContent, exMatch.index);
        
        blocks.push({
          id: this.generateBlockId(),
          type: 'example',
          title: 'Example',
          content: context,
          relatedBlocks: [],
          extractability: this.calculateExtractability(context, 'example'),
        });
      }
    }

    return blocks;
  }

  /**
   * Extract conclusion blocks from content
   * Looks for conclusion markers like "因此", "结论是", "综上所述", etc.
   * 
   * Requirement 1.2: Provide clear conclusion sentences
   */
  private extractConclusions(htmlContent: string): KnowledgeBlock[] {
    const blocks: KnowledgeBlock[] = [];
    
    // Conclusion patterns in Chinese and English
    const conclusionPatterns = [
      /因此[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /结论是[：:]\s*([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /综上所述[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /总结来说[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /总之[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|。|$)/gi,
      /therefore[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
      /in\s+conclusion[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
      /to\s+summarize[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
      /in\s+summary[，,]\s*([^<>]+?)(?=<\/p>|<\/div>|\.|$)/gi,
    ];

    for (const pattern of conclusionPatterns) {
      let match;
      // Reset lastIndex for each pattern
      pattern.lastIndex = 0;
      while ((match = pattern.exec(htmlContent)) !== null) {
        const context = this.extractSurroundingContext(htmlContent, match.index);
        const text = this.stripHtmlTags(context);
        
        if (text.length > 20) {
          blocks.push({
            id: this.generateBlockId(),
            type: 'conclusion',
            title: 'Conclusion',
            content: context,
            relatedBlocks: [],
            extractability: this.calculateExtractability(context, 'conclusion'),
          });
        }
      }
    }

    return blocks;
  }

  /**
   * Check if text contains definition patterns
   */
  private isDefinitionSentence(text: string): boolean {
    const patterns = [
      /是指/,
      /指的是/,
      /定义为/,
      /is\s+defined\s+as/i,
      /refers\s+to/i,
    ];
    
    return patterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if text contains conclusion patterns
   */
  private isConclusionSentence(text: string): boolean {
    const patterns = [
      /^因此/,
      /^结论是/,
      /^综上所述/,
      /^总结来说/,
      /^总之/,
      /^therefore/i,
      /^in\s+conclusion/i,
      /^to\s+summarize/i,
    ];
    
    return patterns.some(pattern => pattern.test(text.trim()));
  }

  /**
   * Extract surrounding context for a match
   * Gets the paragraph or section containing the match
   */
  private extractSurroundingContext(
    htmlContent: string,
    matchIndex: number,
    contextSize: number = 500
  ): string {
    // Find the start of the containing paragraph or section
    let start = matchIndex;
    while (start > 0 && !htmlContent.substring(start - 1, start).match(/<p|<div|<section/)) {
      start--;
      if (matchIndex - start > contextSize) break;
    }
    
    // Find the end of the containing paragraph or section
    let end = matchIndex;
    while (end < htmlContent.length && !htmlContent.substring(end, end + 1).match(/>/)) {
      end++;
      if (end - matchIndex > contextSize) break;
    }
    
    // Extend to include the full closing tag
    const closingTagMatch = htmlContent.substring(end).match(/<\/(p|div|section)>/);
    if (closingTagMatch) {
      end += closingTagMatch.index! + closingTagMatch[0].length;
    }
    
    return htmlContent.substring(start, end);
  }

  /**
   * Extract a title from text content
   * Takes the first sentence or first N characters
   */
  private extractTitle(text: string, maxLength: number = 50): string {
    // Try to get the first sentence
    const sentenceMatch = text.match(/^[^。.!?！？]+[。.!?！？]/);
    if (sentenceMatch) {
      const title = sentenceMatch[0].trim();
      return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }
    
    // Otherwise, take first N characters
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Strip HTML tags from content
   */
  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * Generate a unique block ID
   */
  private generateBlockId(): string {
    return `kb-${++this.blockIdCounter}`;
  }

  /**
   * Calculate extractability score for a knowledge block
   * 
   * Factors:
   * - Block type (definitions and conclusions are highly extractable)
   * - Content length (too short or too long reduces extractability)
   * - Structure (lists and tables are more extractable)
   * - Clarity markers (clear patterns increase extractability)
   * 
   * @returns Score between 0 and 1
   */
  private calculateExtractability(
    content: string,
    type: KnowledgeBlock['type']
  ): number {
    let score = 0.5; // Base score
    
    // Type-based scoring
    const typeScores: Record<KnowledgeBlock['type'], number> = {
      definition: 0.9,
      conclusion: 0.85,
      comparison: 0.8,
      example: 0.7,
      explanation: 0.6,
    };
    score = typeScores[type];
    
    // Length-based adjustment
    const textLength = this.stripHtmlTags(content).length;
    if (textLength < 10) {
      score *= 0.5; // Too short
    } else if (textLength > 500) {
      score *= 0.7; // Too long
    } else if (textLength >= 20 && textLength <= 300) {
      score *= 1.0; // Good length, no penalty
    } else if (textLength >= 10 && textLength < 20) {
      score *= 0.9; // Short but acceptable for definitions
    }
    
    // Structure-based adjustment
    if (content.includes('<ul>') || content.includes('<ol>')) {
      score *= 1.1; // Has lists
    }
    if (content.includes('<table>')) {
      score *= 1.15; // Has tables
    }
    if (content.includes('<code>') || content.includes('<pre>')) {
      score *= 1.05; // Has code
    }
    
    // Ensure score is between 0 and 1
    return Math.min(1, Math.max(0, score));
  }
}

/**
 * Parse HTML content into knowledge blocks
 * 
 * Convenience function for one-off parsing
 * 
 * @param htmlContent - The HTML content to parse
 * @returns Array of extracted knowledge blocks
 */
export function parseKnowledgeBlocks(htmlContent: string): KnowledgeBlock[] {
  const parser = new KnowledgeBlockParser();
  return parser.parse(htmlContent);
}
