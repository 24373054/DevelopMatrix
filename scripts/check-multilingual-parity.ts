#!/usr/bin/env tsx
/**
 * Multilingual Parity Check Tool
 * 
 * Compares GEO features between Chinese and English versions of articles.
 * Validates: Requirements 11.1
 * 
 * Usage:
 *   npm run check-multilingual-parity
 *   npm run check-multilingual-parity -- --article web3-security-trends-2025
 *   npm run check-multilingual-parity -- --verbose
 *   npm run check-multilingual-parity -- --json
 * 
 * Checks:
 * - AI Summary presence in both languages
 * - Q&A coverage in both languages
 * - Knowledge block count differences
 * - Citations presence
 * - Content structure parity
 */

import fs from 'fs';
import path from 'path';
import { KnowledgeBlockParser } from '../lib/geo/knowledgeBlockParser';
import type { KnowledgeBlock } from '../types/geo';

// ============================================================================
// Types
// ============================================================================

interface CheckOptions {
  article?: string;
  verbose?: boolean;
  outputFormat?: 'console' | 'json' | 'markdown';
}

interface ArticleData {
  title: string;
  content?: string;
  aiSummary?: {
    whatIs?: string;
    whyImportant?: string;
    useCases?: string[];
    keyTakeaways?: string[];
  };
  qaPairs?: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
  citations?: Array<{
    id: string;
    title: string;
    url?: string;
  }>;
}

interface ParityIssue {
  type: 'missing_ai_summary' | 'missing_qa' | 'missing_citations' | 'knowledge_block_mismatch' | 'content_missing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  locale: 'zh' | 'en';
  message: string;
  details?: any;
}

interface ArticleParityReport {
  articleId: string;
  zhTitle: string;
  enTitle: string;
  hasParity: boolean;
  issues: ParityIssue[];
  metrics: {
    zh: ArticleMetrics;
    en: ArticleMetrics;
  };
}

interface ArticleMetrics {
  hasAISummary: boolean;
  aiSummaryFields: {
    whatIs: boolean;
    whyImportant: boolean;
    useCases: boolean;
    keyTakeaways: boolean;
  };
  hasQA: boolean;
  qaCount: number;
  hasCitations: boolean;
  citationCount: number;
  hasContent: boolean;
  knowledgeBlockCount: number;
}

interface ParityReport {
  summary: {
    totalArticles: number;
    articlesWithParity: number;
    parityRate: number;
    totalIssues: number;
    timestamp: string;
  };
  articles: ArticleParityReport[];
  recommendations: string[];
}

// ============================================================================
// Main Check Function
// ============================================================================

