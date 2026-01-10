# AI文章生成工作流 - 快速开始指南

## 🚀 5分钟快速设置

### 第一步：配置API密钥

1. **获取DeepSeek API密钥**
   - 访问：https://platform.deepseek.com/
   - 注册或登录账号
   - 进入API密钥管理页面
   - 创建新的API密钥

2. **配置环境变量**

   ```bash
   # 运行设置脚本
   bash scripts/setup-api-key.sh
   
   # 或者手动创建
   cp .env.example .env.local
   ```

3. **编辑 `.env.local` 文件**

   ```bash
   # 使用你喜欢的编辑器
   nano .env.local
   # 或
   vim .env.local
   # 或
   code .env.local
   ```

   将 `your-api-key-here` 替换为你的真实API密钥：
   ```bash
   DEEPSEEK_API_KEY=sk-你的真实密钥
   DEEPSEEK_API_BASE=https://api.deepseek.com/v1
   ```

4. **保存文件** ✅

### 第二步：运行AI工作流

```bash
npm run ai-create-article
```

### 第三步：按提示输入信息

```
═══════════════════════════════════════════════════════════════
        AI-Powered GEO Article Creation Workflow               
═══════════════════════════════════════════════════════════════

📋 Step 1: Basic Information

Article Title: Web3安全最佳实践2025
Language (zh/en) [zh]: zh
Category (security/defi/web3/blockchain): security
Keywords (comma-separated): Web3, 安全, 最佳实践, 智能合约
Author [Seal Wax]: Seal Wax

✅ Article ID: web3-security-best-practices-2025
```

### 第四步：等待AI完成

AI会自动完成以下所有工作：

```
📝 Step 2: Generating Outline
🤖 AI is generating article outline...
✅ Outline generated (8 sections)

📄 Step 3: Generating Content
[1/8] Generating: 概述 ✅
[2/8] Generating: 核心概念 ✅
[3/8] Generating: 常见安全威胁 ✅
...
✅ All 8 sections generated!

🤖 Step 4: Generating AI Summary
✅ AI Summary created

❓ Step 5: Generating Q&A Pairs
✅ Generated 7 Q&A pairs

🔍 Step 6: Validation and Auto-Fix
📊 Quality Score: 92/100
✅ Validation complete

💾 Step 7: Saving Article
✅ Article saved

🏗️  Step 8: Build and Publish
1️⃣  Running pre-build validation... ✅
2️⃣  Running GEO check... ✅
3️⃣  Building application... ✅

🎉 Article published successfully!
📱 View at: http://localhost:3108/zh/blog/web3-security-best-practices-2025
```

### 第五步：查看结果

```bash
# 启动开发服务器（如果还没运行）
npm run dev

# 在浏览器中访问
http://localhost:3108/zh/blog/你的文章ID
```

## 📊 完整工作流程

```
你的输入 → AI生成大纲 → AI撰写内容 → AI创建摘要 → AI生成Q&A 
    ↓
验证质量 → 自动修复 → 保存文章 → 构建发布 → 文章上线 ✅
```

## ⏱️ 时间对比

| 步骤 | 手动创作 | AI工作流 |
|------|---------|---------|
| 构思大纲 | 30-60分钟 | 30秒 |
| 撰写内容 | 3-4小时 | 2-3分钟 |
| 创建摘要 | 15-30分钟 | 20秒 |
| 生成Q&A | 30-60分钟 | 30秒 |
| 验证优化 | 30-60分钟 | 10秒 |
| **总计** | **4-6小时** | **5-7分钟** |

## ✅ 自动保证的质量标准

AI工作流自动确保：

### 内容结构
- ✅ 明确的定义句（"X是指..."）
- ✅ 清晰的结论标识（"因此"、"综上所述"）
- ✅ 结构化列表（<ul>、<ol>）
- ✅ 短段落（< 300字符）

### 语义确定性
- ✅ 陈述句表达
- ✅ 避免模糊词汇（可能、也许、大概）
- ✅ 明确的边界条件

### 权威信号
- ✅ 作者信息完整
- ✅ 上下文说明（"在...中"）
- ✅ 经验数据支撑

### 可验证性
- ✅ 避免夸张语言（颠覆、革命性）
- ✅ 引用结构完整
- ✅ 局限性讨论

### LLM友好结构
- ✅ Q&A格式
- ✅ 定义→解释→应用场景
- ✅ 对比表格
- ✅ 要点总结

### AI摘要
- ✅ whatIs（核心定义）
- ✅ whyImportant（重要性）
- ✅ useCases（应用场景）
- ✅ keyTakeaways（核心要点）

### 问题覆盖
- ✅ 定义类问题
- ✅ 对比类问题
- ✅ 应用类问题
- ✅ 局限性问题

### 术语规范
- ✅ 首次出现定义
- ✅ 使用规范名称
- ✅ 术语一致性

## 🎯 使用场景

