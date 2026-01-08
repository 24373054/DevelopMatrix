/**
 * Dictionary Loader
 * 
 * Utility to load the terminology dictionary from the data file
 */

import terminologyData from '@/data/terminology.json';
import { loadTerminologyDictionary, validateDictionary } from './terminology';
import type { TerminologyDictionary } from '@/types/geo';

/**
 * Load and validate the terminology dictionary
 * 
 * @returns TerminologyManager instance with loaded dictionary
 * @throws Error if dictionary is invalid
 */
export function getTerminologyDictionary() {
  // Validate the dictionary structure
  const validation = validateDictionary(terminologyData);
  
  if (!validation.valid) {
    throw new Error(
      `Invalid terminology dictionary: ${validation.errors.join(', ')}`
    );
  }

  // Load the dictionary
  return loadTerminologyDictionary(terminologyData as TerminologyDictionary);
}

/**
 * Get raw terminology data
 * 
 * @returns The raw terminology dictionary data
 */
export function getRawTerminologyData(): TerminologyDictionary {
  return terminologyData as TerminologyDictionary;
}
