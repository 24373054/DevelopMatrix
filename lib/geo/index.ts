/**
 * GEO Library - Main exports
 * 
 * Central export point for all GEO optimization functionality
 */

export {
  TerminologyManager,
  loadTerminologyDictionary,
  validateDictionary,
} from './terminology';

export type {
  TerminologyDictionary,
  TerminologyEntry,
  ConflictReport,
} from '@/types/geo';
