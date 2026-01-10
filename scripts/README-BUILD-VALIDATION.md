# Build Validation System

This document describes the automated GEO quality validation system integrated into the build process.

## Overview

The build validation system ensures that all content meets GEO (Generative Engine Optimization) standards before the application is built. This prevents low-quality content from being deployed and maintains consistent quality across all articles.

## Quality Gates

The validation system enforces the following quality gates:

### Default Mode

- **AI Summary Coverage**: ≥ 90% of articles must have AI Summary
- **Average Quality Score**: ≥ 70/100 across all articles
- **Multilingual Parity Rate**: ≥ 90% of articles must have parity between languages
- **Critical Issues**: 0 critical issues allowed

### Strict Mode

- **AI Summary Coverage**: 100% of articles must have AI Summary
- **Average Quality Score**: ≥ 80/100 across all articles
- **Multilingual Parity Rate**: 100% of articles must have parity between languages
- **Critical Issues**: 0 critical issues allowed

## Usage

### Standard Build (with validation)

```bash
npm run build
```

This runs the pre-build validation before building. If validation fails, the build is aborted.

### Build without validation

```bash
npm run build:skip-validation
```

Use this only when you need to build despite validation failures (not recommended for production).

### Run validation only

```bash
# Default mode
npm run validate:pre-build

# Strict mode
npm run validate:pre-build:strict

# Custom threshold
npm run validate:pre-build -- --threshold 80

# Skip multilingual check
npm run validate:pre-build -- --skip-multilingual
```

### Run all validations separately

```bash
npm run validate:all
```

This runs all validation scripts individually:
- GEO quality check
- Multilingual parity check
- Schema.org validation

## Validation Components

### 1. GEO Quality Check

**Script**: `scripts/geo-check.ts`

**Command**: `npm run geo:check`

**Validates**:
- AI Summary presence and completeness
- Q&A coverage
- Citations and references
- Content structure (definitions, conclusions, lists)
- Paragraph length constraints
- Semantic certainty (avoiding vague terms)
- Verifiability (avoiding hyperbole)
- Terminology consistency

**Output**: Quality score (0-100) for each article

### 2. Multilingual Parity Check

**Script**: `scripts/check-multilingual-parity.ts`

**Command**: `npm run geo:check-multilingual-parity`

**Validates**:
- AI Summary parity between Chinese and English
- Q&A coverage parity
- Citations parity
- Content structure parity
- Knowledge block count similarity

**Output**: Parity rate (%) and list of issues

### 3. Schema.org Validation

**Script**: `scripts/validate-schema.ts`

**Command**: `npm run geo:validate-schema`

**Validates**:
- JSON-LD format correctness
- Required fields presence
- Type definitions
- Relationship markup

**Output**: Validation errors and warnings

## Exit Codes

The validation scripts use the following exit codes:

- **0**: All checks passed
- **1**: Quality gates not met (validation failed)
- **2**: Validation error (script error)

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run GEO validation
        run: npm run validate:pre-build
      
      - name: Build application
        run: npm run build:skip-validation
      
      - name: Deploy
        run: npm run deploy
```

### GitLab CI Example

```yaml
stages:
  - validate
  - build
  - deploy

validate:
  stage: validate
  script:
    - npm ci
    - npm run validate:pre-build
  only:
    - main

build:
  stage: build
  script:
    - npm ci
    - npm run build:skip-validation
  only:
    - main
  dependencies:
    - validate
```

## Customizing Quality Gates

You can customize quality gates by modifying `scripts/pre-build-validation.ts`:

```typescript
const DEFAULT_QUALITY_GATES: QualityGates = {
  aiSummaryCoverage: 90,        // Change this
  averageQualityScore: 70,      // Change this
  multilingualParityRate: 90,   // Change this
  maxCriticalIssues: 0,         // Change this
};
```

Or use command-line options:

```bash
# Set custom quality score threshold
npm run validate:pre-build -- --threshold 85

