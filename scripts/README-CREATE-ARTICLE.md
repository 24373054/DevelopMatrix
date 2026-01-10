# Article Creation Assistant Tool

Interactive CLI tool for creating GEO-optimized articles with built-in validation and terminology support.

## Features

✅ **Article Templates** - Pre-built templates for different content types
✅ **AI Summary Generation** - Structured summaries optimized for LLMs
✅ **Q&A Coverage Builder** - Create comprehensive Q&A sections
✅ **Real-time GEO Validation** - Instant feedback on content quality
✅ **Terminology Dictionary** - Lookup and validate technical terms
✅ **Automatic Structure** - Generate well-structured content outlines
✅ **Markdown Export** - Export editable markdown templates

## Quick Start

### Interactive Mode

```bash
npm run create-article
```

The tool will guide you through 8 steps:
1. **Basic Information** - Title, description, category, keywords
2. **Template Selection** - Choose from 4 pre-built templates
3. **AI Summary** - Create structured summary for LLMs
4. **Content Structure** - Use template or custom structure
5. **Q&A Pairs** - Add common questions and answers
6. **Author Information** - Set author name and bio
7. **GEO Validation** - Real-time quality checks
8. **Save Article** - Export to messages file and markdown

### Command Line Options

```bash
# Create article with specific ID and locale
npm run create-article -- --id my-article --locale zh

# Use a specific template
npm run create-article -- --template security-analysis

# List available templates
npm run create-article -- --list-templates

# View terminology dictionary
npm run create-article -- --terminology

# Search for a term
npm run create-article -- --search "智能合约"

# Show help
npm run create-article -- --help
```

## Available Templates

### 1. Technical Guide
Step-by-step technical guide with best practices

**Structure:**
- Overview
- Core concepts with definitions
- Implementation steps
- Best practices
- Common questions
- Limitations and considerations
- Conclusion

**Best for:** How-to guides, tutorials, implementation guides

### 2. Concept Explanation
In-depth explanation of a technical concept

**Structure:**
- What is [concept]
- Why it's important
- How it works
- Comparison with related concepts
- Real-world use cases
- Advantages and disadvantages
- Conclusion

**Best for:** Educational content, concept introductions

### 3. Security Analysis
Security analysis and risk assessment

**Structure:**
- Security threat overview
- Common vulnerability types
- Attack vector analysis
- Protection measures
- Audit checklist
- Case studies
- Best practice recommendations
- Conclusion

**Best for:** Security audits, vulnerability analysis, risk assessments

### 4. Trend Analysis
Industry trend analysis and predictions

**Structure:**
- Industry status
- Major trends
- Driving factors
- Impact analysis
- Opportunities and challenges
- Future outlook
- Conclusion

**Best for:** Market analysis, industry reports, trend forecasts

## Terminology Dictionary

The tool includes a built-in terminology dictionary with 20+ Web3/blockchain terms.

### View All Terms

```bash
npm run create-article -- --terminology
```

### Search for a Term

```bash
npm run create-article -- --search "智能合约"
npm run create-article -- --search "DeFi"
npm run create-article -- --search "Web3"
```

### Term Information Includes:
- **Canonical Name** - Official term to use
- **Definition** - Clear explanation
- **Translation** - Chinese and English versions
- **Category** - web3, blockchain, defi, security
- **Context** - Where the term is used
- **Aliases** - Terms to avoid
- **Related Terms** - Connected concepts
- **First Defined In** - Original article reference

### Usage Tips:
- Always use canonical names (not aliases)
- Add definitions on first mention
- Include English terms in Chinese articles: "智能合约（Smart Contract）"
- Check related terms for context

## GEO Validation

The tool automatically validates your article against GEO requirements:

### Metrics Checked:
- ✅ AI Summary presence and completeness
- ✅ Q&A coverage
- ✅ Definition sentences (使用 "X 是指..." 格式)
- ✅ Conclusion markers (使用 "因此"、"结论是")
- ✅ Proper list structures
- ✅ Paragraph length (< 300 characters)
- ✅ Avoids vague terms (可能、也许、大概)
- ✅ Avoids hyperbole (颠覆、革命性)
- ✅ Citations and references
- ✅ Terminology consistency

### Validation Score:
- **90-100**: Excellent - Ready to publish
- **70-89**: Good - Minor improvements needed
- **50-69**: Fair - Significant improvements needed
- **< 50**: Poor - Major revisions required

## Output Files

### 1. Messages File
Article data is added to `messages/{locale}.json`:

