/**
 * Property-Based Test Generators for AI Summary
 * 
 * These generators create random but valid AI Summary data for property-based testing
 * of AI Summary component and validation.
 */

import * as fc from 'fast-check';
import type { AISummary } from '@/types/geo';

/**
 * Generate safe text content for AI Summary fields
 */
function safeTextGenerator(minLength: number, maxLength: number): fc.Arbitrary<string> {
  return fc.string({ 
    minLength, 
    maxLength,
    unit: fc.constantFrom(
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      ' ', ' ', ' ', '.', ',', '-', ':', ';'
    )
  }).map(s => s.trim()).filter(s => s.length >= minLength);
}

/**
 * Generate a complete, valid AI Summary
 * Property 18, 19, 20, 21, 22: AI Summary structure
 */
export function aiSummaryGenerator(): fc.Arbitrary<AISummary> {
  return fc.record({
    whatIs: safeTextGenerator(20, 200),
    whyImportant: safeTextGenerator(20, 200),
    useCases: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
    keyTakeaways: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
  });
}

/**
 * Generate an AI Summary with missing whatIs field
 * Property 19: AI Summary whatIs field
 */
export function aiSummaryWithoutWhatIsGenerator(): fc.Arbitrary<Partial<AISummary>> {
  return fc.record({
    whatIs: fc.constant(''),
    whyImportant: safeTextGenerator(20, 200),
    useCases: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
    keyTakeaways: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
  });
}

/**
 * Generate an AI Summary with missing whyImportant field
 * Property 20: AI Summary whyImportant field
 */
export function aiSummaryWithoutWhyImportantGenerator(): fc.Arbitrary<Partial<AISummary>> {
  return fc.record({
    whatIs: safeTextGenerator(20, 200),
    whyImportant: fc.constant(''),
    useCases: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
    keyTakeaways: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
  });
}

/**
 * Generate an AI Summary with empty useCases array
 * Property 21: AI Summary useCases field
 */
export function aiSummaryWithoutUseCasesGenerator(): fc.Arbitrary<Partial<AISummary>> {
  return fc.record({
    whatIs: safeTextGenerator(20, 200),
    whyImportant: safeTextGenerator(20, 200),
    useCases: fc.constant([]),
    keyTakeaways: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
  });
}

/**
 * Generate an AI Summary with non-array useCases (invalid structure)
 * Property 22: AI Summary structured format
 */
export function aiSummaryWithInvalidUseCasesGenerator(): fc.Arbitrary<any> {
  return fc.record({
    whatIs: safeTextGenerator(20, 200),
    whyImportant: safeTextGenerator(20, 200),
    useCases: safeTextGenerator(50, 200), // String instead of array
    keyTakeaways: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
  });
}

/**
 * Generate an AI Summary with non-array keyTakeaways (invalid structure)
 * Property 22: AI Summary structured format
 */
export function aiSummaryWithInvalidKeyTakeawaysGenerator(): fc.Arbitrary<any> {
  return fc.record({
    whatIs: safeTextGenerator(20, 200),
    whyImportant: safeTextGenerator(20, 200),
    useCases: fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }),
    keyTakeaways: safeTextGenerator(50, 200), // String instead of array
  });
}

/**
 * Generate a minimal valid AI Summary (all required fields present but minimal)
 */
export function minimalAISummaryGenerator(): fc.Arbitrary<AISummary> {
  return fc.record({
    whatIs: safeTextGenerator(20, 50),
    whyImportant: safeTextGenerator(20, 50),
    useCases: fc.array(safeTextGenerator(10, 30), { minLength: 1, maxLength: 2 }),
    keyTakeaways: fc.array(safeTextGenerator(10, 30), { minLength: 1, maxLength: 2 }),
  });
}

/**
 * Generate a comprehensive AI Summary (all fields with rich content)
 */
export function comprehensiveAISummaryGenerator(): fc.Arbitrary<AISummary> {
  return fc.record({
    whatIs: safeTextGenerator(100, 300),
    whyImportant: safeTextGenerator(100, 300),
    useCases: fc.array(safeTextGenerator(30, 100), { minLength: 3, maxLength: 5 }),
    keyTakeaways: fc.array(safeTextGenerator(30, 100), { minLength: 3, maxLength: 5 }),
  });
}

/**
 * Generate an article-like object with AI Summary
 * For testing component integration
 */
export function articleWithAISummaryGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  aiSummary: AISummary;
}> {
  return fc.record({
    id: fc.uuid(),
    title: safeTextGenerator(10, 100),
    aiSummary: aiSummaryGenerator(),
  });
}

/**
 * Generate an article-like object without AI Summary
 * For testing graceful degradation
 */
export function articleWithoutAISummaryGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  aiSummary?: AISummary;
}> {
  return fc.record({
    id: fc.uuid(),
    title: safeTextGenerator(10, 100),
    aiSummary: fc.constant(undefined),
  });
}

/**
 * Generate an article with partial AI Summary (some fields missing)
 */
export function articleWithPartialAISummaryGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  aiSummary: Partial<AISummary>;
}> {
  return fc.record({
    id: fc.uuid(),
    title: safeTextGenerator(10, 100),
    aiSummary: fc.oneof(
      aiSummaryWithoutWhatIsGenerator(),
      aiSummaryWithoutWhyImportantGenerator(),
      aiSummaryWithoutUseCasesGenerator()
    ),
  });
}

/**
 * Generate mixed content with various AI Summary states
 */
export function mixedAISummaryContentGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  aiSummary?: AISummary | Partial<AISummary>;
}> {
  return fc.oneof(
    articleWithAISummaryGenerator(),
    articleWithoutAISummaryGenerator(),
    articleWithPartialAISummaryGenerator()
  );
}
