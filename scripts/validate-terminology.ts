#!/usr/bin/env ts-node
/**
 * Terminology Dictionary Validation Script
 * 
 * Validates the terminology dictionary and displays statistics
 */

import { getTerminologyDictionary, getRawTerminologyData } from '../lib/geo/loadDictionary';

function main() {
  console.log('🔍 Validating Terminology Dictionary...\n');

  try {
    // Load the dictionary
    const dictionary = getTerminologyDictionary();
    const rawData = getRawTerminologyData();

    // Display metadata
    const metadata = dictionary.getMetadata();
    console.log('📊 Dictionary Metadata:');
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Last Updated: ${metadata.lastUpdated}`);
    console.log('');

    // Display statistics
    const allEntries = dictionary.getAllEntries();
    console.log('📈 Statistics:');
    console.log(`   Total Terms: ${allEntries.length}`);
    
    // Count by category
    const categories = ['web3', 'defi', 'security', 'blockchain', 'general'] as const;
    categories.forEach(category => {
      const count = dictionary.getTermsByCategory(category).length;
      if (count > 0) {
        console.log(`   ${category}: ${count} terms`);
      }
    });
    console.log('');

    // Display all terms
    console.log('📚 All Terms:');
    allEntries.forEach(entry => {
      console.log(`   • ${entry.canonicalName} (${entry.category})`);
      if (entry.aliases.length > 0) {
        console.log(`     Aliases: ${entry.aliases.join(', ')}`);
      }
    });
    console.log('');

    // Test some lookups
    console.log('🔎 Testing Lookups:');
    
    const testTerms = ['智能合约', 'Smart Contract', 'DeFi', '去中心化金融'];
    testTerms.forEach(term => {
      const found = dictionary.findTerm(term);
      const canonical = dictionary.getCanonicalName(term);
      const isAlias = dictionary.isAlias(term);
      
      console.log(`   "${term}":`);
      console.log(`     Found: ${found ? '✓' : '✗'}`);
      console.log(`     Canonical: ${canonical}`);
      console.log(`     Is Alias: ${isAlias ? 'Yes' : 'No'}`);
    });
    console.log('');

    // Test related terms
    console.log('🔗 Related Terms Example:');
    const smartContract = dictionary.findTerm('智能合约');
    if (smartContract) {
      const related = dictionary.getRelatedTerms('智能合约');
      console.log(`   智能合约 is related to:`);
      related.forEach(term => {
        console.log(`     • ${term.canonicalName}`);
      });
    }
    console.log('');

    console.log('✅ Validation Complete - Dictionary is valid!');
    
  } catch (error) {
    console.error('❌ Validation Failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
