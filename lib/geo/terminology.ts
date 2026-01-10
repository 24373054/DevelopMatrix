/**
 * Terminology Dictionary System
 * 
 * Manages the terminology dictionary for GEO optimization.
 * Ensures consistent use of technical terms across all content.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.5
 */

import type {
  TerminologyDictionary,
  TerminologyEntry,
  ConflictReport,
} from '@/types/geo';

/**
 * Terminology Manager
 * 
 * Provides functionality to:
 * - Load and query terminology dictionary
 * - Validate term usage consistency
 * - Check for terminology conflicts
 * - Find canonical names for terms
 */
export class TerminologyManager {
  private dictionary: TerminologyDictionary;

  constructor(dictionary: TerminologyDictionary) {
    this.dictionary = dictionary;
  }

  /**
   * Get all entries in the dictionary
   */
  getAllEntries(): TerminologyEntry[] {
    return this.dictionary.entries;
  }

  /**
   * Find a term by its canonical name or alias
   * 
   * @param term - The term to search for
   * @returns The terminology entry if found, undefined otherwise
   */
  findTerm(term: string): TerminologyEntry | undefined {
    const normalizedTerm = term.toLowerCase().trim();
    
    return this.dictionary.entries.find(entry => {
      // Check canonical name
      if (entry.canonicalName.toLowerCase() === normalizedTerm) {
        return true;
      }
      
      // Check term itself
      if (entry.term.toLowerCase() === normalizedTerm) {
        return true;
      }
      
      // Check aliases
      return entry.aliases.some(
        alias => alias.toLowerCase() === normalizedTerm
      );
    });
  }

  /**
   * Get the canonical name for a term
   * 
   * @param term - The term to look up
   * @returns The canonical name, or the original term if not found
   */
  getCanonicalName(term: string): string {
    const entry = this.findTerm(term);
    return entry ? entry.canonicalName : term;
  }

  /**
   * Check if a term is using an alias instead of the canonical name
   * 
   * @param term - The term to check
   * @returns true if the term is an alias, false otherwise
   */
  isAlias(term: string): boolean {
    const normalizedTerm = term.toLowerCase().trim();
    
    return this.dictionary.entries.some(entry =>
      entry.aliases.some(alias => alias.toLowerCase() === normalizedTerm)
    );
  }

  /**
   * Get all terms in a specific category
   * 
   * @param category - The category to filter by
   * @returns Array of terminology entries in that category
   */
  getTermsByCategory(
    category: TerminologyEntry['category']
  ): TerminologyEntry[] {
    return this.dictionary.entries.filter(
      entry => entry.category === category
    );
  }

  /**
   * Get related terms for a given term
   * 
   * @param term - The term to find relations for
   * @returns Array of related terminology entries
   */
  getRelatedTerms(term: string): TerminologyEntry[] {
    const entry = this.findTerm(term);
    if (!entry) {
      return [];
    }

    return entry.relatedTerms
      .map(relatedTerm => this.findTerm(relatedTerm))
      .filter((e): e is TerminologyEntry => e !== undefined);
  }