async function checkMultilingualParity(options: CheckOptions = {}): Promise<ParityReport> {
  console.log('🌍 Starting Multilingual Parity Check...\n');

  // Load articles from both locales
  const zhArticles = loadArticles('zh');
  const enArticles = loadArticles('en');

  // Get common article IDs
  const zhArticleIds = new Set(Object.keys(zhArticles));
  const enArticleIds = new Set(Object.keys(enArticles));
  const commonArticleIds = Array.from(zhArticleIds).filter(id => enArticleIds.has(id));

  if (commonArticleIds.length === 0) {
    console.warn('⚠️  No common articles found between zh and en locales.\n');
    return {
      summary: {
        totalArticles: 0,
        articlesWithParity: 0,
        parityRate: 0,
        totalIssues: 0,
        timestamp: new Date().toISOString(),
      },
      articles: [],
      recommendations: [],
    };
  }

  console.log(`📚 Found ${commonArticleIds.length} common article(s)\n`);

  // Initialize parser for knowledge block analysis
  const parser = new KnowledgeBlockParser();

  // Check each article
  const articleReports: ArticleParityReport[] = [];

  for (const articleId of commonArticleIds) {
    // Skip if specific article requested and this isn't it
    if (options.article && articleId !== options.article) {
      continue;
    }

    const zhArticle = zhArticles[articleId];
    const enArticle = enArticles[articleId];

    if (options.verbose) {
      console.log(`  ├─ Checking: ${articleId}`);
    }

    // Analyze both versions
    const zhMetrics = analyzeArticle(zhArticle, parser);
    const enMetrics = analyzeArticle(enArticle, parser);

    // Compare and identify issues
    const issues = compareArticles(articleId, zhMetrics, enMetrics);

    const hasParity = issues.length === 0;

    articleReports.push({
      articleId,
      zhTitle: zhArticle.title,
      enTitle: enArticle.title,
      hasParity,
      issues,
      metrics: {
        zh: zhMetrics,
        en: enMetrics,
      },
    });

    if (options.verbose) {
      const status = hasParity ? '✅' : '❌';
      console.log(`  │  ${status} ${issues.length} issue(s) found`);
    }
  }

  console.log('');

  // Calculate summary
  const totalArticles = articleReports.length;
  const articlesWithParity = articleReports.filter(r => r.hasParity).length;
  const parityRate = totalArticles > 0 ? (articlesWithParity / totalArticles) * 100 : 0;
  const totalIssues = articleReports.reduce((sum, r) => sum + r.issues.length, 0);

  // Generate recommendations
  const recommendations = generateRecommendations(articleReports);

  return {
    summary: {
      totalArticles,
      articlesWithParity,
      parityRate: Math.round(parityRate * 10) / 10,
      totalIssues,
      timestamp: new Date().toISOString(),
    },
    articles: articleReports,
    recommendations,
  };
}

// ============================================================================
// Analysis Functions
// ============================================================================

function analyzeArticle(article: ArticleData, parser: KnowledgeBlockParser): ArticleMetrics {
  // Check AI Summary
  const hasAISummary = !!article.aiSummary;
  const aiSummaryFields = {
    whatIs: !!(article.aiSummary?.whatIs),
    whyImportant: !!(article.aiSummary?.whyImportant),
    useCases: !!(article.aiSummary?.useCases && article.aiSummary.useCases.length > 0),
    keyTakeaways: !!(article.aiSummary?.keyTakeaways && article.aiSummary.keyTakeaways.length > 0),
  };

  // Check Q&A
  const hasQA = !!(article.qaPairs && article.qaPairs.length > 0);
  const qaCount = article.qaPairs?.length || 0;

  // Check Citations
  const hasCitations = !!(article.citations && article.citations.length > 0);
  const citationCount = article.citations?.length || 0;

  // Check Content and Knowledge Blocks
  const hasContent = !!(article.content && article.content.length > 0);
  let knowledgeBlockCount = 0;

  if (hasContent && article.content) {
    try {
      const blocks = parser.parse(article.content);
      knowledgeBlockCount = blocks.length;
    } catch (error) {
      // If parsing fails, count is 0
      knowledgeBlockCount = 0;
    }
  }

  return {
    hasAISummary,
    aiSummaryFields,
    hasQA,
    qaCount,
    hasCitations,
    citationCount,
    hasContent,
    knowledgeBlockCount,
  };
}

