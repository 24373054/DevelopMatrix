/**
 * Property-Based Test Generators for Terminology System
 * 
 * These generators create random but valid test data for property-based testing.
 */

import * as fc from 'fast-check';
import type { TerminologyEntry, TerminologyDictionary } from '@/types/geo';

/**
 * Generate a valid terminology category
 */
export function categoryGenerator(): fc.Arbitrary<TerminologyEntry['category']> {
  return fc.constantFrom('web3', 'defi', 'security', 'blockchain', 'general');
}

/**
 * Generate a safe string for terminology (alphanumeric only, no special chars)
 */
function safeString(minLength: number, maxLength: number): fc.Arbitrary<string> {
  return fc.array(
    fc.constantFrom(
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ),
    { minLength, maxLength }
  ).map(chars => chars.join(''));
}

/**
 * Generate a valid terminology entry
 */
export function terminologyEntryGenerator(): fc.Arbitrary<TerminologyEntry> {
  return fc.record({
    term: safeString(3, 20),
    canonicalName: safeString(3, 20),
    aliases: fc.array(safeString(2, 20), { minLength: 0, maxLength: 3 }),
    definition: safeString(20, 100),
    context: safeString(10, 50),
    relatedTerms: fc.array(safeString(3, 20), { minLength: 0, maxLength: 3 }),
    firstDefinedIn: fc.webUrl(),
    category: categoryGenerator(),
  });
}

/**
 * Generate a terminology dictionary with multiple entries
 */
export function terminologyDictionaryGenerator(): fc.Arbitrary<TerminologyDictionary> {
  return fc.record({
    version: fc.constant('1.0.0'),
    lastUpdated: fc.date().map(d => d.toISOString()),
    entries: fc.array(terminologyEntryGenerator(), { minLength: 1, maxLength: 10 }),
  });
}

/**
 * Generate article content with terminology usage
 * This creates content that may or may not follow GEO best practices
 */
export function articleContentGenerator(
  dictionary: TerminologyDictionary
): fc.Arbitrary<string> {
  if (dictionary.entries.length === 0) {
    return fc.constant('<p>Empty content</p>');
  }
  
  return fc.array(
    fc.oneof(
      // Paragraph with proper definition format
      fc.record({
        term: fc.constantFrom(...dictionary.entries.map(e => e.canonicalName)),
        definition: fc.constantFrom(...dictionary.entries.map(e => e.definition)),
      }).map(({ term, definition }) => 
        `<p>在本文中，${term}指的是${definition}。</p>`
      ),
      
      // Paragraph using canonical name
      fc.record({
        term: fc.constantFrom(...dictionary.entries.map(e => e.canonicalName)),
      }).map(({ term }) => 
        `<p>This article discusses ${term} in detail.</p>`
      ),
      
      // Paragraph using alias (should be flagged)
      fc.record({
        entry: fc.constantFrom(...dictionary.entries.filter(e => e.aliases.length > 0)),
      }).map(({ entry }) => {
        const alias = entry.aliases[0];
        return `<p>This article discusses ${alias} in detail.</p>`;
      }),
      
      // Regular paragraph without terminology
      fc.constant('<p>This is a regular paragraph.</p>')
    ),
    { minLength: 3, maxLength: 10 }
  ).map(paragraphs => paragraphs.join('\n'));
}

/**
 * Generate content with first-mention definition pattern
 */
export function contentWithDefinitionGenerator(
  term: string,
  definition: string
): fc.Arbitrary<string> {
  return fc.constantFrom(
    `<p>在本文中，${term}指的是${definition}。</p>`,
    `<p>${term}是指${definition}。</p>`,
    `<p>${term}定义为${definition}。</p>`,
    `<p>本文所说的${term}，指的是${definition}。</p>`
  );
}

/**
 * Generate content WITHOUT proper definition pattern (for negative testing)
 */
export function contentWithoutDefinitionGenerator(
  term: string
): fc.Arbitrary<string> {
  return fc.constant(`<p>This article discusses ${term} without defining it.</p>`);
}

/**
 * Generate content using only canonical names (should pass consistency check)
 */
export function consistentContentGenerator(
  dictionary: TerminologyDictionary
): fc.Arbitrary<string> {
  if (dictionary.entries.length === 0) {
    return fc.constant('<p>Empty content</p>');
  }
  
  const canonicalNames = dictionary.entries.map(e => e.canonicalName);
  
  return fc.array(
    fc.record({
      term: fc.constantFrom(...canonicalNames),
    }).map(({ term }) => `<p>This article discusses ${term}.</p>`),
    { minLength: 3, maxLength: 10 }
  ).map(paragraphs => paragraphs.join('\n'));
}

/**
 * Generate content using aliases (should fail consistency check)
 */
export function inconsistentContentGenerator(
  dictionary: TerminologyDictionary
): fc.Arbitrary<string> {
  const entriesWithAliases = dictionary.entries.filter(e => e.aliases.length > 0);
  
  if (entriesWithAliases.length === 0) {
    // Fallback to consistent content if no aliases exist
    return consistentContentGenerator(dictionary);
  }
  
  return fc.array(
    fc.record({
      entry: fc.constantFrom(...entriesWithAliases),
    }).map(({ entry }) => {
      const alias = entry.aliases[0];
      return `<p>This article discusses ${alias}.</p>`;
    }),
    { minLength: 1, maxLength: 5 }
  ).map(paragraphs => paragraphs.join('\n'));
}
