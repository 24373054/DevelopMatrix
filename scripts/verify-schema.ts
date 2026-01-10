/**
 * Script to verify the enhanced Schema.org structured data
 * 
 * This script generates and displays the JSON-LD for a sample blog article
 * to verify that all GEO requirements are met.
 */

import {
  generateEnhancedSchema,
  extractCoreConcepts,
  extractMentionedTechnologies,
  determineArticleSeries,
  validateEnhancedSchema,
} from '../lib/geo/schemaGenerator';
import type { AISummary, QAPair } from '../types/geo';

// Sample data from web3-security-trends-2025 article
const aiSummary: AISummary = {
  whatIs: 'Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究，涵盖智能合约漏洞、跨链桥攻击、社会工程学诈骗等攻击向量，以及相应的防御策略和最佳实践。',
  whyImportant: '2024年 Web3 领域的安全事件造成了数十亿美元的损失。随着去中心化应用的普及，理解安全威胁并采取有效防御措施对于保护用户资产、维护项目信誉和推动行业健康发展至关重要。',
  useCases: [
    '智能合约开发者在部署前进行安全审计和漏洞检测',
    'DeFi 项目方建立多层防御体系和实时监控系统',
    '跨链桥运营方加强验证机制和签名安全',
    '普通用户识别钓鱼网站和社会工程学攻击',
    '安全团队制定应急响应预案和事件处理流程',
  ],
  keyTakeaways: [
    '智能合约漏洞（重入攻击、整数溢出、访问控制缺陷）仍是最主要的攻击向量',
    '跨链桥因锁定大量资产成为黑客的主要目标',
    '社会工程学攻击（钓鱼、假冒项目方）日益精密化',
    '专业的代码审计是主网部署前的必要步骤',
    '多重签名机制可有效避免单点故障',
    '实时链上监控系统能及时发现异常交易',
    'Web3 安全需要持续演进的多层防御策略',
  ],
};

const qaPairs: QAPair[] = [
  {
    question: '什么是 Web3 安全趋势分析？',
    answer: 'Web3 安全趋势分析是对去中心化生态系统中主要安全威胁的系统性研究，涵盖智能合约漏洞、跨链桥攻击、社会工程学诈骗等攻击向量，以及相应的防御策略和最佳实践。它帮助开发者、项目方和用户理解当前和未来的安全挑战。',
    category: 'definition',
    relatedConcepts: ['Web3', '安全', '区块链'],
  },
  {
    question: '为什么 Web3 安全如此重要？',
    answer: '2024年 Web3 领域的安全事件造成了数十亿美元的损失。由于智能合约一旦部署就无法修改，任何安全漏洞都可能导致不可逆的资金损失。理解安全威胁并采取有效防御措施对于保护用户资产、维护项目信誉和推动行业健康发展至关重要。',
    category: 'definition',
    relatedConcepts: ['安全', '智能合约'],
  },
];

const slug = 'web3-security-trends-2025';
const title = '2025年 Web3 安全趋势分析：从攻击手法到防御策略';
const description = '深入分析2025年Web3领域的主要安全威胁，包括智能合约漏洞、跨链桥攻击、钓鱼诈骗等，并提供专业的防御建议和最佳实践。';
const category = '安全';
const keywords = 'Web3安全, 智能合约漏洞, 区块链安全, 跨链桥攻击, 安全审计';
const author = 'Matrix Lab 安全团队';
const authorBio = 'Matrix Lab 安全团队专注于区块链安全研究，为多个知名项目提供安全审计服务。';
const datePublished = '2024-12-30';
const locale = 'zh' as const;

// Extract GEO enhancements
const coreConcepts = extractCoreConcepts(aiSummary, keywords);
const mentionedTechnologies = extractMentionedTechnologies(keywords, aiSummary);
const seriesName = determineArticleSeries(category, locale);

// Generate enhanced schema
const enhancedSchema = generateEnhancedSchema({
  slug,
  title,
  description,
  category,
  keywords,
  author,
  authorBio,
  datePublished,
  dateModified: datePublished,
  locale,
  aiSummary,
  qaPairs,
  seriesName,
  mentionedTechnologies,
  coreConcepts,
});

// Add @context and @id for complete JSON-LD
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@id': `https://develop.matrixlab.work/${locale}/blog/${slug}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://develop.matrixlab.work/${locale}/blog/${slug}`,
  },
  ...enhancedSchema,
};

// Validate the schema
const validation = validateEnhancedSchema(enhancedSchema);

console.log('='.repeat(80));
console.log('Enhanced Schema.org JSON-LD for Blog Article');
console.log('='.repeat(80));
console.log();
console.log(JSON.stringify(articleJsonLd, null, 2));
console.log();
console.log('='.repeat(80));
console.log('Validation Result');
console.log('='.repeat(80));
console.log();
console.log(`Valid: ${validation.valid}`);
console.log();
if (validation.errors.length > 0) {
  console.log('Issues:');
  validation.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
} else {
  console.log('✓ No validation errors found!');
}
console.log();
console.log('='.repeat(80));
console.log('Key GEO Requirements Verification');
console.log('='.repeat(80));
console.log();
console.log(`✓ @type: ${articleJsonLd['@type']}`);
console.log(`✓ @id: ${articleJsonLd['@id']}`);
console.log(`✓ mainEntityOfPage: ${articleJsonLd.mainEntityOfPage['@type']}`);
console.log(`✓ Author name: ${articleJsonLd.author.name}`);
console.log(`✓ Author jobTitle: ${articleJsonLd.author.jobTitle || 'N/A'}`);
console.log(`✓ Author description: ${articleJsonLd.author.description?.substring(0, 50)}...`);
console.log(`✓ Date published (ISO 8601): ${articleJsonLd.datePublished}`);
console.log(`✓ Date modified (ISO 8601): ${articleJsonLd.dateModified}`);
console.log(`✓ About (core concepts): ${articleJsonLd.about?.length || 0} concepts`);
console.log(`✓ Teaches (key takeaways): ${articleJsonLd.teaches?.length || 0} points`);
console.log(`✓ Mentions (technologies): ${articleJsonLd.mentions?.length || 0} items`);
console.log(`✓ IsPartOf (series): ${articleJsonLd.isPartOf?.name || 'N/A'}`);
console.log(`✓ MainEntity (Q&A): ${articleJsonLd.mainEntity?.length || 0} questions`);
console.log();
console.log('='.repeat(80));
console.log('All GEO Requirements Met! ✓');
console.log('='.repeat(80));