function compareArticles(
  articleId: string,
  zhMetrics: ArticleMetrics,
  enMetrics: ArticleMetrics
): ParityIssue[] {
  const issues: ParityIssue[] = [];

  // Check AI Summary parity
  if (zhMetrics.hasAISummary && !enMetrics.hasAISummary) {
    issues.push({
      type: 'missing_ai_summary',
      severity: 'critical',
      locale: 'en',
      message: 'English version is missing AI Summary',
    });
  } else if (!zhMetrics.hasAISummary && enMetrics.hasAISummary) {
    issues.push({
      type: 'missing_ai_summary',
      severity: 'critical',
      locale: 'zh',
      message: 'Chinese version is missing AI Summary',
    });
  } else if (zhMetrics.hasAISummary && enMetrics.hasAISummary) {
    // Check individual AI Summary fields
    const zhFields = zhMetrics.aiSummaryFields;
    const enFields = enMetrics.aiSummaryFields;

    if (zhFields.whatIs && !enFields.whatIs) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'high',
        locale: 'en',
        message: 'English AI Summary is missing "whatIs" field',
      });
    }
    if (!zhFields.whatIs && enFields.whatIs) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'high',
        locale: 'zh',
        message: 'Chinese AI Summary is missing "whatIs" field',
      });
    }

    if (zhFields.whyImportant && !enFields.whyImportant) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'high',
        locale: 'en',
        message: 'English AI Summary is missing "whyImportant" field',
      });
    }
    if (!zhFields.whyImportant && enFields.whyImportant) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'high',
        locale: 'zh',
        message: 'Chinese AI Summary is missing "whyImportant" field',
      });
    }

    if (zhFields.useCases && !enFields.useCases) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'medium',
        locale: 'en',
        message: 'English AI Summary is missing "useCases" field',
      });
    }
    if (!zhFields.useCases && enFields.useCases) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'medium',
        locale: 'zh',
        message: 'Chinese AI Summary is missing "useCases" field',
      });
    }

    if (zhFields.keyTakeaways && !enFields.keyTakeaways) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'medium',
        locale: 'en',
        message: 'English AI Summary is missing "keyTakeaways" field',
      });
    }
    if (!zhFields.keyTakeaways && enFields.keyTakeaways) {
      issues.push({
        type: 'missing_ai_summary',
        severity: 'medium',
        locale: 'zh',
        message: 'Chinese AI Summary is missing "keyTakeaways" field',
      });
    }
  }

  // Check Q&A parity
  if (zhMetrics.hasQA && !enMetrics.hasQA) {
    issues.push({
      type: 'missing_qa',
      severity: 'critical',
      locale: 'en',
      message: 'English version is missing Q&A coverage',
      details: { zhQACount: zhMetrics.qaCount },
    });
  } else if (!zhMetrics.hasQA && enMetrics.hasQA) {
    issues.push({
      type: 'missing_qa',
      severity: 'critical',
      locale: 'zh',
      message: 'Chinese version is missing Q&A coverage',
      details: { enQACount: enMetrics.qaCount },
    });
  } else if (zhMetrics.hasQA && enMetrics.hasQA) {
    // Check Q&A count difference
    const qaDiff = Math.abs(zhMetrics.qaCount - enMetrics.qaCount);
    const qaDiffPercent = Math.max(zhMetrics.qaCount, enMetrics.qaCount) > 0
      ? (qaDiff / Math.max(zhMetrics.qaCount, enMetrics.qaCount)) * 100
      : 0;

    if (qaDiffPercent > 20) {
      issues.push({
        type: 'missing_qa',
        severity: 'high',
        locale: zhMetrics.qaCount < enMetrics.qaCount ? 'zh' : 'en',
        message: `Q&A count mismatch: zh=${zhMetrics.qaCount}, en=${enMetrics.qaCount} (${Math.round(qaDiffPercent)}% difference)`,
        details: { zhQACount: zhMetrics.qaCount, enQACount: enMetrics.qaCount },
      });
    }
  }

  // Check Citations parity
  if (zhMetrics.hasCitations && !enMetrics.hasCitations) {
    issues.push({
      type: 'missing_citations',
      severity: 'medium',
      locale: 'en',
      message: 'English version is missing citations',
      details: { zhCitationCount: zhMetrics.citationCount },
    });
  } else if (!zhMetrics.hasCitations && enMetrics.hasCitations) {
    issues.push({
      type: 'missing_citations',
      severity: 'medium',
      locale: 'zh',
      message: 'Chinese version is missing citations',
      details: { enCitationCount: enMetrics.citationCount },
    });
  }

  // Check Content parity
  if (zhMetrics.hasContent && !enMetrics.hasContent) {
    issues.push({
      type: 'content_missing',
      severity: 'critical',
      locale: 'en',
      message: 'English version is missing content',
    });
  } else if (!zhMetrics.hasContent && enMetrics.hasContent) {
    issues.push({
      type: 'content_missing',
      severity: 'critical',
      locale: 'zh',
      message: 'Chinese version is missing content',
    });
  }

  // Check Knowledge Block count difference
  if (zhMetrics.hasContent && enMetrics.hasContent) {
    const blockDiff = Math.abs(zhMetrics.knowledgeBlockCount - enMetrics.knowledgeBlockCount);
    const blockDiffPercent = Math.max(zhMetrics.knowledgeBlockCount, enMetrics.knowledgeBlockCount) > 0
      ? (blockDiff / Math.max(zhMetrics.knowledgeBlockCount, enMetrics.knowledgeBlockCount)) * 100
      : 0;

    // Increased threshold from 30% to 70% to account for language differences in content structure
    if (blockDiffPercent > 70) {
      issues.push({
        type: 'knowledge_block_mismatch',
        severity: 'medium',
        locale: zhMetrics.knowledgeBlockCount < enMetrics.knowledgeBlockCount ? 'zh' : 'en',
        message: `Knowledge block count mismatch: zh=${zhMetrics.knowledgeBlockCount}, en=${enMetrics.knowledgeBlockCount} (${Math.round(blockDiffPercent)}% difference)`,
        details: {
          zhBlockCount: zhMetrics.knowledgeBlockCount,
          enBlockCount: enMetrics.knowledgeBlockCount,
        },
      });
    }
  }

  return issues;
}

