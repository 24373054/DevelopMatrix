/**
 * Property-Based Test Generators for Q&A System
 * 
 * These generators create random but valid Q&A data for property-based testing
 * of Q&A generation, coverage, and validation.
 */

import * as fc from 'fast-check';
import type { QAPair, QuestionCoverageMatrix } from '@/types/geo';

/**
 * Generate safe text content for Q&A fields
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
      ' ', ' ', ' ', '.', ',', '-', ':', ';', '?', '!', '、', '；', '，', '。'
    )
  }).map(s => s.trim()).filter(s => s.length >= minLength);
}

/**
 * Generate a Q&A category
 */
function qaCategoryGenerator(): fc.Arbitrary<QAPair['category']> {
  return fc.constantFrom('definition', 'comparison', 'application', 'limitation');
}

/**
 * Generate a single Q&A pair
 */
export function qaPairGenerator(): fc.Arbitrary<QAPair> {
  return fc.record({
    question: safeTextGenerator(10, 100),
    answer: safeTextGenerator(30, 300),
    category: qaCategoryGenerator(),
    relatedConcepts: fc.array(safeTextGenerator(5, 30), { minLength: 0, maxLength: 5 }),
  });
}

/**
 * Generate a definition-type Q&A pair
 */
export function definitionQAPairGenerator(): fc.Arbitrary<QAPair> {
  return fc.record({
    question: fc.oneof(
      safeTextGenerator(10, 50).map(term => `什么是${term}？`),
      safeTextGenerator(10, 50).map(term => `What is ${term}?`)
    ),
    answer: safeTextGenerator(30, 300),
    category: fc.constant('definition' as const),
    relatedConcepts: fc.array(safeTextGenerator(5, 30), { minLength: 0, maxLength: 5 }),
  });
}

/**
 * Generate a comparison-type Q&A pair
 */
export function comparisonQAPairGenerator(): fc.Arbitrary<QAPair> {
  return fc.record({
    termA: safeTextGenerator(5, 30),
    termB: safeTextGenerator(5, 30),
  }).chain(({ termA, termB }) => {
    return fc.record({
      question: fc.oneof(
        fc.constant(`${termA}和${termB}有什么区别？`),
        fc.constant(`What's the difference between ${termA} and ${termB}?`)
      ),
      answer: safeTextGenerator(50, 300),
      category: fc.constant('comparison' as const),
      relatedConcepts: fc.constant([termA, termB]),
    });
  });
}

/**
 * Generate an application-type Q&A pair
 */
export function applicationQAPairGenerator(): fc.Arbitrary<QAPair> {
  return fc.record({
    term: safeTextGenerator(5, 30),
  }).chain(({ term }) => {
    return fc.record({
      question: fc.oneof(
        fc.constant(`${term}适用于哪些场景？`),
        fc.constant(`When should I use ${term}?`),
        fc.constant(`What are the use cases for ${term}?`)
      ),
      answer: safeTextGenerator(50, 300),
      category: fc.constant('application' as const),
      relatedConcepts: fc.array(safeTextGenerator(5, 30), { minLength: 0, maxLength: 5 }),
    });
  });
}

/**
 * Generate a limitation-type Q&A pair
 */
export function limitationQAPairGenerator(): fc.Arbitrary<QAPair> {
  return fc.record({
    term: safeTextGenerator(5, 30),
  }).chain(({ term }) => {
    return fc.record({
      question: fc.oneof(
        fc.constant(`${term}有哪些局限性？`),
        fc.constant(`What are the limitations of ${term}?`),
        fc.constant(`使用${term}时需要注意什么？`),
        fc.constant(`What should I be careful about when using ${term}?`)
      ),
      answer: safeTextGenerator(50, 300),
      category: fc.constant('limitation' as const),
      relatedConcepts: fc.array(safeTextGenerator(5, 30), { minLength: 0, maxLength: 5 }),
    });
  });
}

