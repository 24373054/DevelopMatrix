/**
 * Validate Q&A coverage for blog articles
 */

import zhMessages from '../messages/zh.json';
import enMessages from '../messages/en.json';

const articleSlugs = [
  'web3-security-trends-2025',
  'smart-contract-audit-guide',
  'defi-risk-management',
  'benign-arbitrage-theory'
];

interface QAPair {
  question: string;
  answer: string;
  category: 'definition' | 'comparison' | 'application' | 'limitation';
}

function validateQACoverage() {
  console.log('=== Q&A Coverage Validation ===\n');

  let allValid = true;

  for (const slug of articleSlugs) {
    console.log(`\n📄 ${slug}`);
    console.log('─'.repeat(60));

    // Check Chinese version
    const zhArticles = zhMessages.blog.articles as Record<string, any>;
    const zhArticle = zhArticles[slug];
    const zhQAPairs = zhArticle?.qaPairs as QAPair[] | undefined;

    if (!zhQAPairs || zhQAPairs.length === 0) {
      console.log('❌ Chinese version: Missing Q&A pairs');
      allValid = false;
    } else {
      console.log(`✓ Chinese version: ${zhQAPairs.length} Q&A pairs`);
      
      const zhCoverage = {
        definition: zhQAPairs.filter(qa => qa.category === 'definition').length,
        comparison: zhQAPairs.filter(qa => qa.category === 'comparison').length,
        application: zhQAPairs.filter(qa => qa.category === 'application').length,
        limitation: zhQAPairs.filter(qa => qa.category === 'limitation').length,
      };
      
      console.log(`  - Definition: ${zhCoverage.definition}`);
      console.log(`  - Comparison: ${zhCoverage.comparison}`);
      console.log(`  - Application: ${zhCoverage.application}`);
      console.log(`  - Limitation: ${zhCoverage.limitation}`);
      
      if (zhCoverage.definition === 0) {
        console.log('  ⚠️  Missing definition questions');
      }
      if (zhCoverage.application === 0) {
        console.log('  ⚠️  Missing application questions');
      }
    }

    // Check English version
    const enArticles = enMessages.blog.articles as Record<string, any>;
    const enArticle = enArticles[slug];
    const enQAPairs = enArticle?.qaPairs as QAPair[] | undefined;

    if (!enQAPairs || enQAPairs.length === 0) {
      console.log('❌ English version: Missing Q&A pairs');
      allValid = false;
    } else {
      console.log(`✓ English version: ${enQAPairs.length} Q&A pairs`);
    }

    // Check parity
    if (zhQAPairs && enQAPairs && zhQAPairs.length !== enQAPairs.length) {
      console.log(`⚠️  Q&A count mismatch: zh=${zhQAPairs.length}, en=${enQAPairs.length}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  if (allValid) {
    console.log('✅ All articles have Q&A coverage!');
  } else {
    console.log('❌ Some articles are missing Q&A pairs');
    process.exit(1);
  }
}

validateQACoverage();
