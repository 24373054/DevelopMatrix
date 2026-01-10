/**
 * Content Quality Validator
 * 
 * Validates content quality for GEO optimization.
 * Checks for semantic certainty, appropriate paragraph length,
 * and avoidance of vague or hyperbolic language.
 * 
 * Requirements: 1.4, 2.1, 2.2, 4.2
 */

import type { ContentQualityReport, QualityIssue } from '@/types/geo';

/**
 * Content Validator
 * 
 * Analyzes content and identifies quality issues that may reduce
 * extractability or semantic certainty for LLMs.
 */
export class ContentValidator {
  // Maximum paragraph length in characters (Requirement 1.4)
  private readonly MAX_PARAGRAPH_LENGTH = 300;

  // Vague terms to avoid (Requirement 2.2)
  private readonly VAGUE_TERMS_ZH = [
    '可能',
    '也许',
    '大概',
    '或许',
    '似乎',
    '好像',
    '大约',
    '左右',
    '差不多',
    '基本上',
  ];

  private readonly VAGUE_TERMS_EN = [
    'maybe',
    'perhaps',
    'possibly',
    'probably',
    'might',
    'could be',
    'seems like',
    'appears to',
    'roughly',
    'approximately',
  ];

  // Hyperbolic/marketing terms to avoid (Requirement 4.2)
  private readonly HYPERBOLE_TERMS_ZH = [
    '颠覆',
    '史无前例',
    '革命性',
    '划时代',
    '空前',
    '绝无仅有',
    '前所未有',
    '最强',
    '最好',
    '完美',
    '终极',
    '极致',
    '无敌',
    '碾压',
    '秒杀',
  ];

  private readonly HYPERBOLE_TERMS_EN = [
    'revolutionary',
    'groundbreaking',
    'unprecedented',
    'game-changing',
    'disruptive',
    'paradigm shift',
    'best ever',
    'perfect',
    'ultimate',
    'unbelievable',
    'amazing',
    'incredible',
    'mind-blowing',
  ];

  /**
   * Validate content and generate a quality report
   * 
   * @param articleId - Identifier for the article
   * @param content - HTML content to validate
   * @param hasAISummary - Whether the article has an AI Summary
   * @param hasQACoverage - Whether the article has Q&A coverage
   * @param hasCitations - Whether the article has citations/references
   * @returns Content quality report with issues and recommendations
   */
  validate(
    articleId: string,
    content: string,
    hasAISummary: boolean = false,
    hasQACoverage: boolean = false,
    hasCitations: boolean = false
  ): ContentQualityReport {
    const issues: QualityIssue[] = [];

    // Check paragraph lengths
    const paragraphIssues = this.checkParagraphLength(content);
    issues.push(...paragraphIssues);

    // Check for rhetorical questions
    const rhetoricalIssues = this.checkRhetoricalQuestions(content);
    issues.push(...rhetoricalIssues);

    // Check for vague terms
    const vagueIssues = this.checkVagueTerms(content);
    issues.push(...vagueIssues);

    // Check for hyperbole
    const hyperboleIssues = this.checkHyperbole(content);
    issues.push(...hyperboleIssues);

    // Check for citations (if not explicitly provided)
    const citationIssues = hasCitations ? [] : this.checkCitations(content);
    issues.push(...citationIssues);

    // Calculate metrics
    const metrics = {
      hasDefinitions: this.hasDefinitionSentences(content),
      hasConclusions: this.hasConclusionMarkers(content),
      hasProperLists: this.hasProperListStructures(content),
      paragraphLengthOk: paragraphIssues.length === 0,
      avoidsVagueTerms: vagueIssues.length === 0,
      avoidsHyperbole: hyperboleIssues.length === 0,
      hasAuthorInfo: true, // Assumed to be checked elsewhere
      hasAISummary,
      hasQACoverage,
      hasCitations: hasCitations || this.hasCitations(content),
    };

    // Calculate overall score
    const overallScore = this.calculateOverallScore(metrics, issues);

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, issues);

