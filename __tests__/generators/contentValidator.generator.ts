/**
 * Property-Based Test Generators for Content Validator
 * 
 * These generators create random but valid HTML content for property-based testing
 * of content quality validation.
 */

import * as fc from 'fast-check';

/**
 * Generate a safe HTML tag name for paragraphs
 * Note: ContentValidator only checks <p> tags for paragraph length
 */
function paragraphTagGenerator(): fc.Arbitrary<string> {
  return fc.constant('p');
}

/**
 * Generate a safe HTML tag name for general content
 */
function htmlTagGenerator(): fc.Arbitrary<string> {
  return fc.constantFrom('p', 'div', 'section', 'article', 'span');
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
      ' ', ' ', ' ', '.', ',', '!', // More spaces and punctuation for readability
    )
  }).map(s => s.trim()).filter(s => s.length >= minLength);
}

/**
 * Generate safe text content without punctuation that breaks question patterns
 * Used for rhetorical question generators
 */
function safeTextForQuestionsGenerator(minLength: number, maxLength: number): fc.Arbitrary<string> {
  return fc.string({ 
    minLength, 
    maxLength,
    unit: fc.constantFrom(
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      ' ', ' ', ' ', ',', // No .!? that would break question patterns
    )
  }).map(s => s.trim()).filter(s => s.length >= minLength);
}

/**
 * Generate a paragraph with controlled length
 * 
 * @param minLength - Minimum character length
 * @param maxLength - Maximum character length
 */
export function paragraphGenerator(minLength: number, maxLength: number): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(minLength, maxLength),
    tag: htmlTagGenerator(),
  }).map(({ text, tag }) => `<${tag}>${text}</${tag}>`);
}

/**
 * Generate content with paragraphs that exceed the 300 character limit
 * Property 4: Paragraph length constraint
 */
export function longParagraphGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(301, 500), // Exceeds 300 character limit
    tag: paragraphTagGenerator(), // Use <p> tags specifically
  }).map(({ text, tag }) => `<${tag}>${text}</${tag}>`);
}

/**
 * Generate content with paragraphs within the 300 character limit
 * Property 4: Paragraph length constraint
 */
export function shortParagraphGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(50, 300), // Within 300 character limit
    tag: paragraphTagGenerator(), // Use <p> tags specifically
  }).map(({ text, tag }) => `<${tag}>${text}</${tag}>`);
}

/**
 * Generate content with rhetorical questions (Chinese)
 * Property 5: Declarative sentence usage
 * 
 * Matches patterns: 吗？, 呢？, 难道...？, 怎么...？, 为什么...？
 */
export function chineseRhetoricalQuestionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    question: safeTextForQuestionsGenerator(10, 50),
    pattern: fc.constantFrom('吗？', '呢？'),
    prefix: fc.constantFrom('难道', '怎么', '为什么', ''),
    tag: htmlTagGenerator(),
  }).map(({ question, pattern, prefix, tag }) => {
    // If we have a prefix like "难道", use "？" instead of "吗？" or "呢？"
    if (prefix && prefix !== '') {
      const content = `${prefix}${question}？`;
      return `<${tag}>${content}</${tag}>`;
    } else {
      // For patterns like "吗？" or "呢？", don't use prefix
      const content = `${question}${pattern}`;
      return `<${tag}>${content}</${tag}>`;
    }
  });
}

/**
 * Generate content with rhetorical questions (English)
 * Property 5: Declarative sentence usage
 * 
 * Matches patterns: Why/How/What/When/Where/Who ..., Isn't/Aren't ..., Can/Could/Would/Should/Will ...
 */
export function englishRhetoricalQuestionGenerator(): fc.Arbitrary<string> {
  return fc.record({
    question: safeTextForQuestionsGenerator(10, 50),
    starter: fc.constantFrom('Why', 'How', 'What', 'When', 'Where', 'Who', 
                             "Isn't", "Aren't", "Can", "Could", "Would", "Should", "Will"),
    tag: htmlTagGenerator(),
  }).map(({ question, starter, tag }) => {
    // Ensure the question doesn't have periods that would break the pattern
    const cleanQuestion = question.replace(/\./g, ' ');
    const content = `${starter} ${cleanQuestion}?`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate content with declarative sentences (no questions)
 * Property 5: Declarative sentence usage
 */
export function declarativeSentenceGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(20, 100),
    tag: htmlTagGenerator(),
  }).map(({ text, tag }) => {
    // Ensure no question marks
    const cleanText = text.replace(/\?/g, '.');
    return `<${tag}>${cleanText}.</${tag}>`;
  });
}

/**
 * Generate content with vague terms (Chinese)
 * Property 6: Vague term avoidance
 */
