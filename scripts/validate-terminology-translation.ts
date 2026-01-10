#!/usr/bin/env tsx
/**
 * Terminology Translation Consistency Validator
 * 
 * This script validates that:
 * 1. All terminology entries have translation information
 * 2. Chinese and English definitions are semantically equivalent
 * 3. Terms are used consistently across language versions
 * 
 * Requirements: 11.3, 11.5
 */

import fs from 'fs';
import path from 'path';
import { TerminologyManager, loadTerminologyDictionary } from '../lib/geo/terminology';
import type { TerminologyDictionary } from '../types/geo';

// Load terminology dictionary
const dictionaryPath = path.join(process.cwd(), 'data/terminology.json');
const dictionaryData: TerminologyDictionary = JSON.parse(
  fs.readFileSync(dictionaryPath, 'utf-8')
);

const manager = loadTerminologyDictionary(dictionaryData);

// Load message files
const zhMessagesPath = path.join(process.cwd(), 'messages/zh.json');
const enMessagesPath = path.join(process.cwd(), 'messages/en.json');

const zhMessages = JSON.parse(fs.readFileSync(zhMessagesPath, 'utf-8'));
const enMessages = JSON.parse(fs.readFileSync(enMessagesPath, 'utf-8'));

console.log('🔍 Validating Terminology Translation Consistency\n');
console.log('='.repeat(60));

// Check 1: All entries have translation information
console.log('\n📋 Check 1: Translation Information Completeness');
console.log('-'.repeat(60));

let missingTranslations = 0;
const entries = manager.getAllEntries();

for (const entry of entries) {
  if (!entry.translation) {
    console.log(`❌ Missing translation: ${entry.canonicalName}`);
    missingTranslations++;
  } else {
    const hasEn = entry.translation.en && entry.translation.enDefinition;
    const hasZh = entry.translation.zh && entry.translation.zhDefinition;
    
    if (!hasEn || !hasZh) {
      console.log(`⚠️  Incomplete translation: ${entry.canonicalName}`);
      if (!hasEn) console.log(`   - Missing English translation`);
      if (!hasZh) console.log(`   - Missing Chinese translation`);
      missingTranslations++;
    }
  }
}

if (missingTranslations === 0) {
  console.log('✅ All entries have complete translation information');
} else {
  console.log(`\n❌ Found ${missingTranslations} entries with missing/incomplete translations`);
}

// Check 2: Bilingual term mapping table
console.log('\n📊 Check 2: Chinese-English Term Mapping Table');
console.log('-'.repeat(60));
console.log('\n| Chinese Term | English Term | Category |');
console.log('|--------------|--------------|----------|');

for (const entry of entries) {
  if (entry.translation) {
    const zh = entry.translation.zh || entry.canonicalName;
    const en = entry.translation.en || entry.canonicalName;
    console.log(`| ${zh} | ${en} | ${entry.category} |`);
  }
}

// Check 3: Term usage in blog articles
console.log('\n📝 Check 3: Term Usage in Blog Articles');
console.log('-'.repeat(60));

const blogArticles = zhMessages.blog?.articles || {};
const enBlogArticles = enMessages.blog?.articles || {};

let inconsistencies = 0;

for (const [slug, article] of Object.entries(blogArticles)) {
  const zhContent = (article as any).content || '';
  const enArticle = enBlogArticles[slug];
  const enContent = enArticle ? (enArticle as any).content || '' : '';

  if (!enContent) {
    console.log(`⚠️  Article ${slug}: No English version found`);
    continue;
  }

  // Validate translation consistency
  const issues = manager.validateTranslationConsistency(zhContent, enContent);
  
  // Filter out false positives: it's normal for Chinese content to use Chinese terms
  // and English content to use English terms
  const realIssues = issues.filter(issue => {
    // If the issue is about a term appearing in English but not Chinese,
    // check if the Chinese equivalent appears in Chinese content
    if (issue.canonicalDefinition.includes('appears in English')) {
      const entry = manager.getAllEntries().find(e => 
        e.translation?.en === issue.term
      );
      if (entry && entry.translation?.zh) {
        const zhTerm = entry.translation.zh;
        const zhPattern = new RegExp(`\\b${zhTerm}\\b`, 'g');
        // If Chinese term appears in Chinese content, this is not an issue
        if (zhPattern.test(zhContent)) {
          return false;
        }
      }
    }
    
    // If the issue is about a term appearing in Chinese but not English,
    // check if the English equivalent appears in English content
    if (issue.canonicalDefinition.includes('appears in Chinese')) {
      const entry = manager.getAllEntries().find(e => 
        e.translation?.zh === issue.term
      );
      if (entry && entry.translation?.en) {
        const enTerm = entry.translation.en;
        const enPattern = new RegExp(`\\b${enTerm}\\b`, 'gi');
        // If English term appears in English content, this is not an issue
        if (enPattern.test(enContent)) {
          return false;
        }
      }
    }
    
    return true;
  });
  
  if (realIssues.length > 0) {
    console.log(`\n⚠️  Article: ${slug}`);
    for (const issue of realIssues) {
      console.log(`   - ${issue.canonicalDefinition}`);
      console.log(`     ${issue.articleDefinition}`);
    }
    inconsistencies += realIssues.length;
  }
}

if (inconsistencies === 0) {
  console.log('✅ No translation inconsistencies found in blog articles');
} else {
  console.log(`\n⚠️  Found ${inconsistencies} potential translation inconsistencies`);
}

// Check 4: First mention format in Chinese articles
console.log('\n🔤 Check 4: English Term Preservation in Chinese Content');
console.log('-'.repeat(60));
console.log('Checking if Chinese articles include English terms on first mention...\n');

let properFormatCount = 0;
let improperFormatCount = 0;

for (const [slug, article] of Object.entries(blogArticles)) {
  const zhContent = (article as any).content || '';
  
  // Check for terms that should have English in parentheses
  for (const entry of entries) {
    if (!entry.translation) continue;
    
    const zhTerm = entry.translation.zh || entry.canonicalName;
    const enTerm = entry.translation.en || entry.canonicalName;
    
    // Skip if terms are the same (like "Web3", "DeFi")
    if (zhTerm === enTerm) continue;
    
    // Check if Chinese term appears
    const zhPattern = new RegExp(`\\b${zhTerm}\\b`, 'g');
    if (zhPattern.test(zhContent)) {
      // Check if it's formatted with English in parentheses
      const formattedPattern = new RegExp(
        `${zhTerm}[（(]${enTerm}[）)]`,
        'g'
      );
      
      if (formattedPattern.test(zhContent)) {
        properFormatCount++;
      } else {
        console.log(`⚠️  Article ${slug}: "${zhTerm}" should include English "(${enTerm})"`);
        improperFormatCount++;
      }
    }
  }
}

console.log(`\n✅ Properly formatted: ${properFormatCount} instances`);
if (improperFormatCount > 0) {
  console.log(`⚠️  Missing English terms: ${improperFormatCount} instances`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Total terminology entries: ${entries.length}`);
console.log(`Entries with complete translations: ${entries.length - missingTranslations}`);
console.log(`Translation inconsistencies: ${inconsistencies}`);
console.log(`Properly formatted terms: ${properFormatCount}`);
console.log(`Terms missing English: ${improperFormatCount}`);

const totalIssues = missingTranslations + inconsistencies + improperFormatCount;

if (totalIssues === 0) {
  console.log('\n✅ All terminology translation checks passed!');
  process.exit(0);
} else {
  console.log(`\n⚠️  Found ${totalIssues} issues that need attention`);
  process.exit(1);
}
