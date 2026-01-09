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

export {
  KnowledgeBlockParser,
  parseKnowledgeBlocks,
} from './knowledgeBlockParser';

export {
  ContentValidator,
  validateContent,
} from './contentValidator';

export {
  QAGenerator,
  generateQA,
} from './qaGenerator';

export type {
  TerminologyDictionary,
  TerminologyEntry,
  ConflictReport,
  KnowledgeBlock,
  ContentQualityReport,
  QualityIssue,
  QAPair,
  QuestionCoverageMatrix,
} from '@/types/geo';

export type {
  ArticleInput,
  QAGeneratorConfig,
} from './qaGenerator';
