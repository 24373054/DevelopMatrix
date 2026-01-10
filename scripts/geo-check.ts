#!/usr/bin/env tsx
/**
 * GEO Quality Check Tool
 * 
 * Comprehensive quality checker for GEO optimization.
 * Validates all articles against GEO requirements and generates a quality report.
 * 
 * Usage:
 *   npm run geo-check
 *   npm run geo-check -- --locale zh
 *   npm run geo-check -- --article web3-security-trends-2025
 *   npm run geo-check -- --verbose
 * 
 * Requirements: All requirements from the GEO optimization spec
 */

import fs from 'fs';
import path from 'path';
import { ContentValidator } from '../lib/geo/contentValidator';
import { TerminologyManager, loadTerminologyDictionary } from '../lib/geo/terminology';
import type {
  ContentQualityReport,
  TerminologyDictionary,
  ConflictReport,
} from '../types/geo';

// ============================================================================
// Configuration
// ============================================================================

interface CheckOptions {
  locale?: 'zh' | 'en' | 'all';
  article?: string;
  verbose?: boolean;
  outputFormat?: 'console' | 'json' | 'markdown';
}

interface ArticleData {
  title: string;
  content: string;
  aiSummary?: any;
  qaPairs?: any[];
  citations?: any[];
  author?: string;
  authorBio?: string;
}

interface GEOCheckReport {
  summary: {
    totalArticles: number;
    articlesChecked: number;
    averageScore: number;
    passRate: number;
    timestamp: string;
  };
  articles: ArticleReport[];
  terminology: {
    totalTerms: number;
    conflictsFound: number;
    conflicts: ConflictReport[];
  };
  recommendations: string[];
}

interface ArticleReport {
  id: string;
  locale: string;
  title: string;
  qualityReport: ContentQualityReport;
  terminologyIssues: ConflictReport[];
  passed: boolean;
}

// ============================================================================
// Main Check Function
// ============================================================================

async function runGEOCheck(options: CheckOptions = {}): Promise<GEOCheckReport> {
  console.log('🔍 Starting GEO Quality Check...\n');

  const locales = options.locale === 'all' || !options.locale 
    ? ['zh', 'en'] 
    : [options.locale];

  // Load terminology dictionary
  const terminologyData = loadTerminologyData();
  const terminologyManager = terminologyData 
    ? loadTerminologyDictionary(terminologyData)
    : null;

  if (!terminologyManager) {
    console.warn('⚠️  Terminology dictionary not found. Skipping terminology checks.\n');
  }

  // Initialize validator
  const validator = new ContentValidator();

  // Collect all articles
  const allArticles: ArticleReport[] = [];
  let totalConflicts: ConflictReport[] = [];

  for (const locale of locales) {
    console.log(`📚 Checking ${locale.toUpperCase()} articles...`);
    
    const articles = loadArticles(locale);
    
    for (const [articleId, articleData] of Object.entries(articles)) {
      // Skip if specific article requested and this isn't it
      if (options.article && articleId !== options.article) {
        continue;
      }

      if (options.verbose) {
        console.log(`  ├─ Checking: ${articleId}`);
      }

      // Validate content quality
      const qualityReport = validator.validate(
        articleId,
        articleData.content || '',
        !!articleData.aiSummary,
        !!(articleData.qaPairs && articleData.qaPairs.length > 0),
        !!(articleData.citations && articleData.citations.length > 0)
      );

      // Check terminology consistency
      const terminologyIssues: ConflictReport[] = [];
      if (terminologyManager && articleData.content) {
        const conflicts = terminologyManager.validateTerminologyConsistency(
          articleData.content,
          locale as 'zh' | 'en'
        );
        conflicts.forEach(conflict => {
          conflict.articleId = articleId;
          terminologyIssues.push(conflict);
        });
        totalConflicts.push(...terminologyIssues);
      }

      // Determine if article passed
      const passed = qualityReport.overallScore >= 70 && terminologyIssues.length === 0;

      allArticles.push({
        id: articleId,
        locale,
        title: articleData.title,
        qualityReport,
        terminologyIssues,
        passed,
      });

      if (options.verbose) {
        const status = passed ? '✅' : '❌';
        console.log(`  │  ${status} Score: ${qualityReport.overallScore}/100`);
        if (terminologyIssues.length > 0) {
          console.log(`  │  ⚠️  ${terminologyIssues.length} terminology issue(s)`);
        }
      }
    }
    
    console.log('');
  }

  // Calculate summary statistics
  const totalArticles = allArticles.length;
  const averageScore = totalArticles > 0
    ? allArticles.reduce((sum, a) => sum + a.qualityReport.overallScore, 0) / totalArticles
    : 0;
  const passedArticles = allArticles.filter(a => a.passed).length;
  const passRate = totalArticles > 0 ? (passedArticles / totalArticles) * 100 : 0;

  // Generate global recommendations
  const recommendations = generateGlobalRecommendations(allArticles, totalConflicts);

  const report: GEOCheckReport = {
    summary: {
      totalArticles,
      articlesChecked: totalArticles,
      averageScore: Math.round(averageScore * 10) / 10,
      passRate: Math.round(passRate * 10) / 10,
      timestamp: new Date().toISOString(),
    },
    articles: allArticles,
    terminology: {
      totalTerms: terminologyManager?.getAllEntries().length || 0,
      conflictsFound: totalConflicts.length,
      conflicts: totalConflicts,
    },
    recommendations,
  };

  return report;
}