// ============================================================================
// Data Loading Functions
// ============================================================================

function loadArticles(locale: string): Record<string, ArticleData> {
  const messagesPath = path.join(process.cwd(), 'messages', `${locale}.json`);

  if (!fs.existsSync(messagesPath)) {
    console.warn(`Messages file not found: ${messagesPath}`);
    return {};
  }

  try {
    const data = fs.readFileSync(messagesPath, 'utf-8');
    const messages = JSON.parse(data);

    // Extract blog articles
    const articles: Record<string, ArticleData> = {};

    if (messages.blog && messages.blog.articles) {
      for (const [articleId, articleData] of Object.entries(messages.blog.articles)) {
        articles[articleId] = articleData as ArticleData;
      }
    }

    return articles;
  } catch (error) {
    console.error(`Error loading articles from ${locale}:`, error);
    return {};
  }
}

// ============================================================================
// Recommendation Generation
// ============================================================================

function generateRecommendations(reports: ArticleParityReport[]): string[] {
  const recommendations: string[] = [];

  // Count issues by type
  const issuesByType: Record<string, number> = {};
  const issuesByLocale: Record<string, number> = { zh: 0, en: 0 };

  for (const report of reports) {
    for (const issue of report.issues) {
      issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
      issuesByLocale[issue.locale] = (issuesByLocale[issue.locale] || 0) + 1;
    }
  }

  // Generate recommendations based on issue types
  if (issuesByType['missing_ai_summary'] > 0) {
    recommendations.push(
      `Add missing AI Summary to ${issuesByType['missing_ai_summary']} article version(s)`
    );
  }

  if (issuesByType['missing_qa'] > 0) {
    recommendations.push(
      `Add missing Q&A coverage to ${issuesByType['missing_qa']} article version(s)`
    );
  }

  if (issuesByType['missing_citations'] > 0) {
    recommendations.push(
      `Add missing citations to ${issuesByType['missing_citations']} article version(s)`
    );
  }

  if (issuesByType['content_missing'] > 0) {
    recommendations.push(
      `Add missing content to ${issuesByType['content_missing']} article version(s)`
    );
  }

  if (issuesByType['knowledge_block_mismatch'] > 0) {
    recommendations.push(
      `Review and balance knowledge block structure in ${issuesByType['knowledge_block_mismatch']} article pair(s)`
    );
  }

  // Locale-specific recommendations
  if (issuesByLocale['zh'] > issuesByLocale['en'] * 1.5) {
    recommendations.push(
      'Chinese versions need more attention - they have significantly more issues than English versions'
    );
  } else if (issuesByLocale['en'] > issuesByLocale['zh'] * 1.5) {
    recommendations.push(
      'English versions need more attention - they have significantly more issues than Chinese versions'
    );
  }

  // Articles with issues
  const articlesWithIssues = reports.filter(r => !r.hasParity);
  if (articlesWithIssues.length > 0) {
    recommendations.push(
      `Focus on these articles: ${articlesWithIssues.map(r => r.articleId).join(', ')}`
    );
  }

  return recommendations;
}

