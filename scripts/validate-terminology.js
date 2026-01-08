#!/usr/bin/env node
/**
 * Terminology Dictionary Validation Script
 * 
 * Validates the terminology dictionary and displays statistics
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('🔍 Validating Terminology Dictionary...\n');

  try {
    // Load the dictionary
    const dictionaryPath = path.join(__dirname, '../data/terminology.json');
    const rawData = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));

    // Validate structure
    const errors = [];
    
    if (!rawData.version) {
      errors.push('Missing required field: version');
    }
    
    if (!rawData.lastUpdated) {
      errors.push('Missing required field: lastUpdated');
    }
    
    if (!Array.isArray(rawData.entries)) {
      errors.push('Missing or invalid field: entries (must be an array)');
    } else {
      // Validate each entry
      rawData.entries.forEach((entry, index) => {
        if (!entry.term) {
          errors.push(`Entry ${index}: Missing required field: term`);
        }
        if (!entry.canonicalName) {
          errors.push(`Entry ${index}: Missing required field: canonicalName`);
        }
        if (!entry.definition) {
          errors.push(`Entry ${index}: Missing required field: definition`);
        }
        if (!Array.isArray(entry.aliases)) {
          errors.push(`Entry ${index}: Field 'aliases' must be an array`);
        }
        if (!Array.isArray(entry.relatedTerms)) {
          errors.push(`Entry ${index}: Field 'relatedTerms' must be an array`);
        }
        if (!entry.category) {
          errors.push(`Entry ${index}: Missing required field: category`);
        }
      });
    }

    if (errors.length > 0) {
      console.error('❌ Validation Failed:');
      errors.forEach(error => console.error(`   • ${error}`));
      process.exit(1);
    }

    // Display metadata
    console.log('📊 Dictionary Metadata:');
    console.log(`   Version: ${rawData.version}`);
    console.log(`   Last Updated: ${rawData.lastUpdated}`);
    console.log('');

    // Display statistics
    console.log('📈 Statistics:');
    console.log(`   Total Terms: ${rawData.entries.length}`);
    
    // Count by category
    const categoryCounts = {};
    rawData.entries.forEach(entry => {
      categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    });
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} terms`);
    });
    console.log('');

    // Display all terms
    console.log('📚 All Terms:');
    rawData.entries.forEach(entry => {
      console.log(`   • ${entry.canonicalName} (${entry.category})`);
      if (entry.aliases.length > 0) {
        console.log(`     Aliases: ${entry.aliases.join(', ')}`);
      }
    });
    console.log('');

    // Test lookups
    console.log('🔎 Testing Lookups:');
    
    const testTerms = ['智能合约', 'Smart Contract', 'DeFi', '去中心化金融'];
    testTerms.forEach(term => {
      const found = rawData.entries.find(entry => {
        const normalizedTerm = term.toLowerCase().trim();
        return entry.canonicalName.toLowerCase() === normalizedTerm ||
               entry.term.toLowerCase() === normalizedTerm ||
               entry.aliases.some(alias => alias.toLowerCase() === normalizedTerm);
      });
      
      const isAlias = found && found.aliases.some(
        alias => alias.toLowerCase() === term.toLowerCase().trim()
      );
      
      console.log(`   "${term}":`);
      console.log(`     Found: ${found ? '✓' : '✗'}`);
      console.log(`     Canonical: ${found ? found.canonicalName : 'N/A'}`);
      console.log(`     Is Alias: ${isAlias ? 'Yes' : 'No'}`);
    });
    console.log('');

    // Test related terms
    console.log('🔗 Related Terms Example:');
    const smartContract = rawData.entries.find(e => e.canonicalName === '智能合约');
    if (smartContract) {
      console.log(`   智能合约 is related to:`);
      smartContract.relatedTerms.forEach(relatedTerm => {
        const related = rawData.entries.find(e => e.canonicalName === relatedTerm);
        if (related) {
          console.log(`     • ${related.canonicalName}`);
        }
      });
    }
    console.log('');

    console.log('✅ Validation Complete - Dictionary is valid!');
    console.log(`\n📝 Summary: ${rawData.entries.length} terms validated successfully`);
    
  } catch (error) {
    console.error('❌ Validation Failed:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
