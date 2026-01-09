# GEO Library

This library provides tools for Generative Engine Optimization (GEO) - optimizing content for Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity.

## Components

### Knowledge Block Parser

The Knowledge Block Parser analyzes HTML content and extracts structured knowledge blocks that are optimized for LLM consumption.

#### Features

- **Definition Extraction**: Identifies clear definition sentences using patterns like "X 是指", "X 指的是", "X is defined as"
- **Conclusion Extraction**: Finds conclusion markers like "因此", "结论是", "therefore", "in conclusion"
- **Comparison Extraction**: Detects tables and comparison keywords
- **Example Extraction**: Identifies code blocks and example markers
- **Explanation Extraction**: Captures explanatory paragraphs
- **Extractability Scoring**: Calculates how easily an LLM can extract and use each block (0-1 scale)

#### Usage

```typescript
import { KnowledgeBlockParser, parseKnowledgeBlocks } from '@/lib/geo';

// Using the class
const parser = new KnowledgeBlockParser();
const blocks = parser.parse(htmlContent);

// Using the convenience function
const blocks = parseKnowledgeBlocks(htmlContent);

// Analyze the results
blocks.forEach(block => {
  console.log(`Type: ${block.type}`);
  console.log(`Title: ${block.title}`);
  console.log(`Extractability: ${block.extractability}`);
});
```

#### Example

```typescript
const htmlContent = `
  <div>
    <p>智能合约是指运行在区块链上的自动执行程序。</p>
    <p>智能合约可以自动执行预定义的规则和条件。</p>
    <ul>
      <li>自动执行</li>
      <li>去中心化</li>
    </ul>
    <p>因此，智能合约是Web3技术的核心组件。</p>
  </div>
`;

const blocks = parseKnowledgeBlocks(htmlContent);

// Results:
// - 1 definition block: "智能合约是指..."
// - 1 explanation block: "智能合约可以自动执行..."
// - 1 conclusion block: "因此，智能合约是..."
```

### Terminology Manager

The Terminology Manager ensures consistent use of technical terms across all content.

#### Features

- **Term Lookup**: Find canonical names for terms and their aliases
- **Consistency Validation**: Check if content uses canonical names
- **Definition Conflict Detection**: Identify conflicting definitions
- **Category Filtering**: Get terms by category (web3, defi, security, blockchain)
- **Related Terms**: Find related concepts

#### Usage

```typescript
import { loadTerminologyDictionary } from '@/lib/geo';
import terminologyData from '@/data/terminology.json';

const manager = loadTerminologyDictionary(terminologyData);

// Find a term
const term = manager.findTerm('智能合约');
console.log(term.canonicalName); // "Smart Contract"
console.log(term.definition);

// Get canonical name
const canonical = manager.getCanonicalName('smart contract');

// Check if using an alias
const isAlias = manager.isAlias('SC'); // true if 'SC' is an alias

// Validate content
const conflicts = manager.validateTerminologyConsistency(content);
if (conflicts.length > 0) {
  console.log('Found terminology issues:', conflicts);
}

// Get related terms
const related = manager.getRelatedTerms('智能合约');
```

## Requirements Mapping

This implementation addresses the following requirements from the GEO optimization spec:

- **Requirement 1.1**: Definition sentence structures - Extracted by `extractDefinitions()`
- **Requirement 1.2**: Conclusion sentences - Extracted by `extractConclusions()`
- **Requirement 1.3**: Enumeration structures - Detected in extractability scoring
- **Requirement 5.5**: Knowledge block decomposition - Core functionality of the parser
- **Requirement 8.1-8.5**: Terminology consistency - Managed by TerminologyManager

## Testing

Run the test suite:

```bash
npm test -- lib/geo/__tests__/
```

## Future Enhancements

- AI Summary generation
- Q&A pair extraction
- Schema.org structured data generation
- Content quality validation
- Multilingual parity checking