# Use strict mode
npm run validate:pre-build -- --strict
```

## Troubleshooting

### Validation fails with "AI Summary coverage below threshold"

**Solution**: Add AI Summary to articles that are missing it.

1. Run detailed check:
   ```bash
   npm run geo:check -- --verbose
   ```

2. Identify articles without AI Summary

3. Add AI Summary to `messages/zh.json` and `messages/en.json`:
   ```json
   {
     "blog": {
       "articles": {
         "article-id": {
           "aiSummary": {
             "whatIs": "...",
             "whyImportant": "...",
             "useCases": ["..."],
             "keyTakeaways": ["..."]
           }
         }
       }
     }
   }
   ```

### Validation fails with "Multilingual parity issues"

**Solution**: Ensure Chinese and English versions have equivalent GEO features.

1. Run detailed parity check:
   ```bash
   npm run geo:check-multilingual-parity -- --verbose
   ```

2. Identify missing features in either language

3. Add missing features to the appropriate locale file

### Validation fails with "Critical issues found"

**Solution**: Fix critical content quality issues.

1. Run detailed check:
   ```bash
   npm run geo:check -- --verbose
   ```

2. Review critical issues in the output

3. Fix issues in article content:
   - Add missing definitions
   - Add missing conclusions
   - Fix paragraph length
   - Remove vague terms
   - Remove hyperbolic language

### Need to build despite validation failures

**Not recommended for production**, but you can:

```bash
npm run build:skip-validation
```

## Best Practices

1. **Run validation locally before committing**
   ```bash
   npm run validate:pre-build
   ```

2. **Fix issues incrementally**
   - Start with critical issues
   - Then fix high-priority issues
   - Finally address medium/low priority issues

3. **Use verbose mode for debugging**
   ```bash
   npm run geo:check -- --verbose
   npm run geo:check-multilingual-parity -- --verbose
   ```

4. **Generate reports for review**
   ```bash
   npm run geo:check -- --json
   npm run geo:check -- --markdown
   ```

5. **Monitor quality trends**
   - Track average quality scores over time
   - Track AI Summary coverage
   - Track parity rate

## Reporting

### Console Output

Default output shows summary and pass/fail status:

```
🚀 Starting Pre-Build Validation...

📋 Quality Gates:
   ├─ AI Summary Coverage:      >= 90%
   ├─ Average Quality Score:    >= 70/100
   ├─ Multilingual Parity Rate: >= 90%
   └─ Max Critical Issues:      <= 0

📊 Step 1/2: Running GEO Quality Check...
   Results:
   ├─ AI Summary Coverage:   95.0%
   ├─ Average Quality Score: 78.5/100
   ├─ Critical Issues:       0
   └─ Total Articles:        4

   ✅ AI Summary coverage gate PASSED
   ✅ Average quality score gate PASSED
   ✅ Critical issues gate PASSED

🌍 Step 2/2: Running Multilingual Parity Check...
   Results:
   ├─ Parity Rate:        100.0%
   ├─ Total Issues:       0
   ├─ Critical Issues:    0
   └─ Total Articles:     4

   ✅ Multilingual parity gate PASSED
   ✅ Critical parity issues gate PASSED

✅ PRE-BUILD VALIDATION PASSED
All quality gates met. Build can proceed.
```

### JSON Reports

Generate JSON reports for programmatic analysis:

```bash
npm run geo:check -- --json
npm run geo:check-multilingual-parity -- --json
```

Reports are saved to:
- `geo-quality-report.json`
- `multilingual-parity-report.json`

### Markdown Reports

Generate Markdown reports for documentation:

```bash
npm run geo:check -- --markdown
npm run geo:check-multilingual-parity -- --markdown
```

Reports are saved to:
- `geo-quality-report.md`
- `multilingual-parity-report.md`

## Requirements Validated

This validation system validates all requirements from the GEO optimization specification:

- **Requirements 1.1-1.5**: Content extractability
- **Requirements 2.1-2.5**: Semantic certainty
- **Requirements 3.1-3.5**: Authority signals
- **Requirements 4.1-4.5**: Verifiability
- **Requirements 5.1-5.5**: LLM-friendly structure
- **Requirements 6.1-6.5**: AI Summary integration
- **Requirements 7.1-7.5**: Question coverage
- **Requirements 8.1-8.5**: Concept sovereignty
- **Requirements 10.1-10.5**: Structured metadata
- **Requirements 11.1-11.5**: Multilingual optimization

## Related Documentation

- [GEO Check Tool](./README-GEO-CHECK.md)
- [Multilingual Parity Check](./README-MULTILINGUAL-PARITY.md)
- [Schema Validation](./README-SCHEMA-VALIDATION.md)
- [GEO Optimization Spec](../.kiro/specs/geo-optimization/design.md)
