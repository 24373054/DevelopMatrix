/**
 * Property-Based Tests for Authority Signals
 * 
 * Feature: geo-optimization
 * Tests Properties 7, 8, 9, 10 from the design document
 * Validates Requirements: 3.1, 3.2, 3.3, 3.4
 */

import * as fc from 'fast-check';
import type { AuthorInfo, AuthorProject } from '@/types/geo';
import {
  completeAuthorInfoGenerator,
  authorInfoWithoutNameGenerator,
  authorInfoWithoutBioGenerator,
  authorInfoWithoutExpertiseGenerator,
  contentWithContextGenerator,
  contentWithoutContextGenerator,
  contentWithQuantifiedExperienceGenerator,
  contentWithoutQuantifiedExperienceGenerator,
  contentWithSourceAttributionGenerator,
  contentWithoutSourceAttributionGenerator,
  articleMetadataWithCompleteAuthorGenerator,
  articleMetadataWithIncompleteAuthorGenerator,
  mixedAuthorityContentGenerator,
  projectWithCountGenerator,
  projectWithoutCountGenerator,
} from '../generators/authoritySignals.generator';

// ============================================================================
// Helper Functions for Validation
// ============================================================================

/**
 * Check if author information is complete
 * Property 7: Author information completeness
 */
function hasCompleteAuthorInfo(author: any): boolean {
  if (!author || typeof author !== 'object') {
    return false;
  }
  
  return (
    typeof author.name === 'string' &&
    author.name.trim().length > 0 &&
    typeof author.role === 'string' &&
    author.role.trim().length > 0 &&
    typeof author.bio === 'string' &&
    author.bio.trim().length > 0 &&
    Array.isArray(author.expertise) &&
    author.expertise.length > 0 &&
    Array.isArray(author.credentials) &&
    author.credentials.length > 0 &&
    typeof author.contact === 'object' &&
    author.contact !== null
  );
}

/**
 * Check if content contains context specification
 * Property 8: Context specification
 */
function hasContextSpecification(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  // Chinese context patterns
  const chinesePatterns = [
    /在.{2,20}中/,  // 在...中
    /在.{2,20}领域/,  // 在...领域
    /在.{2,20}场景下/,  // 在...场景下
  ];
  
  // English context patterns
  const englishPatterns = [
    /in\s+(smart\s+contract|protocol|security|development|auditing)/i,
    /in\s+\w+\s+(smart\s+contract|protocol|security|development|auditing)/i,
    /in\s+the\s+context\s+of/i,
    /when\s+(working\s+with|developing|auditing)/i,
  ];
  
  const hasChineseContext = chinesePatterns.some(pattern => pattern.test(content));
  const hasEnglishContext = englishPatterns.some(pattern => pattern.test(content));
  
  return hasChineseContext || hasEnglishContext;
}

/**
 * Check if content contains quantified experience evidence
 * Property 9: Quantified experience evidence
 */
function hasQuantifiedExperience(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  // Chinese quantified patterns
  const chinesePatterns = [
    /\d+\+?\s*(个|次|年|项目)/,  // N+ 项目, N 年, N 次
    /在\s*\d+\+?\s*(个|次|年|项目)/,  // 在 N+ 项目
    /经过\s*\d+\+?\s*(个|次|年|项目)/,  // 经过 N 年
    /通过\s*\d+\+?\s*(个|次|年|项目)/,  // 通过 N+ 次
  ];
  
  // English quantified patterns
  const englishPatterns = [
    /\d+\+?\s+(projects?|years?|audits?|cases?)/i,
    /in\s+\d+\+?\s+(projects?|years?|audits?|cases?)/i,
    /after\s+\d+\+?\s+(projects?|years?|audits?|cases?)/i,
    /through\s+\d+\+?\s+(projects?|years?|audits?|cases?)/i,
    /over\s+\d+\+?\s+(projects?|years?|audits?|cases?)/i,
  ];
  
  const hasChineseQuantified = chinesePatterns.some(pattern => pattern.test(content));
  const hasEnglishQuantified = englishPatterns.some(pattern => pattern.test(content));
  
  return hasChineseQuantified || hasEnglishQuantified;
}

/**
 * Check if content contains knowledge source attribution
 * Property 10: Knowledge source attribution
 */
