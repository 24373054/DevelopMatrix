/**
 * Q&A Generator Tests
 * 
 * Unit tests for the Q&A generation functionality
 */

import { QAGenerator, generateQA } from '../qaGenerator';
import type { ArticleInput } from '../qaGenerator';

describe('QAGenerator', () => {
  const sampleArticle: ArticleInput = {
    id: 'test-article',
    title: 'Web3 安全',
    content: `
      <h2>什么是 Web3 安全</h2>
      <p>Web3 安全是指在去中心化应用中保护用户资产和数据的实践。</p>
      
      <h2>智能合约和传统合约的区别</h2>
      <p>智能合约和传统合约的区别在于执行方式。智能合约自动执行，而传统合约需要人工执行。</p>
      
      <h2>局限性</h2>
      <p>Web3 安全的局限性包括代码不可修改、gas 费用高昂等问题。</p>
      <p>另一个风险是智能合约漏洞可能导致资金损失。</p>
    `,
    aiSummary: {
      whatIs: 'Web3 安全是指在去中心化生态系统中保护用户资产和数据的实践。',
      whyImportant: '因为智能合约一旦部署就无法修改，任何漏洞都可能导致不可逆的资金损失。',
      useCases: [
        'DeFi 协议的安全审计',
        '智能合约漏洞检测',
        '链上资金追踪',
      ],
      keyTakeaways: [
        '代码审计是必要的',
        '多重签名提高安全性',
        '实时监控很重要',
      ],
    },
    keywords: ['Web3', '区块链安全', '智能合约'],
  };

  describe('generateFromArticle', () => {
    it('should generate Q&A pairs with all categories', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      expect(result.article).toBe('test-article');
      expect(result.qaPairs.length).toBeGreaterThan(0);
      expect(result.coverage.hasDefinition).toBe(true);
      expect(result.coverage.hasApplication).toBe(true);
    });

    it('should generate definition questions from AI Summary', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      const definitionQuestions = result.qaPairs.filter(
        qa => qa.category === 'definition'
      );

      expect(definitionQuestions.length).toBeGreaterThan(0);
      expect(definitionQuestions[0].question).toContain('什么是');
      expect(definitionQuestions[0].answer).toBe(sampleArticle.aiSummary!.whatIs);
    });

    it('should generate application questions from use cases', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      const applicationQuestions = result.qaPairs.filter(
        qa => qa.category === 'application'
      );

      expect(applicationQuestions.length).toBeGreaterThan(0);
      expect(applicationQuestions[0].question).toContain('适用于哪些场景');
    });

    it('should generate comparison questions from content', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      const comparisonQuestions = result.qaPairs.filter(
        qa => qa.category === 'comparison'
      );

      // Should find "智能合约和传统合约的区别"
      expect(comparisonQuestions.length).toBeGreaterThan(0);
      expect(comparisonQuestions[0].question).toContain('区别');
    });

    it('should generate limitation questions from content', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      const limitationQuestions = result.qaPairs.filter(
        qa => qa.category === 'limitation'
      );

      expect(limitationQuestions.length).toBeGreaterThan(0);
      expect(limitationQuestions[0].question).toContain('局限性');
    });

    it('should respect maxQAPairs configuration', () => {
      const generator = new QAGenerator({ maxQAPairs: 3 });
      const result = generator.generateFromArticle(sampleArticle);

      expect(result.qaPairs.length).toBeLessThanOrEqual(3);
    });

    it('should allow disabling specific question types', () => {
      const generator = new QAGenerator({
        includeDefinition: true,
        includeComparison: false,
        includeApplication: false,
        includeLimitation: false,
      });
      const result = generator.generateFromArticle(sampleArticle);

      expect(result.coverage.hasDefinition).toBe(true);
      expect(result.coverage.hasComparison).toBe(false);
      expect(result.coverage.hasApplication).toBe(false);
      expect(result.coverage.hasLimitation).toBe(false);
    });

    it('should handle articles without AI Summary', () => {
      const articleWithoutSummary: ArticleInput = {
        id: 'test-2',
        title: '测试文章',
        content: '<p>一些内容</p>',
      };

      const generator = new QAGenerator();
      const result = generator.generateFromArticle(articleWithoutSummary);

      // Should still generate some Q&A pairs from content
      expect(result.qaPairs).toBeDefined();
      expect(result.coverage.hasDefinition).toBe(false);
    });

    it('should extract related concepts correctly', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      const firstQA = result.qaPairs[0];
      expect(firstQA.relatedConcepts).toContain('Web3 安全');
      expect(firstQA.relatedConcepts.length).toBeGreaterThan(0);
    });
  });

  describe('generateQA convenience function', () => {
    it('should work as a standalone function', () => {
      const result = generateQA(sampleArticle);

      expect(result.article).toBe('test-article');
      expect(result.qaPairs.length).toBeGreaterThan(0);
    });

    it('should accept configuration', () => {
      const result = generateQA(sampleArticle, { maxQAPairs: 5 });

      expect(result.qaPairs.length).toBeLessThanOrEqual(5);
    });
  });

  describe('coverage calculation', () => {
    it('should correctly calculate coverage metrics', () => {
      const generator = new QAGenerator();
      const result = generator.generateFromArticle(sampleArticle);

      expect(result.coverage).toHaveProperty('hasDefinition');
      expect(result.coverage).toHaveProperty('hasComparison');
      expect(result.coverage).toHaveProperty('hasApplication');
      expect(result.coverage).toHaveProperty('hasLimitation');
    });
  });
});