export function chineseVagueTermGenerator(): fc.Arbitrary<string> {
  return fc.record({
    prefix: safeTextGenerator(10, 30),
    vagueTerm: fc.constantFrom('可能', '也许', '大概', '或许', '似乎', '好像', '大约', '左右', '差不多', '基本上'),
    suffix: safeTextGenerator(10, 30),
    tag: htmlTagGenerator(),
  }).map(({ prefix, vagueTerm, suffix, tag }) => {
    const content = `${prefix}${vagueTerm}${suffix}`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate content with vague terms (English)
 * Property 6: Vague term avoidance
 */
export function englishVagueTermGenerator(): fc.Arbitrary<string> {
  return fc.record({
    prefix: safeTextGenerator(10, 30),
    vagueTerm: fc.constantFrom('maybe', 'perhaps', 'possibly', 'probably', 'might', 
                               'could be', 'seems like', 'appears to', 'roughly', 'approximately'),
    suffix: safeTextGenerator(10, 30),
    tag: htmlTagGenerator(),
  }).map(({ prefix, vagueTerm, suffix, tag }) => {
    const content = `${prefix} ${vagueTerm} ${suffix}`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate content without vague terms
 * Property 6: Vague term avoidance
 */
export function definitiveLanguageGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(30, 100),
    tag: htmlTagGenerator(),
  }).map(({ text, tag }) => {
    // Remove any vague terms that might accidentally appear
    let cleanText = text
      .replace(/maybe|perhaps|possibly|probably|might|could be|seems like|appears to|roughly|approximately/gi, 'is')
      .replace(/可能|也许|大概|或许|似乎|好像|大约|左右|差不多|基本上/g, '是');
    return `<${tag}>${cleanText}</${tag}>`;
  });
}

/**
 * Generate content with hyperbolic terms (Chinese)
 * Property 11: Hyperbole avoidance
 */
export function chineseHyperboleGenerator(): fc.Arbitrary<string> {
  return fc.record({
    prefix: safeTextGenerator(10, 30),
    hyperbole: fc.constantFrom('颠覆', '史无前例', '革命性', '划时代', '空前', '绝无仅有', 
                               '前所未有', '最强', '最好', '完美', '终极', '极致', '无敌', '碾压', '秒杀'),
    suffix: safeTextGenerator(10, 30),
    tag: htmlTagGenerator(),
  }).map(({ prefix, hyperbole, suffix, tag }) => {
    const content = `${prefix}${hyperbole}${suffix}`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate content with hyperbolic terms (English)
 * Property 11: Hyperbole avoidance
 */
export function englishHyperboleGenerator(): fc.Arbitrary<string> {
  return fc.record({
    prefix: safeTextGenerator(10, 30),
    hyperbole: fc.constantFrom('revolutionary', 'groundbreaking', 'unprecedented', 'game-changing', 
                               'disruptive', 'paradigm shift', 'best ever', 'perfect', 'ultimate', 
                               'unbelievable', 'amazing', 'incredible', 'mind-blowing'),
    suffix: safeTextGenerator(10, 30),
    tag: htmlTagGenerator(),
  }).map(({ prefix, hyperbole, suffix, tag }) => {
    const content = `${prefix} ${hyperbole} ${suffix}`;
    return `<${tag}>${content}</${tag}>`;
  });
}

/**
 * Generate content without hyperbolic terms
 * Property 11: Hyperbole avoidance
 */
export function measuredLanguageGenerator(): fc.Arbitrary<string> {
  return fc.record({
    text: safeTextGenerator(30, 100),
    tag: htmlTagGenerator(),
  }).map(({ text, tag }) => {
    // Remove any hyperbolic terms that might accidentally appear
    let cleanText = text
      .replace(/revolutionary|groundbreaking|unprecedented|game-changing|disruptive|paradigm shift|best ever|perfect|ultimate|unbelievable|amazing|incredible|mind-blowing/gi, 'significant')
      .replace(/颠覆|史无前例|革命性|划时代|空前|绝无仅有|前所未有|最强|最好|完美|终极|极致|无敌|碾压|秒杀/g, '重要');
    return `<${tag}>${cleanText}</${tag}>`;
  });
}

/**
 * Generate content with Q&A section markers
 * This content should be excluded from rhetorical question checks
 */
export function qaContentGenerator(): fc.Arbitrary<string> {
  return fc.record({
    questions: fc.array(
      fc.record({
        question: safeTextGenerator(10, 50),
        answer: safeTextGenerator(20, 100),
      }),
      { minLength: 2, maxLength: 5 }
    ),
  }).map(({ questions }) => {
    const qaItems = questions.map(({ question, answer }) => 
      `<div class="qa-item"><p class="question">${question}?</p><p class="answer">${answer}</p></div>`
    ).join('\n');
    return `<section class="qa-section"><h2>Q&A</h2>${qaItems}</section>`;
  });
}

/**
 * Generate complex article content with mixed quality issues
 */
export function mixedQualityContentGenerator(): fc.Arbitrary<string> {
  return fc.record({
    hasLongParagraphs: fc.boolean(),
    hasRhetoricalQuestions: fc.boolean(),
    hasVagueTerms: fc.boolean(),
    hasHyperbole: fc.boolean(),
    goodParagraphs: fc.integer({ min: 1, max: 3 }),
  }).chain(({ hasLongParagraphs, hasRhetoricalQuestions, hasVagueTerms, hasHyperbole, goodParagraphs }) => {
    const blocks: fc.Arbitrary<string>[] = [];
    
    // Add good paragraphs
    for (let i = 0; i < goodParagraphs; i++) {
      blocks.push(shortParagraphGenerator());
    }
    
    // Add problematic content based on flags
    if (hasLongParagraphs) {
      blocks.push(longParagraphGenerator());
    }
    
    if (hasRhetoricalQuestions) {
      blocks.push(fc.oneof(chineseRhetoricalQuestionGenerator(), englishRhetoricalQuestionGenerator()));
    }
    
    if (hasVagueTerms) {
      blocks.push(fc.oneof(chineseVagueTermGenerator(), englishVagueTermGenerator()));
    }
    
    if (hasHyperbole) {
      blocks.push(fc.oneof(chineseHyperboleGenerator(), englishHyperboleGenerator()));
    }
    
    // Combine all blocks
    return fc.tuple(...blocks).map(blockArray => blockArray.join('\n'));
  });
}

/**
 * Generate high-quality content (no issues)
 */
export function highQualityContentGenerator(): fc.Arbitrary<string> {
  return fc.array(
    fc.oneof(
      shortParagraphGenerator(),
      declarativeSentenceGenerator(),
      definitiveLanguageGenerator(),
      measuredLanguageGenerator()
    ),
    { minLength: 2, maxLength: 5 }
  ).map(blocks => blocks.join('\n'));
}