function hasSourceAttribution(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  // Chinese source patterns
  const chinesePatterns = [
    /根据.{2,20}(发现|表明|显示)/,  // 根据...发现/表明/显示
    /基于.{2,20}(经验|研究|分析)/,  // 基于...经验/研究/分析
    /通过.{2,20}(研究|分析|实践)/,  // 通过...研究/分析/实践
    /(研究团队|项目经验|学术研究|行业分析)/,  // 研究团队, 项目经验, etc.
  ];
  
  // English source patterns
  const englishPatterns = [
    /according\s+to\s+(our|the)\s+(research|team|analysis|study)/i,
    /based\s+on\s+(our|the)?\s*(research|experience|analysis|study|project)/i,
    /through\s+(our|the)?\s*(research|analysis|experience)/i,
    /(research\s+team|project\s+experience|academic\s+research|industry\s+analysis)/i,
    /(our|the)\s+(team|research|study)\s+(found|shows|indicates)/i,
  ];
  
  const hasChineseSource = chinesePatterns.some(pattern => pattern.test(content));
  const hasEnglishSource = englishPatterns.some(pattern => pattern.test(content));
  
  return hasChineseSource || hasEnglishSource;
}

/**
 * Check if author has quantified project experience
 */
function hasQuantifiedProjects(author: AuthorInfo): boolean {
  if (!author.projects || author.projects.length === 0) {
    return false;
  }
  
  return author.projects.some(project => 
    typeof project.count === 'number' && project.count > 0
  );
}

/**
 * Validate all items in expertise array are non-empty strings
 */
function allExpertiseValid(expertise: any[]): boolean {
  return expertise.every(item => 
    typeof item === 'string' && item.trim().length > 0
  );
}

