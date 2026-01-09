/**
 * Property-Based Tests for Q&A System
 * 
 * Feature: geo-optimization
 * Tests Properties 13, 23, 24, 25, 26, 27 from the design document
 * Validates Requirements: 5.1, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import * as fc from 'fast-check';
import type { QAPair, QuestionCoverageMatrix } from '@/types/geo';
import {
  qaPairGenerator,
  qaPairsArrayGenerator,
  definitionQAPairGenerator,
  comparisonQAPairGenerator,
  applicationQAPairGenerator,
  limitationQAPairGenerator,
  completeQuestionCoverageMatrixGenerator,
  incompleteQuestionCoverageMatrixGenerator,
  definitionOnlyMatrixGenerator,
  noComparisonMatrixGenerator,
  noApplicationMatrixGenerator,
  noLimitationMatrixGenerator,
  implementationStepsContentGenerator,
  bestPracticesSectionGenerator,
  contentWithoutStepsGenerator,
  contentWithoutBestPracticesGenerator,
  articleWithQAGenerator,
  articleWithoutQAGenerator,
  mixedQAContentGenerator,
} from '../generators/qa.generator';

// ============================================================================
// Helper Functions for Validation
// ============================================================================

/**
 * Check if an article has Q&A component present
 */
function hasQAComponent(article: any): boolean {
  if (!article || typeof article !== 'object') {
    return false;
  }
  
  return (
    Array.isArray(article.qaPairs) &&
    article.qaPairs.length > 0
  );
}

/**
 * Check if Q&A coverage includes comparison questions
 */
function hasComparisonCoverage(matrix: QuestionCoverageMatrix): boolean {
  return (
    matrix.coverage.hasComparison &&
    matrix.qaPairs.some(qa => qa.category === 'comparison')
  );
}

/**
 * Check if Q&A coverage includes application questions
 */
function hasApplicationCoverage(matrix: QuestionCoverageMatrix): boolean {
  return (
    matrix.coverage.hasApplication &&
    matrix.qaPairs.some(qa => qa.category === 'application')
  );
}

/**
 * Check if Q&A coverage includes limitation questions
 */
function hasLimitationCoverage(matrix: QuestionCoverageMatrix): boolean {
  return (
    matrix.coverage.hasLimitation &&
    matrix.qaPairs.some(qa => qa.category === 'limitation')
  );
}

/**
 * Check if content contains implementation steps (ordered list)
 */
function hasImplementationSteps(htmlContent: string): boolean {
  // Check for ordered list tags
  const hasOrderedList = /<ol[^>]*>[\s\S]*<\/ol>/i.test(htmlContent);
  
  // Check for step-related keywords
  const hasStepKeywords = /步骤|steps|实施|implementation|如何|how to/i.test(htmlContent);
  
  return hasOrderedList && hasStepKeywords;
}

/**
 * Check if content contains best practices section
 */
function hasBestPracticesSection(htmlContent: string): boolean {
  // Check for best practices keywords
  const hasBestPracticesKeywords = /最佳实践|best practices|推荐做法|recommended practices/i.test(htmlContent);
  
  // Check for list structure (ul or ol)
  const hasList = /<[uo]l[^>]*>[\s\S]*<\/[uo]l>/i.test(htmlContent);
  
  return hasBestPracticesKeywords && hasList;
}

/**
 * Validate Q&A pair structure
 */
function isValidQAPair(qa: any): boolean {
  return (
    qa &&
    typeof qa === 'object' &&
    typeof qa.question === 'string' &&
    qa.question.trim().length > 0 &&
    typeof qa.answer === 'string' &&
    qa.answer.trim().length > 0 &&
    ['definition', 'comparison', 'application', 'limitation'].includes(qa.category) &&
    Array.isArray(qa.relatedConcepts)
  );
}

/**
 * Validate Question Coverage Matrix structure
 */
function isValidCoverageMatrix(matrix: any): boolean {
  return (
    matrix &&
    typeof matrix === 'object' &&
    typeof matrix.article === 'string' &&
    Array.isArray(matrix.qaPairs) &&
    matrix.qaPairs.every(isValidQAPair) &&
    matrix.coverage &&
    typeof matrix.coverage === 'object' &&
    typeof matrix.coverage.hasDefinition === 'boolean' &&
    typeof matrix.coverage.hasComparison === 'boolean' &&
    typeof matrix.coverage.hasApplication === 'boolean' &&
    typeof matrix.coverage.hasLimitation === 'boolean'
  );
}

