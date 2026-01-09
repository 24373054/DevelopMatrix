# GEO Optimization Test Suite

This directory contains the test suite for the GEO (Generative Engine Optimization) system.

## Structure

```
__tests__/
├── generators/          # Property-based test data generators
│   ├── aiSummary.generator.ts
│   ├── contentValidator.generator.ts
│   ├── knowledgeBlock.generator.ts
│   └── terminology.generator.ts
├── properties/          # Property-based tests
│   ├── aiSummary.test.ts
│   ├── contentValidator.test.ts
│   ├── knowledgeBlock.test.ts
│   └── terminology.test.ts
└── README.md           # This file
```

## Running Tests

```bash
# Run all tests
npm test

# Run only property-based tests
npm run test:properties

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Property-Based Tests

Property-based tests use the `fast-check` library to verify universal properties that should hold across all valid inputs. Each test runs 100 iterations with randomly generated data.

### AI Summary Tests

Located in `__tests__/properties/aiSummary.test.ts`, these tests validate:

#### Property 18: AI Summary component presence
- Validates that articles have AI Summary present
- Ensures complete AI Summary structure
- Tests graceful degradation when AI Summary is missing
- **Validates Requirements: 6.1**

#### Property 19: AI Summary whatIs field
- Ensures whatIs field is present and non-empty
- Validates whatIs is a string with meaningful length (≥20 characters)
- Detects missing whatIs fields
- **Validates Requirements: 6.2**

#### Property 20: AI Summary whyImportant field
- Ensures whyImportant field is present and non-empty
- Validates whyImportant is a string with meaningful length (≥20 characters)
- Detects missing whyImportant fields
- **Validates Requirements: 6.3**

#### Property 21: AI Summary useCases field
- Ensures useCases is a non-empty array
- Validates all use cases are non-empty strings
- Checks for reasonable number of use cases (1-5)
- **Validates Requirements: 6.4**

#### Property 22: AI Summary structured format
- Validates useCases and keyTakeaways are arrays (not strings)
- Detects invalid format (string instead of array)
- Ensures all array items are non-empty strings
- **Validates Requirements: 6.5**

### Content Validator Tests

Located in `__tests__/properties/contentValidator.test.ts`, these tests validate:

#### Property 4: Paragraph length constraint
- Detects paragraphs exceeding 300 characters
- Validates paragraphs within limit are not flagged
- **Validates Requirements: 1.4**

#### Property 5: Declarative sentence usage
- Detects Chinese and English rhetorical questions
- Validates declarative sentences are not flagged
- Excludes Q&A sections from checks
- **Validates Requirements: 2.1**

#### Property 6: Vague term avoidance
- Detects vague terms in Chinese and English
- Validates definitive language is not flagged
- **Validates Requirements: 2.2**

#### Property 11: Hyperbole avoidance
- Detects hyperbolic marketing terms
- Validates measured, factual language is not flagged
- **Validates Requirements: 4.2**

### Knowledge Block Tests

Located in `__tests__/properties/knowledgeBlock.test.ts`, these tests validate:

#### Property 1: Definition sentence presence
- Recognizes valid definition patterns
- Validates definition extraction
- **Validates Requirements: 1.1**

#### Property 2: Conclusion marker presence
- Detects conclusion markers in content
- Validates conclusion identification
- **Validates Requirements: 1.2**

#### Property 3: List structure formatting
- Validates proper HTML list structures
- Ensures lists use `<ul>` or `<ol>` tags
- **Validates Requirements: 1.3**

#### Property 17: Knowledge block decomposition
- Validates content can be parsed into knowledge blocks
- Ensures blocks are independently extractable
- **Validates Requirements: 5.5**

### Terminology Dictionary Tests

Located in `__tests__/properties/terminology.test.ts`, these tests validate:

#### Property 28: First-mention definition
- Validates that content contains proper definition patterns
- Ensures first mentions include explicit definitions
- **Validates Requirements: 8.1**

#### Property 29: Terminology consistency
- Detects alias usage in content
- Ensures canonical names are used consistently
- Verifies aliases are correctly identified
- **Validates Requirements: 8.2, 8.5**

#### Property 30: Definition sentence format
- Recognizes valid definition sentence formats (Chinese and English)
- Rejects invalid definition formats
- Ensures definitions can be extracted from content
- **Validates Requirements: 8.3**

### Test Generators

Located in `__tests__/generators/`, these generators create:

**AI Summary Generators** (`aiSummary.generator.ts`):
- `aiSummaryGenerator()`: Complete, valid AI Summary
- `aiSummaryWithoutWhatIsGenerator()`: AI Summary missing whatIs field
- `aiSummaryWithoutWhyImportantGenerator()`: AI Summary missing whyImportant field
- `aiSummaryWithoutUseCasesGenerator()`: AI Summary with empty useCases
- `aiSummaryWithInvalidUseCasesGenerator()`: AI Summary with string instead of array
- `minimalAISummaryGenerator()`: Minimal valid AI Summary
- `comprehensiveAISummaryGenerator()`: Rich AI Summary with extensive content
- `articleWithAISummaryGenerator()`: Article with complete AI Summary
- `articleWithoutAISummaryGenerator()`: Article without AI Summary
- `mixedAISummaryContentGenerator()`: Mixed content with various AI Summary states

**Content Validator Generators** (`contentValidator.generator.ts`):
- `longParagraphGenerator()`: Paragraphs exceeding 300 characters
- `shortParagraphGenerator()`: Paragraphs within 300 character limit
- `chineseRhetoricalQuestionGenerator()`: Chinese rhetorical questions
- `englishRhetoricalQuestionGenerator()`: English rhetorical questions
- `declarativeSentenceGenerator()`: Declarative sentences
- `chineseVagueTermGenerator()`: Content with Chinese vague terms
- `englishVagueTermGenerator()`: Content with English vague terms
- `definitiveLanguageGenerator()`: Content with definitive language
- `chineseHyperboleGenerator()`: Content with Chinese hyperbolic terms
- `englishHyperboleGenerator()`: Content with English hyperbolic terms
- `measuredLanguageGenerator()`: Content with measured language
- `qaContentGenerator()`: Q&A section content
- `mixedQualityContentGenerator()`: Mixed quality content
- `highQualityContentGenerator()`: High-quality content

**Knowledge Block Generators** (`knowledgeBlock.generator.ts`):
- `knowledgeBlockGenerator()`: Random knowledge blocks
- `contentWithDefinitionGenerator()`: Content with definition patterns
- `contentWithConclusionGenerator()`: Content with conclusion markers
- `contentWithListsGenerator()`: Content with proper list structures

**Terminology Generators** (`terminology.generator.ts`):
- `terminologyEntryGenerator()`: Random terminology entries
- `terminologyDictionaryGenerator()`: Complete dictionaries
- `articleContentGenerator()`: Article content with terminology
- `contentWithDefinitionGenerator()`: Content with proper definitions
- `consistentContentGenerator()`: Content using canonical names
- `inconsistentContentGenerator()`: Content using aliases

## Test Configuration

Jest configuration is in `jest.config.js`:
- Uses `ts-jest` preset for TypeScript support
- Test environment: Node.js
- Module path mapping: `@/*` → `<rootDir>/*`
- Coverage threshold: 80% for all metrics

## Integration Tests

Integration tests verify the terminology system works correctly with the real dictionary data from `data/terminology.json`.

## Adding New Tests

When adding new property-based tests:

1. Create generators in `__tests__/generators/`
2. Write property tests in `__tests__/properties/`
3. Use the format: `// Feature: geo-optimization, Property N: [description]`
4. Run at least 100 iterations: `{ numRuns: 100 }`
5. Reference the design document property number
6. Validate specific requirements

## Test Status

✅ All 115 tests passing
- 40 AI Summary property-based tests
- 50 Content Validator property-based tests  
- 16 Knowledge Block property-based tests
- 9 Terminology property-based tests

Last updated: 2026-01-09
