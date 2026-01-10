# AI Article Creation - Quick Start Guide

## ✅ Setup Complete!

Your AI-powered article creation system is ready to use!

## 🚀 Create Your First Article

```bash
npm run ai-create-article
```

## 📝 Example Workflow

### Step 1: Run the command
```bash
npm run ai-create-article
```

### Step 2: Answer the prompts

```
Article Title: OTC的尽头是合规化，反洗钱正成为行业亟须
Language (zh/en) [zh]: zh
Category (security/defi/web3/blockchain): security
Keywords (comma-separated): OTC,KYC,AML,反洗钱,监管,合规
Author [Seal Wax]: Seal Wax
```

### Step 3: AI generates outline (30 seconds)

The AI will create a detailed outline with 6-10 sections. You can review and edit it if needed.

### Step 4: AI writes content (2-3 minutes)

The AI generates content section by section:
- Section 1: 概述 ✅
- Section 2: 核心概念 ✅
- Section 3: OTC交易现状 ✅
- Section 4: 反洗钱监管要求 ✅
- Section 5: 合规化路径 ✅
- Section 6: 最佳实践 ✅
- Section 7: 挑战与机遇 ✅
- Section 8: 结论 ✅

### Step 5: AI creates AI Summary (20 seconds)

```json
{
  "whatIs": "OTC合规化是指场外交易平台建立完善的反洗钱体系...",
  "whyImportant": "随着全球监管趋严，合规化已成为OTC平台生存的关键...",
  "useCases": [
    "加密货币OTC交易平台",
    "数字资产托管服务",
    "跨境支付场景"
  ],
  "keyTakeaways": [
    "建立完善的KYC/AML体系",
    "实施交易监控和风险评估",
    "加强与监管机构的沟通"
  ]
}
```

### Step 6: AI generates Q&A (30 seconds)

```
Generated 7 Q&A pairs:
1. [definition] 什么是OTC合规化？
2. [comparison] OTC合规和传统金融合规有什么区别？
3. [application] OTC合规化适用于哪些场景？
4. [limitation] OTC合规化有哪些挑战？
5. [application] 如何实施有效的反洗钱措施？
6. [definition] 什么是KYC和AML？
7. [limitation] 合规成本如何控制？
```

### Step 7: Validation (10 seconds)

```
Quality Score: 92/100

Metrics:
  ✓ AI Summary: Yes
  ✓ Q&A Coverage: Yes
  ✓ Definitions: Yes
  ✓ Conclusions: Yes
  ✓ Terminology: Consistent

✅ Validation complete
```

### Step 8: Build & Publish (1-2 minutes)

```
1️⃣  Running pre-build validation...
✅ Pre-build validation passed

2️⃣  Running GEO check...
✅ GEO check passed

3️⃣  Building application...
✅ Build successful

🎉 Article published successfully!
📱 View at: http://localhost:3108/zh/blog/otc的尽头是合规化-反洗钱正成为行业亟须
```

## ⏱️ Total Time: 5-7 minutes

Compare to manual writing: 4-6 hours!

## 📊 What You Get

✅ **Fully written article** (2000-4000 words)
✅ **GEO-optimized content** (score 85-95/100)
✅ **AI Summary** (4 structured fields)
✅ **Q&A section** (5-8 comprehensive pairs)
✅ **Validated** (all GEO requirements met)
✅ **Published** (live on your website)

## 🎯 Quality Guaranteed

Every article includes:
- Clear definition sentences ("X是指...")
- Explicit conclusion markers ("因此", "综上所述")
- Proper HTML structure (<ul>, <ol>, <p>)
- Short paragraphs (< 300 characters)
- No vague terms (可能, 也许)
- No hyperbole (颠覆, 革命性)
- Canonical terminology
- English terms in Chinese articles

## 💡 Tips for Best Results

### 1. Choose Clear Titles
Good: "智能合约安全审计完全指南"
Better: "2025年智能合约安全审计最佳实践"

### 2. Select Appropriate Category
- **security**: Security analysis, audits, vulnerabilities
- **defi**: DeFi protocols, yield farming, liquidity
- **web3**: Web3 concepts, decentralization, NFTs
- **blockchain**: Blockchain technology, consensus, architecture

### 3. Add Relevant Keywords
Include 4-6 keywords that cover:
- Main topic
- Related technologies
- Use cases
- Target audience

### 4. Review the Outline
When AI generates the outline, take a moment to review it. You can:
- Add sections you want to cover
- Remove irrelevant sections
- Adjust the order
- Refine section titles

### 5. Let AI Handle the Rest
Once you approve the outline, sit back and let AI:
- Write all content
- Create AI Summary
- Generate Q&A
- Validate quality
- Build and publish

## 🔧 Troubleshooting

### Issue: API Key Error
```
Error: Authentication failed
```

**Solution**: Check `.env.local` file:
```bash
DEEPSEEK_API_KEY=sk-c23dd2d363044b2aad5788bf3003fc91
DEEPSEEK_API_BASE=https://api.deepseek.com
```

### Issue: Low Quality Score
```
Quality Score: 65/100
```

**Solution**: The AI will automatically try to fix issues. If it still fails, you can:
1. Check the validation report
2. Edit the content manually
3. Run validation again: `npm run geo:check -- --article {id}`

### Issue: Build Fails
```
❌ Build failed
```

**Solution**: Check the error message and:
1. Run validation: `npm run validate:pre-build`
2. Fix any issues reported
3. Try building again: `npm run build`

## 📚 Additional Resources

- **Full Documentation**: `scripts/README-AI-CREATE-ARTICLE.md`
- **Workflow Diagram**: `docs/AI-WORKFLOW-DIAGRAM.md`
- **Implementation Details**: `.kiro/specs/geo-optimization/AI-WORKFLOW-SUMMARY.md`
- **Manual Creation Tool**: `npm run create-article`
- **Terminology Dictionary**: `npm run create-article -- --terminology`

## 🎓 Learn More

### Test API Connection
```bash
npx tsx scripts/test-deepseek-api.ts
```

### View Help
```bash
npm run ai-create-article -- --help
```

### Check Existing Articles
```bash
npm run geo:check
```

### Validate Terminology
```bash
npm run geo:validate-terminology
```

## 🚀 Ready to Scale

Create multiple articles:

```bash
# Article 1
npm run ai-create-article
# (5-7 minutes)

# Article 2
npm run ai-create-article
# (5-7 minutes)

# Article 3
npm run ai-create-article
# (5-7 minutes)

# Total: 15-21 minutes for 3 articles!
```

## 💰 Cost Efficiency

- **Manual**: $50-100 per article (4-6 hours of work)
- **AI**: $0.10-0.30 per article (5-7 minutes)
- **Savings**: 99% cost reduction + 95% time savings

## ✨ Success Metrics

After using the AI workflow, you'll have:
- ✅ 10x faster article creation
- ✅ Consistent quality (85-95/100)
- ✅ 100% GEO compliance
- ✅ Ready for LLM indexing
- ✅ SEO optimized
- ✅ Multilingual support

---

## 🎉 Start Creating Now!

```bash
npm run ai-create-article
```

**Let AI handle the heavy lifting while you focus on strategy!** 🚀

---

## Need Help?

- Check documentation: `scripts/README-AI-CREATE-ARTICLE.md`
- Test API: `npx tsx scripts/test-deepseek-api.ts`
- View help: `npm run ai-create-article -- --help`
- Validate articles: `npm run geo:check`

**Happy writing! 📝✨**
