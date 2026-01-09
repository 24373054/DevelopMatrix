/**
 * Generate Q&A content for existing blog articles
 */

import { generateQA } from '../lib/geo/qaGenerator';
import type { ArticleInput } from '../lib/geo/qaGenerator';

// Import article data from messages
import zhMessages from '../messages/zh.json';
import enMessages from '../messages/en.json';

const articleSlugs = [
  'web3-security-trends-2025',
  'smart-contract-audit-guide',
  'defi-risk-management',
  'benign-arbitrage-theory'
];

function generateQAForArticles() {
  console.log('Generating Q&A for blog articles...\n');

  for (const slug of articleSlugs) {
    console.log(`\n=== ${slug} ===\n`);

    // Get Chinese article data
    const articles = zhMessages.blog.articles as Record<string, any>;
    const zhArticle = articles[slug];
    
    if (!zhArticle) {
      console.error(`Article ${slug} not found in zh.json`);
      continue;
    }

    // Create article input
    const articleInput: ArticleInput = {
      id: slug,
      title: zhArticle.title,
      content: zhArticle.content,
      aiSummary: zhArticle.aiSummary,
      keywords: zhArticle.keywords?.split(', '),
    };

    // Generate Q&A
    const qaMatrix = generateQA(articleInput, {
      maxQAPairs: 8,
    });

    console.log(`Generated ${qaMatrix.qaPairs.length} Q&A pairs`);
    console.log(`Coverage:`, qaMatrix.coverage);
    console.log('\nQ&A Pairs:');
    
    qaMatrix.qaPairs.forEach((qa, index) => {
      console.log(`\n${index + 1}. [${qa.category}] ${qa.question}`);
      console.log(`   Answer: ${qa.answer.substring(0, 100)}...`);
    });
  }
}

generateQAForArticles();
