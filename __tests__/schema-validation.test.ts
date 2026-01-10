/**
 * Schema.org Structured Data Validation Tests
 * 
 * This test file validates that the enhanced Schema.org structured data
 * is correctly generated for blog articles according to GEO requirements.
 */

import {
  generateEnhancedSchema,
  extractCoreConcepts,
  extractMentionedTechnologies,
  determineArticleSeries,
  validateEnhancedSchema,
} from '@/lib/geo/schemaGenerator';
import type { AISummary, QAPair } from '@/types/geo';

describe('Schema.org Structured Data Generation', () => {
  const mockAISummary: AISummary = {
    whatIs: 'Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究',
    whyImportant: '2024年 Web3 领域的安全事件造成了数十亿美元的损失',
    useCases: [
      '智能合约开发者在部署前进行安全审计',
      'DeFi 项目方建立多层防御体系',
    ],
    keyTakeaways: [
      '智能合约漏洞仍是最主要的攻击向量',
      '跨链桥因锁定大量资产成为黑客的主要目标',
    ],
  };

  const mockQAPairs: QAPair[] = [
    {
      question: '什么是 Web3 安全趋势分析？',
      answer: 'Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究',
      category: 'definition',
      relatedConcepts: ['Web3', '安全', '区块链'],
    },
    {
      question: '智能合约漏洞和传统软件漏洞有什么区别？',
      answer: '智能合约漏洞的主要区别在于不可修改性和资金直接暴露',
      category: 'comparison',
      relatedConcepts: ['智能合约', '漏洞'],
    },
  ];

  describe('generateEnhancedSchema', () => {
    it('should generate valid BlogPosting schema with all required fields', () => {
      const schema = generateEnhancedSchema({
        slug: 'web3-security-trends-2025',
        title: '2025年 Web3 安全趋势分析',
        description: '深入分析2025年Web3领域的主要安全威胁',
        category: '安全',
        keywords: 'Web3安全, 智能合约漏洞, 区块链安全',
        author: 'Matrix Lab 安全团队',
        authorBio: 'Matrix Lab 安全团队专注于区块链安全研究',
        datePublished: '2024-12-30',
        dateModified: '2024-12-30',
        locale: 'zh',
        aiSummary: mockAISummary,
        qaPairs: mockQAPairs,
      });

      // Validate required fields
      expect(schema['@type']).toBe('BlogPosting');
      expect(schema.headline).toBe('2025年 Web3 安全趋势分析');
      expect(schema.description).toBe('深入分析2025年Web3领域的主要安全威胁');
      expect(schema.author).toBeDefined();
      expect(schema.author.name).toBe('Matrix Lab 安全团队');
      expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO 8601 format
      expect(schema.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include author with complete professional information', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'test',
        author: 'Seal Wax',
        authorBio: '刻熵科技创始人',
        datePublished: '2024-12-30',
        locale: 'zh',
      });

      expect(schema.author).toBeDefined();
      expect(schema.author.name).toBe('Seal Wax');
      expect(schema.author.description).toBe('刻熵科技创始人');
      expect(schema.author.jobTitle).toBe('创始人 & 首席架构师');
      expect(schema.author.url).toBe('https://yz.matrixlab.work');
    });

    it('should include Q&A structure in mainEntity', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'test',
        author: 'Test Author',
        datePublished: '2024-12-30',
        locale: 'zh',
        qaPairs: mockQAPairs,
      });

      expect(schema.mainEntity).toBeDefined();
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity![0]['@type']).toBe('Question');
      expect(schema.mainEntity![0].name).toBe('什么是 Web3 安全趋势分析？');
      expect(schema.mainEntity![0].acceptedAnswer['@type']).toBe('Answer');
    });

    it('should include about field with core concepts', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '安全',
        keywords: 'Web3, 区块链',
        author: 'Test Author',
        datePublished: '2024-12-30',
        locale: 'zh',
        aiSummary: mockAISummary,
      });

      expect(schema.about).toBeDefined();
      expect(schema.about!.length).toBeGreaterThan(0);
      expect(schema.about![0]['@type']).toBe('DefinedTerm');
      expect(schema.about![0].name).toBeDefined();
      expect(schema.about![0].description).toBeDefined();
    });

    it('should include teaches field from AI Summary', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'test',
        author: 'Test Author',
        datePublished: '2024-12-30',
        locale: 'zh',
        aiSummary: mockAISummary,
      });

      expect(schema.teaches).toBeDefined();
      expect(schema.teaches).toEqual(mockAISummary.keyTakeaways);
    });

    it('should include mentions field with technologies', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'Web3, Ethereum, Solidity',
        author: 'Test Author',
        datePublished: '2024-12-30',
        locale: 'zh',
      });

      expect(schema.mentions).toBeDefined();
      expect(schema.mentions!.length).toBeGreaterThan(0);
    });

    it('should include isPartOf field for article series', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '安全',
        keywords: 'test',
        author: 'Test Author',
        datePublished: '2024-12-30',
        locale: 'zh',
        seriesName: 'Web3 安全系列',
      });

      expect(schema.isPartOf).toBeDefined();
      expect(schema.isPartOf!['@type']).toBe('CreativeWorkSeries');
      expect(schema.isPartOf!.name).toBe('Web3 安全系列');
    });

    it('should ensure dates are in ISO 8601 format', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'test',
        author: 'Test Author',
        datePublished: '2024-12-30', // Date only format
        dateModified: '2024-12-31',
        locale: 'zh',
      });

      // Should be converted to full ISO 8601 format
      expect(schema.datePublished).toBe('2024-12-30T00:00:00Z');
      expect(schema.dateModified).toBe('2024-12-31T00:00:00Z');
    });
  });

  describe('validateEnhancedSchema', () => {
    it('should validate a complete schema without errors', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'test',
        author: 'Test Author',
        authorBio: 'Test Bio',
        datePublished: '2024-12-30T00:00:00Z',
        dateModified: '2024-12-30T00:00:00Z',
        locale: 'zh',
        aiSummary: mockAISummary,
        qaPairs: mockQAPairs,
      });

      const result = validateEnhancedSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors.filter(e => !e.startsWith('Warning'))).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompleteSchema = {
        '@type': 'BlogPosting' as const,
        headline: 'Test',
        // Missing description, author, datePublished
      };

      const result = validateEnhancedSchema(incompleteSchema as any);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid date formats', () => {
      const schema = generateEnhancedSchema({
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        category: '技术',
        keywords: 'test',
        author: 'Test Author',
        datePublished: 'invalid-date',
        locale: 'zh',
      });

      const result = validateEnhancedSchema(schema);
      // Should have warnings about date format
      expect(result.errors.some(e => e.includes('date'))).toBe(true);
    });
  });

  describe('Helper Functions', () => {
    it('should extract core concepts from AI Summary', () => {
      const concepts = extractCoreConcepts(mockAISummary, 'Web3安全, 区块链');
      expect(concepts.length).toBeGreaterThan(0);
      expect(concepts[0].name).toBe('Web3安全');
      expect(concepts[0].definition).toBe(mockAISummary.whatIs);
    });

    it('should extract mentioned technologies from keywords', () => {
      const technologies = extractMentionedTechnologies(
        'Web3, Ethereum, Solidity, DeFi',
        mockAISummary
      );
      expect(technologies).toContain('Web3');
      expect(technologies).toContain('Ethereum');
      expect(technologies).toContain('Solidity');
      expect(technologies).toContain('DeFi');
    });

    it('should determine article series from category', () => {
      const zhSeries = determineArticleSeries('安全', 'zh');
      expect(zhSeries).toBe('Web3 安全系列');

      const enSeries = determineArticleSeries('Security', 'en');
      expect(enSeries).toBe('Web3 Security Series');

      const noSeries = determineArticleSeries('其他', 'zh');
      expect(noSeries).toBeUndefined();
    });
  });
});
