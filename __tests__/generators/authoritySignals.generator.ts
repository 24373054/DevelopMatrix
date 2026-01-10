/**
 * Property-Based Test Generators for Authority Signals
 * 
 * These generators create random but valid author information and authority signal data
 * for property-based testing of authority signal validation.
 */

import * as fc from 'fast-check';
import type { AuthorInfo, AuthorCredential, AuthorProject, AuthorContact, GEOArticle } from '@/types/geo';

/**
 * Generate safe text content
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
 * Generate author credential
 */
export function authorCredentialGenerator(): fc.Arbitrary<AuthorCredential> {
  return fc.record({
    type: fc.constantFrom('academic', 'professional', 'research'),
    description: safeTextGenerator(10, 100),
    institution: fc.option(safeTextGenerator(5, 50), { nil: undefined }),
  });
}

/**
 * Generate author project
 */
export function authorProjectGenerator(): fc.Arbitrary<AuthorProject> {
  return fc.record({
    name: safeTextGenerator(5, 50),
    description: safeTextGenerator(20, 150),
    count: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
  });
}

/**
 * Generate author contact
 */
export function authorContactGenerator(): fc.Arbitrary<AuthorContact> {
  return fc.record({
    email: fc.option(fc.emailAddress(), { nil: undefined }),
    website: fc.option(fc.webUrl(), { nil: undefined }),
  });
}

/**
 * Generate complete author information with all fields
 * Property 7: Author information completeness
 */