### 场景1：技术文章
```bash
npm run ai-create-article

Title: 智能合约安全审计完全指南
Category: security
Keywords: 智能合约, 安全审计, 漏洞检测
```

### 场景2：概念解释
```bash
npm run ai-create-article

Title: 深入理解DeFi流动性池
Category: defi
Keywords: DeFi, 流动性池, AMM, 收益农场
```

### 场景3：趋势分析
```bash
npm run ai-create-article

Title: 2025年Web3发展趋势预测
Category: web3
Keywords: Web3, 区块链, 发展趋势, 2025
```

### 场景4：英文文章
```bash
npm run ai-create-article

Title: Understanding Zero-Knowledge Proofs
Language: en
Category: blockchain
Keywords: ZKP, Privacy, Cryptography
```

## 💡 高级功能

### 编辑AI生成的大纲

当AI生成大纲后，你可以选择编辑：

```
Do you want to edit the outline? (y/n): y

📝 Opening editor for outline.md...
   File: .temp/outline.md
   Edit the file and save when done.

Press Enter when you have finished editing...
```

### 批量创建文章

```bash
# 创建多篇文章
npm run ai-create-article  # 文章1
npm run ai-create-article  # 文章2
npm run ai-create-article  # 文章3

# 统一验证
npm run validate:all

# 构建发布
npm run build
```

### 查看术语词典

在创作前查看可用术语：

```bash
npm run create-article -- --terminology
```

### 搜索特定术语

```bash
npm run create-article -- --search "智能合约"
npm run create-article -- --search "DeFi"
```

## 🔧 故障排除

### 问题1：API密钥错误

```
Error: DeepSeek API key not found
```

**解决方案**：
1. 确认 `.env.local` 文件存在
2. 检查API密钥格式正确
3. 确保没有多余的空格或引号

### 问题2：构建失败

```
❌ Build failed: Validation errors
```

**解决方案**：
```bash
# 检查具体错误
npm run geo:check -- --article 你的文章ID

# 查看详细报告
cat geo-quality-report.md
```

### 问题3：质量分数过低

```
⚠️  Quality score below threshold: 65/100
```

**解决方案**：
AI会自动尝试修复。如果仍然失败：
1. 查看具体问题
2. 手动编辑 `content/文章ID.md`
3. 重新运行验证

### 问题4：术语冲突

```
⚠️  Found 3 terminology issue(s)
```

**解决方案**：
```bash
# 查看术语词典
npm run create-article -- --terminology

# 使用规范名称而非别名
```

## 📚 相关文档

- **完整文档**：`scripts/README-AI-CREATE-ARTICLE.md`
- **安全指南**：`docs/SECURITY-SETUP.md`
- **工作流图**：`docs/AI-WORKFLOW-DIAGRAM.md`
- **实现总结**：`.kiro/specs/geo-optimization/AI-WORKFLOW-SUMMARY.md`

## 🔒 安全提醒

### ⚠️ 重要安全规则

1. **永远不要**将 `.env.local` 提交到git
2. **永远不要**在代码中硬编码API密钥
3. **永远不要**在文档中分享真实的API密钥
4. **定期轮换**API密钥
5. **监控**API使用情况

### 验证安全性

```bash
# 确认 .env.local 被git忽略
git check-ignore .env.local
# 应该输出：.env.local

# 确认没有API密钥被追踪
git grep -i "sk-" -- ':!.env.local'
# 应该没有输出
```

## 💰 成本估算

基于DeepSeek API定价：

- **每篇文章**：约19,000-21,000 tokens
- **预估成本**：$0.10-0.30 USD/篇
- **100篇文章**：$10-30 USD

相比人工创作（$50-100/篇），节省95%以上成本。

## 🎓 最佳实践

### 1. 提供清晰的标题
好的标题 ✅：
- "Web3安全最佳实践2025"
- "深入理解DeFi流动性池机制"
- "智能合约常见漏洞及防护方法"

不好的标题 ❌：
- "安全"
- "DeFi介绍"
- "区块链"

### 2. 选择准确的分类
- `security` - 安全相关
- `defi` - DeFi金融
- `web3` - Web3生态
- `blockchain` - 区块链技术

### 3. 添加相关关键词
```
Keywords: Web3, 安全, 最佳实践, 智能合约, 漏洞检测
```

### 4. 审查AI生成的大纲
虽然AI生成的大纲通常很好，但建议：
- 检查逻辑流程
- 确认覆盖所有要点
- 调整章节顺序（如需要）

### 5. 本地预览后再发布
```bash
npm run dev
# 访问 http://localhost:3108/zh/blog/你的文章ID
# 检查格式、链接、图片等
```

## 🚀 开始创作

现在你已经准备好了！运行：

```bash
npm run ai-create-article
```

让AI帮你在5分钟内创建一篇高质量、GEO优化的技术文章！

---

**需要帮助？**
- 查看完整文档：`scripts/README-AI-CREATE-ARTICLE.md`
- 查看安全指南：`docs/SECURITY-SETUP.md`
- 运行诊断工具：`npm run geo:check`
