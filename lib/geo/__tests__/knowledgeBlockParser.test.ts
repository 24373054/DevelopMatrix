/**
 * Knowledge Block Parser Tests
 * 
 * Tests for the Knowledge Block Parser functionality
 */

import { KnowledgeBlockParser, parseKnowledgeBlocks } from '../knowledgeBlockParser';
import type { KnowledgeBlock } from '@/types/geo';

describe('KnowledgeBlockParser', () => {
  let parser: KnowledgeBlockParser;

  beforeEach(() => {
    parser = new KnowledgeBlockParser();
  });

  describe('Definition Extraction', () => {
    it('should extract Chinese definition sentences with "是指"', () => {
      const html = '<p>智能合约是指运行在区块链上的自动执行程序。</p>';
      const blocks = parser.parse(html);
      
      const definitions = blocks.filter(b => b.type === 'definition');
      expect(definitions.length).toBeGreaterThan(0);
      expect(definitions[0].title).toContain('智能合约');
    });

    it('should extract Chinese definition sentences with "指的是"', () => {
      const html = '<p>在本文中，DeFi指的是去中心化金融系统。</p>';
      const blocks = parser.parse(html);
      
      const definitions = blocks.filter(b => b.type === 'definition');
      expect(definitions.length).toBeGreaterThan(0);
    });

    it('should extract English definition sentences', () => {
      const html = '<p>A smart contract is defined as a self-executing program on blockchain.</p>';
      const blocks = parser.parse(html);
      
      const definitions = blocks.filter(b => b.type === 'definition');
      expect(definitions.length).toBeGreaterThan(0);
    });

    it('should calculate high extractability for definitions', () => {
      const html = '<p>区块链是指一种分布式账本技术。</p>';
      const blocks = parser.parse(html);
      
      const definitions = blocks.filter(b => b.type === 'definition');
      expect(definitions[0].extractability).toBeGreaterThan(0.7);
    });
  });

  describe('Conclusion Extraction', () => {
    it('should extract Chinese conclusion sentences with "因此"', () => {
      const html = '<p>因此，智能合约是Web3技术的核心组件。</p>';
      const blocks = parser.parse(html);
      
      const conclusions = blocks.filter(b => b.type === 'conclusion');
      expect(conclusions.length).toBeGreaterThan(0);
    });

    it('should extract Chinese conclusion sentences with "结论是"', () => {
      const html = '<p>结论是：去中心化是区块链的本质特征。</p>';
      const blocks = parser.parse(html);
      
      const conclusions = blocks.filter(b => b.type === 'conclusion');
      expect(conclusions.length).toBeGreaterThan(0);
    });

    it('should extract English conclusion sentences', () => {
      const html = '<p>Therefore, blockchain technology provides transparency and security.</p>';
      const blocks = parser.parse(html);
      
      const conclusions = blocks.filter(b => b.type === 'conclusion');
      expect(conclusions.length).toBeGreaterThan(0);
    });
  });

  describe('Comparison Extraction', () => {
    it('should extract table structures as comparisons', () => {
      const html = `
        <table>
          <tr><th>特性</th><th>说明</th></tr>
          <tr><td>透明性</td><td>所有代码公开</td></tr>
        </table>
      `;
      const blocks = parser.parse(html);
      
      const comparisons = blocks.filter(b => b.type === 'comparison');
      expect(comparisons.length).toBeGreaterThan(0);
      expect(comparisons[0].content).toContain('<table>');
    });

    it('should extract comparison keywords', () => {
      const html = '<p>智能合约和传统合约的区别在于执行方式。</p>';
      const blocks = parser.parse(html);
      
      const comparisons = blocks.filter(b => b.type === 'comparison');
      expect(comparisons.length).toBeGreaterThan(0);
    });
  });

  describe('Example Extraction', () => {
    it('should extract code blocks as examples', () => {
      const html = '<pre><code>function transfer() { return true; }</code></pre>';
      const blocks = parser.parse(html);
      
      const examples = blocks.filter(b => b.type === 'example');
      expect(examples.length).toBeGreaterThan(0);
      expect(examples[0].content).toContain('<pre>');
    });

    it('should extract content with example keywords', () => {
      const html = '<p>例如：以太坊是最流行的智能合约平台。</p>';
      const blocks = parser.parse(html);
      
      const examples = blocks.filter(b => b.type === 'example');
      expect(examples.length).toBeGreaterThan(0);
    });
  });

  describe('Explanation Extraction', () => {
    it('should extract regular paragraphs as explanations', () => {
      const html = '<p>智能合约可以自动执行预定义的规则和条件，无需人工干预。</p>';
      const blocks = parser.parse(html);
      
      const explanations = blocks.filter(b => b.type === 'explanation');
      expect(explanations.length).toBeGreaterThan(0);
    });

    it('should not extract very short paragraphs', () => {
      const html = '<p>短文本</p>';
      const blocks = parser.parse(html);
      
      const explanations = blocks.filter(b => b.type === 'explanation');
      expect(explanations.length).toBe(0);
    });

    it('should not extract very long paragraphs', () => {
      const longText = 'A'.repeat(400);
      const html = `<p>${longText}</p>`;
      const blocks = parser.parse(html);
      
      const explanations = blocks.filter(b => b.type === 'explanation');
      expect(explanations.length).toBe(0);
    });
  });

  describe('Extractability Scoring', () => {
    it('should give high scores to structured content', () => {
      const html = `
        <div>
          <p>智能合约是指运行在区块链上的程序。</p>
          <ul>
            <li>自动执行</li>
            <li>去中心化</li>
          </ul>
        </div>
      `;
      const blocks = parser.parse(html);
      
      // Definitions should have high extractability
      const definitions = blocks.filter(b => b.type === 'definition');
      if (definitions.length > 0) {
        expect(definitions[0].extractability).toBeGreaterThan(0.7);
      }
    });

    it('should give lower scores to unstructured content', () => {
      const html = '<p>这是一段没有明确结构的普通文本内容。</p>';
      const blocks = parser.parse(html);
      
      const explanations = blocks.filter(b => b.type === 'explanation');
      if (explanations.length > 0) {
        expect(explanations[0].extractability).toBeLessThan(0.8);
      }
    });
  });

  describe('Block ID Generation', () => {
    it('should generate unique IDs for each block', () => {
      const html = `
        <p>第一段是指定义。</p>
        <p>第二段是指另一个定义。</p>
      `;
      const blocks = parser.parse(html);
      
      const ids = blocks.map(b => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Comprehensive Parsing', () => {
    it('should parse complex HTML with multiple block types', () => {
      const html = `
        <div>
          <h2>智能合约介绍</h2>
          <p>智能合约是指运行在区块链上的自动执行程序。</p>
          <p>智能合约可以自动执行预定义的规则和条件。</p>
          <ul>
            <li>自动执行</li>
            <li>去中心化</li>
          </ul>
          <table>
            <tr><th>特性</th><th>说明</th></tr>
            <tr><td>透明性</td><td>代码公开</td></tr>
          </table>
          <p>例如：以太坊智能合约使用Solidity语言编写。</p>
          <pre><code>function transfer() { }</code></pre>
          <p>因此，智能合约是Web3的核心技术。</p>
        </div>
      `;
      const blocks = parser.parse(html);
      
      // Should have multiple types of blocks
      const types = new Set(blocks.map(b => b.type));
      expect(types.size).toBeGreaterThan(2);
      
      // Should have at least one of each major type
      expect(blocks.some(b => b.type === 'definition')).toBe(true);
      expect(blocks.some(b => b.type === 'conclusion')).toBe(true);
    });
  });

  describe('Convenience Function', () => {
    it('should work with parseKnowledgeBlocks function', () => {
      const html = '<p>区块链是指一种分布式账本技术。</p>';
      const blocks = parseKnowledgeBlocks(html);
      
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBeGreaterThan(0);
    });
  });
});
