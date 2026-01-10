# GEO Quality Check Tool

Comprehensive quality checker for GEO (Generative Engine Optimization) content. This tool validates all articles against GEO requirements and generates detailed quality reports.

## Overview

The GEO Check tool analyzes blog articles to ensure they meet the standards for optimal consumption by Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity. It validates content structure, semantic certainty, terminology consistency, and more.

## Features

### Content Quality Validation

- **AI Summary Presence**: Checks if articles have structured AI summaries
- **Q&A Coverage**: Validates question coverage (definition, comparison, application, limitation)
- **Citations**: Ensures articles have proper references and citations
- **Content Structure**: Validates definitions, conclusions, and list structures
- **Paragraph Length**: Checks that paragraphs don't exceed 300 characters
- **Semantic Certainty**: Detects vague terms (可能, 也许, maybe, perhaps)
- **Verifiability**: Identifies hyperbolic language (颠覆, 革命性, revolutionary)

### Terminology Consistency

- **Canonical Name Usage**: Ensures consistent use of canonical terminology
- **Alias Detection**: Identifies use of aliases instead of canonical names
- **Cross-Language Consistency**: Validates terminology across Chinese and English versions

### Reporting

- **Console Output**: Formatted, color-coded console reports
- **JSON Export**: Machine-readable JSON reports for CI/CD integration
- **Markdown Export**: Human-readable Markdown reports for documentation

## Installation

The tool is already integrated into the project. No additional installation required.

## Usage

### Basic Usage

Check all articles in all languages:

```bash
npm run geo:check
```

### Check Specific Locale

Check only Chinese articles:

```bash
npm run geo:check -- --locale zh
```

Check only English articles:

```bash
npm run geo:check -- --locale en
```

### Check Specific Article

Check a single article by ID:

```bash
npm run geo:check -- --article web3-security-trends-2025
```

### Verbose Output

Show detailed issues and recommendations:

```bash
npm run geo:check -- --verbose
```

Or use the short form:

```bash
npm run geo:check -- -v
```

### Export Reports

Export as JSON:

```bash
npm run geo:check -- --json
```

Export as Markdown:

```bash
npm run geo:check -- --markdown
```

Or use the short form:

```bash
npm run geo:check -- --md
```

### Combined Options

You can combine multiple options:

```bash
npm run geo:check -- --locale zh --verbose --json
npm run geo:check -- --article defi-risk-management --verbose --markdown
```

## Output Format

### Console Report

The console report includes:

1. **Summary Section**
   - Total articles checked
   - Average quality score
   - Pass rate percentage
   - Terminology statistics
   - Generation timestamp

2. **Article Details**
   - Pass/Fail status
   - Quality score (0-100)
   - Metrics checklist
   - Issues found (in verbose mode)
   - Terminology conflicts

3. **Recommendations**
   - Actionable suggestions for improvement
   - Prioritized by impact

### JSON Report

Saved to `geo-quality-report.json` in the project root. Contains:

```json
{
  "summary": {
    "totalArticles": 4,
    "averageScore": 90.3,
    "passRate": 100,
    "timestamp": "2026-01-10T04:32:21.038Z"
  },
  "articles": [...],
  "terminology": {
    "totalTerms": 20,
    "conflictsFound": 0,
    "conflicts": []
  },
  "recommendations": [...]
}
```

### Markdown Report

Saved to `geo-quality-report.md` in the project root. Includes:

- Summary statistics
- Detailed article breakdowns
- Issues and recommendations
- Easy to read and share

## Quality Metrics

### Scoring System

Articles are scored from 0-100 based on:

- **Missing Features** (deductions):
  - No AI Summary: -15 points
  - No Q&A Coverage: -10 points
  - No Definitions: -10 points
  - No Conclusions: -5 points
  - No Proper Lists: -5 points

- **Issues** (deductions):
  - Each error: -5 points
  - Each warning: -2 points

### Pass Threshold

Articles must meet these criteria to pass:

- Quality score ≥ 70
- No terminology conflicts

## Requirements Validated

The tool validates all GEO optimization requirements:

### Requirement 1: Content Extractability
- ✅ Definition sentences (1.1)
- ✅ Conclusion markers (1.2)
- ✅ List structures (1.3)
- ✅ Paragraph length (1.4)

### Requirement 2: Semantic Certainty
- ✅ Declarative sentences (2.1)
- ✅ Avoids vague terms (2.2)

### Requirement 3: Authority Signals
- ✅ Author information (3.1)

### Requirement 4: Verifiability
- ✅ Avoids hyperbole (4.2)
- ✅ Citations present (4.3)

### Requirement 5: LLM-Friendly Structure
- ✅ Q&A format (5.1)

### Requirement 6: AI Summary
- ✅ AI Summary presence (6.1)
- ✅ All required fields (6.2-6.5)

### Requirement 7: Question Coverage
- ✅ Q&A coverage matrix (7.1-7.5)

### Requirement 8: Concept Sovereignty
- ✅ Terminology consistency (8.1-8.5)

### Requirement 10: Structured Data
- ✅ Citations and references (10.3)

## Integration with CI/CD

### Exit Codes

- `0`: All checks passed
- `1`: One or more checks failed

### Example GitHub Actions

```yaml
name: GEO Quality Check

on: [push, pull_request]

jobs:
  geo-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run geo:check -- --json
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: geo-quality-report
          path: geo-quality-report.json
```

## Troubleshooting

### "Messages file not found"

Ensure `messages/zh.json` and `messages/en.json` exist in the project root.

### "Terminology dictionary not found"

The tool will skip terminology checks if `data/terminology.json` doesn't exist. This is a warning, not an error.

### Low Quality Scores

Common issues and fixes:

1. **Missing AI Summary**: Add `aiSummary` field to article data
2. **Missing Q&A**: Add `qaPairs` array to article data
3. **Long Paragraphs**: Break paragraphs longer than 300 characters
4. **Vague Terms**: Replace 可能, 也许, maybe, perhaps with definitive language
5. **Hyperbole**: Remove 颠覆, 革命性, revolutionary, groundbreaking

## Development

### Adding New Checks

To add a new quality check:

1. Add the check logic to `lib/geo/contentValidator.ts`
2. Update the `ContentQualityReport` type in `types/geo.ts`
3. Update the report generation in `scripts/geo-check.ts`
4. Update this README

### Testing

Run the tool on test data:

```bash
npm run geo:check -- --article web3-security-trends-2025 --verbose
```

## Related Tools

- `npm run geo:validate-terminology` - Validate terminology dictionary structure
- `npm run geo:validate-schema` - Validate Schema.org structured data
- `npm run geo:check-multilingual-parity` - Check feature parity across languages
- `npm run geo:validate-language` - Validate language metadata

## Support

For issues or questions:

1. Check this README
2. Review the GEO optimization spec at `.kiro/specs/geo-optimization/`
3. Contact the development team

## License

Part of the Ke Entropy Technology website project.