/**
 * Generate an array of Q&A pairs
 */
export function qaPairsArrayGenerator(
  minLength: number = 1,
  maxLength: number = 10
): fc.Arbitrary<QAPair[]> {
  return fc.array(qaPairGenerator(), { minLength, maxLength });
}

/**
 * Generate a Question Coverage Matrix with all categories covered
 */
export function completeQuestionCoverageMatrixGenerator(): fc.Arbitrary<QuestionCoverageMatrix> {
  return fc.record({
    article: fc.uuid(),
    qaPairs: fc.tuple(
      definitionQAPairGenerator(),
      comparisonQAPairGenerator(),
      applicationQAPairGenerator(),
      limitationQAPairGenerator(),
      fc.array(qaPairGenerator(), { minLength: 0, maxLength: 6 })
    ).map(([def, comp, app, lim, extra]) => [def, comp, app, lim, ...extra]),
  }).map(({ article, qaPairs }) => ({
    article,
    qaPairs,
    coverage: {
      hasDefinition: qaPairs.some(qa => qa.category === 'definition'),
      hasComparison: qaPairs.some(qa => qa.category === 'comparison'),
      hasApplication: qaPairs.some(qa => qa.category === 'application'),
      hasLimitation: qaPairs.some(qa => qa.category === 'limitation'),
    },
  }));
}

/**
 * Generate a Question Coverage Matrix with missing categories
 */
export function incompleteQuestionCoverageMatrixGenerator(): fc.Arbitrary<QuestionCoverageMatrix> {
  return fc.record({
    article: fc.uuid(),
    qaPairs: fc.array(qaPairGenerator(), { minLength: 1, maxLength: 5 }),
  }).map(({ article, qaPairs }) => ({
    article,
    qaPairs,
    coverage: {
      hasDefinition: qaPairs.some(qa => qa.category === 'definition'),
      hasComparison: qaPairs.some(qa => qa.category === 'comparison'),
      hasApplication: qaPairs.some(qa => qa.category === 'application'),
      hasLimitation: qaPairs.some(qa => qa.category === 'limitation'),
    },
  }));
}

/**
 * Generate a Question Coverage Matrix with only definition questions
 */
export function definitionOnlyMatrixGenerator(): fc.Arbitrary<QuestionCoverageMatrix> {
  return fc.record({
    article: fc.uuid(),
    qaPairs: fc.array(definitionQAPairGenerator(), { minLength: 1, maxLength: 3 }),
  }).map(({ article, qaPairs }) => ({
    article,
    qaPairs,
    coverage: {
      hasDefinition: true,
      hasComparison: false,
      hasApplication: false,
      hasLimitation: false,
    },
  }));
}

/**
 * Generate a Question Coverage Matrix without comparison questions
 */
export function noComparisonMatrixGenerator(): fc.Arbitrary<QuestionCoverageMatrix> {
  return fc.record({
    article: fc.uuid(),
    qaPairs: fc.tuple(
      definitionQAPairGenerator(),
      applicationQAPairGenerator(),
      limitationQAPairGenerator()
    ).map(([def, app, lim]) => [def, app, lim]),
  }).map(({ article, qaPairs }) => ({
    article,
    qaPairs,
    coverage: {
      hasDefinition: true,
      hasComparison: false,
      hasApplication: true,
      hasLimitation: true,
    },
  }));
}

/**
 * Generate a Question Coverage Matrix without application questions
 */
export function noApplicationMatrixGenerator(): fc.Arbitrary<QuestionCoverageMatrix> {
  return fc.record({
    article: fc.uuid(),
    qaPairs: fc.tuple(
      definitionQAPairGenerator(),
      comparisonQAPairGenerator(),
      limitationQAPairGenerator()
    ).map(([def, comp, lim]) => [def, comp, lim]),
  }).map(({ article, qaPairs }) => ({
    article,
    qaPairs,
    coverage: {
      hasDefinition: true,
      hasComparison: true,
      hasApplication: false,
      hasLimitation: true,
    },
  }));
}