describe('Q&A System - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 13: Q&A component presence
  // ============================================================================
  
  describe('Property 13: Q&A component presence', () => {
    /**
     * Feature: geo-optimization, Property 13: Q&A component presence
     * 
     * For any core blog article, the page should include a Q&A component or FAQ section
     * 
     * Validates: Requirements 5.1, 7.1
     */
    it('should have Q&A component present in articles with Q&A data', () => {
      fc.assert(
        fc.property(
          articleWithQAGenerator(),
          (article) => {
            return hasQAComponent(article);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle articles without Q&A gracefully', () => {
      fc.assert(
        fc.property(
          articleWithoutQAGenerator(),
          (article) => {
            // Articles without Q&A should not have the component
            return !hasQAComponent(article);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have at least one Q&A pair when component is present', () => {
      fc.assert(
        fc.property(
          articleWithQAGenerator(),
          (article) => {
            if (hasQAComponent(article)) {
              return article.qaPairs!.length >= 1;
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have valid Q&A pair structure', () => {
      fc.assert(
        fc.property(
          qaPairsArrayGenerator(1, 10),
          (qaPairs) => {
            return qaPairs.every(isValidQAPair);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should distinguish between articles with and without Q&A', () => {
      fc.assert(
        fc.property(
          mixedQAContentGenerator(),
          (article) => {
            const hasQA = hasQAComponent(article);
            const hasQAPairs = article.qaPairs && article.qaPairs.length > 0;
            
            // hasQA should match whether qaPairs exist
            return hasQA === !!hasQAPairs;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 23: Comparison question coverage
  // ============================================================================
  
  describe('Property 23: Comparison question coverage', () => {
    /**
     * Feature: geo-optimization, Property 23: Comparison question coverage
     * 
     * For any article discussing multiple related concepts, the Q&A coverage matrix 
     * should include at least one comparison-type question
     * 
     * Validates: Requirements 7.1
     */
    it('should have comparison questions in complete coverage matrix', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            return hasComparisonCoverage(matrix);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should correctly identify comparison questions', () => {
      fc.assert(
        fc.property(
          comparisonQAPairGenerator(),
          (qa) => {
            return qa.category === 'comparison';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing comparison coverage', () => {
      fc.assert(
        fc.property(
          noComparisonMatrixGenerator(),
          (matrix) => {
            return !hasComparisonCoverage(matrix);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have comparison questions with related concepts', () => {
      fc.assert(
        fc.property(
          comparisonQAPairGenerator(),
          (qa) => {
            // Comparison questions should have at least 2 related concepts (the terms being compared)
            return qa.relatedConcepts.length >= 2;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain coverage consistency', () => {
      fc.assert(
        fc.property(
          incompleteQuestionCoverageMatrixGenerator(),
          (matrix) => {
            const hasComparisonQA = matrix.qaPairs.some(qa => qa.category === 'comparison');
            const coverageIndicator = matrix.coverage.hasComparison;
            
            // Coverage indicator should match actual presence of comparison questions
            return hasComparisonQA === coverageIndicator;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 24: Application scenario coverage
  // ============================================================================
  
  describe('Property 24: Application scenario coverage', () => {
    /**
     * Feature: geo-optimization, Property 24: Application scenario coverage
     * 
     * For any technical article, the Q&A coverage matrix should include at least 
     * one application-type question
     * 
     * Validates: Requirements 7.2
     */
    it('should have application questions in complete coverage matrix', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            return hasApplicationCoverage(matrix);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should correctly identify application questions', () => {
      fc.assert(
        fc.property(
          applicationQAPairGenerator(),
          (qa) => {
            return qa.category === 'application';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing application coverage', () => {
      fc.assert(
        fc.property(
          noApplicationMatrixGenerator(),
          (matrix) => {
            return !hasApplicationCoverage(matrix);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have application questions with meaningful answers', () => {
      fc.assert(
        fc.property(
          applicationQAPairGenerator(),
          (qa) => {
            // Application questions should have substantial answers (> 30 chars)
            return qa.answer.trim().length >= 30;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain coverage consistency for application questions', () => {
      fc.assert(
        fc.property(
          incompleteQuestionCoverageMatrixGenerator(),
          (matrix) => {
            const hasApplicationQA = matrix.qaPairs.some(qa => qa.category === 'application');
            const coverageIndicator = matrix.coverage.hasApplication;
            
            // Coverage indicator should match actual presence of application questions
            return hasApplicationQA === coverageIndicator;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 25: Limitation discussion coverage
  // ============================================================================
  
  describe('Property 25: Limitation discussion coverage', () => {
    /**
     * Feature: geo-optimization, Property 25: Limitation discussion coverage
     * 
     * For any technical article, the Q&A coverage matrix should include at least 
     * one limitation-type question
     * 
     * Validates: Requirements 7.3
     */
    it('should have limitation questions in complete coverage matrix', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            return hasLimitationCoverage(matrix);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should correctly identify limitation questions', () => {
      fc.assert(
        fc.property(
          limitationQAPairGenerator(),
          (qa) => {
            return qa.category === 'limitation';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing limitation coverage', () => {
      fc.assert(
        fc.property(
          noLimitationMatrixGenerator(),
          (matrix) => {
            return !hasLimitationCoverage(matrix);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have limitation questions with meaningful answers', () => {
      fc.assert(
        fc.property(
          limitationQAPairGenerator(),
          (qa) => {
            // Limitation questions should have substantial answers (> 30 chars)
            return qa.answer.trim().length >= 30;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain coverage consistency for limitation questions', () => {
      fc.assert(
        fc.property(
          incompleteQuestionCoverageMatrixGenerator(),
          (matrix) => {
            const hasLimitationQA = matrix.qaPairs.some(qa => qa.category === 'limitation');
            const coverageIndicator = matrix.coverage.hasLimitation;
            
            // Coverage indicator should match actual presence of limitation questions
            return hasLimitationQA === coverageIndicator;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 26: Implementation steps presence
  // ============================================================================
  
  describe('Property 26: Implementation steps presence', () => {
    /**
     * Feature: geo-optimization, Property 26: Implementation steps presence
     * 
     * For any how-to article, the content should include ordered lists or 
     * step-by-step instructions
     * 
     * Validates: Requirements 7.4
     */
    it('should detect implementation steps in content', () => {
      fc.assert(
        fc.property(
          implementationStepsContentGenerator(),
          (htmlContent) => {
            return hasImplementationSteps(htmlContent);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT detect implementation steps in content without them', () => {
      fc.assert(
        fc.property(
          contentWithoutStepsGenerator(),
          (htmlContent) => {
            // Content without steps should not be detected as having steps
            // (unless it accidentally contains the keywords)
            const hasSteps = hasImplementationSteps(htmlContent);
            const hasOrderedList = /<ol[^>]*>[\s\S]*<\/ol>/i.test(htmlContent);
            
            // If no ordered list, should not detect steps
            if (!hasOrderedList) {
              return !hasSteps;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have ordered list structure for implementation steps', () => {
      fc.assert(
        fc.property(
          implementationStepsContentGenerator(),
          (htmlContent) => {
            // Should contain <ol> tags
            return /<ol[^>]*>[\s\S]*<\/ol>/i.test(htmlContent);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have multiple steps in implementation content', () => {
      fc.assert(
        fc.property(
          implementationStepsContentGenerator(),
          (htmlContent) => {
            // Count <li> tags
            const liMatches = htmlContent.match(/<li>/gi);
            return liMatches && liMatches.length >= 3;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have step-related keywords in implementation content', () => {
      fc.assert(
        fc.property(
          implementationStepsContentGenerator(),
          (htmlContent) => {
            return /步骤|steps|实施|implementation|如何|how to/i.test(htmlContent);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 27: Best practices section
  // ============================================================================
  
  describe('Property 27: Best practices section', () => {
    /**
     * Feature: geo-optimization, Property 27: Best practices section
     * 
     * For any technical guide article, the content should include a section 
     * discussing best practices
     * 
     * Validates: Requirements 7.5
     */
    it('should detect best practices section in content', () => {
      fc.assert(
        fc.property(
          bestPracticesSectionGenerator(),
          (htmlContent) => {
            return hasBestPracticesSection(htmlContent);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT detect best practices in content without them', () => {
      fc.assert(
        fc.property(
          contentWithoutBestPracticesGenerator(),
          (htmlContent) => {
            // Content without best practices should not be detected as having them
            const hasBestPractices = hasBestPracticesSection(htmlContent);
            const hasKeywords = /最佳实践|best practices|推荐做法|recommended practices/i.test(htmlContent);
            
            // If no keywords, should not detect best practices
            if (!hasKeywords) {
              return !hasBestPractices;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have list structure for best practices', () => {
      fc.assert(
        fc.property(
          bestPracticesSectionGenerator(),
          (htmlContent) => {
            // Should contain <ul> or <ol> tags
            return /<[uo]l[^>]*>[\s\S]*<\/[uo]l>/i.test(htmlContent);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have multiple practices in best practices section', () => {
      fc.assert(
        fc.property(
          bestPracticesSectionGenerator(),
          (htmlContent) => {
            // Count <li> tags
            const liMatches = htmlContent.match(/<li>/gi);
            return liMatches && liMatches.length >= 3;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have best practices keywords', () => {
      fc.assert(
        fc.property(
          bestPracticesSectionGenerator(),
          (htmlContent) => {
            return /最佳实践|best practices|推荐做法|recommended practices/i.test(htmlContent);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Complete Q&A System Validation
  // ============================================================================
  
  describe('Integration: Complete Q&A System Validation', () => {
    it('should validate complete coverage matrix has all required properties', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            return (
              isValidCoverageMatrix(matrix) &&
              hasComparisonCoverage(matrix) &&
              hasApplicationCoverage(matrix) &&
              hasLimitationCoverage(matrix)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain consistency between qaPairs and coverage indicators', () => {
      fc.assert(
        fc.property(
          incompleteQuestionCoverageMatrixGenerator(),
          (matrix) => {
            const actualDefinition = matrix.qaPairs.some(qa => qa.category === 'definition');
            const actualComparison = matrix.qaPairs.some(qa => qa.category === 'comparison');
            const actualApplication = matrix.qaPairs.some(qa => qa.category === 'application');
            const actualLimitation = matrix.qaPairs.some(qa => qa.category === 'limitation');
            
            return (
              actualDefinition === matrix.coverage.hasDefinition &&
              actualComparison === matrix.coverage.hasComparison &&
              actualApplication === matrix.coverage.hasApplication &&
              actualLimitation === matrix.coverage.hasLimitation
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have valid structure for all Q&A pairs in matrix', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            return matrix.qaPairs.every(isValidQAPair);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have at least one Q&A pair in complete matrix', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            return matrix.qaPairs.length >= 1;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have all four categories represented in complete matrix', () => {
      fc.assert(
        fc.property(
          completeQuestionCoverageMatrixGenerator(),
          (matrix) => {
            const categories = new Set(matrix.qaPairs.map(qa => qa.category));
            return (
              categories.has('definition') &&
              categories.has('comparison') &&
              categories.has('application') &&
              categories.has('limitation')
            );
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
    it('should handle empty Q&A array', () => {
      const article = {
        id: 'test',
        title: 'Test',
        content: 'Test content',
        qaPairs: [],
      };
      
      expect(hasQAComponent(article)).toBe(false);
    });
    
    it('should handle undefined Q&A', () => {
      const article = {
        id: 'test',
        title: 'Test',
        content: 'Test content',
        qaPairs: undefined,
      };
      
      expect(hasQAComponent(article)).toBe(false);
    });
    
    it('should handle null Q&A', () => {
      const article = {
        id: 'test',
        title: 'Test',
        content: 'Test content',
        qaPairs: null,
      };
      
      expect(hasQAComponent(article)).toBe(false);
    });
    
    it('should handle empty content for implementation steps', () => {
      expect(hasImplementationSteps('')).toBe(false);
    });
    
    it('should handle empty content for best practices', () => {
      expect(hasBestPracticesSection('')).toBe(false);
    });
    
    it('should handle malformed HTML gracefully', () => {
      const malformedHTML = '<ol><li>Step 1<li>Step 2</ol>'; // Missing closing tag
      // Should still detect ordered list
      expect(/<ol[^>]*>[\s\S]*<\/ol>/i.test(malformedHTML)).toBe(true);
    });
    
    it('should validate Q&A pair with all required fields', () => {
      const validQA: QAPair = {
        question: 'What is blockchain?',
        answer: 'Blockchain is a distributed ledger technology.',
        category: 'definition',
        relatedConcepts: ['blockchain', 'distributed ledger'],
      };
      
      expect(isValidQAPair(validQA)).toBe(true);
    });
    
    it('should reject Q&A pair with missing fields', () => {
      const invalidQA = {
        question: 'What is blockchain?',
        // Missing answer
        category: 'definition',
        relatedConcepts: [],
      };
      
      expect(isValidQAPair(invalidQA)).toBe(false);
    });
    
    it('should reject Q&A pair with invalid category', () => {
      const invalidQA = {
        question: 'What is blockchain?',
        answer: 'Blockchain is a distributed ledger technology.',
        category: 'invalid-category',
        relatedConcepts: [],
      };
      
      expect(isValidQAPair(invalidQA)).toBe(false);
    });
  });
});
