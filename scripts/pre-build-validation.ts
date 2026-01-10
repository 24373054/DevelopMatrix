#!/usr/bin/env tsx
/**
 * Pre-Build Validation Script
 * 
 * Runs comprehensive GEO quality checks before building the application.
 * Enforces quality gates to ensure all content meets GEO standards.
 * 
 * Usage:
 *   npm run validate:pre-build
 *   npm run validate:pre-build -- --strict
 *   npm run validate:pre-build -- --threshold 80
 * 
 * Quality Gates:
 * - AI Summary coverage >= 90%
 * - Average quality score >= 70
 * - Multilingual parity rate >= 90%
 * - Zero critical terminology conflicts
 * 
 * Exit Codes:
 * - 0: All checks passed
 * - 1: Quality gates not met
 * - 2: Validation error
 */

import { runGEOCheck, type GEOCheckReport } from './geo-check';
import { checkMultilingualParity, type ParityReport } from './check-multilingual-parity';

// ============================================================================
// Configuration
// ============================================================================

interface ValidationOptions {
  strict?: boolean;
  threshold?: number;
  skipMultilingual?: boolean;
}

interface QualityGates {
  aiSummaryCoverage: number;      // Minimum % of articles with AI Summary
  averageQualityScore: number;    // Minimum average quality score
  multilingualParityRate: number; // Minimum % of articles with parity
  maxCriticalIssues: number;      // Maximum number of critical issues
}

const DEFAULT_QUALITY_GATES: QualityGates = {
  aiSummaryCoverage: 90,
  averageQualityScore: 70,
  multilingualParityRate: 90,
  maxCriticalIssues: 0,
};

const STRICT_QUALITY_GATES: QualityGates = {
  aiSummaryCoverage: 100,
  averageQualityScore: 80,
  multilingualParityRate: 100,
  maxCriticalIssues: 0,
};

// ============================================================================
// Main Validation Function
// ============================================================================