// ============================================================================
// Data Loading Functions
// ============================================================================

function loadTerminologyData(): TerminologyDictionary | null {
  const terminologyPath = path.join(process.cwd(), 'data', 'terminology.json');
  
  if (!fs.existsSync(terminologyPath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(terminologyPath, 'utf-8');
    return JSON.parse(data) as TerminologyDictionary;
  } catch (error) {
    console.error('Error loading terminology dictionary:', error);
    return null;
  }
}

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
// Report Generation Functions
// ============================================================================

function generateGlobalRecommendations(
  articles: ArticleReport[],
  conflicts: ConflictReport[]
): string[] {
  const recommendations: string[] = [];

  // Check AI Summary coverage
  const articlesWithoutAISummary = articles.filter(
    a => !a.qualityReport.metrics.hasAISummary
  );
  if (articlesWithoutAISummary.length > 0) {
    recommendations.push(
      `Add AI Summary to ${articlesWithoutAISummary.length} article(s): ${articlesWithoutAISummary.map(a => a.id).join(', ')}`
    );
  }

  // Check Q&A coverage
  const articlesWithoutQA = articles.filter(
    a => !a.qualityReport.metrics.hasQACoverage
  );
  if (articlesWithoutQA.length > 0) {
    recommendations.push(
      `Add Q&A coverage to ${articlesWithoutQA.length} article(s): ${articlesWithoutQA.map(a => a.id).join(', ')}`
    );
  }

  // Check citations
  const articlesWithoutCitations = articles.filter(
    a => !a.qualityReport.metrics.hasCitations
  );
  if (articlesWithoutCitations.length > 0) {
    recommendations.push(
      `Add citations/references to ${articlesWithoutCitations.length} article(s): ${articlesWithoutCitations.map(a => a.id).join(', ')}`
    );
  }

  // Check terminology conflicts
  if (conflicts.length > 0) {
    const uniqueTerms = new Set(conflicts.map(c => c.term));
    recommendations.push(
      `Fix terminology conflicts for ${uniqueTerms.size} term(s): ${Array.from(uniqueTerms).join(', ')}`
    );
  }

  // Check paragraph length issues
  const articlesWithLongParagraphs = articles.filter(
    a => !a.qualityReport.metrics.paragraphLengthOk
  );
  if (articlesWithLongParagraphs.length > 0) {
    recommendations.push(
      `Break long paragraphs in ${articlesWithLongParagraphs.length} article(s)`
    );
  }

  // Check vague terms
  const articlesWithVagueTerms = articles.filter(
    a => !a.qualityReport.metrics.avoidsVagueTerms
  );
  if (articlesWithVagueTerms.length > 0) {
    recommendations.push(
      `Remove vague terms from ${articlesWithVagueTerms.length} article(s)`
    );
  }

  // Check hyperbole
  const articlesWithHyperbole = articles.filter(
    a => !a.qualityReport.metrics.avoidsHyperbole
  );
  if (articlesWithHyperbole.length > 0) {
    recommendations.push(
      `Remove hyperbolic language from ${articlesWithHyperbole.length} article(s)`
    );
  }

  return recommendations;
}

function printConsoleReport(report: GEOCheckReport, verbose: boolean = false): void {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    GEO QUALITY REPORT                         ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Summary
  console.log('📊 SUMMARY');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Total Articles:     ${report.summary.totalArticles}`);
  console.log(`Average Score:      ${report.summary.averageScore}/100`);
  console.log(`Pass Rate:          ${report.summary.passRate}%`);
  console.log(`Terminology Terms:  ${report.terminology.totalTerms}`);
  console.log(`Terminology Issues: ${report.terminology.conflictsFound}`);
  console.log(`Generated:          ${new Date(report.summary.timestamp).toLocaleString()}`);
  console.log('');

  // Article Details
  console.log('📝 ARTICLE DETAILS');
  console.log('─────────────────────────────────────────────────────────────');
  
  for (const article of report.articles) {
    const status = article.passed ? '✅ PASS' : '❌ FAIL';
    const score = article.qualityReport.overallScore;
    
    console.log(`\n${status} [${article.locale.toUpperCase()}] ${article.title}`);
    console.log(`    ID: ${article.id}`);
    console.log(`    Score: ${score}/100`);
    
    // Metrics
    const metrics = article.qualityReport.metrics;
    console.log(`    Metrics:`);
    console.log(`      ├─ AI Summary:        ${metrics.hasAISummary ? '✓' : '✗'}`);
    console.log(`      ├─ Q&A Coverage:      ${metrics.hasQACoverage ? '✓' : '✗'}`);
    console.log(`      ├─ Citations:         ${metrics.hasCitations ? '✓' : '✗'}`);
    console.log(`      ├─ Definitions:       ${metrics.hasDefinitions ? '✓' : '✗'}`);
    console.log(`      ├─ Conclusions:       ${metrics.hasConclusions ? '✓' : '✗'}`);
    console.log(`      ├─ Proper Lists:      ${metrics.hasProperLists ? '✓' : '✗'}`);
    console.log(`      ├─ Paragraph Length:  ${metrics.paragraphLengthOk ? '✓' : '✗'}`);
    console.log(`      ├─ Avoids Vague:      ${metrics.avoidsVagueTerms ? '✓' : '✗'}`);
    console.log(`      └─ Avoids Hyperbole:  ${metrics.avoidsHyperbole ? '✓' : '✗'}`);
    
    // Issues
    if (verbose && article.qualityReport.issues.length > 0) {
      console.log(`    Issues (${article.qualityReport.issues.length}):`);
      article.qualityReport.issues.slice(0, 5).forEach((issue, idx) => {
        const prefix = idx === Math.min(4, article.qualityReport.issues.length - 1) ? '└─' : '├─';
        console.log(`      ${prefix} [${issue.severity.toUpperCase()}] ${issue.type}: ${issue.message.substring(0, 80)}...`);
      });
      if (article.qualityReport.issues.length > 5) {
        console.log(`      └─ ... and ${article.qualityReport.issues.length - 5} more`);
      }
    }
    
    // Terminology issues
    if (article.terminologyIssues.length > 0) {
      console.log(`    Terminology Issues (${article.terminologyIssues.length}):`);
      article.terminologyIssues.slice(0, 3).forEach((issue, idx) => {
        const prefix = idx === Math.min(2, article.terminologyIssues.length - 1) ? '└─' : '├─';
        console.log(`      ${prefix} ${issue.term}: ${issue.articleDefinition.substring(0, 60)}...`);
      });
      if (article.terminologyIssues.length > 3) {
        console.log(`      └─ ... and ${article.terminologyIssues.length - 3} more`);
      }
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

function saveJSONReport(report: GEOCheckReport, outputPath: string): void {
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ JSON report saved to: ${outputPath}`);
}

