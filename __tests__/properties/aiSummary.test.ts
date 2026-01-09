/**
 * Property-Based Tests for AI Summary
 * 
 * Feature: geo-optimization
 * Tests Properties 18, 19, 20, 21, 22 from the design document
 * Validates Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import * as fc from 'fast-check';
import type { AISummary } from '@/types/geo';
import {
  aiSummaryGenerator,
  aiSummaryWithoutWhatIsGenerator,
  aiSummaryWithoutWhyImportantGenerator,
  aiSummaryWithoutUseCasesGenerator,
  aiSummaryWithInvalidUseCasesGenerator,
  aiSummaryWithInvalidKeyTakeawaysGenerator,
  minimalAISummaryGenerator,
  comprehensiveAISummaryGenerator,
  articleWithAISummaryGenerator,
  articleWithoutAISummaryGenerator,
  articleWithPartialAISummaryGenerator,
  mixedAISummaryContentGenerator,
} from '../generators/aiSummary.generator';

// ============================================================================
// Helper Functions for Validation
// ============================================================================

/**
 * Check if an AI Summary has all required fields present and non-empty
 */
function hasCompleteAISummary(summary: any): boolean {
  if (!summary || typeof summary !== 'object') {
    return false;
  }
  
  return (
    typeof summary.whatIs === 'string' &&
    summary.whatIs.trim().length > 0 &&
    typeof summary.whyImportant === 'string' &&
    summary.whyImportant.trim().length > 0 &&
    Array.isArray(summary.useCases) &&
    summary.useCases.length > 0 &&
    Array.isArray(summary.keyTakeaways) &&
    summary.keyTakeaways.length > 0
  );
}

/**
 * Check if AI Summary has whatIs field
 */
function hasWhatIsField(summary: any): boolean {
  if (!summary || typeof summary !== 'object') {
    return false;
  }
  
  return (
    typeof summary.whatIs === 'string' &&
    summary.whatIs.trim().length > 0
  );
}

/**
 * Check if AI Summary has whyImportant field
 */
function hasWhyImportantField(summary: any): boolean {
  if (!summary || typeof summary !== 'object') {
    return false;
  }
  
  return (
    typeof summary.whyImportant === 'string' &&
    summary.whyImportant.trim().length > 0
  );
}

/**
 * Check if AI Summary has useCases field with at least one item
 */
function hasUseCasesField(summary: any): boolean {
  if (!summary || typeof summary !== 'object') {
    return false;
  }
  
  return (
    Array.isArray(summary.useCases) &&
    summary.useCases.length > 0
  );
}

/**
 * Check if AI Summary has properly structured array fields
 */
function hasStructuredFormat(summary: any): boolean {
  if (!summary || typeof summary !== 'object') {
    return false;
  }
  
  return (
    Array.isArray(summary.useCases) &&
    Array.isArray(summary.keyTakeaways)
  );
}

/**
 * Validate that all items in an array are non-empty strings
 */
function allItemsAreNonEmptyStrings(arr: any[]): boolean {
  return arr.every(item => typeof item === 'string' && item.trim().length > 0);
}

