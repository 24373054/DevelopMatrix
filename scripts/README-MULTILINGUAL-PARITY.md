# Multilingual Parity Check Tool

## Overview

The Multilingual Parity Check Tool compares GEO (Generative Engine Optimization) features between Chinese and English versions of blog articles to ensure feature parity across languages.

**Validates**: Requirements 11.1 - Feature parity across languages

## Features Checked

The tool validates the following aspects across language versions:

1. **AI Summary Presence**: Checks if both versions have AI Summary
2. **AI Summary Completeness**: Validates all required fields (whatIs, whyImportant, useCases, keyTakeaways)
3. **Q&A Coverage**: Compares Q&A presence and count
4. **Citations**: Checks citation presence and count
5. **Content Availability**: Ensures both versions have content
6. **Knowledge Block Count**: Compares structural complexity (allows up to 30% difference)

## Usage

### Basic Check

Check all articles for multilingual parity:

```bash
npm run geo:check-multilingual-parity
```

### Check Specific Article

Check a single article by ID:

```bash
npm run geo:check-multilingual-parity -- --article web3-security-trends-2025
```

### Verbose Output

Show detailed progress and metrics:

```bash
npm run geo:check-multilingual-parity -- --verbose
```

### Generate Reports

Generate JSON report:

```bash
npm run geo:check-multilingual-parity -- --json
```

Generate Markdown report:

```bash
npm run geo:check-multilingual-parity -- --markdown
```

### Combined Options

```bash
npm run geo:check-multilingual-parity -- --verbose --markdown
```

## Output Formats

### Console Output

Default output shows:
- Summary statistics (total articles, parity rate, total issues)
- Per-article metrics comparison
- List of issues with severity indicators
- Actionable recommendations

### JSON Report

Generates `multilingual-parity-report.json` with:
- Structured data for programmatic processing
- Complete metrics for both language versions
- Detailed issue information with severity levels

### Markdown Report

Generates `multilingual-parity-report.md` with:
- Human-readable formatted report
- Comparison tables for easy visual inspection
- Issue summaries with emoji indicators

## Issue Severity Levels

- 🔴 **Critical**: Missing core features (AI Summary, Q&A, Content)
- 🟠 **High**: Missing important fields or significant count mismatches (>20%)
- 🟡 **Medium**: Missing optional features or moderate mismatches
- 🔵 **Low**: Minor inconsistencies

## Thresholds

The tool uses the following thresholds to determine issues:

- **Q&A Count Mismatch**: >20% difference triggers a high-severity issue
- **Knowledge Block Mismatch**: >30% difference triggers a medium-severity issue
- **AI Summary Fields**: Missing any field triggers appropriate severity based on field importance

## Exit Codes

- `0`: All articles have parity (no issues found)
- `1`: Parity issues detected

## Integration with CI/CD

You can integrate this tool into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Check Multilingual Parity
  run: npm run geo:check-multilingual-parity
```

The tool will fail the build if parity issues are detected, ensuring quality before deployment.

## Example Output

```
═══════════════════════════════════════════════════════════════
              MULTILINGUAL PARITY REPORT                       
═══════════════════════════════════════════════════════════════

📊 SUMMARY
─────────────────────────────────────────────────────────────
Total Articles:        4
Articles with Parity:  1
Parity Rate:           25%
Total Issues:          3
Generated:             1/10/2026, 12:49:10 PM

📝 ARTICLE DETAILS
─────────────────────────────────────────────────────────────

❌ MISMATCH web3-security-trends-2025
    ZH: 2025年 Web3 安全趋势分析：从攻击手法到防御策略
    EN: Web3 Security Trends 2025: From Attack Vectors to Defense Strategies
    Metrics:
      ├─ AI Summary:     ZH=✓  EN=✓
      ├─ Q&A:            ZH=7  EN=7
      ├─ Citations:      ZH=4  EN=4
      ├─ Content:        ZH=✓  EN=✓
      └─ Knowledge Blocks: ZH=22  EN=9
    Issues (1):
      └─ 🟡 [EN] Knowledge block count mismatch: zh=22, en=9 (59% difference)

💡 RECOMMENDATIONS
─────────────────────────────────────────────────────────────
1. Review and balance knowledge block structure in 3 article pair(s)
2. English versions need more attention - they have significantly more issues
3. Focus on these articles: web3-security-trends-2025, defi-risk-management
```

## Recommendations Interpretation

The tool generates actionable recommendations based on detected issues:

1. **Add missing features**: Identifies which articles need AI Summary, Q&A, or citations
2. **Balance structure**: Highlights articles with significant knowledge block differences
3. **Language-specific attention**: Indicates if one language version needs more work
4. **Priority articles**: Lists specific articles that need immediate attention

## Technical Details

### Data Sources

- Reads from `messages/zh.json` and `messages/en.json`
- Extracts articles from `blog.articles` section
- Uses `KnowledgeBlockParser` for structural analysis

### Metrics Calculation

- **AI Summary**: Checks for presence and completeness of all fields
- **Q&A Count**: Direct count comparison with 20% tolerance
- **Knowledge Blocks**: Parsed from HTML content using the GEO parser
- **Citations**: Direct count from citations array

### Dependencies

- `lib/geo/knowledgeBlockParser`: For content structure analysis
- `types/geo`: Type definitions for GEO features

## Troubleshooting

### No Common Articles Found

If you see "No common articles found", ensure:
- Both `messages/zh.json` and `messages/en.json` exist
- Articles are defined in `blog.articles` section
- Article IDs match between language versions

### Knowledge Block Count Differences

Large differences in knowledge block counts may indicate:
- Content length differences between translations
- Different content structure (more/fewer sections)
- HTML formatting differences

This is not always a problem - the tool allows up to 30% difference before flagging an issue.

### False Positives

If you believe an issue is a false positive:
- Review the specific article content
- Check if the difference is intentional (e.g., culture-specific examples)
- Consider adjusting thresholds in the tool if needed

## Related Tools

- `geo-check.ts`: Overall GEO quality validation
- `validate-terminology-translation.ts`: Terminology consistency check
- `validate-language-metadata.ts`: Language metadata validation

## Requirements Validation

This tool validates:

- **Requirement 11.1**: Feature parity across languages
  - Ensures Chinese and English versions have equivalent GEO features
  - Validates AI Summary, Q&A, citations, and content structure
  - Identifies and reports discrepancies

## Future Enhancements

Potential improvements for future versions:

- Support for additional languages beyond zh/en
- Configurable thresholds for different issue types
- Automated content length comparison
- Translation quality hints
- Integration with translation management systems
