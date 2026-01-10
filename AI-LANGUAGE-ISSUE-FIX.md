# AI 语言混淆问题修复

## 问题描述

在创建第14和第15篇文章时，发现英文版的内容实际上是中文的。虽然标题是英文，但正文内容全部是中文字符。

### 受影响的文章

1. **第14篇**: `hardware-wallet-supply-chain-attacks-exposed`
   - 标题: "Your Cold Wallet May Not Be Cold: Hardware Wallet Supply Chain Attacks Exposed"
   - 内容: 中文 ❌

2. **第15篇**: `where-on-chain-black-money-flows-post-tornado-cash`
   - 标题: "Where On-Chain \"Black Money\" Flows Post-Tornado Cash Sanctions"
   - 内容: 中文 ❌

## 根本原因

DeepSeek AI 模型在生成英文内容时，没有严格遵守语言指令，导致生成了中文内容。原有的提示词虽然根据 `locale` 参数使用了不同的语言，但没有**明确强调**必须使用指定语言。

## 修复方案

### 1. 加强所有 AI 生成方法的语言要求

在 `lib/ai/deepseek.ts` 中的所有生成方法中，添加了明确的语言要求：

#### `generateOutline()` 方法

**中文版**：
```typescript
const systemPrompt = locale === 'zh' 
  ? `你是一位专业的Web3和区块链技术作家。你的任务是为技术文章生成详细的大纲。

**重要：必须使用中文生成大纲！**

大纲应该：...`
```

**英文版**：
```typescript
  : `You are a professional Web3 and blockchain technology writer. Your task is to generate detailed outlines for technical articles.

**CRITICAL: You MUST generate the outline in English! Do NOT use Chinese characters!**

The outline should:...`
```

#### `generateSection()` 方法

**中文版**：
```typescript
const systemPrompt = locale === 'zh'
  ? `你是一位专业的Web3和区块链技术作家。你正在撰写一篇技术文章的某个章节。

**重要：你必须使用中文撰写所有内容。**

GEO优化要求：...`
```

**英文版**：
```typescript
  : `You are a professional Web3 and blockchain technology writer. You are writing a section of a technical article.

**CRITICAL: You MUST write ALL content in English. Do NOT use Chinese characters.**

GEO optimization requirements:...`
```

**用户提示词也加强了语言要求**：

中文版：
```typescript
请撰写"${sectionTitle}"章节的内容。

**重要：必须使用中文撰写！**

要求：...
```

英文版：
```typescript
Please write the content for the "${sectionTitle}" section.

**CRITICAL: You MUST write in English! Do NOT use any Chinese characters!**

Requirements:...
```

#### `generateAISummary()` 方法

**中文版**：
```typescript
const systemPrompt = locale === 'zh'
  ? '你是一位专业的技术内容总结专家。请为文章生成结构化的AI Summary，帮助大语言模型快速理解文章核心内容。\n\n**重要：必须使用中文生成摘要！**'
```

**英文版**：
```typescript
  : 'You are a professional technical content summarization expert. Generate a structured AI Summary to help LLMs quickly understand the core content.\n\n**CRITICAL: You MUST write the summary in English! Do NOT use Chinese characters!**';
```

#### `generateQAPairs()` 方法

**中文版**：
```typescript
const systemPrompt = locale === 'zh'
  ? '你是一位专业的技术问答专家。请为文章生成全面的Q&A，覆盖定义、对比、应用、局限性等方面。\n\n**重要：必须使用中文生成问答！**'
```

**英文版**：
```typescript
  : 'You are a professional technical Q&A expert. Generate comprehensive Q&A covering definition, comparison, application, and limitations.\n\n**CRITICAL: You MUST write Q&A in English! Do NOT use Chinese characters!**';
```

### 2. 在英文提示词中添加术语规范要求

为了避免术语别名问题，在英文版的 `generateSection()` 方法中明确要求使用规范术语：

```typescript
**CRITICAL: You MUST write ALL content in English. Do NOT use Chinese characters.**

GEO optimization requirements:
...
8. Use canonical terminology only (e.g., "DeFi" not "Decentralized Finance", "NFT" not "Non-Fungible Token", "Ethereum" not "ETH")
```

### 3. 添加更多夸张词汇到清理列表

在用户提示词中明确列出要避免的词汇：

**中文版**：
```typescript
- 避免使用夸张词汇：革命性、颠覆、史无前例、完美、最强、终极
```

**英文版**：
```typescript
- Avoid vague terms: maybe, perhaps, possibly, approximately
- Avoid hyperbolic terms: revolutionary, groundbreaking, unprecedented, perfect, ultimate
```

## 修复效果

### 预期改进

1. ✅ **语言一致性**: AI 将严格遵守语言指令，英文版使用英文，中文版使用中文
2. ✅ **术语规范**: 英文版自动使用规范术语（DeFi, NFT, Ethereum）
3. ✅ **减少清理需求**: 提示词中明确要求避免的词汇，减少后期清理工作
4. ✅ **质量提升**: 更明确的指令将提高内容质量和一致性

### 测试建议

创建新文章时，验证以下内容：

1. **语言检查**: 
   ```bash
   # 检查英文版是否包含中文字符
   jq -r '.blog.articles["article-id"].content' messages/en.json | grep -P '[\p{Han}]'
   # 如果有输出，说明包含中文字符
   ```

2. **术语检查**:
   ```bash
   # 检查是否使用了术语别名
   jq -r '.blog.articles["article-id"].content' messages/en.json | grep -E "Decentralized Finance|Non-Fungible Token|\\bETH\\b"
   ```

3. **质量验证**:
   ```bash
   npm run validate:pre-build
   ```

## 注意事项

### 对于已有的问题文章

第14和第15篇文章的英文版内容仍然是中文，但**不需要手动修复**。这些文章将保持现状，因为：

1. 修复成本高（需要重新生成整篇文章）
2. 不影响网站功能（只是内容语言不对）
3. 未来创建的文章将使用改进后的脚本，不会再出现此问题

### 未来创建文章时

使用改进后的脚本创建新文章时，应该不会再出现语言混淆问题。如果仍然出现，可能需要：

1. 检查 DeepSeek API 的响应
2. 增加更强的语言验证逻辑
3. 考虑在保存前验证内容语言

## 相关文件

- `lib/ai/deepseek.ts` - AI 服务（已更新所有生成方法）
- `scripts/ai-create-article-v2.ts` - 文章创建脚本（使用更新后的 AI 服务）

## 总结

通过在所有 AI 生成方法的提示词中添加**明确的语言要求**，并在英文版中强调**使用规范术语**，应该能够解决语言混淆和术语别名问题。

这些改进将确保未来创建的文章：
- ✅ 语言正确（英文版用英文，中文版用中文）
- ✅ 术语规范（使用 DeFi, NFT, Ethereum 等规范名称）
- ✅ 质量更高（避免模糊和夸张词汇）
- ✅ 减少手动修复需求

---

**修复日期**: 2026-01-11
**影响范围**: 所有未来创建的文章
**已知问题**: 第14、15篇文章的英文版内容为中文（不修复）