    return {
      articleId,
      overallScore,
      metrics,
      issues,
      recommendations,
    };
  }

  /**
   * Check paragraph length
   * Requirement 1.4: Paragraphs should not exceed 300 characters
   * 
   * @param content - HTML content to check
   * @returns Array of issues found
   */
  checkParagraphLength(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    // Extract paragraphs
    const paragraphPattern = /<p[^>]*>(.*?)<\/p>/gi;
    let match;
    let paragraphIndex = 0;

    while ((match = paragraphPattern.exec(content)) !== null) {
      paragraphIndex++;
      const paragraphHtml = match[1];
      const paragraphText = this.stripHtmlTags(paragraphHtml);
      
      if (paragraphText.length > this.MAX_PARAGRAPH_LENGTH) {
        issues.push({
          severity: 'warning',
          type: 'paragraph_length',
          message: `Paragraph ${paragraphIndex} exceeds ${this.MAX_PARAGRAPH_LENGTH} characters (${paragraphText.length} characters). Consider breaking it into smaller, more digestible chunks.`,
          location: `Paragraph ${paragraphIndex}`,
        });
      }
    }

    return issues;
  }

  /**
   * Check for rhetorical questions
   * Requirement 2.1: Use declarative sentences instead of rhetorical questions
   * 
   * @param content - HTML content to check
   * @returns Array of issues found
   */
  checkRhetoricalQuestions(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    // Check if the entire content is in a Q&A section
    const isQAContent = this.isQAContent(content);
    if (isQAContent) {
      return issues; // Skip checking if it's Q&A content
    }

    const text = this.stripHtmlTags(content);

    // Chinese rhetorical question patterns
    const zhQuestionPatterns = [
      /[^。！？]*吗？/g,
      /[^。！？]*呢？/g,
      /难道[^？]*？/g,
      /怎么[^？]*？/g,
      /为什么[^？]*？/g,
    ];

    // English rhetorical question patterns
    const enQuestionPatterns = [
      /\b(why|how|what|when|where|who)\s+[^.!?]*\?/gi,
      /\b(isn't|aren't|wasn't|weren't|don't|doesn't|didn't)\s+[^.!?]*\?/gi,
      /\b(can|could|would|should|will)\s+[^.!?]*\?/gi,
    ];

    // Check Chinese patterns
    for (const pattern of zhQuestionPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const question = match[0].trim();
        issues.push({
          severity: 'warning',
          type: 'rhetorical_question',
          message: `Rhetorical question detected: "${question}". Consider using a declarative statement instead for better semantic certainty.`,
          location: this.getLocationContext(text, match.index),
        });
      }
    }

    // Check English patterns
    for (const pattern of enQuestionPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const question = match[0].trim();
        issues.push({
          severity: 'warning',
          type: 'rhetorical_question',
          message: `Rhetorical question detected: "${question}". Consider using a declarative statement instead for better semantic certainty.`,
          location: this.getLocationContext(text, match.index),
        });
      }
    }

    return issues;
  }

  /**
   * Check for vague terms
   * Requirement 2.2: Avoid vague terms like "可能", "也许", "大概"
   * 
   * @param content - HTML content to check
   * @returns Array of issues found
   */
  checkVagueTerms(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const text = this.stripHtmlTags(content);

    // Check Chinese vague terms (no word boundaries for Chinese)
    for (const term of this.VAGUE_TERMS_ZH) {
      const pattern = new RegExp(this.escapeRegex(term), 'g');
      let match;
      
      while ((match = pattern.exec(text)) !== null) {
        issues.push({
          severity: 'warning',
          type: 'vague_term',
          message: `Vague term detected: "${term}". Use more definitive language to improve semantic certainty.`,
          location: this.getLocationContext(text, match.index),
        });
      }
    }

    // Check English vague terms
    for (const term of this.VAGUE_TERMS_EN) {
      const pattern = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
      let match;
      
      while ((match = pattern.exec(text)) !== null) {
        issues.push({
          severity: 'warning',
          type: 'vague_term',
          message: `Vague term detected: "${term}". Use more definitive language to improve semantic certainty.`,
          location: this.getLocationContext(text, match.index),
        });
      }
    }

    return issues;
  }

  /**
   * Check for hyperbolic language
   * Requirement 4.2: Avoid hyperbolic and marketing language
   * 
   * @param content - HTML content to check
   * @returns Array of issues found
   */
  checkHyperbole(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const text = this.stripHtmlTags(content);

    // Check Chinese hyperbolic terms (no word boundaries for Chinese)
    for (const term of this.HYPERBOLE_TERMS_ZH) {
      const pattern = new RegExp(this.escapeRegex(term), 'g');
      let match;
      
      while ((match = pattern.exec(text)) !== null) {
        issues.push({
          severity: 'warning',
          type: 'hyperbole',
          message: `Hyperbolic term detected: "${term}". Use more measured, factual language to improve verifiability.`,
          location: this.getLocationContext(text, match.index),
        });
      }
    }

    // Check English hyperbolic terms
    for (const term of this.HYPERBOLE_TERMS_EN) {
      const pattern = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
      let match;
      
      while ((match = pattern.exec(text)) !== null) {
        issues.push({
          severity: 'warning',
          type: 'hyperbole',
          message: `Hyperbolic term detected: "${term}". Use more measured, factual language to improve verifiability.`,
          location: this.getLocationContext(text, match.index),
        });
      }
    }

    return issues;
  }

  /**
   * Check for citations and references
   * Requirement 4.3: Provide citations and references for technical claims
   * 
   * @param content - HTML content to check
   * @returns Array of issues found
   */
  checkCitations(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    // Check if content has citations
    if (!this.hasCitations(content)) {
      issues.push({
        severity: 'warning',
        type: 'missing_citations',
        message: 'No citations or references found. Technical articles should include citations to improve verifiability and credibility.',
        location: 'Article content',
      });
    }

    return issues;
  }

  /**
   * Check if content has citations
   * 
   * @param content - HTML content to check
   * @returns True if citations are present
   */
  hasCitations(content: string): boolean {
    // Check for common citation patterns:
    // 1. External links with rel="noopener" or target="_blank"
    // 2. References section
    // 3. Citation markers like [1], [2], etc.
    // 4. Footnote markers
    
    const citationPatterns = [
      // External links
      /<a[^>]*href="https?:\/\/[^"]*"[^>]*(?:target="_blank"|rel="noopener")[^>]*>/i,
      // References section
      /<(?:section|div)[^>]*class="[^"]*(?:references|citations|bibliography)[^"]*"[^>]*>/i,
      /<h[1-6][^>]*>.*?(?:References|Citations|Bibliography|参考文献|引用|来源).*?<\/h[1-6]>/i,
      // Citation markers
      /\[\d+\]/,
      /\(\d{4}\)/, // Year in parentheses (common in academic citations)
      // Footnote markers
      /<sup[^>]*>\d+<\/sup>/,
    ];

    return citationPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check if content has definition sentences
   */
  private hasDefinitionSentences(content: string): boolean {
    const definitionPatterns = [
      /是指/,
      /指的是/,
      /定义为/,
      /is\s+defined\s+as/i,
      /refers\s+to/i,
    ];

    return definitionPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check if content has conclusion markers
   */
  private hasConclusionMarkers(content: string): boolean {
    const conclusionPatterns = [
      /因此/,
      /结论是/,
      /综上所述/,
      /总结来说/,
      /therefore/i,
      /in\s+conclusion/i,
      /to\s+summarize/i,
    ];

    return conclusionPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check if content has proper list structures
   */
  private hasProperListStructures(content: string): boolean {
    return /<ul[^>]*>/.test(content) || /<ol[^>]*>/.test(content);
  }

  /**
   * Check if content is Q&A content
   */
  private isQAContent(content: string): boolean {
    const qaMarkers = [
      /<section[^>]*class="[^"]*qa[^"]*"[^>]*>/i,
      /<div[^>]*class="[^"]*qa[^"]*"[^>]*>/i,
      /<h[1-6][^>]*>.*?(Q&A|问答|常见问题|FAQ).*?<\/h[1-6]>/i,
    ];

    return qaMarkers.some(marker => marker.test(content));
  }

  /**
   * Check if a position in content is within a Q&A section
   */
  private isInQASection(content: string, position: number): boolean {
    // Look for Q&A section markers before the position
    const beforeContent = content.substring(0, position);
    
    // Check if we're inside a Q&A section by looking for section/div with qa class
    // or a heading with Q&A/问答/常见问题
    const qaMarkers = [
      /<section[^>]*class="[^"]*qa[^"]*"[^>]*>/i,
      /<div[^>]*class="[^"]*qa[^"]*"[^>]*>/i,
      /<h[1-6][^>]*>.*?(Q&A|问答|常见问题|FAQ).*?<\/h[1-6]>/i,
    ];

    // Find the last occurrence of a Q&A marker before this position
    let lastQAMarkerIndex = -1;
    for (const marker of qaMarkers) {
      const matches = beforeContent.match(marker);
      if (matches) {
        const index = beforeContent.lastIndexOf(matches[0]);
        if (index > lastQAMarkerIndex) {
          lastQAMarkerIndex = index;
        }
      }
    }

    if (lastQAMarkerIndex === -1) {
      return false; // No Q&A marker found
    }

    // Check if there's a closing tag after the Q&A marker but before our position
    const afterMarker = content.substring(lastQAMarkerIndex, position);
    const hasClosingSection = /<\/(section|div)>/i.test(afterMarker);
    
    // If there's no closing tag, we're still inside the Q&A section
    return !hasClosingSection;
  }

  /**
   * Get context around a location in text
   */
  private getLocationContext(text: string, position: number, contextSize: number = 50): string {
    const start = Math.max(0, position - contextSize);
    const end = Math.min(text.length, position + contextSize);
    const context = text.substring(start, end);
    
    return `...${context}...`;
  }

  /**
   * Strip HTML tags from content
   */
  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Calculate overall quality score
   * 
   * @param metrics - Quality metrics
   * @param issues - Quality issues found
   * @returns Score from 0-100
   */
  private calculateOverallScore(
    metrics: ContentQualityReport['metrics'],
    issues: QualityIssue[]
  ): number {
    let score = 100;

    // Deduct points for missing features
    if (!metrics.hasDefinitions) score -= 10;
    if (!metrics.hasConclusions) score -= 5;
    if (!metrics.hasProperLists) score -= 5;
    if (!metrics.hasAISummary) score -= 15;
    if (!metrics.hasQACoverage) score -= 10;

    // Deduct points for issues
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    score -= errorCount * 5;
    score -= warningCount * 2;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendations based on metrics and issues
   */
  private generateRecommendations(
    metrics: ContentQualityReport['metrics'],
    issues: QualityIssue[]
  ): string[] {
    const recommendations: string[] = [];

    if (!metrics.hasDefinitions) {
      recommendations.push('Add clear definition sentences using patterns like "X 是指..." or "X is defined as..."');
    }

    if (!metrics.hasConclusions) {
      recommendations.push('Add explicit conclusion markers like "因此" or "therefore" to make conclusions clear');
    }

    if (!metrics.hasProperLists) {
      recommendations.push('Use <ul> or <ol> tags for lists instead of plain text enumeration');
    }

    if (!metrics.paragraphLengthOk) {
      recommendations.push('Break long paragraphs (>300 characters) into smaller, more digestible chunks');
    }

    if (!metrics.avoidsVagueTerms) {
      recommendations.push('Replace vague terms (可能, 也许, maybe, perhaps) with more definitive language');
    }

    if (!metrics.avoidsHyperbole) {
      recommendations.push('Replace hyperbolic terms (颠覆, 革命性, revolutionary) with measured, factual language');
    }

    if (!metrics.hasCitations) {
      recommendations.push('Add citations and references to external sources to improve verifiability and credibility');
    }

    if (!metrics.hasAISummary) {
      recommendations.push('Add an AI Summary section with whatIs, whyImportant, useCases, and keyTakeaways');
    }

    if (!metrics.hasQACoverage) {
      recommendations.push('Add Q&A coverage addressing common questions (definition, comparison, application, limitation)');
    }

    // Add specific recommendations based on issue types
    const issueTypes = new Set(issues.map(i => i.type));
    
    if (issueTypes.has('rhetorical_question')) {
      recommendations.push('Convert rhetorical questions to declarative statements for better semantic certainty');
    }

    if (issueTypes.has('missing_citations')) {
      recommendations.push('Include external links, references section, or citation markers to support technical claims');
    }

    return recommendations;
  }
}

/**
 * Validate content quality
 * 
 * Convenience function for one-off validation
 * 
 * @param articleId - Identifier for the article
 * @param content - HTML content to validate
 * @param hasAISummary - Whether the article has an AI Summary
 * @param hasQACoverage - Whether the article has Q&A coverage
 * @param hasCitations - Whether the article has citations/references
 * @returns Content quality report
 */
export function validateContent(
  articleId: string,
  content: string,
  hasAISummary: boolean = false,
  hasQACoverage: boolean = false,
  hasCitations: boolean = false
): ContentQualityReport {
  const validator = new ContentValidator();
  return validator.validate(articleId, content, hasAISummary, hasQACoverage, hasCitations);
}