function saveMarkdownReport(report: GEOCheckReport, outputPath: string): void {
  let md = '# GEO Quality Report\n\n';
  
  // Summary
  md += '## Summary\n\n';
  md += `- **Total Articles**: ${report.summary.totalArticles}\n`;
  md += `- **Average Score**: ${report.summary.averageScore}/100\n`;
  md += `- **Pass Rate**: ${report.summary.passRate}%\n`;
  md += `- **Terminology Terms**: ${report.terminology.totalTerms}\n`;
  md += `- **Terminology Issues**: ${report.terminology.conflictsFound}\n`;
  md += `- **Generated**: ${new Date(report.summary.timestamp).toLocaleString()}\n\n`;
  
  // Article Details
  md += '## Article Details\n\n';
  
  for (const article of report.articles) {
    const status = article.passed ? '✅ PASS' : '❌ FAIL';
    md += `### ${status} [${article.locale.toUpperCase()}] ${article.title}\n\n`;
    md += `- **ID**: \`${article.id}\`\n`;
    md += `- **Score**: ${article.qualityReport.overallScore}/100\n\n`;
    
    // Metrics
    md += '**Metrics**:\n\n';
    const metrics = article.qualityReport.metrics;
    md += `- AI Summary: ${metrics.hasAISummary ? '✓' : '✗'}\n`;
    md += `- Q&A Coverage: ${metrics.hasQACoverage ? '✓' : '✗'}\n`;
    md += `- Citations: ${metrics.hasCitations ? '✓' : '✗'}\n`;
    md += `- Definitions: ${metrics.hasDefinitions ? '✓' : '✗'}\n`;
    md += `- Conclusions: ${metrics.hasConclusions ? '✓' : '✗'}\n`;
    md += `- Proper Lists: ${metrics.hasProperLists ? '✓' : '✗'}\n`;
    md += `- Paragraph Length: ${metrics.paragraphLengthOk ? '✓' : '✗'}\n`;
    md += `- Avoids Vague Terms: ${metrics.avoidsVagueTerms ? '✓' : '✗'}\n`;
    md += `- Avoids Hyperbole: ${metrics.avoidsHyperbole ? '✓' : '✗'}\n\n`;
    
    // Issues
    if (article.qualityReport.issues.length > 0) {
      md += `**Issues** (${article.qualityReport.issues.length}):\n\n`;
      article.qualityReport.issues.forEach((issue, idx) => {
        md += `${idx + 1}. **[${issue.severity.toUpperCase()}]** ${issue.type}: ${issue.message}\n`;
      });
      md += '\n';
    }
    
    // Terminology issues
    if (article.terminologyIssues.length > 0) {
      md += `**Terminology Issues** (${article.terminologyIssues.length}):\n\n`;
      article.terminologyIssues.forEach((issue, idx) => {
        md += `${idx + 1}. **${issue.term}**: ${issue.articleDefinition}\n`;
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
    locale: 'all',
    verbose: false,
    outputFormat: 'console',
  };
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--locale' && i + 1 < args.length) {
      options.locale = args[++i] as 'zh' | 'en' | 'all';
    } else if (arg === '--article' && i + 1 < args.length) {
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
    const report = await runGEOCheck(options);
    
    // Output the report
    if (options.outputFormat === 'console') {
      printConsoleReport(report, options.verbose);
    } else if (options.outputFormat === 'json') {
      const outputPath = path.join(process.cwd(), 'geo-quality-report.json');
      saveJSONReport(report, outputPath);
    } else if (options.outputFormat === 'markdown') {
      const outputPath = path.join(process.cwd(), 'geo-quality-report.md');
      saveMarkdownReport(report, outputPath);
    }
    
    // Exit with appropriate code
    const failedArticles = report.articles.filter(a => !a.passed).length;
    if (failedArticles > 0) {
      console.log(`\n⚠️  ${failedArticles} article(s) failed quality checks.`);
      process.exit(1);
    } else {
      console.log('\n✅ All articles passed quality checks!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Error running GEO check:', error);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
GEO Quality Check Tool

Usage:
  npm run geo-check [options]

Options:
  --locale <zh|en|all>    Check specific locale or all (default: all)
  --article <id>          Check specific article by ID
  --verbose, -v           Show detailed output
  --json                  Output report as JSON file
  --markdown, --md        Output report as Markdown file
  --help, -h              Show this help message

Examples:
  npm run geo-check
  npm run geo-check -- --locale zh
  npm run geo-check -- --article web3-security-trends-2025
  npm run geo-check -- --verbose --json
  npm run geo-check -- --markdown

Requirements Validated:
  - AI Summary presence and completeness
  - Q&A coverage and question types
  - Citations and references
  - Content structure (definitions, conclusions, lists)
  - Paragraph length constraints
  - Semantic certainty (avoiding vague terms)
  - Verifiability (avoiding hyperbole)
  - Terminology consistency
  `);
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runGEOCheck, type GEOCheckReport, type CheckOptions };
