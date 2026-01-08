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
   * @returns Array of issues found (empty if all terms are canonical)
   */
  validateTerminologyConsistency(content: string): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    const contentLower = content.toLowerCase();

    for (const entry of this.dictionary.entries) {
      // Check if any aliases are used in the content
      for (const alias of entry.aliases) {
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
    }

    return conflicts;
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