  /**
   * Validate that content uses canonical names consistently
   * 
   * @param content - The content to validate
   * @param locale - The language of the content ('zh' or 'en')
   * @returns Array of issues found (empty if all terms are canonical)
   */
  validateTerminologyConsistency(content: string, locale?: 'zh' | 'en'): ConflictReport[] {
    const conflicts: ConflictReport[] = [];

    // If locale is not specified, try to detect it
    if (!locale) {
      locale = this.detectLocale(content);
    }

    for (const entry of this.dictionary.entries) {
      // For language-aware validation, skip if the term is appropriate for the locale
      if (locale && entry.translation) {
        const appropriateTerm = locale === 'en' ? entry.translation.en : entry.translation.zh;
        
        // Check if any inappropriate aliases are used
        for (const alias of entry.aliases) {
          // Skip if this alias is the appropriate term for this locale
          if (alias === appropriateTerm) {
            continue;
          }
          
          // Skip if this is the canonical name and it matches the appropriate term
          if (entry.canonicalName === appropriateTerm) {
            continue;
          }

          // Simple word boundary check
          const aliasPattern = new RegExp(
            `\\b${this.escapeRegex(alias)}\\b`,
            'gi'
          );
          
          if (aliasPattern.test(content)) {
            conflicts.push({
              term: alias,
              canonicalDefinition: entry.definition,
              articleDefinition: `Using alias "${alias}" instead of canonical name "${entry.canonicalName}"`,
              articleId: 'unknown', // Will be set by caller
            });
          }
        }
      } else {
        // Fallback to original behavior if no translation info
        for (const alias of entry.aliases) {
          const aliasPattern = new RegExp(
            `\\b${this.escapeRegex(alias)}\\b`,
            'gi'
          );
          
          if (aliasPattern.test(content)) {
            conflicts.push({
              term: alias,
              canonicalDefinition: entry.definition,
              articleDefinition: `Using alias "${alias}" instead of canonical name "${entry.canonicalName}"`,
              articleId: 'unknown', // Will be set by caller
            });
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Detect the locale of content based on character patterns
   * 
   * @param content - The content to analyze
   * @returns Detected locale ('zh' or 'en')
   */
  private detectLocale(content: string): 'zh' | 'en' {
    // Count Chinese characters
    const chineseChars = content.match(/[\u4e00-\u9fa5]/g);
    const chineseCount = chineseChars ? chineseChars.length : 0;
    
    // If more than 10% of characters are Chinese, consider it Chinese content
    const totalChars = content.length;
    return (chineseCount / totalChars) > 0.1 ? 'zh' : 'en';
  }

  /**
   * Check if a definition matches the canonical definition
   * 
   * @param term - The term being defined
   * @param definition - The definition to check
   * @returns Conflict report if definitions don't match, undefined otherwise
   */
  checkDefinitionConflict(
    term: string,
    definition: string
  ): ConflictReport | undefined {
    const entry = this.findTerm(term);
    if (!entry) {
      return undefined;
    }

    // Normalize both definitions for comparison
    const normalizedCanonical = this.normalizeDefinition(entry.definition);
    const normalizedProvided = this.normalizeDefinition(definition);

    // Check if definitions are substantially different
    if (normalizedCanonical !== normalizedProvided) {
      return {
        term: entry.canonicalName,
        canonicalDefinition: entry.definition,
        articleDefinition: definition,
        articleId: 'unknown', // Will be set by caller
      };
    }

    return undefined;
  }

  /**
   * Extract terms from content that are in the dictionary
   * 
   * @param content - The content to analyze
   * @returns Array of found terminology entries
   */
  extractTermsFromContent(content: string): TerminologyEntry[] {
    const foundTerms: TerminologyEntry[] = [];
    const contentLower = content.toLowerCase();

    for (const entry of this.dictionary.entries) {
      // Check for canonical name
      const termPattern = new RegExp(
        `\\b${this.escapeRegex(entry.canonicalName)}\\b`,
        'i'
      );
      
      if (termPattern.test(content)) {
        foundTerms.push(entry);
      }
    }

    return foundTerms;
  }

  /**
   * Get translation for a term
   * 
   * @param term - The term to translate
   * @param targetLang - Target language ('en' or 'zh')
   * @returns Translation information if found, undefined otherwise
   */
  getTranslation(
    term: string,
    targetLang: 'en' | 'zh'
  ): { term: string; definition: string } | undefined {
    const entry = this.findTerm(term);
    if (!entry || !entry.translation) {
      return undefined;
    }

    if (targetLang === 'en') {
      return {
        term: entry.translation.en || entry.canonicalName,
        definition: entry.translation.enDefinition || entry.definition,
      };
    } else {
      return {
        term: entry.translation.zh || entry.canonicalName,
        definition: entry.translation.zhDefinition || entry.definition,
      };
    }
  }

  /**
   * Check if a term has translation information
   * 
   * @param term - The term to check
   * @returns true if translation exists, false otherwise
   */
  hasTranslation(term: string): boolean {
    const entry = this.findTerm(term);
    return !!(entry && entry.translation);
  }

  /**
   * Get bilingual term pair (Chinese and English)
   * 
   * @param term - The term to look up
   * @returns Object with both Chinese and English terms, or undefined
   */
  getBilingualPair(term: string): {
    zh: string;
    en: string;
    zhDefinition: string;
    enDefinition: string;
  } | undefined {
    const entry = this.findTerm(term);
    if (!entry || !entry.translation) {
      return undefined;
    }

    return {
      zh: entry.translation.zh || entry.canonicalName,
      en: entry.translation.en || entry.canonicalName,
      zhDefinition: entry.translation.zhDefinition || entry.definition,
      enDefinition: entry.translation.enDefinition || entry.definition,
    };
  }

  /**
   * Validate translation consistency across language versions
   * 
   * @param zhContent - Chinese content
   * @param enContent - English content
   * @returns Array of translation consistency issues
   */
  validateTranslationConsistency(
    zhContent: string,
    enContent: string
  ): ConflictReport[] {
    const issues: ConflictReport[] = [];

    for (const entry of this.dictionary.entries) {
      if (!entry.translation) {
        continue;
      }

      const zhTerm = entry.translation.zh || entry.canonicalName;
      const enTerm = entry.translation.en || entry.canonicalName;

      // Check if Chinese term appears in Chinese content
      const zhPattern = new RegExp(
        `\\b${this.escapeRegex(zhTerm)}\\b`,
        'g'
      );
      const zhMatches = zhContent.match(zhPattern);

      // Check if English term appears in English content
      const enPattern = new RegExp(
        `\\b${this.escapeRegex(enTerm)}\\b`,
        'gi'
      );
      const enMatches = enContent.match(enPattern);

      // If term appears in one language but not the other, flag it
      if (zhMatches && !enMatches) {
        issues.push({
          term: zhTerm,
          canonicalDefinition: `Term appears in Chinese (${zhMatches.length} times) but not in English`,
          articleDefinition: `Missing English translation: ${enTerm}`,
          articleId: 'translation-consistency-check',
        });
      } else if (enMatches && !zhMatches) {
        issues.push({
          term: enTerm,
          canonicalDefinition: `Term appears in English (${enMatches.length} times) but not in Chinese`,
          articleDefinition: `Missing Chinese translation: ${zhTerm}`,
          articleId: 'translation-consistency-check',
        });
      }
    }

    return issues;
  }

  /**
   * Format term with English original in parentheses (for Chinese content)
   * Example: "智能合约（Smart Contract）"
   * 
   * @param term - The Chinese term
   * @returns Formatted string with English in parentheses
   */
  formatWithEnglish(term: string): string {
    const entry = this.findTerm(term);
    if (!entry || !entry.translation || !entry.translation.en) {
      return term;
    }

    const enTerm = entry.translation.en;
    // Don't add parentheses if the term is already in English or if it's the same
    if (enTerm === term || entry.canonicalName === enTerm) {
      return term;
    }

    return `${term}（${enTerm}）`;
  }

  /**
   * Get dictionary version and metadata
   */
  getMetadata(): { version: string; lastUpdated: string } {
    return {
      version: this.dictionary.version,
      lastUpdated: this.dictionary.lastUpdated,
    };
  }

  /**
   * Helper: Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Helper: Normalize definition for comparison
   * Removes extra whitespace, punctuation, and converts to lowercase
   */
  private normalizeDefinition(definition: string): string {
    return definition
      .toLowerCase()
      .replace(/[.,;:!?。，；：！？]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Load terminology dictionary from JSON data
 * 
 * @param data - The dictionary data
 * @returns A TerminologyManager instance
 */
export function loadTerminologyDictionary(
  data: TerminologyDictionary
): TerminologyManager {
  return new TerminologyManager(data);
}

/**
 * Validate terminology dictionary structure
 * 
 * @param data - The dictionary data to validate
 * @returns Validation result with any errors
 */
export function validateDictionary(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.version) {
    errors.push('Missing required field: version');
  }

  if (!data.lastUpdated) {
    errors.push('Missing required field: lastUpdated');
  }

  if (!Array.isArray(data.entries)) {
    errors.push('Missing or invalid field: entries (must be an array)');
  } else {
    // Validate each entry
    data.entries.forEach((entry: any, index: number) => {
      if (!entry.term) {
        errors.push(`Entry ${index}: Missing required field: term`);
      }
      if (!entry.canonicalName) {
        errors.push(`Entry ${index}: Missing required field: canonicalName`);
      }
      if (!entry.definition) {
        errors.push(`Entry ${index}: Missing required field: definition`);
      }
      if (!Array.isArray(entry.aliases)) {
        errors.push(`Entry ${index}: Field 'aliases' must be an array`);
      }
      if (!Array.isArray(entry.relatedTerms)) {
        errors.push(`Entry ${index}: Field 'relatedTerms' must be an array`);
      }
      if (!entry.category) {
        errors.push(`Entry ${index}: Missing required field: category`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
