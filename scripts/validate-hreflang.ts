/**
 * Hreflang Validation Script
 * 
 * Validates that all pages have proper hreflang alternates including:
 * - Canonical URL
 * - Language alternates (zh-CN, en-US)
 * - x-default tag
 * - Correct URL format
 */

import { generateHreflangAlternates, validateHreflangUrl, validateHreflangCode } from '../lib/geo/hreflang';

interface ValidationResult {
  page: string;
  passed: boolean;
  issues: string[];
}

const pages = [
  { path: '', name: 'Home' },
  { path: 'blog', name: 'Blog List' },
  { path: 'blog/web3-security-trends-2025', name: 'Blog Article (example)' },
  { path: 'products/exchange', name: 'Exchange Product' },
  { path: 'products/game', name: 'Game Product' },
  { path: 'products/trace', name: 'Trace Product' },
  { path: 'developers', name: 'Developers' },
  { path: 'privacy', name: 'Privacy Policy' },
  { path: 'terms', name: 'Terms of Service' },
  { path: 'contact', name: 'Contact' },
];

function validatePage(path: string, name: string): ValidationResult {
  const issues: string[] = [];
  
  // Generate hreflang alternates
  const alternates = generateHreflangAlternates({ path });
  
  // Check if x-default exists
  if (!alternates['x-default']) {
    issues.push('Missing x-default hreflang tag');
  }
  
  // Check if both language versions exist
  if (!alternates['zh-CN']) {
    issues.push('Missing zh-CN hreflang tag');
  }
  
  if (!alternates['en-US']) {
    issues.push('Missing en-US hreflang tag');
  }
  
  // Validate all URLs
  Object.entries(alternates).forEach(([langCode, url]) => {
    // Validate language code
    if (!validateHreflangCode(langCode)) {
      issues.push(`Invalid language code: ${langCode}`);
    }
    
    // Validate URL format
    if (!validateHreflangUrl(url)) {
      issues.push(`Invalid URL format for ${langCode}: ${url}`);
    }
    
    // Check URL structure
    if (!url.startsWith('https://develop.matrixlab.work/')) {
      issues.push(`URL doesn't start with base URL: ${url}`);
    }
  });
  
  // Check that Chinese and English URLs are different (unless it's the home page)
  if (path !== '' && alternates['zh-CN'] === alternates['en-US']) {
    issues.push('Chinese and English URLs are identical');
  }
  
  return {
    page: name,
    passed: issues.length === 0,
    issues,
  };
}

function runValidation() {
  console.log('🔍 Validating hreflang implementation...\n');
  
  const results: ValidationResult[] = [];
  let totalPassed = 0;
  let totalFailed = 0;
  
  pages.forEach(({ path, name }) => {
    const result = validatePage(path, name);
    results.push(result);
    
    if (result.passed) {
      totalPassed++;
      console.log(`✅ ${name}`);
    } else {
      totalFailed++;
      console.log(`❌ ${name}`);
      result.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total pages: ${pages.length}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Success rate: ${((totalPassed / pages.length) * 100).toFixed(1)}%`);
  
  if (totalFailed > 0) {
    console.log('\n⚠️  Some pages have hreflang issues. Please review and fix.');
    process.exit(1);
  } else {
    console.log('\n✨ All pages have proper hreflang implementation!');
    process.exit(0);
  }
}

// Run validation
runValidation();
