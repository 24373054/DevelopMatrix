# GEO Library

This directory contains the implementation of the Generative Engine Optimization (GEO) system for the Ke Entropy Technology website.

## Terminology Dictionary System

The terminology dictionary ensures consistent use of technical terms across all content, which is crucial for GEO optimization.

### Features

- **Term Lookup**: Find terms by canonical name or aliases
- **Consistency Validation**: Check if content uses canonical names
- **Conflict Detection**: Identify when definitions don't match the dictionary
- **Category Filtering**: Get terms by category (web3, defi, security, blockchain)
- **Related Terms**: Find related concepts for any term

### Usage

#### Basic Usage

```typescript
import { getTerminologyDictionary } from '@/lib/geo/loadDictionary';

// Load the dictionary
const dictionary = getTerminologyDictionary();

// Find a term
const term = dictionary.findTerm('智能合约');
console.log(term?.definition);
// Output: "部署在区块链上的自动执行程序，当预设条件满足时自动执行合约条款"

// Get canonical name (useful for normalizing aliases)
const canonical = dictionary.getCanonicalName('Smart Contract');
console.log(canonical);
// Output: "智能合约"

// Check if a term is an alias
const isAlias = dictionary.isAlias('去中心化金融');
console.log(isAlias);
// Output: true (it's an alias for "DeFi")
```

#### Validate Content Consistency

```typescript
import { getTerminologyDictionary } from '@/lib/geo/loadDictionary';

const dictionary = getTerminologyDictionary();
const content = "在Web 3.0中，智能合约是核心技术...";

// Check for terminology consistency issues
const conflicts = dictionary.validateTerminologyConsistency(content);

if (conflicts.length > 0) {
  console.log('Found terminology issues:');
  conflicts.forEach(conflict => {
    console.log(`- Using "${conflict.term}" instead of canonical name`);
  });
}
```

#### Get Terms by Category

```typescript
import { getTerminologyDictionary } from '@/lib/geo/loadDictionary';

const dictionary = getTerminologyDictionary();

// Get all DeFi-related terms
const defiTerms = dictionary.getTermsByCategory('defi');
console.log(defiTerms.map(t => t.canonicalName));
// Output: ["DeFi", "流动性池", "套利", "良性套利", ...]

// Get all security-related terms
const securityTerms = dictionary.getTermsByCategory('security');
console.log(securityTerms.map(t => t.canonicalName));
// Output: ["智能合约审计", "重入攻击", "私钥", "公钥", "风险管理"]
```

#### Find Related Terms

```typescript
import { getTerminologyDictionary } from '@/lib/geo/loadDictionary';

const dictionary = getTerminologyDictionary();

// Find terms related to "智能合约"
const relatedTerms = dictionary.getRelatedTerms('智能合约');
console.log(relatedTerms.map(t => t.canonicalName));
// Output: ["区块链", "DeFi", "Solidity"]
```

#### Extract Terms from Content

```typescript
import { getTerminologyDictionary } from '@/lib/geo/loadDictionary';

const dictionary = getTerminologyDictionary();
const articleContent = `
  智能合约是区块链上的自动执行程序。
  在DeFi应用中，智能合约审计至关重要。
`;

// Extract all dictionary terms found in the content
const foundTerms = dictionary.extractTermsFromContent(articleContent);
console.log(foundTerms.map(t => t.canonicalName));
// Output: ["智能合约", "区块链", "DeFi", "智能合约审计"]
```

### Dictionary Structure

The terminology dictionary is stored in `data/terminology.json` with the following structure:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-09T00:00:00Z",
  "entries": [
    {
      "term": "智能合约",
      "canonicalName": "智能合约",
      "aliases": ["Smart Contract", "自动执行合约"],
      "definition": "部署在区块链上的自动执行程序...",
      "context": "在以太坊和其他区块链平台上",
      "relatedTerms": ["区块链", "DeFi", "Solidity"],
      "firstDefinedIn": "/blog/smart-contract-audit-guide",
      "category": "blockchain"
    }
  ]
}
```

### Adding New Terms

To add new terms to the dictionary:

1. Edit `data/terminology.json`
2. Add a new entry with all required fields:
   - `term`: The term itself
   - `canonicalName`: The standard name to use
   - `aliases`: Alternative names (to be avoided)
   - `definition`: Clear, authoritative definition
   - `context`: Where this term is used
   - `relatedTerms`: Related concepts
   - `firstDefinedIn`: URL where first defined
   - `category`: One of: web3, defi, security, blockchain, general

3. Update the `version` and `lastUpdated` fields

### Best Practices

1. **Always use canonical names** in content - avoid aliases
2. **Define terms on first use** using the format: "在本文中，XXX 指的是..."
3. **Keep definitions consistent** across all content
4. **Add context** to help LLMs understand when to use each term
5. **Link related terms** to help build concept networks

### Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 8.1**: First-mention definition support
- **Requirement 8.2**: Terminology consistency across content
- **Requirement 8.3**: Explicit definition sentence format
- **Requirement 8.5**: Avoiding synonym confusion

### Future Enhancements

Planned enhancements for the terminology system:

- Automatic term extraction from new articles
- Suggestion system for related terms
- Multi-language term mapping (Chinese ↔ English)
- Integration with content authoring tools
- Real-time validation in content editor
