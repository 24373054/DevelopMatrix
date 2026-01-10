#!/usr/bin/env tsx
/**
 * Language Metadata Validation Script
 * 
 * This script validates that all pages have correct language metadata:
 * 1. HTML lang attribute uses BCP 47 compliant codes (zh-CN, en-US)
 * 2. All structured data includes inLanguage field
 * 3. Language codes are consistent across the application
 * 
 * Requirements: 11.2
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ValidationIssue {
  file: string;
  line?: number;
  issue: string;
  severity: 'error' | 'warning';
}

const issues: ValidationIssue[] = [];

/**
 * BCP 47 compliant language codes
 */
const VALID_LANG_CODES = ['zh-CN', 'en-US'];
const DEPRECATED_LANG_CODES = ['zh', 'en'];

/**
 * Check if a file contains proper lang attribute
 */
function checkLangAttribute(filePath: string, content: string): void {
  // Check for lang attribute in HTML tag - handle both static and dynamic
  const langMatch = content.match(/<html[^>]+lang=["'\{]([^"'\}]+)["'\}]/);
  
  if (!langMatch) {
    issues.push({
      file: filePath,
      issue: 'Missing lang attribute in <html> tag',
      severity: 'error',
    });
    return;
  }

  const langCode = langMatch[1];
  
  // If it's a variable (like langCode), check if it's properly defined
  if (!langCode.includes('-') && !langCode.includes('locale')) {
    // Check if using deprecated short codes
    if (DEPRECATED_LANG_CODES.includes(langCode)) {
      issues.push({
        file: filePath,
        issue: `Using deprecated language code "${langCode}". Should use BCP 47 compliant code (zh-CN or en-US)`,
        severity: 'error',
      });
    }
  }
  
  // If using a variable, verify it's converted properly
  if (langCode === 'locale') {
    // Check if there's no conversion
    if (!content.includes('zh-CN') && !content.includes('en-US')) {
      issues.push({
        file: filePath,
        issue: 'Using locale directly in lang attribute without BCP 47 conversion',
        severity: 'error',
      });
    }
  }
}

/**
 * Check if structured data includes inLanguage field
 */
function checkInLanguageField(filePath: string, content: string): void {
  // Find all JSON-LD script blocks
  const jsonLdMatches = content.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g
  );

  for (const match of Array.from(jsonLdMatches)) {
    const jsonContent = match[1];
    
    try {
      // Check if it's a variable or inline JSON
      if (jsonContent.includes('dangerouslySetInnerHTML')) {
        // This is a React component, check the variable
        const varMatch = jsonContent.match(/JSON\.stringify\((\w+)\)/);
        if (varMatch) {
          const varName = varMatch[1];
          
          // Find the variable definition
          const varDefMatch = content.match(
            new RegExp(`const ${varName}\\s*=\\s*{([\\s\\S]*?)};`, 'm')
          );
          
          if (varDefMatch) {
            const varContent = varDefMatch[1];
            
            // Check if inLanguage is present
            if (!varContent.includes('inLanguage')) {
              issues.push({
                file: filePath,
                issue: `Structured data variable "${varName}" missing inLanguage field`,
                severity: 'warning',
              });
            } else {
              // Check if using correct language codes
              const inLanguageMatch = varContent.match(/inLanguage["']?\s*:\s*["']([^"']+)["']/);
              if (inLanguageMatch) {
                const langCode = inLanguageMatch[1];
                if (DEPRECATED_LANG_CODES.includes(langCode)) {
                  issues.push({
                    file: filePath,
                    issue: `Structured data "${varName}" uses deprecated language code "${langCode}"`,
                    severity: 'error',
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // Skip parsing errors
    }
  }
}

/**
 * Check if locale variables are properly converted to BCP 47
 */
function checkLocaleConversion(filePath: string, content: string): void {
  // Check for direct usage of locale in lang attribute without conversion
  const langLocalePattern = /lang=\{locale\}/g;
  const matches = Array.from(content.matchAll(langLocalePattern));
  
  for (const match of matches) {
    // Check if there's a conversion nearby
    const hasConversionNearby = content.includes('langCode') || 
                                content.includes('zh-CN') || 
                                content.includes('en-US');
    
    if (!hasConversionNearby) {
      issues.push({
        file: filePath,
        issue: 'Using locale directly in lang attribute without BCP 47 conversion',
        severity: 'error',
      });
    }
  }
}

/**
 * Main validation function
 */
async function validateLanguageMetadata(): Promise<void> {
  console.log('🔍 Validating language metadata...\n');

  // Find all TypeScript/TSX files in app directory
  const files = await glob('app/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/.next/**'],
  });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check layout files for lang attribute
    if (file.includes('layout.tsx')) {
      checkLangAttribute(file, content);
    }

    // Check all files with structured data
    if (content.includes('application/ld+json')) {
      checkInLanguageField(file, content);
    }

    // Check for proper locale conversion
    if (content.includes('locale')) {
      checkLocaleConversion(file, content);
    }
  }

  // Report results
  console.log('📊 Validation Results:\n');

  if (issues.length === 0) {
    console.log('✅ All language metadata is valid!\n');
    console.log('✓ All HTML lang attributes use BCP 47 compliant codes');
    console.log('✓ All structured data includes inLanguage field');
    console.log('✓ All language codes are consistent\n');
    return;
  }

  // Group issues by severity
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):\n`);
    errors.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}`);
      console.log(`   ${issue.issue}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Found ${warnings.length} warning(s):\n`);
    warnings.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}`);
      console.log(`   ${issue.issue}\n`);
    });
  }

  // Exit with error if there are errors
  if (errors.length > 0) {
    console.log('❌ Validation failed. Please fix the errors above.\n');
    process.exit(1);
  } else {
    console.log('✅ Validation passed with warnings.\n');
  }
}

// Run validation
validateLanguageMetadata().catch((error) => {
  console.error('Error during validation:', error);
  process.exit(1);
});
