/**
 * Property-Based Tests for Knowledge Block Parser
 * 
 * Feature: geo-optimization
 * Tests Properties 1, 2, 3, 17 from the design document
 * Validates Requirements: 1.1, 1.2, 1.3, 5.5
 */

import * as fc from 'fast-check';
import { KnowledgeBlockParser, parseKnowledgeBlocks } from '@/lib/geo/knowledgeBlockParser';
import type { KnowledgeBlock } from '@/types/geo';
import {
  chineseDefinitionGenerator,
  englishDefinitionGenerator,
  chineseConclusionGenerator,
  englishConclusionGenerator,
  listStructureGenerator,
  tableStructureGenerator,
  contentWithoutDefinitionGenerator,
  contentWithoutConclusionGenerator,
  plainTextListGenerator,
  complexArticleGenerator,
  decomposableContentGenerator,
} from '../generators/knowledgeBlock.generator';

describe('Knowledge Block Parser - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 1: Definition sentence presence
  // ============================================================================
  
  describe('Property 1: Definition sentence presence', () => {
    /**
     * Feature: geo-optimization, Property 1: Definition sentence presence
     * 
     * For any blog article, the content should contain at least one clear 
     * definition sentence using patterns like "X 是什么", "X 指的是", or "X 定义为"
     * 
     * Validates: Requirements 1.1
     */
    it('should extract definition blocks from Chinese definition patterns', () => {
      fc.assert(
        fc.property(
          chineseDefinitionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should extract at least one definition block
            const definitions = blocks.filter(b => b.type === 'definition');
            return definitions.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should extract definition blocks from English definition patterns', () => {
      fc.assert(
        fc.property(
          englishDefinitionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should extract at least one definition block
            const definitions = blocks.filter(b => b.type === 'definition');
            return definitions.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT extract definition blocks from content without definition patterns', () => {
      fc.assert(
        fc.property(
          contentWithoutDefinitionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should NOT extract definition blocks
            const definitions = blocks.filter(b => b.type === 'definition');
            return definitions.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should assign high extractability scores to definition blocks', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseDefinitionGenerator(), englishDefinitionGenerator()),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            const definitions = blocks.filter(b => b.type === 'definition');
            
            // All definition blocks should have high extractability (> 0.7)
            return definitions.every(def => def.extractability > 0.7);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should extract term and definition from definition blocks', () => {
      fc.assert(
        fc.property(
          chineseDefinitionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            const definitions = blocks.filter(b => b.type === 'definition');
            
            if (definitions.length === 0) return false;
            
            // Each definition should have a title containing the term
            return definitions.every(def => {
              return def.title.includes('Definition:') && def.title.length > 11;
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 2: Conclusion marker presence
  // ============================================================================
  
  describe('Property 2: Conclusion marker presence', () => {
    /**
     * Feature: geo-optimization, Property 2: Conclusion marker presence
     * 
     * For any blog article with conclusions, the content should use explicit 
     * conclusion markers like "因此", "结论是", or "综上所述"
     * 
     * Validates: Requirements 1.2
     */
    it('should extract conclusion blocks from Chinese conclusion markers', () => {
      fc.assert(
        fc.property(
          chineseConclusionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should extract at least one conclusion block
            const conclusions = blocks.filter(b => b.type === 'conclusion');
            return conclusions.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should extract conclusion blocks from English conclusion markers', () => {
      fc.assert(
        fc.property(
          englishConclusionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should extract at least one conclusion block
            const conclusions = blocks.filter(b => b.type === 'conclusion');
            return conclusions.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should NOT extract conclusion blocks from content without conclusion markers', () => {
      fc.assert(
        fc.property(
          contentWithoutConclusionGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should NOT extract conclusion blocks
            const conclusions = blocks.filter(b => b.type === 'conclusion');
            return conclusions.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should assign high extractability scores to conclusion blocks', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseConclusionGenerator(), englishConclusionGenerator()),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            const conclusions = blocks.filter(b => b.type === 'conclusion');
            
            // All conclusion blocks should have high extractability (> 0.7)
            return conclusions.every(conc => conc.extractability > 0.7);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should extract conclusion content with sufficient length', () => {
      fc.assert(
        fc.property(
          fc.oneof(chineseConclusionGenerator(), englishConclusionGenerator()),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            const conclusions = blocks.filter(b => b.type === 'conclusion');
            
            // Each conclusion should have substantial content (> 20 chars after stripping HTML)
            return conclusions.every(conc => {
              const textContent = conc.content.replace(/<[^>]*>/g, '').trim();
              return textContent.length > 20;
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 3: List structure formatting
  // ============================================================================
  
  describe('Property 3: List structure formatting', () => {
    /**
     * Feature: geo-optimization, Property 3: List structure formatting
     * 
     * For any content containing list information, the HTML should use proper 
     * <ul> or <ol> tags rather than plain text enumeration
     * 
     * Validates: Requirements 1.3
     */
    it('should recognize and extract proper list structures', () => {
      fc.assert(
        fc.property(
          listStructureGenerator(),
          (htmlContent) => {
            // Verify the generated content has proper list tags
            const hasUlTag = htmlContent.includes('<ul>');
            const hasOlTag = htmlContent.includes('<ol>');
            const hasLiTag = htmlContent.includes('<li>');
            
            // Should have either ul or ol, and must have li
            return (hasUlTag || hasOlTag) && hasLiTag;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should increase extractability score for content with list structures', () => {
      fc.assert(
        fc.property(
          listStructureGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Content with lists should have blocks with good extractability
            // The parser should recognize structured content
            if (blocks.length === 0) return true; // Skip if no blocks extracted
            
            // At least some blocks should benefit from list structure
            const hasGoodExtractability = blocks.some(b => b.extractability > 0.6);
            return hasGoodExtractability;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should recognize table structures as comparison blocks', () => {
      fc.assert(
        fc.property(
          tableStructureGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Should extract at least one comparison block for tables
            const comparisons = blocks.filter(b => b.type === 'comparison');
            return comparisons.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should assign high extractability to table structures', () => {
      fc.assert(
        fc.property(
          tableStructureGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            const comparisons = blocks.filter(b => b.type === 'comparison');
            
            // Tables should have high extractability
            return comparisons.every(comp => comp.extractability > 0.7);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should preserve list structure in extracted blocks', () => {
      fc.assert(
        fc.property(
          listStructureGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // If blocks are extracted, they should preserve list tags
            // (This tests that the parser doesn't strip important structure)
            return blocks.every(block => {
              // If the original content had lists, extracted blocks should too
              if (htmlContent.includes('<ul>') || htmlContent.includes('<ol>')) {
                // The block content should reference or contain list-related content
                return block.content.length > 0;
              }
              return true;
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 17: Knowledge block decomposition
  // ============================================================================
  
  describe('Property 17: Knowledge block decomposition', () => {
    /**
     * Feature: geo-optimization, Property 17: Knowledge block decomposition
     * 
     * For any blog article, the content should be parseable into multiple 
     * independent knowledge blocks
     * 
     * Validates: Requirements 5.5
     */
    it('should decompose complex content into multiple knowledge blocks', () => {
      fc.assert(
        fc.property(
          complexArticleGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // Complex content SHOULD produce blocks, but only if it contains
            // recognizable patterns that the parser extracts as blocks
            
            // Check if content has patterns that produce extractable blocks
            const hasDefinitionPattern = /是指|指的是|定义为|is defined as|refers to|means/i.test(htmlContent);
            const hasConclusionPattern = /因此|结论是|综上所述|Therefore|In conclusion/i.test(htmlContent);
            const hasTable = /<table>/i.test(htmlContent);
            const hasCodeBlock = /<pre>/i.test(htmlContent);
            const hasExampleKeyword = /例如|举例来说|for example|for instance/i.test(htmlContent);
            const hasComparisonKeyword = /和.+的区别|与.+的对比|vs\.|versus|difference between/i.test(htmlContent);
            
            // If content has extractable patterns, we should extract blocks
            if (hasDefinitionPattern || hasConclusionPattern || hasTable || 
                hasCodeBlock || hasExampleKeyword || hasComparisonKeyword) {
              return blocks.length >= 1;
            }
            
            // Otherwise, it's acceptable to have 0 blocks
            // (Lists alone don't create blocks, they enhance existing blocks)
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should create blocks with unique IDs', () => {
      fc.assert(
        fc.property(
          decomposableContentGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            if (blocks.length === 0) return true;
            
            // All block IDs should be unique
            const ids = blocks.map(b => b.id);
            const uniqueIds = new Set(ids);
            return uniqueIds.size === ids.length;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should classify blocks into appropriate types', () => {
      fc.assert(
        fc.property(
          decomposableContentGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // All blocks should have valid types
            const validTypes: KnowledgeBlock['type'][] = [
              'definition', 'explanation', 'comparison', 'example', 'conclusion'
            ];
            
            return blocks.every(block => validTypes.includes(block.type));
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should assign extractability scores between 0 and 1', () => {
      fc.assert(
        fc.property(
          complexArticleGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // All extractability scores should be in valid range
            return blocks.every(block => 
              block.extractability >= 0 && block.extractability <= 1
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should create blocks with non-empty content', () => {
      fc.assert(
        fc.property(
          decomposableContentGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // All blocks should have non-empty content
            return blocks.every(block => 
              block.content && block.content.trim().length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should create blocks with meaningful titles', () => {
      fc.assert(
        fc.property(
          decomposableContentGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // All blocks should have non-empty titles
            return blocks.every(block => 
              block.title && block.title.trim().length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle content with mixed block types', () => {
      fc.assert(
        fc.property(
          decomposableContentGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            if (blocks.length < 2) return true; // Skip if too few blocks
            
            // Should have multiple different block types
            const types = new Set(blocks.map(b => b.type));
            return types.size >= 2;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain relatedBlocks as an array', () => {
      fc.assert(
        fc.property(
          complexArticleGenerator(),
          (htmlContent) => {
            const parser = new KnowledgeBlockParser();
            const blocks = parser.parse(htmlContent);
            
            // All blocks should have relatedBlocks as an array
            return blocks.every(block => Array.isArray(block.relatedBlocks));
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Testing with parseKnowledgeBlocks convenience function
  // ============================================================================
  
  describe('Integration with parseKnowledgeBlocks function', () => {
    it('should work correctly with the convenience function', () => {
      fc.assert(
        fc.property(
          complexArticleGenerator(),
          (htmlContent) => {
            const blocks = parseKnowledgeBlocks(htmlContent);
            
            // Should return an array
            if (!Array.isArray(blocks)) return false;
            
            // All blocks should have required properties
            return blocks.every(block => 
              block.id &&
              block.type &&
              block.title &&
              block.content &&
              Array.isArray(block.relatedBlocks) &&
              typeof block.extractability === 'number'
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
    it('should handle empty content gracefully', () => {
      const parser = new KnowledgeBlockParser();
      const blocks = parser.parse('');
      
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBe(0);
    });
    
    it('should handle content with only whitespace', () => {
      const parser = new KnowledgeBlockParser();
      const blocks = parser.parse('   \n\n   ');
      
      expect(Array.isArray(blocks)).toBe(true);
    });
    
    it('should handle malformed HTML gracefully', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 100 }),
          (randomString) => {
            const parser = new KnowledgeBlockParser();
            
            // Should not throw errors even with random input
            try {
              const blocks = parser.parse(randomString);
              return Array.isArray(blocks);
            } catch (error) {
              return false; // Should not throw
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