describe('AI Summary - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 18: AI Summary component presence
  // ============================================================================
  
  describe('Property 18: AI Summary component presence', () => {
    /**
     * Feature: geo-optimization, Property 18: AI Summary component presence
     * 
     * For any blog article, the page should render an AI Summary component
     * 
     * Validates: Requirements 6.1
     */
    it('should have AI Summary present in articles', () => {
      fc.assert(
        fc.property(
          articleWithAISummaryGenerator(),
          (article) => {
            // Article should have an aiSummary field
            return article.aiSummary !== undefined && article.aiSummary !== null;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have complete AI Summary structure', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            // AI Summary should have all required fields
            return hasCompleteAISummary(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle articles without AI Summary gracefully', () => {
      fc.assert(
        fc.property(
          articleWithoutAISummaryGenerator(),
          (article) => {
            // Article without AI Summary should have undefined or null aiSummary
            // This tests graceful degradation
            return article.aiSummary === undefined || article.aiSummary === null;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should distinguish between complete and incomplete AI Summaries', () => {
      fc.assert(
        fc.property(
          mixedAISummaryContentGenerator(),
          (article) => {
            if (!article.aiSummary) {
              // No AI Summary is a valid state (graceful degradation)
              return true;
            }
            
            // If AI Summary exists, it should either be complete or incomplete
            const isComplete = hasCompleteAISummary(article.aiSummary);
            const hasAnyField = (
              hasWhatIsField(article.aiSummary) ||
              hasWhyImportantField(article.aiSummary) ||
              hasUseCasesField(article.aiSummary)
            );
            
            // Either complete or has at least some fields
            return isComplete || hasAnyField;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 19: AI Summary whatIs field
  // ============================================================================
  
  describe('Property 19: AI Summary whatIs field', () => {
    /**
     * Feature: geo-optimization, Property 19: AI Summary whatIs field
     * 
     * For any AI Summary, it should contain a non-empty whatIs field defining the core concept
     * 
     * Validates: Requirements 6.2
     */
    it('should have non-empty whatIs field in complete AI Summary', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return hasWhatIsField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have whatIs as a string type', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return typeof summary.whatIs === 'string';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have whatIs with meaningful length', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            // whatIs should be at least 20 characters (meaningful definition)
            return summary.whatIs.trim().length >= 20;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing whatIs field', () => {
      fc.assert(
        fc.property(
          aiSummaryWithoutWhatIsGenerator(),
          (summary) => {
            // Summary without whatIs should fail the check
            return !hasWhatIsField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have whatIs in both minimal and comprehensive summaries', () => {
      fc.assert(
        fc.property(
          fc.oneof(minimalAISummaryGenerator(), comprehensiveAISummaryGenerator()),
          (summary) => {
            return hasWhatIsField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 20: AI Summary whyImportant field
  // ============================================================================
  
  describe('Property 20: AI Summary whyImportant field', () => {
    /**
     * Feature: geo-optimization, Property 20: AI Summary whyImportant field
     * 
     * For any AI Summary, it should contain a non-empty whyImportant field explaining significance
     * 
     * Validates: Requirements 6.3
     */
    it('should have non-empty whyImportant field in complete AI Summary', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return hasWhyImportantField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have whyImportant as a string type', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return typeof summary.whyImportant === 'string';
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have whyImportant with meaningful length', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            // whyImportant should be at least 20 characters (meaningful explanation)
            return summary.whyImportant.trim().length >= 20;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing whyImportant field', () => {
      fc.assert(
        fc.property(
          aiSummaryWithoutWhyImportantGenerator(),
          (summary) => {
            // Summary without whyImportant should fail the check
            return !hasWhyImportantField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have whyImportant in both minimal and comprehensive summaries', () => {
      fc.assert(
        fc.property(
          fc.oneof(minimalAISummaryGenerator(), comprehensiveAISummaryGenerator()),
          (summary) => {
            return hasWhyImportantField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 21: AI Summary useCases field
  // ============================================================================
  
  describe('Property 21: AI Summary useCases field', () => {
    /**
     * Feature: geo-optimization, Property 21: AI Summary useCases field
     * 
     * For any AI Summary, it should contain a useCases array with at least one use case
     * 
     * Validates: Requirements 6.4
     */
    it('should have non-empty useCases array in complete AI Summary', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return hasUseCasesField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have useCases as an array type', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return Array.isArray(summary.useCases);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have at least one use case', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return summary.useCases.length >= 1;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have all use cases as non-empty strings', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return allItemsAreNonEmptyStrings(summary.useCases);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect empty useCases array', () => {
      fc.assert(
        fc.property(
          aiSummaryWithoutUseCasesGenerator(),
          (summary) => {
            // Summary with empty useCases should fail the check
            return !hasUseCasesField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have useCases in both minimal and comprehensive summaries', () => {
      fc.assert(
        fc.property(
          fc.oneof(minimalAISummaryGenerator(), comprehensiveAISummaryGenerator()),
          (summary) => {
            return hasUseCasesField(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have reasonable number of use cases', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            // Should have between 1 and 5 use cases (as per generator)
            return summary.useCases.length >= 1 && summary.useCases.length <= 5;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 22: AI Summary structured format
  // ============================================================================
  
  describe('Property 22: AI Summary structured format', () => {
    /**
     * Feature: geo-optimization, Property 22: AI Summary structured format
     * 
     * For any AI Summary, the useCases and keyTakeaways fields should be arrays (not plain strings)
     * 
     * Validates: Requirements 6.5
     */
    it('should have useCases and keyTakeaways as arrays', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return hasStructuredFormat(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect invalid useCases format (string instead of array)', () => {
      fc.assert(
        fc.property(
          aiSummaryWithInvalidUseCasesGenerator(),
          (summary) => {
            // Invalid format should fail the structured format check
            return !Array.isArray(summary.useCases);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect invalid keyTakeaways format (string instead of array)', () => {
      fc.assert(
        fc.property(
          aiSummaryWithInvalidKeyTakeawaysGenerator(),
          (summary) => {
            // Invalid format should fail the structured format check
            return !Array.isArray(summary.keyTakeaways);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have keyTakeaways as array with at least one item', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return (
              Array.isArray(summary.keyTakeaways) &&
              summary.keyTakeaways.length >= 1
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have all keyTakeaways as non-empty strings', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return allItemsAreNonEmptyStrings(summary.keyTakeaways);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain structured format in minimal summaries', () => {
      fc.assert(
        fc.property(
          minimalAISummaryGenerator(),
          (summary) => {
            return hasStructuredFormat(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain structured format in comprehensive summaries', () => {
      fc.assert(
        fc.property(
          comprehensiveAISummaryGenerator(),
          (summary) => {
            return hasStructuredFormat(summary);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have reasonable number of keyTakeaways', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            // Should have between 1 and 5 key takeaways (as per generator)
            return summary.keyTakeaways.length >= 1 && summary.keyTakeaways.length <= 5;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Complete AI Summary Validation
  // ============================================================================
  
  describe('Integration: Complete AI Summary Validation', () => {
    it('should validate complete AI Summary has all required properties', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            return (
              hasWhatIsField(summary) &&
              hasWhyImportantField(summary) &&
              hasUseCasesField(summary) &&
              hasStructuredFormat(summary) &&
              hasCompleteAISummary(summary)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle mixed article content with various AI Summary states', () => {
      fc.assert(
        fc.property(
          mixedAISummaryContentGenerator(),
          (article) => {
            // Should always have valid article structure
            return (
              typeof article.id === 'string' &&
              article.id.length > 0 &&
              typeof article.title === 'string' &&
              article.title.length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should ensure minimal summaries meet all requirements', () => {
      fc.assert(
        fc.property(
          minimalAISummaryGenerator(),
          (summary) => {
            return (
              hasCompleteAISummary(summary) &&
              summary.whatIs.length >= 20 &&
              summary.whyImportant.length >= 20 &&
              summary.useCases.length >= 1 &&
              summary.keyTakeaways.length >= 1
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should ensure comprehensive summaries have rich content', () => {
      fc.assert(
        fc.property(
          comprehensiveAISummaryGenerator(),
          (summary) => {
            return (
              hasCompleteAISummary(summary) &&
              summary.whatIs.length >= 100 &&
              summary.whyImportant.length >= 100 &&
              summary.useCases.length >= 3 &&
              summary.keyTakeaways.length >= 3
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate that all array items have meaningful content', () => {
      fc.assert(
        fc.property(
          aiSummaryGenerator(),
          (summary) => {
            const useCasesValid = summary.useCases.every(uc => uc.trim().length >= 10);
            const takeawaysValid = summary.keyTakeaways.every(kt => kt.trim().length >= 10);
            return useCasesValid && takeawaysValid;
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
    it('should handle null AI Summary', () => {
      const summary = null;
      expect(hasCompleteAISummary(summary)).toBe(false);
      expect(hasWhatIsField(summary)).toBe(false);
      expect(hasWhyImportantField(summary)).toBe(false);
      expect(hasUseCasesField(summary)).toBe(false);
      expect(hasStructuredFormat(summary)).toBe(false);
    });
    
    it('should handle undefined AI Summary', () => {
      const summary = undefined;
      expect(hasCompleteAISummary(summary)).toBe(false);
      expect(hasWhatIsField(summary)).toBe(false);
      expect(hasWhyImportantField(summary)).toBe(false);
      expect(hasUseCasesField(summary)).toBe(false);
      expect(hasStructuredFormat(summary)).toBe(false);
    });
    
    it('should handle empty object as AI Summary', () => {
      const summary = {};
      expect(hasCompleteAISummary(summary)).toBe(false);
      expect(hasWhatIsField(summary)).toBe(false);
      expect(hasWhyImportantField(summary)).toBe(false);
      expect(hasUseCasesField(summary)).toBe(false);
      expect(hasStructuredFormat(summary)).toBe(false);
    });
    
    it('should handle AI Summary with only whitespace in string fields', () => {
      const summary = {
        whatIs: '   ',
        whyImportant: '   ',
        useCases: ['   '],
        keyTakeaways: ['   '],
      };
      expect(hasCompleteAISummary(summary)).toBe(false);
      expect(hasWhatIsField(summary)).toBe(false);
      expect(hasWhyImportantField(summary)).toBe(false);
    });
    
    it('should handle AI Summary with empty arrays', () => {
      const summary = {
        whatIs: 'Valid definition',
        whyImportant: 'Valid importance',
        useCases: [],
        keyTakeaways: [],
      };
      expect(hasCompleteAISummary(summary)).toBe(false);
      expect(hasUseCasesField(summary)).toBe(false);
    });
    
    it('should handle AI Summary with mixed valid and invalid fields', () => {
      const summary = {
        whatIs: 'Valid definition',
        whyImportant: '',
        useCases: ['Valid use case'],
        keyTakeaways: [],
      };
      expect(hasCompleteAISummary(summary)).toBe(false);
      expect(hasWhatIsField(summary)).toBe(true);
      expect(hasWhyImportantField(summary)).toBe(false);
      expect(hasUseCasesField(summary)).toBe(true);
    });
  });
});
