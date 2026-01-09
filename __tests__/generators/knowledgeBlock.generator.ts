/**
 * Property-Based Test Generators for Knowledge Block Parser
 * 
 * These generators create random but valid HTML content for property-based testing.
 */

import * as fc from 'fast-check';
import type { KnowledgeBlock } from '@/types/geo';

/**
 * Generate a safe HTML tag name
 */
function htmlTagGenerator(): fc.Arbitrary<string> {
  return fc.constantFrom('p', 'div', 'section', 'article');
}

/**
 * Generate safe text content (alphanumeric with spaces and basic punctuation)
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
      ' ', ' ', ' ' // More spaces for readability
    )
  }).map(s => s.trim()).filter(s => s.length >= minLength);
}

/**
 * Generate a Chinese term (simplified)
 */
function chineseTermGenerator(): fc.Arbitrary<string> {
  const commonTerms = [
    '智能合约', '区块链', 'DeFi', 'Web3', '去中心化',
    '加密货币', '共识机制', '分布式账本', '数字资产', '代币'
  ];
  return fc.constantFrom(...commonTerms);
}

/**
 * Generate an English term
 */
function englishTermGenerator(): fc.Arbitrary<string> {
  const commonTerms = [
    'Smart Contract', 'Blockchain', 'DeFi', 'Web3', 'Decentralization',
    'Cryptocurrency', 'Consensus Mechanism', 'Distributed Ledger', 'Digital Asset', 'Token'
  ];
  return fc.constantFrom(...commonTerms);
}

/**
 * Generate HTML content with a definition sentence (Chinese)
 * Pattern: "X 是指 Y" or "在本文中，X 指的是 Y"
 */
