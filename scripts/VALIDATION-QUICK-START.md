# GEO Validation Quick Start Guide

## TL;DR

```bash
# Run validation before building
npm run validate:pre-build

# Build with validation (automatic)
npm run build

# Build without validation (not recommended)
npm run build:skip-validation
```

## Common Commands

### Validation

```bash
# Pre-build validation (default mode)
npm run validate:pre-build

# Pre-build validation (strict mode)
npm run validate:pre-build:strict

# Run all validations separately
npm run validate:all

# Individual checks
npm run geo:check
npm run geo:check-multilingual-parity
npm run geo:validate-schema
```

### Detailed Reports

```bash
# Verbose console output
npm run geo:check -- --verbose
npm run geo:check-multilingual-parity -- --verbose

# JSON reports
npm run geo:check -- --json
npm run geo:check-multilingual-parity -- --json

# Markdown reports
npm run geo:check -- --markdown
npm run geo:check-multilingual-parity -- --markdown
```

## Quality Gates

### Default Mode (Production)

| Metric | Threshold |
|--------|-----------|
| AI Summary Coverage | ≥ 90% |
| Average Quality Score | ≥ 70/100 |
| Multilingual Parity Rate | ≥ 90% |
| Critical Issues | 0 |

### Strict Mode

| Metric | Threshold |
|--------|-----------|
| AI Summary Coverage | 100% |
| Average Quality Score | ≥ 80/100 |
| Multilingual Parity Rate | 100% |
| Critical Issues | 0 |

### Development Mode

| Metric | Threshold |
|--------|-----------|
| AI Summary Coverage | ≥ 50% |
| Average Quality Score | ≥ 60/100 |
| Multilingual Parity Rate | ≥ 50% |
| Critical Issues | ≤ 5 |

## Fixing Common Issues

### Issue: "AI Summary coverage below threshold"

**Fix**: Add AI Summary to articles

1. Identify missing articles:
   ```bash
   npm run geo:check -- --verbose
   ```

2. Add to `messages/zh.json` and `messages/en.json`:
   ```json
   {
     "blog": {
       "articles": {
         "your-article-id": {
           "aiSummary": {
             "whatIs": "Core definition of the concept",
             "whyImportant": "Why this matters",
             "useCases": [
               "Use case 1",
               "Use case 2"
             ],
             "keyTakeaways": [
               "Key point 1",
               "Key point 2"
             ]
           }
         }
       }
     }
   }
   ```

### Issue: "Multilingual parity rate below threshold"

**Fix**: Ensure Chinese and English versions match

1. Check differences:
   ```bash
   npm run geo:check-multilingual-parity -- --verbose
   ```

2. Add missing features to the language that's lacking them

### Issue: "Critical issues exceed threshold"

**Fix**: Address content quality issues

1. Identify issues:
   ```bash
   npm run geo:check -- --verbose
   ```

2. Common fixes:
   - Add definition sentences ("X 是指...")
   - Add conclusion sentences ("因此...")
   - Break long paragraphs (< 300 chars)
   - Remove vague terms ("可能", "也许")
   - Remove hyperbole ("颠覆", "革命性")

### Issue: "Average quality score below threshold"

**Fix**: Improve overall content quality

1. Review detailed metrics:
   ```bash
   npm run geo:check -- --verbose
   ```

2. Focus on:
   - Adding Q&A sections
   - Adding citations
   - Improving content structure
   - Using proper lists and tables

## Configuration

Edit `.geo-validation.json` to customize quality gates:

```json
{
  "qualityGates": {
    "default": {
      "aiSummaryCoverage": 90,
      "averageQualityScore": 70,
      "multilingualParityRate": 90,
      "maxCriticalIssues": 0
    }
  },
  "enabled": true,
  "mode": "default"
}
```

## CI/CD Integration

### Disable validation temporarily

```bash
# In CI/CD pipeline
npm run build:skip-validation
```

### Use development mode in CI

```bash
# Set environment variable
export GEO_VALIDATION_MODE=development
npm run build
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 1 | Quality gates not met |
| 2 | Validation error |

## Getting Help

```bash
# Show help for any command
npm run validate:pre-build -- --help
npm run geo:check -- --help
npm run geo:check-multilingual-parity -- --help
```

## Related Documentation

- [Full Build Validation Guide](./README-BUILD-VALIDATION.md)
- [GEO Check Tool](./README-GEO-CHECK.md)
- [Multilingual Parity Check](./README-MULTILINGUAL-PARITY.md)
- [Schema Validation](./README-SCHEMA-VALIDATION.md)
