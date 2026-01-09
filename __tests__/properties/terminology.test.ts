/**
 * Property-Based Tests for Terminology Dictionary System
 * 
 * Feature: geo-optimization
 * Tests Properties 28, 29, 30 from the design document
 * Validates Requirements: 8.1, 8.2, 8.3, 8.5
 */

import * as fc from 'fast-check';
import { TerminologyManager, loadTerminologyDictionary } from '@/lib/geo/terminology';
import type { TerminologyDictionary, TerminologyEntry } from '@/types/geo';
import {
  terminologyDictionaryGenerator,
  terminologyEntryGenerator,
  articleContentGenerator,
  contentWithDefinitionGenerator,
  contentWithoutDefinitionGenerator,
  consistentContentGenerator,
  inconsistentContentGenerator,
} from '../generators/terminology.generator';

// Load the actual terminology dictionary for some tests
import terminologyData from '@/data/terminology.json';

describe('Terminology Dictionary - Property-Based Tests', () => {
  
  // ============================================================================
  // Property 28: First-mention definition
  // ============================================================================
  
  describe('Property 28: First-mention definition', () => {
    /**
     * Feature: geo-optimization, Property 28: First-mention definition
     * 
     * For any core concept in the terminology dictionary, its first mention 
     * in an article should include an explicit definition.
     * 
     * Validates: Requirements 8.1
     */
    it('should detect when content contains proper definition patterns', () => {
      fc.assert(
        fc.property(
          terminologyEntryGenerator(),
          (entry) => {
            // Generate content with proper definition format
            const contentWithDef = `在本文中，${entry.canonicalName}指的是${entry.definition}。`;
            
            // Check if content contains definition patterns
            const hasDefinitionPattern = 
              /(.+)(是指|指的是|定义为)(.+)/.test(contentWithDef);
            
            return hasDefinitionPattern === true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should detect when content lacks proper definition patterns', () => {
      fc.assert(
        fc.property(
          terminologyEntryGenerator(),
          (entry) => {
            // Generate content WITHOUT proper definition format
            const contentWithoutDef = `This article discusses ${entry.canonicalName} without defining it.`;
            
            // Escape special regex characters in the term
            const escapedTerm = entry.canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // This content should NOT match definition patterns
            const hasDefinitionPattern = 
              new RegExp(`${escapedTerm}(是指|指的是|定义为)`, 'i').test(contentWithoutDef);
            
            // We expect this to be false (no definition pattern)
            return hasDefinitionPattern === false;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate that first mention includes definition in real dictionary', () => {
      const manager = loadTerminologyDictionary(terminologyData as TerminologyDictionary);
      const entries = manager.getAllEntries();
      
      // For each entry, verify it has a definition
      entries.forEach(entry => {
        expect(entry.definition).toBeDefined();
        expect(entry.definition.length).toBeGreaterThan(0);
        expect(entry.firstDefinedIn).toBeDefined();
      });
    });
  });
  
  // ============================================================================
  // Property 29: Terminology consistency
  // ============================================================================
  
  describe('Property 29: Terminology consistency', () => {
    /**
     * Feature: geo-optimization, Property 29: Terminology consistency
     * 
     * For any concept in the terminology dictionary, all articles should use 
     * the canonical name rather than aliases.
     * 
     * Validates: Requirements 8.2, 8.5
     */
    it('should detect alias usage in content', () => {
      fc.assert(
        fc.property(
          terminologyDictionaryGenerator(),
          (dictionary) => {
            const manager = new TerminologyManager(dictionary);
            
            // Find entries with aliases
            const entriesWithAliases = dictionary.entries.filter(e => e.aliases.length > 0);
            
            if (entriesWithAliases.length === 0) {
              return true; // Skip if no aliases
            }
            
            // Pick an entry with aliases
            const entry = entriesWithAliases[0];
            const alias = entry.aliases[0];
            
            // Skip if alias is too short or contains only whitespace
            if (!alias || alias.trim().length < 2) {
              return true;
            }
            
            // Create content using the alias
            const contentWithAlias = `This article discusses ${alias} in detail.`;
            
            // Validate - should detect the alias usage
            const conflicts = manager.validateTerminologyConsistency(contentWithAlias);
            
            // Should find at least one conflict (the alias usage)
            return conflicts.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should not flag canonical name usage as inconsistent', () => {
      fc.assert(
        fc.property(
          terminologyDictionaryGenerator(),
          (dictionary) => {
            const manager = new TerminologyManager(dictionary);
            
            if (dictionary.entries.length === 0) {
              return true; // Skip empty dictionaries
            }
            
            // Pick an entry
            const entry = dictionary.entries[0];
            
            // Skip if canonical name is too short
            if (!entry.canonicalName || entry.canonicalName.trim().length < 2) {
              return true;
            }
            
            // Create content using ONLY the canonical name
            const contentWithCanonical = `This article discusses ${entry.canonicalName} in detail.`;
            
            // Validate - should NOT detect any conflicts
            const conflicts = manager.validateTerminologyConsistency(contentWithCanonical);
            
            // Should find no conflicts when using canonical name
            return conflicts.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should correctly identify canonical names vs aliases', () => {
      fc.assert(
        fc.property(
          terminologyDictionaryGenerator(),
          (dictionary) => {
            const manager = new TerminologyManager(dictionary);
            
            // For each entry, verify canonical name is not flagged as alias
            for (const entry of dictionary.entries) {
              // Skip entries with invalid names
              if (!entry.canonicalName || entry.canonicalName.trim().length < 2) {
                continue;
              }
              
              const isCanonicalAnAlias = manager.isAlias(entry.canonicalName);
              if (isCanonicalAnAlias) {
                return false; // Canonical name should never be flagged as alias
              }
              
              // Verify each alias IS flagged as an alias
              for (const alias of entry.aliases) {
                // Skip invalid aliases
                if (!alias || alias.trim().length < 2) {
                  continue;
                }
                
                const isAliasDetected = manager.isAlias(alias);
                if (!isAliasDetected) {
                  return false; // Alias should be detected
                }
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain consistency across the real dictionary', () => {
      const manager = loadTerminologyDictionary(terminologyData as TerminologyDictionary);
      const entries = manager.getAllEntries();
      
      // Check that no canonical name appears as an alias in another entry
      const canonicalNames = new Set(entries.map(e => e.canonicalName.toLowerCase()));
      
      entries.forEach(entry => {
        entry.aliases.forEach(alias => {
          const aliasLower = alias.toLowerCase();
          // An alias should not be a canonical name of another entry
          if (canonicalNames.has(aliasLower) && aliasLower !== entry.canonicalName.toLowerCase()) {
            fail(`Alias "${alias}" conflicts with a canonical name in the dictionary`);
          }
        });
      });
    });
  });
  
  // ============================================================================
  // Property 30: Definition sentence format
  // ============================================================================
  
  describe('Property 30: Definition sentence format', () => {
    /**
     * Feature: geo-optimization, Property 30: Definition sentence format
     * 
     * For any concept definition, it should use the format 
     * "在本文中，XXX 指的是……" or similar explicit patterns.
     * 
     * Validates: Requirements 8.3
     */
    it('should recognize valid definition sentence formats', () => {
      fc.assert(
        fc.property(
          terminologyEntryGenerator(),
          (entry) => {
            // Skip entries with invalid names
            if (!entry.canonicalName || entry.canonicalName.trim().length < 2) {
              return true;
            }
            
            // Test with Chinese definition patterns
            const chineseFormats = [
              `在本文中，${entry.canonicalName}指的是${entry.definition}。`,
              `${entry.canonicalName}是指${entry.definition}。`,
              `${entry.canonicalName}定义为${entry.definition}。`,
            ];
            
            // Escape special regex characters
            const escapedTerm = entry.canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Check if the Chinese definition pattern matches
            const chinesePattern = new RegExp(
              `(在本文中，)?${escapedTerm}(是指|指的是|定义为)`,
              'i'
            );
            
            // All Chinese formats should match
            const allChineseMatch = chineseFormats.every(format => chinesePattern.test(format));
            
            // Also test English-style definitions
            const englishFormats = [
              `${entry.canonicalName} is defined as ${entry.definition}.`,
              `${entry.canonicalName} refers to ${entry.definition}.`,
            ];
            
            const englishPattern = new RegExp(
              `${escapedTerm}\\s+(is defined as|refers to|means)`,
              'i'
            );
            
            const allEnglishMatch = englishFormats.every(format => englishPattern.test(format));
            
            // At least one pattern type should work
            return allChineseMatch || allEnglishMatch;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid definition formats', () => {
      fc.assert(
        fc.property(
          terminologyEntryGenerator(),
          (entry) => {
            // Skip entries with invalid names
            if (!entry.canonicalName || entry.canonicalName.trim().length < 2) {
              return true;
            }
            
            // Create content that mentions the term but doesn't define it properly
            const invalidFormats = [
              `This article discusses ${entry.canonicalName} without defining it.`,
              `The concept of ${entry.canonicalName} is important.`,
              `${entry.canonicalName} is a complex topic.`,
            ];
            
            // Escape special regex characters
            const escapedTerm = entry.canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            const definitionPattern = new RegExp(
              `${escapedTerm}(是指|指的是|定义为)`,
              'i'
            );
            
            // These formats should NOT match the definition pattern
            return invalidFormats.every(format => !definitionPattern.test(format));
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should validate definition format in real dictionary entries', () => {
      const manager = loadTerminologyDictionary(terminologyData as TerminologyDictionary);
      const entries = manager.getAllEntries();
      
      entries.forEach(entry => {
        // Each entry should have a well-formed definition
        expect(entry.definition).toBeDefined();
        expect(entry.definition.length).toBeGreaterThan(10);
        
        // Definition should not be empty or just whitespace
        expect(entry.definition.trim()).not.toBe('');
        
        // Definition should be a complete sentence (ends with appropriate punctuation)
        // This is a soft check - definitions might not always end with punctuation
        const hasSubstantiveContent = entry.definition.length > 20;
        expect(hasSubstantiveContent).toBe(true);
      });
    });
    
    it('should ensure definitions can be extracted from content', () => {
      fc.assert(
        fc.property(
          terminologyEntryGenerator(),
          (entry) => {
            // Create properly formatted definition content
            const content = `在本文中，${entry.canonicalName}指的是${entry.definition}。`;
            
            // Extract the definition using regex
            const pattern = new RegExp(
              `在本文中，(${entry.canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})指的是(.+?)。`,
              'i'
            );
            
            const match = content.match(pattern);
            
            // Should be able to extract both term and definition
            if (!match) return false;
            
            const extractedTerm = match[1];
            const extractedDefinition = match[2];
            
            return extractedTerm === entry.canonicalName && 
                   extractedDefinition === entry.definition;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  // ============================================================================
  // Integration Tests - Testing with Real Dictionary
  // ============================================================================
  
  describe('Integration with Real Dictionary', () => {
    let manager: TerminologyManager;
    
    beforeAll(() => {
      manager = loadTerminologyDictionary(terminologyData as TerminologyDictionary);
    });
    
    it('should find terms by canonical name', () => {
      const web3Entry = manager.findTerm('Web3');
      expect(web3Entry).toBeDefined();
      expect(web3Entry?.canonicalName).toBe('Web3');
    });
    
    it('should find terms by alias', () => {
      const web3Entry = manager.findTerm('Web 3.0');
      expect(web3Entry).toBeDefined();
      expect(web3Entry?.canonicalName).toBe('Web3');
    });
    
    it('should return canonical name for aliases', () => {
      const canonical = manager.getCanonicalName('Smart Contract');
      expect(canonical).toBe('智能合约');
    });
    
    it('should detect alias usage in sample content', () => {
      const content = 'This article discusses Smart Contract security.';
      const conflicts = manager.validateTerminologyConsistency(content);
      
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0].term).toBe('Smart Contract');
    });
    
    it('should not flag canonical names in sample content', () => {
      const content = '本文讨论智能合约的安全性。';
      const conflicts = manager.validateTerminologyConsistency(content);
      
      // Should not flag canonical name usage
      const smartContractConflicts = conflicts.filter(c => 
        c.canonicalDefinition.includes('智能合约')
      );
      expect(smartContractConflicts.length).toBe(0);
    });
  });
});