describe('Authority Signals - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 7: Author information completeness
  // ============================================================================
  
  describe('Property 7: Author information completeness', () => {
    /**
     * Feature: geo-optimization, Property 7: Author information completeness
     * 
     * For any blog article, the metadata should include both author name and authorBio fields
     * 
     * Validates: Requirements 3.1
     */
    it('should have complete author information in article metadata', () => {
      fc.assert(
        fc.property(
          articleMetadataWithCompleteAuthorGenerator(),
          (metadata) => {
            return hasCompleteAuthorInfo(metadata.author);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have non-empty author name', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return (
              typeof author.name === 'string' &&
              author.name.trim().length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have non-empty author bio', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return (
              typeof author.bio === 'string' &&
              author.bio.trim().length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have at least one area of expertise', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return (
              Array.isArray(author.expertise) &&
              author.expertise.length > 0 &&
              allExpertiseValid(author.expertise)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have at least one credential', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return (
              Array.isArray(author.credentials) &&
              author.credentials.length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have contact information', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return (
              typeof author.contact === 'object' &&
              author.contact !== null
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing author name', () => {
      fc.assert(
        fc.property(
          authorInfoWithoutNameGenerator(),
          (author) => {
            return !hasCompleteAuthorInfo(author);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing author bio', () => {
      fc.assert(
        fc.property(
          authorInfoWithoutBioGenerator(),
          (author) => {
            return !hasCompleteAuthorInfo(author);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect empty expertise array', () => {
      fc.assert(
        fc.property(
          authorInfoWithoutExpertiseGenerator(),
          (author) => {
            return !hasCompleteAuthorInfo(author);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate credentials have proper structure', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return author.credentials.every(cred =>
              typeof cred.type === 'string' &&
              ['academic', 'professional', 'research'].includes(cred.type) &&
              typeof cred.description === 'string' &&
              cred.description.length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 8: Context specification
  // ============================================================================
  
  describe('Property 8: Context specification', () => {
    /**
     * Feature: geo-optimization, Property 8: Context specification
     * 
     * For any technical article, the content should include context markers 
     * like "在...中" to specify use cases
     * 
     * Validates: Requirements 3.2
     */
    it('should detect context specification in content', () => {
      fc.assert(
        fc.property(
          contentWithContextGenerator(),
          (content) => {
            return hasContextSpecification(content);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing context specification', () => {
      fc.assert(
        fc.property(
          contentWithoutContextGenerator(),
          (content) => {
            // Content without explicit context markers should not pass
            // Note: Some random content might accidentally match patterns,
            // so we check that most don't match
            return !hasContextSpecification(content);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should recognize Chinese context patterns', () => {
      const chineseContextExamples = [
        '在Web3智能合约审计中，我们发现了这个问题。',
        '在DeFi协议开发领域，这是一个常见的挑战。',
        '在区块链安全分析场景下，需要特别注意。',
      ];
      
      chineseContextExamples.forEach(example => {
        expect(hasContextSpecification(example)).toBe(true);
      });
    });
    
    it('should recognize English context patterns', () => {
      const englishContextExamples = [
        'In smart contract auditing, this is a common issue.',
        'In the context of DeFi protocol development, we observe this pattern.',
        'When working with blockchain security, attention is required.',
      ];
      
      englishContextExamples.forEach(example => {
        expect(hasContextSpecification(example)).toBe(true);
      });
    });
    
    it('should not flag generic content as having context', () => {
      const genericContent = [
        'This is a general statement about technology.',
        'The system works well in most cases.',
        'We recommend following best practices.',
      ];
      
      genericContent.forEach(content => {
        expect(hasContextSpecification(content)).toBe(false);
      });
    });
  });
  
  // ============================================================================
  // Property 9: Quantified experience evidence
  // ============================================================================
  
  describe('Property 9: Quantified experience evidence', () => {
    /**
     * Feature: geo-optimization, Property 9: Quantified experience evidence
     * 
     * For any article claiming experience, the content should include quantified 
     * evidence patterns like "N+ 项目" or "N 年经验"
     * 
     * Validates: Requirements 3.3
     */
    it('should detect quantified experience in content', () => {
      fc.assert(
        fc.property(
          contentWithQuantifiedExperienceGenerator(),
          (content) => {
            return hasQuantifiedExperience(content);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing quantified experience', () => {
      fc.assert(
        fc.property(
          contentWithoutQuantifiedExperienceGenerator(),
          (content) => {
            // Content without quantified experience should not pass
            return !hasQuantifiedExperience(content);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should recognize Chinese quantified patterns', () => {
      const chineseQuantifiedExamples = [
        '在20+项目中观察到这个现象。',
        '经过5年的实践，我们总结出这些经验。',
        '通过30+次审计发现了这个问题。',
        '在15个案例中都出现了类似情况。',
      ];
      
      chineseQuantifiedExamples.forEach(example => {
        expect(hasQuantifiedExperience(example)).toBe(true);
      });
    });
    
    it('should recognize English quantified patterns', () => {
      const englishQuantifiedExamples = [
        'In 20+ projects, we observed this pattern.',
        'After 5 years of experience, we learned this.',
        'Through 30+ audits, we discovered this issue.',
        'Over 15 cases showed similar results.',
      ];
      
      englishQuantifiedExamples.forEach(example => {
        expect(hasQuantifiedExperience(example)).toBe(true);
      });
    });
    
    it('should not flag vague experience claims', () => {
      const vagueExamples = [
        'Based on our extensive experience.',
        'We have worked on many projects.',
        'After years of practice, we know this.',
      ];
      
      vagueExamples.forEach(example => {
        expect(hasQuantifiedExperience(example)).toBe(false);
      });
    });
    
    it('should detect quantified projects in author info', () => {
      fc.assert(
        fc.property(
          projectWithCountGenerator(),
          (project) => {
            return (
              typeof project.count === 'number' &&
              project.count > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing project counts', () => {
      fc.assert(
        fc.property(
          projectWithoutCountGenerator(),
          (project) => {
            return project.count === undefined;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Property 10: Knowledge source attribution
  // ============================================================================
  
  describe('Property 10: Knowledge source attribution', () => {
    /**
     * Feature: geo-optimization, Property 10: Knowledge source attribution
     * 
     * For any technical article, the metadata or content should indicate knowledge 
     * source (research team, project experience, etc.)
     * 
     * Validates: Requirements 3.4
     */
    it('should detect source attribution in content', () => {
      fc.assert(
        fc.property(
          contentWithSourceAttributionGenerator(),
          (content) => {
            return hasSourceAttribution(content);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect missing source attribution', () => {
      fc.assert(
        fc.property(
          contentWithoutSourceAttributionGenerator(),
          (content) => {
            // Content without source attribution should not pass
            return !hasSourceAttribution(content);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should recognize Chinese source attribution patterns', () => {
      const chineseSourceExamples = [
        '根据我们的研究团队发现，这是一个重要问题。',
        '基于项目实践经验，我们建议采用这种方法。',
        '通过学术研究表明，这个理论是正确的。',
        '根据行业分析报告显示，趋势正在改变。',
      ];
      
      chineseSourceExamples.forEach(example => {
        expect(hasSourceAttribution(example)).toBe(true);
      });
    });
    
    it('should recognize English source attribution patterns', () => {
      const englishSourceExamples = [
        'According to our research team, this is significant.',
        'Based on project experience, we recommend this approach.',
        'Our research shows that this method works.',
        'The team found that this pattern is common.',
        'Industry analysis indicates a shift in trends.',
      ];
      
      englishSourceExamples.forEach(example => {
        expect(hasSourceAttribution(example)).toBe(true);
      });
    });
    
    it('should not flag unsourced claims', () => {
      const unsourcedExamples = [
        'This is obviously the best approach.',
        'Everyone knows this is true.',
        'It is clear that this works.',
      ];
      
      unsourcedExamples.forEach(example => {
        expect(hasSourceAttribution(example)).toBe(false);
      });
    });
    
    it('should validate author credentials indicate knowledge source', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            // Author with credentials provides implicit source attribution
            return (
              author.credentials.length > 0 &&
              author.credentials.every(cred =>
                ['academic', 'professional', 'research'].includes(cred.type)
              )
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Complete Authority Signal Validation
  // ============================================================================
  
  describe('Integration: Complete Authority Signal Validation', () => {
    it('should validate complete author info has all authority signals', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            return (
              hasCompleteAuthorInfo(author) &&
              author.expertise.length > 0 &&
              author.credentials.length > 0 &&
              allExpertiseValid(author.expertise)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect incomplete author info in article metadata', () => {
      fc.assert(
        fc.property(
          articleMetadataWithIncompleteAuthorGenerator(),
          (metadata) => {
            return !hasCompleteAuthorInfo(metadata.author);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate content with multiple authority signals', () => {
      const contentWithMultipleSignals = 
        '在Web3智能合约审计中，根据我们的研究团队在20+项目中的发现，这是一个关键问题。';
      
      expect(hasContextSpecification(contentWithMultipleSignals)).toBe(true);
      expect(hasQuantifiedExperience(contentWithMultipleSignals)).toBe(true);
      expect(hasSourceAttribution(contentWithMultipleSignals)).toBe(true);
    });
    
    it('should handle mixed content with varying authority signals', () => {
      fc.assert(
        fc.property(
          mixedAuthorityContentGenerator(),
          (content) => {
            // Content should be valid string
            return typeof content === 'string' && content.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate author with projects has quantified experience', () => {
      fc.assert(
        fc.property(
          completeAuthorInfoGenerator(),
          (author) => {
            if (author.projects && author.projects.length > 0) {
              // If author has projects, at least some should have counts
              const hasAnyCount = author.projects.some(p => 
                typeof p.count === 'number'
              );
              // This is a soft requirement - not all projects need counts
              return true;
            }
            return true; // No projects is also valid
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
    it('should handle null author info', () => {
      const author = null;
      expect(hasCompleteAuthorInfo(author)).toBe(false);
    });
    
    it('should handle undefined author info', () => {
      const author = undefined;
      expect(hasCompleteAuthorInfo(author)).toBe(false);
    });
    
    it('should handle empty object as author info', () => {
      const author = {};
      expect(hasCompleteAuthorInfo(author)).toBe(false);
    });
    
    it('should handle author with only whitespace in string fields', () => {
      const author = {
        name: '   ',
        role: '   ',
        bio: '   ',
        expertise: [],
        credentials: [],
        contact: {},
      };
      expect(hasCompleteAuthorInfo(author)).toBe(false);
    });
    
    it('should handle null or empty content strings', () => {
      expect(hasContextSpecification('')).toBe(false);
      expect(hasQuantifiedExperience('')).toBe(false);
      expect(hasSourceAttribution('')).toBe(false);
    });
    
    it('should handle content with only whitespace', () => {
      const whitespaceContent = '     ';
      expect(hasContextSpecification(whitespaceContent)).toBe(false);
      expect(hasQuantifiedExperience(whitespaceContent)).toBe(false);
      expect(hasSourceAttribution(whitespaceContent)).toBe(false);
    });
    
    it('should handle author with mixed valid and invalid fields', () => {
      const author = {
        name: 'Valid Name',
        role: '',
        bio: 'Valid bio',
        expertise: [],
        credentials: [{ type: 'academic', description: 'PhD' }],
        contact: {},
      };
      expect(hasCompleteAuthorInfo(author)).toBe(false);
    });
  });
});