async function runPreBuildValidation(options: ValidationOptions = {}): Promise<boolean> {
  console.log('🚀 Starting Pre-Build Validation...\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Determine quality gates
  const qualityGates = options.strict ? STRICT_QUALITY_GATES : DEFAULT_QUALITY_GATES;
  
  if (options.threshold !== undefined) {
    qualityGates.averageQualityScore = options.threshold;
  }

  console.log('📋 Quality Gates:');
  console.log(`   ├─ AI Summary Coverage:      >= ${qualityGates.aiSummaryCoverage}%`);
  console.log(`   ├─ Average Quality Score:    >= ${qualityGates.averageQualityScore}/100`);
  console.log(`   ├─ Multilingual Parity Rate: >= ${qualityGates.multilingualParityRate}%`);
  console.log(`   └─ Max Critical Issues:      <= ${qualityGates.maxCriticalIssues}`);
  console.log('\n');

  let allChecksPassed = true;
  const failures: string[] = [];

  // ============================================================================
  // Step 1: Run GEO Quality Check
  // ============================================================================

  console.log('📊 Step 1/2: Running GEO Quality Check...\n');

  let geoReport: GEOCheckReport;
  try {
    geoReport = await runGEOCheck({ verbose: false });
  } catch (error) {
    console.error('❌ GEO Quality Check failed:', error);
    return false;
  }

  // Analyze GEO report
  const aiSummaryCoverage = calculateAISummaryCoverage(geoReport);
  const averageScore = geoReport.summary.averageScore;
  const criticalIssues = countCriticalIssues(geoReport);

  console.log('   Results:');
  console.log(`   ├─ AI Summary Coverage:   ${aiSummaryCoverage.toFixed(1)}%`);
  console.log(`   ├─ Average Quality Score: ${averageScore.toFixed(1)}/100`);
  console.log(`   ├─ Critical Issues:       ${criticalIssues}`);
  console.log(`   └─ Total Articles:        ${geoReport.summary.totalArticles}`);
  console.log('');

  // Check AI Summary coverage gate
  if (aiSummaryCoverage < qualityGates.aiSummaryCoverage) {
    allChecksPassed = false;
    failures.push(
      `AI Summary coverage (${aiSummaryCoverage.toFixed(1)}%) is below threshold (${qualityGates.aiSummaryCoverage}%)`
    );
    console.log(`   ❌ AI Summary coverage gate FAILED`);
  } else {
    console.log(`   ✅ AI Summary coverage gate PASSED`);
  }

  // Check average quality score gate
  if (averageScore < qualityGates.averageQualityScore) {
    allChecksPassed = false;
    failures.push(
      `Average quality score (${averageScore.toFixed(1)}) is below threshold (${qualityGates.averageQualityScore})`
    );
    console.log(`   ❌ Average quality score gate FAILED`);
  } else {
    console.log(`   ✅ Average quality score gate PASSED`);
  }

  // Check critical issues gate
  if (criticalIssues > qualityGates.maxCriticalIssues) {
    allChecksPassed = false;
    failures.push(
      `Critical issues (${criticalIssues}) exceed threshold (${qualityGates.maxCriticalIssues})`
    );
    console.log(`   ❌ Critical issues gate FAILED`);
  } else {
    console.log(`   ✅ Critical issues gate PASSED`);
  }

  console.log('\n');

  // ============================================================================
  // Step 2: Run Multilingual Parity Check
  // ============================================================================

  if (!options.skipMultilingual) {
    console.log('🌍 Step 2/2: Running Multilingual Parity Check...\n');

    let parityReport: ParityReport;
    try {
      parityReport = await checkMultilingualParity({ verbose: false });
    } catch (error) {
      console.error('❌ Multilingual Parity Check failed:', error);
      return false;
    }

    // Analyze parity report
    const parityRate = parityReport.summary.parityRate;
    const totalIssues = parityReport.summary.totalIssues;
    const criticalParityIssues = countCriticalParityIssues(parityReport);

    console.log('   Results:');
    console.log(`   ├─ Parity Rate:        ${parityRate.toFixed(1)}%`);
    console.log(`   ├─ Total Issues:       ${totalIssues}`);
    console.log(`   ├─ Critical Issues:    ${criticalParityIssues}`);
    console.log(`   └─ Total Articles:     ${parityReport.summary.totalArticles}`);
    console.log('');

    // Check parity rate gate
    if (parityRate < qualityGates.multilingualParityRate) {
      allChecksPassed = false;
      failures.push(
        `Multilingual parity rate (${parityRate.toFixed(1)}%) is below threshold (${qualityGates.multilingualParityRate}%)`
      );
      console.log(`   ❌ Multilingual parity gate FAILED`);
    } else {
      console.log(`   ✅ Multilingual parity gate PASSED`);
    }

    // Check critical parity issues
    if (criticalParityIssues > 0) {
      allChecksPassed = false;
      failures.push(
        `Critical parity issues (${criticalParityIssues}) found`
      );
      console.log(`   ❌ Critical parity issues gate FAILED`);
    } else {
      console.log(`   ✅ Critical parity issues gate PASSED`);
    }

    console.log('\n');
  } else {
    console.log('⏭️  Step 2/2: Multilingual Parity Check SKIPPED\n');
  }

  // ============================================================================
  // Final Report
  // ============================================================================

  console.log('═══════════════════════════════════════════════════════════════');
  
  if (allChecksPassed) {
    console.log('✅ PRE-BUILD VALIDATION PASSED');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('All quality gates met. Build can proceed.\n');
    return true;
  } else {
    console.log('❌ PRE-BUILD VALIDATION FAILED');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('The following quality gates were not met:\n');
    failures.forEach((failure, idx) => {
      console.log(`${idx + 1}. ${failure}`);
    });
    console.log('\n');
    console.log('Please fix the issues above before building.\n');
    console.log('To see detailed reports, run:');
    console.log('  npm run geo:check -- --verbose');
    console.log('  npm run geo:check-multilingual-parity -- --verbose\n');
    return false;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateAISummaryCoverage(report: GEOCheckReport): number {
  if (report.summary.totalArticles === 0) {
    return 100;
  }

  const articlesWithAISummary = report.articles.filter(
    a => a.qualityReport.metrics.hasAISummary
  ).length;

  return (articlesWithAISummary / report.summary.totalArticles) * 100;
}

function countCriticalIssues(report: GEOCheckReport): number {
  let count = 0;

  for (const article of report.articles) {
    count += article.qualityReport.issues.filter(
      issue => issue.severity === 'error'
    ).length;
  }

  // Add critical terminology conflicts
  count += report.terminology.conflictsFound;

  return count;
}

function countCriticalParityIssues(report: ParityReport): number {
  let count = 0;

  for (const article of report.articles) {
    count += article.issues.filter(
      issue => issue.severity === 'critical'
    ).length;
  }

  return count;
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  const options: ValidationOptions = {
    strict: false,
    skipMultilingual: false,
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--strict') {
      options.strict = true;
    } else if (arg === '--threshold' && i + 1 < args.length) {
      options.threshold = parseInt(args[++i], 10);
    } else if (arg === '--skip-multilingual') {
      options.skipMultilingual = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  try {
    const passed = await runPreBuildValidation(options);
    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Validation error:', error);
    process.exit(2);
  }
}

function printHelp(): void {
  console.log(`
Pre-Build Validation Script

Runs comprehensive GEO quality checks before building the application.
Enforces quality gates to ensure all content meets GEO standards.

Usage:
  npm run validate:pre-build [options]

Options:
  --strict                Use strict quality gates (higher thresholds)
  --threshold <number>    Set custom average quality score threshold (default: 70)
  --skip-multilingual     Skip multilingual parity check
  --help, -h              Show this help message

Quality Gates (Default):
  - AI Summary coverage >= 90%
  - Average quality score >= 70
  - Multilingual parity rate >= 90%
  - Zero critical issues

Quality Gates (Strict):
  - AI Summary coverage >= 100%
  - Average quality score >= 80
  - Multilingual parity rate >= 100%
  - Zero critical issues

Examples:
  npm run validate:pre-build
  npm run validate:pre-build -- --strict
  npm run validate:pre-build -- --threshold 80
  npm run validate:pre-build -- --skip-multilingual

Exit Codes:
  0 - All checks passed
  1 - Quality gates not met
  2 - Validation error
  `);
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runPreBuildValidation, type ValidationOptions, type QualityGates };