export function completeAuthorInfoGenerator(): fc.Arbitrary<AuthorInfo> {
  return fc.record({
    name: safeTextGenerator(3, 50),
    role: safeTextGenerator(5, 50),
    bio: safeTextGenerator(50, 300),
    expertise: fc.array(safeTextGenerator(5, 30), { minLength: 1, maxLength: 5 }),
    credentials: fc.array(authorCredentialGenerator(), { minLength: 1, maxLength: 3 }),
    publications: fc.option(fc.array(safeTextGenerator(10, 100), { minLength: 1, maxLength: 5 }), { nil: undefined }),
    projects: fc.option(fc.array(authorProjectGenerator(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
    contact: authorContactGenerator(),
  });
}

/**
 * Generate author information with missing name
 */
export function authorInfoWithoutNameGenerator(): fc.Arbitrary<Partial<AuthorInfo>> {
  return fc.record({
    name: fc.constant(''),
    role: safeTextGenerator(5, 50),
    bio: safeTextGenerator(50, 300),
    expertise: fc.array(safeTextGenerator(5, 30), { minLength: 1, maxLength: 5 }),
    credentials: fc.array(authorCredentialGenerator(), { minLength: 1, maxLength: 3 }),
    contact: authorContactGenerator(),
  });
}

/**
 * Generate author information with missing bio
 */
export function authorInfoWithoutBioGenerator(): fc.Arbitrary<Partial<AuthorInfo>> {
  return fc.record({
    name: safeTextGenerator(3, 50),
    role: safeTextGenerator(5, 50),
    bio: fc.constant(''),
    expertise: fc.array(safeTextGenerator(5, 30), { minLength: 1, maxLength: 5 }),
    credentials: fc.array(authorCredentialGenerator(), { minLength: 1, maxLength: 3 }),
    contact: authorContactGenerator(),
  });
}

/**
 * Generate author information with empty expertise array
 */
export function authorInfoWithoutExpertiseGenerator(): fc.Arbitrary<Partial<AuthorInfo>> {
  return fc.record({
    name: safeTextGenerator(3, 50),
    role: safeTextGenerator(5, 50),
    bio: safeTextGenerator(50, 300),
    expertise: fc.constant([]),
    credentials: fc.array(authorCredentialGenerator(), { minLength: 1, maxLength: 3 }),
    contact: authorContactGenerator(),
  });
}

/**
 * Generate content with context specification
 * Property 8: Context specification
 */
export function contentWithContextGenerator(): fc.Arbitrary<string> {
  const contextPatterns = [
    '在Web3智能合约审计中',
    '在DeFi协议开发中',
    '在区块链安全分析中',
    '在去中心化应用开发中',
    'In Web3 smart contract auditing',
    'In DeFi protocol development',
    'In blockchain security analysis',
  ];
  
  return fc.record({
    context: fc.constantFrom(...contextPatterns),
    content: safeTextGenerator(50, 200),
  }).map(({ context, content }) => `${context}，${content}`);
}

/**
 * Generate content without context specification
 */
export function contentWithoutContextGenerator(): fc.Arbitrary<string> {
  return safeTextGenerator(50, 200);
}

/**
 * Generate content with quantified experience evidence
 * Property 9: Quantified experience evidence
 */
export function contentWithQuantifiedExperienceGenerator(): fc.Arbitrary<string> {
  const experiencePatterns = [
    (n: number) => `在${n}+项目中观察到`,
    (n: number) => `经过${n}年的实践`,
    (n: number) => `在${n}个案例中发现`,
    (n: number) => `通过${n}+次审计`,
    (n: number) => `In ${n}+ projects`,
    (n: number) => `After ${n} years of experience`,
    (n: number) => `Through ${n}+ audits`,
  ];
  
  return fc.record({
    count: fc.integer({ min: 5, max: 100 }),
    patternIndex: fc.integer({ min: 0, max: experiencePatterns.length - 1 }),
    content: safeTextGenerator(30, 150),
  }).map(({ count, patternIndex, content }) => {
    const pattern = experiencePatterns[patternIndex];
    return `${pattern(count)}，${content}`;
  });
}

/**
 * Generate content without quantified experience
 */
export function contentWithoutQuantifiedExperienceGenerator(): fc.Arbitrary<string> {
  return safeTextGenerator(50, 200).map(content => 
    `Based on our experience, ${content}`
  );
}

/**
 * Generate content with knowledge source attribution
 * Property 10: Knowledge source attribution
 */
export function contentWithSourceAttributionGenerator(): fc.Arbitrary<string> {
  const sourcePatterns = [
    '根据我们的研究团队发现',
    '基于项目实践经验',
    '通过学术研究表明',
    '根据行业分析报告',
    'According to our research team',
    'Based on project experience',
    'Academic research shows',
    'Industry analysis indicates',
  ];
  
  return fc.record({
    source: fc.constantFrom(...sourcePatterns),
    content: safeTextGenerator(30, 150),
  }).map(({ source, content }) => `${source}，${content}`);
}

/**
 * Generate content without source attribution
 */
export function contentWithoutSourceAttributionGenerator(): fc.Arbitrary<string> {
  return safeTextGenerator(50, 200);
}

/**
 * Generate article metadata with complete author info
 */
export function articleMetadataWithCompleteAuthorGenerator(): fc.Arbitrary<{
  author: AuthorInfo;
  datePublished: string;
  dateModified: string;
  category: string;
  keywords: string[];
  readTime: number;
}> {
  return fc.record({
    author: completeAuthorInfoGenerator(),
    datePublished: fc.date({ 
      min: new Date('2020-01-01'), 
      max: new Date('2024-12-31') 
    }).map(d => {
      try {
        return d.toISOString();
      } catch {
        return new Date('2023-01-01').toISOString();
      }
    }),
    dateModified: fc.date({ 
      min: new Date('2020-01-01'), 
      max: new Date('2024-12-31') 
    }).map(d => {
      try {
        return d.toISOString();
      } catch {
        return new Date('2023-01-01').toISOString();
      }
    }),
    category: fc.constantFrom('技术分析', '安全审计', 'DeFi', 'Web3', 'Blockchain'),
    keywords: fc.array(safeTextGenerator(3, 20), { minLength: 3, maxLength: 10 }),
    readTime: fc.integer({ min: 1, max: 30 }),
  });
}

/**
 * Generate article metadata with incomplete author info
 */
export function articleMetadataWithIncompleteAuthorGenerator(): fc.Arbitrary<{
  author: Partial<AuthorInfo>;
  datePublished: string;
  dateModified: string;
  category: string;
  keywords: string[];
  readTime: number;
}> {
  return fc.record({
    author: fc.oneof(
      authorInfoWithoutNameGenerator(),
      authorInfoWithoutBioGenerator(),
      authorInfoWithoutExpertiseGenerator()
    ),
    datePublished: fc.date({ 
      min: new Date('2020-01-01'), 
      max: new Date('2024-12-31') 
    }).map(d => {
      try {
        return d.toISOString();
      } catch {
        return new Date('2023-01-01').toISOString();
      }
    }),
    dateModified: fc.date({ 
      min: new Date('2020-01-01'), 
      max: new Date('2024-12-31') 
    }).map(d => {
      try {
        return d.toISOString();
      } catch {
        return new Date('2023-01-01').toISOString();
      }
    }),
    category: fc.constantFrom('技术分析', '安全审计', 'DeFi', 'Web3', 'Blockchain'),
    keywords: fc.array(safeTextGenerator(3, 20), { minLength: 3, maxLength: 10 }),
    readTime: fc.integer({ min: 1, max: 30 }),
  });
}

/**
 * Generate mixed content with various authority signal patterns
 */
export function mixedAuthorityContentGenerator(): fc.Arbitrary<string> {
  return fc.oneof(
    contentWithContextGenerator(),
    contentWithoutContextGenerator(),
    contentWithQuantifiedExperienceGenerator(),
    contentWithoutQuantifiedExperienceGenerator(),
    contentWithSourceAttributionGenerator(),
    contentWithoutSourceAttributionGenerator()
  );
}

/**
 * Generate author project with quantified count
 */
export function projectWithCountGenerator(): fc.Arbitrary<AuthorProject> {
  return fc.record({
    name: safeTextGenerator(5, 50),
    description: safeTextGenerator(20, 150),
    count: fc.integer({ min: 5, max: 100 }),
  });
}

/**
 * Generate author project without count
 */
export function projectWithoutCountGenerator(): fc.Arbitrary<AuthorProject> {
  return fc.record({
    name: safeTextGenerator(5, 50),
    description: safeTextGenerator(20, 150),
    count: fc.constant(undefined),
  });
}
