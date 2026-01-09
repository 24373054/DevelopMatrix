# GEO Optimization Test Suite

This directory contains the test suite for the GEO (Generative Engine Optimization) system.

## Structure

```
__tests__/
├── generators/          # Property-based test data generators
│   └── terminology.generator.ts
├── properties/          # Property-based tests
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

Located in `__tests__/generators/terminology.generator.ts`, these generators create:

- `terminologyEntryGenerator()`: Random terminology entries
- `terminologyDictionaryGenerator()`: Complete dictionaries with multiple entries
- `articleContentGenerator()`: Article content with terminology usage
- `contentWithDefinitionGenerator()`: Content with proper definition patterns
- `contentWithoutDefinitionGenerator()`: Content without definition patterns
- `consistentContentGenerator()`: Content using only canonical names
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

✅ All 16 tests passing
- 11 property-based tests
- 5 integration tests with real dictionary

Last updated: 2026-01-09
