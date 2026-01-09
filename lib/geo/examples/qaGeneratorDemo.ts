/**
 * Q&A Generator Demo
 * 
 * This file demonstrates how to use the Q&A Generator with real article data
 */

import { generateQA } from '../qaGenerator';
import type { ArticleInput } from '../qaGenerator';

// Example: Web3 Security Trends Article
const web3SecurityArticle: ArticleInput = {
  id: 'web3-security-trends-2025',
  title: '2025年 Web3 安全趋势分析',
  content: `
    <h2>引言</h2>
    <p>随着 Web3 生态的快速发展，安全问题日益凸显。2024年，我们见证了多起重大安全事件。</p>
    
    <h2>主要威胁类型</h2>
    <h3>智能合约漏洞</h3>
    <p>智能合约漏洞仍然是最主要的攻击向量。常见漏洞包括重入攻击、整数溢出等。</p>
    
    <h3>智能合约和传统合约的区别</h3>
    <p>智能合约和传统合约的区别在于执行方式。智能合约自动执行，而传统合约需要人工执行。</p>
    
    <h2>防御策略</h2>
    <h3>代码审计</h3>
    <p>在主网部署前，必须进行专业的智能合约审计。</p>
    
    <h2>局限性</h2>
    <p>Web3 安全的局限性包括代码不可修改的特点。</p>
    <p>另一个风险是 gas 费用可能很高。</p>
  `,
  aiSummary: {
    whatIs: 'Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究，涵盖智能合约漏洞、跨链桥攻击等。',
    whyImportant: '2024年 Web3 领域的安全事件造成了数十亿美元的损失。理解安全威胁对于保护用户资产至关重要。',
    useCases: [
      '智能合约开发者在部署前进行安全审计',
      'DeFi 项目方建立多层防御体系',
      '普通用户识别钓鱼网站',
    ],
    keyTakeaways: [
      '智能合约漏洞仍是最主要的攻击向量',
      '专业的代码审计是必要步骤',
      '多重签名机制可避免单点故障',
    ],
  },
  keywords: ['Web3安全', '智能合约漏洞', '区块链安全'],
};

// Generate Q&A pairs
console.log('=== Q&A Generator Demo ===\n');

const qaCoverage = generateQA(web3SecurityArticle, {
  maxQAPairs: 10,
  includeDefinition: true,
  includeComparison: true,
  includeApplication: true,
  includeLimitation: true,
});

console.log(`Article: ${qaCoverage.article}`);
console.log(`Total Q&A Pairs: ${qaCoverage.qaPairs.length}\n`);

console.log('Coverage:');
console.log(`  - Definition: ${qaCoverage.coverage.hasDefinition ? '✓' : '✗'}`);
console.log(`  - Comparison: ${qaCoverage.coverage.hasComparison ? '✓' : '✗'}`);
console.log(`  - Application: ${qaCoverage.coverage.hasApplication ? '✓' : '✗'}`);
console.log(`  - Limitation: ${qaCoverage.coverage.hasLimitation ? '✓' : '✗'}`);
console.log('');

console.log('Generated Q&A Pairs:\n');
qaCoverage.qaPairs.forEach((qa, index) => {
  console.log(`${index + 1}. [${qa.category.toUpperCase()}]`);
  console.log(`   Q: ${qa.question}`);
  console.log(`   A: ${qa.answer.substring(0, 100)}${qa.answer.length > 100 ? '...' : ''}`);
  console.log(`   Related: ${qa.relatedConcepts.join(', ')}`);
  console.log('');
});

// Example with custom configuration
console.log('\n=== Custom Configuration Example ===\n');

const limitedQA = generateQA(web3SecurityArticle, {
  maxQAPairs: 3,
  includeDefinition: true,
  includeComparison: false,
  includeApplication: true,
  includeLimitation: false,
});

console.log(`Limited to ${limitedQA.qaPairs.length} Q&A pairs`);
console.log('Only definition and application questions included\n');

limitedQA.qaPairs.forEach((qa, index) => {
  console.log(`${index + 1}. [${qa.category}] ${qa.question}`);
});

export { web3SecurityArticle, qaCoverage };