export function chineseDefinitionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    term: chineseTermGenerator(),
    definition: safeTextGenerator(20, 100),
    pattern: fc.constantFrom('是指', '指的是', '定义为'),
    prefix: fc.constantFrom('', '在本文中，', '本文所说的'),
    tag: htmlTagGenerator(),
  }).map(({ term, definition, pattern, prefix, tag }) => {
    const content = prefix ? `${prefix}${term}${pattern}${definition}。` : `${term}${pattern}${definition}。`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate HTML content with a definition sentence (English)
 * Pattern: "X is defined as Y" or "X refers to Y"
 */
export function englishDefinitionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    term: englishTermGenerator(),
    definition: safeTextGenerator(20, 100),
    pattern: fc.constantFrom('is defined as', 'refers to', 'means'),
    tag: htmlTagGenerator(),
  }).map(({ term, definition, pattern, tag }) => {
    const content = `${term} ${pattern} ${definition}.`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate HTML content with a conclusion sentence (Chinese)
 * Pattern: "因此，X" or "结论是：X"
 */
export function chineseConclusionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    conclusion: safeTextGenerator(30, 150),
    marker: fc.constantFrom('因此，', '结论是：', '综上所述，', '总结来说，', '总之，'),
    tag: htmlTagGenerator(),
  }).map(({ conclusion, marker, tag }) => {
    const content = `${marker}${conclusion}。`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate HTML content with a conclusion sentence (English)
 * Pattern: "Therefore, X" or "In conclusion, X"
 */
export function englishConclusionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    conclusion: safeTextGenerator(30, 150),
    marker: fc.constantFrom('Therefore, ', 'In conclusion, ', 'To summarize, ', 'In summary, '),
    tag: htmlTagGenerator(),
  }).map(({ conclusion, marker, tag }) => {
    const content = `${marker}${conclusion}.`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate HTML content with a list structure
 * Uses <ul> or <ol> tags with multiple <li> items
 */
export function listStructureGenerator(): fc.Arbitrary<string> {
  return fc.record({
    listType: fc.constantFrom('ul', 'ol'),
    items: fc.array(safeTextGenerator(10, 50), { minLength: 2, maxLength: 5 }),
  }).map(({ listType, items }) => {
    const listItems = items.map(item => `<li>${item}</li>`).join('\n');
    return `<${listType}>\n${listItems}\n</${listType}>`;
  });
}

/**
 * Generate HTML content with a table structure
 */
export function tableStructureGenerator(): fc.Arbitrary<string> {
  return fc.record({
    headers: fc.array(safeTextGenerator(5, 20), { minLength: 2, maxLength: 4 }),
    rows: fc.array(
      fc.array(safeTextGenerator(10, 30), { minLength: 2, maxLength: 4 }),
      { minLength: 1, maxLength: 3 }
    ),
  }).map(({ headers, rows }) => {
    const headerRow = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const dataRows = rows.map(row => 
      `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('\n');
    return `<table>\n${headerRow}\n${dataRows}\n</table>`;
  });
}

/**
 * Generate HTML content WITHOUT definition patterns (for negative testing)
 */
export function contentWithoutDefinitionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(30, 150),
    tag: htmlTagGenerator(),
  }).map(({ text, tag }) => {
    // Ensure the text doesn't accidentally contain definition patterns
    const cleanText = text
      .replace(/是指/g, 'relates to')
      .replace(/指的是/g, 'relates to')
      .replace(/定义为/g, 'relates to')
      .replace(/is defined as/gi, 'relates to')
      .replace(/refers to/gi, 'relates to');
    return `<${tag}>${cleanText}</${tag}>`;
  });
}

/**
 * Generate HTML content WITHOUT conclusion markers (for negative testing)
 */
export function contentWithoutConclusionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(30, 150),
    tag: htmlTagGenerator(),
  }).map(({ text, tag }) => {
    // Ensure the text doesn't accidentally contain conclusion markers
    const cleanText = text
      .replace(/^因此/g, 'Additionally')
      .replace(/^结论是/g, 'Additionally')
      .replace(/^综上所述/g, 'Additionally')
      .replace(/^Therefore/gi, 'Additionally')
      .replace(/^In conclusion/gi, 'Additionally');
    return `<${tag}>${cleanText}</${tag}>`;
  });
}

/**
 * Generate HTML content with plain text (no list tags)
 */
export function plainTextListGenerator(): fc.Arbitrary<string> {
  return fc.record({
    items: fc.array(safeTextGenerator(10, 50), { minLength: 2, maxLength: 5 }),
    tag: htmlTagGenerator(),
  }).map(({ items, tag }) => {
    // Create a list-like structure but without proper HTML tags
    const plainList = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
    return `<${tag}>${plainList}</${tag}>`;
  });
}

/**
 * Generate complex HTML content with multiple knowledge blocks
 * This creates realistic article-like content with various block types
 */
export function complexArticleGenerator(): fc.Arbitrary<string> {
  return fc.record({
    hasDefinition: fc.boolean(),
    hasConclusion: fc.boolean(),
    hasList: fc.boolean(),
    hasTable: fc.boolean(),
    regularParagraphs: fc.integer({ min: 1, max: 3 }),
  }).chain(({ hasDefinition, hasConclusion, hasList, hasTable, regularParagraphs }) => {
    const blocks: fc.Arbitrary<string>[] = [];
    
    // Add definition if requested
    if (hasDefinition) {
      blocks.push(fc.oneof(chineseDefinitionGenerator(), englishDefinitionGenerator()));
    }
    
    // Add regular paragraphs
    for (let i = 0; i < regularParagraphs; i++) {
      blocks.push(
        fc.record({
          text: safeTextGenerator(50, 200),
          tag: htmlTagGenerator(),
        }).map(({ text, tag }) => `<${tag}>${text}</${tag}>`)
      );
    }
    
    // Add list if requested
    if (hasList) {
      blocks.push(listStructureGenerator());
    }
    
    // Add table if requested
    if (hasTable) {
      blocks.push(tableStructureGenerator());
    }
    
    // Add conclusion if requested
    if (hasConclusion) {
      blocks.push(fc.oneof(chineseConclusionGenerator(), englishConclusionGenerator()));
    }
    
    // Combine all blocks
    return fc.tuple(...blocks).map(blockArray => blockArray.join('\n'));
  });
}

/**
 * Generate HTML content that should be decomposable into multiple knowledge blocks
 */
export function decomposableContentGenerator(): fc.Arbitrary<string> {
  return fc.record({
    definitions: fc.array(
      fc.oneof(chineseDefinitionGenerator(), englishDefinitionGenerator()),
      { minLength: 1, maxLength: 3 }
    ),
    explanations: fc.array(
      fc.record({
        text: safeTextGenerator(50, 200),
        tag: htmlTagGenerator(),
      }).map(({ text, tag }) => `<${tag}>${text}</${tag}>`),
      { minLength: 1, maxLength: 3 }
    ),
    conclusions: fc.array(
      fc.oneof(chineseConclusionGenerator(), englishConclusionGenerator()),
      { minLength: 1, maxLength: 2 }
    ),
  }).map(({ definitions, explanations, conclusions }) => {
    return [...definitions, ...explanations, ...conclusions].join('\n');
  });
}

/**
 * Generate a knowledge block type
 */
export function knowledgeBlockTypeGenerator(): fc.Arbitrary<KnowledgeBlock['type']> {
  return fc.constantFrom('definition', 'explanation', 'comparison', 'example', 'conclusion');
}
