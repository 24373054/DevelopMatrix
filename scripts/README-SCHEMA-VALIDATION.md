# Schema.org Validation Tool

## Overview

The Schema.org validation tool (`validate-schema.ts`) is a comprehensive validation utility for ensuring that blog articles have properly structured Schema.org JSON-LD data. This tool is essential for GEO (Generative Engine Optimization) as it validates both standard Schema.org requirements and GEO-specific enhancements.

## Features

### Core Validation Checks

1. **JSON-LD Format Validation**
   - Validates presence of `@context` and `@type` fields
   - Ensures `@type` is one of the valid types (`BlogPosting` or `Article`)
   - Checks for recommended fields like `@id` and `mainEntityOfPage`

2. **Required Fields Validation**
   - Validates all required Schema.org fields:
     - `headline`
     - `description`
     - `author` (with proper Person structure)
     - `datePublished`
     - `dateModified`
   - Checks for recommended fields like `publisher` and `image`

3. **Date Format Validation**
   - Ensures dates are in valid ISO 8601 format
   - Validates that dates are parseable
   - Warns if `dateModified` is before `datePublished`

4. **GEO Enhancement Validation**
   - Validates GEO-specific fields:
     - `about`: Core concepts as DefinedTerm array
     - `teaches`: Knowledge points taught in the article
     - `mentions`: Technologies, tools, and concepts mentioned
     - `mainEntity`: Q&A structure for common questions
     - `inLanguage`: Language metadata
   - Ensures proper Schema.org types for all nested objects

## Usage

### Basic Usage

Validate all articles:

```bash
npm run validate-schema
```

### Validate Specific Article

Validate a single article by slug:

```bash
npm run validate-schema -- --slug=web3-security-trends-2025
```

### Validate Specific Locale

Validate only Chinese or English articles:

```bash
npm run validate-schema -- --locale=zh
npm run validate-schema -- --locale=en
```

### Strict Mode

Treat warnings as errors (useful for CI/CD):

```bash
npm run validate-schema -- --strict
```

### Verbose Output

Show detailed output including warnings:

```bash
npm run validate-schema -- --verbose
```

### Combined Options

You can combine multiple options:

```bash
npm run validate-schema -- --slug=web3-security-trends-2025 --locale=zh --verbose
```

## Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--slug=<slug>` | Validate specific article by slug | `--slug=web3-security-trends-2025` |
| `--locale=<locale>` | Validate specific locale (zh or en) | `--locale=zh` |
| `--strict` | Treat warnings as errors | `--strict` |
| `--verbose`, `-v` | Show detailed output including warnings | `--verbose` |
| `--help`, `-h` | Show help message | `--help` |

## Validation Rules

### Required Fields

The following fields are **required** and will cause validation to fail if missing:

- `headline`: Article title
- `description`: Article description/excerpt
- `author`: Author information (must be a Person with name)
- `datePublished`: Publication date (ISO 8601 format)
- `dateModified`: Last modification date (ISO 8601 format)

### Recommended Fields (Warnings)

The following fields are **recommended** and will generate warnings if missing:

- `@id`: Unique identifier for the article
- `mainEntityOfPage`: Reference to the web page
- `publisher`: Publisher organization information
- `image`: Featured image for the article
- `author.description` or `author.jobTitle`: Author authority signals

### GEO Enhancement Fields (Warnings)

The following GEO-specific fields are **recommended** for optimal LLM understanding:

- `about`: Core concepts discussed (DefinedTerm array)
- `teaches`: Knowledge points taught (string array)
- `mentions`: Technologies/tools mentioned (Thing array)
- `mainEntity`: Q&A structure (Question array)
- `inLanguage`: Language code (e.g., "zh-CN", "en-US")

## Exit Codes

- `0`: All validations passed
- `1`: One or more validations failed

This makes the tool suitable for use in CI/CD pipelines.

## Integration with Build Process

