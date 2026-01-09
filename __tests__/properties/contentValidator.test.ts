/**
 * Property-Based Tests for Content Validator
 * 
 * Feature: geo-optimization
 * Tests Properties 4, 5, 6, 11 from the design document
 * Validates Requirements: 1.4, 2.1, 2.2, 4.2
 */

import * as fc from 'fast-check';
import { ContentValidator, validateContent } from '@/lib/geo/contentValidator';
import type { ContentQualityReport, QualityIssue } from '@/types/geo';
import {
  longParagraphGenerator,
  shortParagraphGenerator,
  chineseRhetoricalQuestionGenerator,
  englishRhetoricalQuestionGenerator,
  declarativeSentenceGenerator,
  chineseVagueTermGenerator,
  englishVagueTermGenerator,
  definitiveLanguageGenerator,
  chineseHyperboleGenerator,
  englishHyperboleGenerator,
  measuredLanguageGenerator,
  qaContentGenerator,
  mixedQualityContentGenerator,
  highQualityContentGenerator,
} from '../generators/contentValidator.generator';

describe('Content Validator - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 4: Paragraph length constraint
  // ============================================================================
  
  describe('Property 4: Paragraph length constraint', () => {
    /**
     * Feature: geo-optimization, Property 4: Paragraph length constraint
     * 
     * For any blog article, individual paragraphs should not exceed 300 characters
     * to avoid long散文式 expressions
     * 
     * Validates: Requirements 1.4
     */
    it('should detect paragraphs exceeding 300 characters', () => {
      fc.assert(
        fc.property(
          longParagraphGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one paragraph length issue
            const paragraphIssues = report.issues.filter(i => i.type === 'paragraph_length');
            return paragraphIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT flag paragraphs within 300 character limit', () => {
      fc.assert(
        fc.property(
          shortParagraphGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should NOT detect paragraph length issues
            const paragraphIssues = report.issues.filter(i => i.type === 'paragraph_length');
            return paragraphIssues.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should report correct paragraph length in issue message', () => {
      fc.assert(
        fc.property(
          longParagraphGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const paragraphIssues = report.issues.filter(i => i.type === 'paragraph_length');
            
            if (paragraphIssues.length === 0) return false;
            
            // Issue message should mention the character count
            return paragraphIssues.every(issue => 
              issue.message.includes('characters') && issue.message.includes('300')
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should set paragraphLengthOk metric correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(longParagraphGenerator(), shortParagraphGenerator()),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const paragraphIssues = report.issues.filter(i => i.type === 'paragraph_length');
            
            // Metric should match whether issues were found
            return report.metrics.paragraphLengthOk === (paragraphIssues.length === 0);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle multiple paragraphs correctly', () => {
      fc.assert(
        fc.property(
          fc.array(fc.oneof(longParagraphGenerator(), shortParagraphGenerator()), { minLength: 2, maxLength: 5 }),
          (paragraphs) => {
            const htmlContent = paragraphs.join('\n');
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Count how many paragraphs exceed 300 chars
            const longParaCount = paragraphs.filter(p => {
              const text = p.replace(/<[^>]*>/g, '').trim();
              return text.length > 300;
            }).length;
            
            const paragraphIssues = report.issues.filter(i => i.type === 'paragraph_length');
            
            // Number of issues should match number of long paragraphs
            return paragraphIssues.length === longParaCount;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 5: Declarative sentence usage
  // ============================================================================
  
  describe('Property 5: Declarative sentence usage', () => {
    /**
     * Feature: geo-optimization, Property 5: Declarative sentence usage
     * 
     * For any blog article, the content should minimize rhetorical questions
     * (sentences ending with "吗？" or "？" in interrogative form)
     * 
     * Validates: Requirements 2.1
     */
    it('should detect Chinese rhetorical questions', () => {
      fc.assert(
        fc.property(
          chineseRhetoricalQuestionGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one rhetorical question issue
            const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
            return rhetoricalIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect English rhetorical questions', () => {
      fc.assert(
        fc.property(
          englishRhetoricalQuestionGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one rhetorical question issue
            const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
            return rhetoricalIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT flag declarative sentences', () => {
      fc.assert(
        fc.property(
          declarativeSentenceGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should NOT detect rhetorical question issues
            const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
            return rhetoricalIssues.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT flag questions in Q&A sections', () => {
      fc.assert(
        fc.property(
          qaContentGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should NOT detect rhetorical question issues in Q&A content
            const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
            return rhetoricalIssues.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should include question text in issue message', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseRhetoricalQuestionGenerator(), englishRhetoricalQuestionGenerator()),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
            
            if (rhetoricalIssues.length === 0) return false;
            
            // Issue message should mention "rhetorical question" and "declarative"
            return rhetoricalIssues.every(issue => 
              issue.message.toLowerCase().includes('rhetorical question') &&
              issue.message.toLowerCase().includes('declarative')
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle mixed content with questions and statements', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              chineseRhetoricalQuestionGenerator(),
              englishRhetoricalQuestionGenerator(),
              declarativeSentenceGenerator()
            ),
            { minLength: 2, maxLength: 5 }
          ),
          (blocks) => {
            const htmlContent = blocks.join('\n');
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should only flag the rhetorical questions, not declarative sentences
            const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
            
            // Count how many blocks are questions
            const questionCount = blocks.filter(block => 
              block.includes('?') || block.includes('？')
            ).length;
            
            // Number of issues should be <= number of question blocks
            // (Some questions might be in Q&A sections or not match patterns)
            return rhetoricalIssues.length <= questionCount;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 6: Vague term avoidance
  // ============================================================================
  
  describe('Property 6: Vague term avoidance', () => {
    /**
     * Feature: geo-optimization, Property 6: Vague term avoidance
     * 
     * For any blog article, the content should avoid vague terms like "可能", "也许", "大概"
     * in technical descriptions
     * 
     * Validates: Requirements 2.2
     */
    it('should detect Chinese vague terms', () => {
      fc.assert(
        fc.property(
          chineseVagueTermGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one vague term issue
            const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
            return vagueIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect English vague terms', () => {
      fc.assert(
        fc.property(
          englishVagueTermGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one vague term issue
            const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
            return vagueIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT flag definitive language', () => {
      fc.assert(
        fc.property(
          definitiveLanguageGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should NOT detect vague term issues
            const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
            return vagueIssues.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should set avoidsVagueTerms metric correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseVagueTermGenerator(), englishVagueTermGenerator(), definitiveLanguageGenerator()),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
            
            // Metric should match whether issues were found
            return report.metrics.avoidsVagueTerms === (vagueIssues.length === 0);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should include vague term in issue message', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseVagueTermGenerator(), englishVagueTermGenerator()),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
            
            if (vagueIssues.length === 0) return false;
            
            // Issue message should mention "vague term" and "semantic certainty"
            return vagueIssues.every(issue => 
              issue.message.toLowerCase().includes('vague term') &&
              issue.message.toLowerCase().includes('semantic certainty')
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect multiple vague terms in content', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(chineseVagueTermGenerator(), englishVagueTermGenerator()),
            { minLength: 2, maxLength: 5 }
          ),
          (blocks) => {
            const htmlContent = blocks.join('\n');
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
            
            // Should detect at least as many issues as there are blocks with vague terms
            // (Each block has at least one vague term)
            return vagueIssues.length >= blocks.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 11: Hyperbole avoidance
  // ============================================================================
  
  describe('Property 11: Hyperbole avoidance', () => {
    /**
     * Feature: geo-optimization, Property 11: Hyperbole avoidance
     * 
     * For any blog article, the content should avoid hyperbolic marketing terms
     * like "颠覆", "史无前例", "revolutionary"
     * 
     * Validates: Requirements 4.2
     */
    it('should detect Chinese hyperbolic terms', () => {
      fc.assert(
        fc.property(
          chineseHyperboleGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one hyperbole issue
            const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
            return hyperboleIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect English hyperbolic terms', () => {
      fc.assert(
        fc.property(
          englishHyperboleGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should detect at least one hyperbole issue
            const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
            return hyperboleIssues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT flag measured, factual language', () => {
      fc.assert(
        fc.property(
          measuredLanguageGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should NOT detect hyperbole issues
            const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
            return hyperboleIssues.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should set avoidsHyperbole metric correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseHyperboleGenerator(), englishHyperboleGenerator(), measuredLanguageGenerator()),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
            
            // Metric should match whether issues were found
            return report.metrics.avoidsHyperbole === (hyperboleIssues.length === 0);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should include hyperbolic term in issue message', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseHyperboleGenerator(), englishHyperboleGenerator()),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
            
            if (hyperboleIssues.length === 0) return false;
            
            // Issue message should mention "hyperbolic" and "verifiability"
            return hyperboleIssues.every(issue => 
              issue.message.toLowerCase().includes('hyperbolic') &&
              issue.message.toLowerCase().includes('verifiability')
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect multiple hyperbolic terms in content', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(chineseHyperboleGenerator(), englishHyperboleGenerator()),
            { minLength: 2, maxLength: 5 }
          ),
          (blocks) => {
            const htmlContent = blocks.join('\n');
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
            
            // Should detect at least as many issues as there are blocks with hyperbole
            // (Each block has at least one hyperbolic term)
            return hyperboleIssues.length >= blocks.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Testing with mixed content
  // ============================================================================
  
  describe('Integration with mixed content', () => {
    it('should handle content with multiple quality issues', () => {
      fc.assert(
        fc.property(
          mixedQualityContentGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // Should return a valid report structure
            return (
              typeof report.overallScore === 'number' &&
              report.overallScore >= 0 &&
              report.overallScore <= 100 &&
              Array.isArray(report.issues) &&
              Array.isArray(report.recommendations) &&
              typeof report.metrics === 'object'
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should give high scores to high-quality content', () => {
      fc.assert(
        fc.property(
          highQualityContentGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // High-quality content should have fewer issues
            const criticalIssues = report.issues.filter(i => 
              i.type === 'paragraph_length' ||
              i.type === 'rhetorical_question' ||
              i.type === 'vague_term' ||
              i.type === 'hyperbole'
            );
            
            // Should have 0 critical issues for high-quality content
            return criticalIssues.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should work correctly with the convenience function', () => {
      fc.assert(
        fc.property(
          mixedQualityContentGenerator(),
          (htmlContent) => {
            const report = validateContent('test-article', htmlContent);
            
            // Should return a valid report
            return (
              report.articleId === 'test-article' &&
              typeof report.overallScore === 'number' &&
              Array.isArray(report.issues)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should provide recommendations for detected issues', () => {
      fc.assert(
        fc.property(
          mixedQualityContentGenerator(),
          (htmlContent) => {
            const validator = new ContentValidator();
            const report = validator.validate('test-article', htmlContent);
            
            // If there are issues, there should be recommendations
            if (report.issues.length > 0) {
              return report.recommendations.length > 0;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Edge Cases and Robustness
  // ============================================================================
  
  describe('Edge Cases and Robustness', () => {
    it('should handle empty content gracefully', () => {
      const validator = new ContentValidator();
      const report = validator.validate('test-article', '');
      
      expect(report.articleId).toBe('test-article');
      expect(Array.isArray(report.issues)).toBe(true);
      expect(typeof report.overallScore).toBe('number');
    });
    
    it('should handle content with only whitespace', () => {
      const validator = new ContentValidator();
      const report = validator.validate('test-article', '   \n\n   ');
      
      expect(report.articleId).toBe('test-article');
      expect(Array.isArray(report.issues)).toBe(true);
    });
    
    it('should handle malformed HTML gracefully', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 100 }),
          (randomString) => {
            const validator = new ContentValidator();
            
            // Should not throw errors even with random input
            try {
              const report = validator.validate('test-article', randomString);
              return (
                typeof report === 'object' &&
                Array.isArray(report.issues)
              );
            } catch (error) {
              return false; // Should not throw
            }
          }
        ),
        { numRuns: 50 }
      );
    });
    
    it('should handle content with nested HTML tags', () => {
      const nestedContent = '<div><p><span>This is nested content with <strong>bold text</strong>.</span></p></div>';
      const validator = new ContentValidator();
      const report = validator.validate('test-article', nestedContent);
      
      expect(report.articleId).toBe('test-article');
      expect(Array.isArray(report.issues)).toBe(true);
    });
    
    it('should handle content with special characters', () => {
      const specialContent = '<p>Content with special chars: &amp; &lt; &gt; &quot; &#39;</p>';
      const validator = new ContentValidator();
      const report = validator.validate('test-article', specialContent);
      
      expect(report.articleId).toBe('test-article');
      expect(Array.isArray(report.issues)).toBe(true);
    });
  });
});