```json
{
  "blog": {
    "articles": {
      "your-article-id": {
        "title": "...",
        "description": "...",
        "content": "...",
        "aiSummary": { ... },
        "qaPairs": [ ... ],
        "author": "...",
        "category": "...",
        "keywords": [ ... ]
      }
    }
  }
}
```

### 2. Markdown Template
Editable template saved to `content/{article-id}.md`:

```markdown
---
id: your-article-id
title: Your Article Title
...
---

# Your Article Title

## AI Summary
...

## Content
...

## Q&A
...

## GEO Optimization Checklist
- [ ] Add clear definition sentences
- [ ] Add explicit conclusion markers
...
```

## Next Steps After Creation

1. **Edit Content**
   ```bash
   # Edit the markdown template
   vim content/your-article-id.md
   ```

2. **Create Hero Image**
   ```bash
   # Create image at:
   public/blog-images/your-article-id-hero.webp
   ```

3. **Validate Article**
   ```bash
   # Run GEO quality check
   npm run geo-check -- --article your-article-id
   
   # Check terminology consistency
   npm run geo:validate-terminology
   ```

4. **Preview**
   ```bash
   # Start development server
   npm run dev
   
   # Visit: http://localhost:3108/blog/your-article-id
   ```

5. **Build and Deploy**
   ```bash
   # Build with validation
   npm run build
   ```

## Examples

### Example 1: Create Security Guide

```bash
npm run create-article -- --template security-analysis
```

Then follow the prompts:
- **ID**: `smart-contract-security-2025`
- **Language**: `zh`
- **Title**: `2025年智能合约安全最佳实践`
- **Description**: `全面的智能合约安全指南，涵盖常见漏洞和防护措施`
- **Category**: `security`
- **Keywords**: `智能合约, 安全审计, 区块链安全`

### Example 2: Create Concept Explanation

```bash
npm run create-article -- --template concept-explanation
```

Then explain a concept like "Layer 2" or "零知识证明"

### Example 3: Search Before Writing

```bash
# Check if term exists in dictionary
npm run create-article -- --search "Layer 2"

# If not found, use canonical term
npm run create-article -- --search "区块链"
```

## Tips for Best Results

### 1. Use Templates
Templates provide GEO-optimized structure out of the box

### 2. Check Terminology First
Search the dictionary before writing to ensure consistent terminology

### 3. Write Clear Definitions
Use explicit patterns:
- "在本文中，X 指的是..."
- "X is defined as..."

### 4. Add Explicit Conclusions
Use markers:
- "因此，我们可以得出结论..."
- "Therefore, we can conclude..."

### 5. Keep Paragraphs Short
Break long paragraphs into < 300 character chunks

### 6. Avoid Vague Language
Replace:
- "可能" → "在...条件下"
- "也许" → "根据...分析"
- "大概" → "约...（具体数据）"

### 7. Add Citations
Include references to external sources for credibility

### 8. Create Comprehensive Q&A
Cover all question types:
- **Definition**: "什么是X？"
- **Comparison**: "X和Y有什么区别？"
- **Application**: "X适用于哪些场景？"
- **Limitation**: "X有哪些局限性？"

## Troubleshooting

### Issue: Terminology dictionary not loading
**Solution**: Ensure `data/terminology.json` exists

### Issue: Validation score too low
**Solution**: Follow the recommendations in the validation report

### Issue: Can't save article
**Solution**: Ensure `messages/{locale}.json` exists and is valid JSON

### Issue: Template not found
**Solution**: Use `--list-templates` to see available templates

## Requirements Validated

This tool helps ensure compliance with all GEO requirements:

- ✅ **Requirement 1**: Content extractability (definitions, conclusions, lists)
- ✅ **Requirement 2**: Semantic certainty (avoid vague terms)
- ✅ **Requirement 3**: Authority signals (author info, context)
- ✅ **Requirement 4**: Verifiability (citations, avoid hyperbole)
- ✅ **Requirement 5**: LLM-friendly structure (Q&A, bullet points)
- ✅ **Requirement 6**: AI Summary integration
- ✅ **Requirement 7**: Question coverage matrix
- ✅ **Requirement 8**: Concept sovereignty (terminology consistency)
- ✅ **Requirement 10**: Structured metadata
- ✅ **Requirement 11**: Multilingual optimization

## Related Tools

- `npm run geo-check` - Validate existing articles
- `npm run geo:validate-terminology` - Check terminology consistency
- `npm run geo:check-multilingual-parity` - Compare language versions
- `npm run validate:pre-build` - Pre-build validation

## Support

For issues or questions:
- Check the GEO optimization spec: `.kiro/specs/geo-optimization/`
- Run validation tools for detailed feedback
- Review existing articles for examples