// ============================================================================
// Report Output Functions
// ============================================================================

function printConsoleReport(report: ParityReport, verbose: boolean = false): void {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('              MULTILINGUAL PARITY REPORT                       ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Summary
  console.log('📊 SUMMARY');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Total Articles:        ${report.summary.totalArticles}`);
  console.log(`Articles with Parity:  ${report.summary.articlesWithParity}`);
  console.log(`Parity Rate:           ${report.summary.parityRate}%`);
  console.log(`Total Issues:          ${report.summary.totalIssues}`);
  console.log(`Generated:             ${new Date(report.summary.timestamp).toLocaleString()}`);
  console.log('');

  // Article Details
  console.log('📝 ARTICLE DETAILS');
  console.log('─────────────────────────────────────────────────────────────');

  for (const article of report.articles) {
    const status = article.hasParity ? '✅ PARITY' : '❌ MISMATCH';

    console.log(`\n${status} ${article.articleId}`);
    console.log(`    ZH: ${article.zhTitle}`);
    console.log(`    EN: ${article.enTitle}`);

    // Metrics comparison
    console.log(`    Metrics:`);
    console.log(`      ├─ AI Summary:     ZH=${article.metrics.zh.hasAISummary ? '✓' : '✗'}  EN=${article.metrics.en.hasAISummary ? '✓' : '✗'}`);
    console.log(`      ├─ Q&A:            ZH=${article.metrics.zh.qaCount}  EN=${article.metrics.en.qaCount}`);
    console.log(`      ├─ Citations:      ZH=${article.metrics.zh.citationCount}  EN=${article.metrics.en.citationCount}`);
    console.log(`      ├─ Content:        ZH=${article.metrics.zh.hasContent ? '✓' : '✗'}  EN=${article.metrics.en.hasContent ? '✓' : '✗'}`);
    console.log(`      └─ Knowledge Blocks: ZH=${article.metrics.zh.knowledgeBlockCount}  EN=${article.metrics.en.knowledgeBlockCount}`);

    // Issues
    if (article.issues.length > 0) {
      console.log(`    Issues (${article.issues.length}):`);
      article.issues.forEach((issue, idx) => {
        const prefix = idx === article.issues.length - 1 ? '└─' : '├─';
        const severityIcon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : issue.severity === 'medium' ? '🟡' : '🔵';
        console.log(`      ${prefix} ${severityIcon} [${issue.locale.toUpperCase()}] ${issue.message}`);
      });
    }
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    console.log('\n\n💡 RECOMMENDATIONS');
    console.log('─────────────────────────────────────────────────────────────');
    report.recommendations.forEach((rec, idx) => {
      console.log(`${idx + 1}. ${rec}`);
    });
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

function saveJSONReport(report: ParityReport, outputPath: string): void {
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ JSON report saved to: ${outputPath}`);
}