To integrate validation into your build process, add it to `package.json`:

```json
{
  "scripts": {
    "prebuild": "npm run validate-schema",
    "build": "next build"
  }
}
```

Or use it in CI/CD:

```yaml
# .github/workflows/ci.yml
- name: Validate Schema.org Data
  run: npm run validate-schema -- --strict
```

## Example Output

### Successful Validation

```
================================================================================
Schema.org Validation Report
================================================================================

Total Articles: 4
✓ Valid: 4
✗ Invalid: 0
⚠ With Warnings: 0

================================================================================
✓ All articles passed validation!
================================================================================
```

### Failed Validation

```
================================================================================
Schema.org Validation Report
================================================================================

Total Articles: 4
✓ Valid: 2
✗ Invalid: 2
⚠ With Warnings: 1

================================================================================
Detailed Results
================================================================================

✗ web3-security-trends-2025 (zh)
  Errors:
    - Missing required field: datePublished
    - Invalid dateModified format (must be ISO 8601)

✓ smart-contract-audit-guide (zh)
  Warnings:
    - Missing "about" field - core concepts should be defined

================================================================================
✗ 2 article(s) failed validation
================================================================================
```

## Testing

The validation tool includes comprehensive unit tests. Run them with:

```bash
npm test -- scripts/__tests__/validate-schema.test.ts
```

Test coverage includes:
- JSON-LD format validation
- Required fields validation
- Date format validation
- GEO enhancement validation
- Strict mode behavior

## Implementation Details

### Validation Functions

The tool is organized into modular validation functions:

1. `validateJsonLdFormat()`: Validates basic JSON-LD structure
2. `validateRequiredFields()`: Validates required Schema.org fields
3. `validateDateFormats()`: Validates ISO 8601 date formats
4. `validateGeoEnhancements()`: Validates GEO-specific enhancements
5. `validateSchema()`: Comprehensive validation combining all checks

### Extensibility

To add new validation rules:

1. Create a new validation function following the pattern:
   ```typescript
   function validateNewRule(schema: EnhancedBlogPosting): ValidationResult {
     const errors: string[] = [];
     const warnings: string[] = [];
     
     // Your validation logic here
     
     return { valid: errors.length === 0, errors, warnings };
   }
   ```

2. Call it from `validateSchema()`:
   ```typescript
   const newResult = validateNewRule(jsonLd);
   allErrors.push(...newResult.errors);
   allWarnings.push(...(newResult.warnings || []));
   ```

3. Add tests in `scripts/__tests__/validate-schema.test.ts`

## Future Enhancements

Planned improvements:

1. **Automatic Article Discovery**: Scan the messages directory to find all articles
2. **Schema Generation Integration**: Generate actual schemas and validate them
3. **HTML Validation**: Validate that JSON-LD in rendered HTML matches expectations
4. **Performance Metrics**: Track validation performance over time
5. **Custom Rules**: Allow projects to define custom validation rules
6. **JSON Report Output**: Generate machine-readable validation reports

## Related Tools

- `lib/geo/schemaGenerator.ts`: Generates enhanced Schema.org data
- `scripts/validate-terminology.ts`: Validates terminology consistency
- `scripts/geo-check.ts`: Comprehensive GEO quality checks (planned)

## Support

For issues or questions about the validation tool:

1. Check the help message: `npm run validate-schema -- --help`
2. Review the test cases in `scripts/__tests__/validate-schema.test.ts`
3. Consult the GEO design document: `.kiro/specs/geo-optimization/design.md`

## References

- [Schema.org BlogPosting](https://schema.org/BlogPosting)
- [Schema.org Article](https://schema.org/Article)
- [JSON-LD Specification](https://json-ld.org/)
- [ISO 8601 Date Format](https://en.wikipedia.org/wiki/ISO_8601)
- [GEO Optimization Guide](../.kiro/specs/geo-optimization/design.md)
