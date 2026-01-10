# Schema.org Validation Tool - Quick Start Guide

## Installation

The tool is already installed and ready to use. Dependencies:
- ✅ `tsx` - TypeScript execution
- ✅ Type definitions from `types/geo.ts`

## Quick Commands

### Validate Everything
```bash
npm run validate-schema
```

### Validate One Article
```bash
npm run validate-schema -- --slug=web3-security-trends-2025
```

### Validate Chinese Articles Only
```bash
npm run validate-schema -- --locale=zh
```

### Strict Mode (for CI/CD)
```bash
npm run validate-schema -- --strict
```

### See All Details
```bash
npm run validate-schema -- --verbose
```

## What Gets Validated?

### ✅ Required Fields
- `headline` - Article title
- `description` - Article description
- `author` - Author with name and type
- `datePublished` - Publication date (ISO 8601)
- `dateModified` - Modification date (ISO 8601)

### ⚠️ Recommended Fields (Warnings)
- `@id` - Unique identifier
- `mainEntityOfPage` - Page reference
- `publisher` - Organization info
- `image` - Featured image

### 🎯 GEO Enhancement Fields (Warnings)
- `about` - Core concepts (DefinedTerm[])
- `teaches` - Knowledge points (string[])
- `mentions` - Technologies (Thing[])
- `mainEntity` - Q&A structure (Question[])
- `inLanguage` - Language code

## Understanding Output

### ✓ Green = Pass
All required fields present and valid.

### ✗ Red = Fail
Missing required fields or invalid data.

### ⚠ Yellow = Warning
Missing recommended fields (won't fail build).

## Common Issues & Fixes

### Issue: "Missing required field: datePublished"
**Fix:** Add date in ISO 8601 format:
```json
"datePublished": "2024-01-15T00:00:00Z"
```

### Issue: "Invalid datePublished format"
**Fix:** Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ):
```json
// ❌ Wrong
"datePublished": "01/15/2024"

// ✅ Correct
"datePublished": "2024-01-15T00:00:00Z"
```

### Issue: "author must have @type: 'Person'"
**Fix:** Add proper author structure:
```json
"author": {
  "@type": "Person",
  "name": "Seal Wax",
  "description": "Founder & Chief Architect"
}
```

### Issue: "Missing 'about' field"
**Fix:** Add core concepts:
```json
"about": [
  {
    "@type": "DefinedTerm",
    "name": "Web3 Security",
    "description": "Security practices for Web3 applications"
  }
]
```

## Integration Examples

### Pre-build Validation
Add to `package.json`:
```json
{
  "scripts": {
    "prebuild": "npm run validate-schema",
    "build": "next build"
  }
}
```

### GitHub Actions
```yaml
- name: Validate Schema.org
  run: npm run validate-schema -- --strict
```

### Pre-commit Hook
```bash
#!/bin/sh
npm run validate-schema -- --strict
```

## Exit Codes

- `0` = Success (all validations passed)
- `1` = Failure (one or more validations failed)

Use in scripts:
```bash
if npm run validate-schema -- --strict; then
  echo "✓ Schema validation passed"
else
  echo "✗ Schema validation failed"
  exit 1
fi
```

## Getting Help

```bash
npm run validate-schema -- --help
```

## Running Tests

```bash
npm test -- scripts/__tests__/validate-schema.test.ts
```

## More Information

See full documentation: `scripts/README-SCHEMA-VALIDATION.md`