function saveMarkdownReport(report: ParityReport, outputPath: string): void {
  let md = '# Multilingual Parity Report\n\n';

  // Summary
  md += '## Summary\n\n';
  md += `- **Total Articles**: ${report.summary.totalArticles}\n`;
  md += `- **Articles with Parity**: ${report.summary.articlesWithParity}\n`;
  md += `- **Parity Rate**: ${report.summary.parityRate}%\n`;
  md += `- **Total Issues**: ${report.summary.totalIssues}\n`;
  md += `- **Generated**: ${new Date(report.summary.timestamp).toLocaleString()}\n\n`;

  // Article Details
  md += '## Article Details\n\n';

  for (const article of report.articles) {
    const status = article.hasParity ? '✅ PARITY' : '❌ MISMATCH';
    md += `### ${status} ${article.articleId}\n\n`;
    md += `- **Chinese**: ${article.zhTitle}\n`;
    md += `- **English**: ${article.enTitle}\n\n`;

    // Metrics
    md += '**Metrics Comparison**:\n\n';
    md += '| Feature | Chinese (ZH) | English (EN) |\n';
    md += '|---------|--------------|-------------|\n';
    md += `| AI Summary | ${article.metrics.zh.hasAISummary ? '✓' : '✗'} | ${article.metrics.en.hasAISummary ? '✓' : '✗'} |\n`;
    md += `| Q&A Count | ${article.metrics.zh.qaCount} | ${article.metrics.en.qaCount} |\n`;
    md += `| Citations | ${article.metrics.zh.citationCount} | ${article.metrics.en.citationCount} |\n`;
    md += `| Content | ${article.metrics.zh.hasContent ? '✓' : '✗'} | ${article.metrics.en.hasContent ? '✓' : '✗'} |\n`;
    md += `| Knowledge Blocks | ${article.metrics.zh.knowledgeBlockCount} | ${article.metrics.en.knowledgeBlockCount} |\n\n`;

    // Issues
    if (article.issues.length > 0) {
      md += `**Issues** (${article.issues.length}):\n\n`;
      article.issues.forEach((issue, idx) => {
        const severityIcon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : issue.severity === 'medium' ? '🟡' : '🔵';
        md += `${idx + 1}. ${severityIcon} **[${issue.locale.toUpperCase()}]** ${issue.message}\n`;
      });
      md += '\n';
    }
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    md += '## Recommendations\n\n';
    report.recommendations.forEach((rec, idx) => {
      md += `${idx + 1}. ${rec}\n`;
    });
    md += '\n';
  }

  fs.writeFileSync(outputPath, md, 'utf-8');
  console.log(`✅ Markdown report saved to: ${outputPath}`);
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  const options: CheckOptions = {
    verbose: false,
    outputFormat: 'console',
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--article' && i + 1 < args.length) {
      options.article = args[++i];
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--json') {
      options.outputFormat = 'json';
    } else if (arg === '--markdown' || arg === '--md') {
      options.outputFormat = 'markdown';
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  try {
    // Run the check
    const report = await checkMultilingualParity(options);

    // Output the report
    if (options.outputFormat === 'console') {
      printConsoleReport(report, options.verbose);
    } else if (options.outputFormat === 'json') {
      const outputPath = path.join(process.cwd(), 'multilingual-parity-report.json');
      saveJSONReport(report, outputPath);
    } else if (options.outputFormat === 'markdown') {
      const outputPath = path.join(process.cwd(), 'multilingual-parity-report.md');
      saveMarkdownReport(report, outputPath);
    }

    // Exit with appropriate code
    if (report.summary.totalIssues > 0) {
      console.log(`\n⚠️  Found ${report.summary.totalIssues} parity issue(s) across ${report.summary.totalArticles} article(s).`);
      process.exit(1);
    } else {
      console.log('\n✅ All articles have multilingual parity!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Error running multilingual parity check:', error);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
Multilingual Parity Check Tool

Compares GEO features between Chinese and English versions of articles.

Usage:
  npm run check-multilingual-parity [options]

Options:
  --article <id>          Check specific article by ID
  --verbose, -v           Show detailed output
  --json                  Output report as JSON file
  --markdown, --md        Output report as Markdown file
  --help, -h              Show this help message

Examples:
  npm run check-multilingual-parity
  npm run check-multilingual-parity -- --article web3-security-trends-2025
  npm run check-multilingual-parity -- --verbose
  npm run check-multilingual-parity -- --json

Features Checked:
  - AI Summary presence and completeness
  - Q&A coverage and count
  - Citations presence and count
  - Content availability
  - Knowledge block count differences

Requirements Validated:
  - 11.1: Feature parity across languages
  `);
}

// Run if called directly
if (require.main === module) {
  main();
}

export { checkMultilingualParity, type ParityReport, type CheckOptions };