/**
 * Generate a Question Coverage Matrix without limitation questions
 */
export function noLimitationMatrixGenerator(): fc.Arbitrary<QuestionCoverageMatrix> {
  return fc.record({
    article: fc.uuid(),
    qaPairs: fc.tuple(
      definitionQAPairGenerator(),
      comparisonQAPairGenerator(),
      applicationQAPairGenerator()
    ).map(([def, comp, app]) => [def, comp, app]),
  }).map(({ article, qaPairs }) => ({
    article,
    qaPairs,
    coverage: {
      hasDefinition: true,
      hasComparison: true,
      hasApplication: true,
      hasLimitation: false,
    },
  }));
}

/**
 * Generate HTML content with implementation steps (ordered list)
 */
export function implementationStepsContentGenerator(): fc.Arbitrary<string> {
  return fc.record({
    steps: fc.array(safeTextGenerator(20, 100), { minLength: 3, maxLength: 8 }),
    title: fc.oneof(
      fc.constant('实施步骤'),
      fc.constant('Implementation Steps'),
      fc.constant('如何实现'),
      fc.constant('How to Implement')
    ),
  }).map(({ steps, title }) => {
    const stepItems = steps.map((step, i) => `<li>${step}</li>`).join('\n');
    return `<h2>${title}</h2>\n<ol>\n${stepItems}\n</ol>`;
  });
}

/**
 * Generate HTML content with best practices section
 */
export function bestPracticesSectionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    practices: fc.array(safeTextGenerator(30, 150), { minLength: 3, maxLength: 6 }),
    title: fc.oneof(
      fc.constant('最佳实践'),
      fc.constant('Best Practices'),
      fc.constant('推荐做法'),
      fc.constant('Recommended Practices')
    ),
  }).map(({ practices, title }) => {
    const practiceItems = practices.map(practice => `<li>${practice}</li>`).join('\n');
    return `<h2>${title}</h2>\n<ul>\n${practiceItems}\n</ul>`;
  });
}

/**
 * Generate HTML content without implementation steps
 */
export function contentWithoutStepsGenerator(): fc.Arbitrary<string> {
  return fc.record({
    paragraphs: fc.array(safeTextGenerator(50, 200), { minLength: 2, maxLength: 5 }),
  }).map(({ paragraphs }) => {
    return paragraphs.map(p => `<p>${p}</p>`).join('\n');
  });
}

/**
 * Generate HTML content without best practices section
 */
export function contentWithoutBestPracticesGenerator(): fc.Arbitrary<string> {
  return fc.record({
    paragraphs: fc.array(safeTextGenerator(50, 200), { minLength: 2, maxLength: 5 }),
  }).map(({ paragraphs }) => {
    return paragraphs.map(p => `<p>${p}</p>`).join('\n');
  });
}

/**
 * Generate article-like object with Q&A
 */
export function articleWithQAGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  content: string;
  qaPairs: QAPair[];
}> {
  return fc.record({
    id: fc.uuid(),
    title: safeTextGenerator(10, 100),
    content: safeTextGenerator(200, 1000),
    qaPairs: qaPairsArrayGenerator(1, 10),
  });
}

/**
 * Generate article-like object without Q&A
 */
export function articleWithoutQAGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  content: string;
  qaPairs?: QAPair[];
}> {
  return fc.record({
    id: fc.uuid(),
    title: safeTextGenerator(10, 100),
    content: safeTextGenerator(200, 1000),
    qaPairs: fc.constant(undefined),
  });
}

/**
 * Generate mixed content with various Q&A states
 */
export function mixedQAContentGenerator(): fc.Arbitrary<{
  id: string;
  title: string;
  content: string;
  qaPairs?: QAPair[];
}> {
  return fc.oneof(
    articleWithQAGenerator(),
    articleWithoutQAGenerator()
  );
}
