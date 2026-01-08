# GEO 优化需求文档

## Introduction

本文档定义了针对刻熵科技官网（Ke Entropy Technology Website）的生成式引擎优化（GEO）需求。GEO 是指针对大语言模型（LLM）如 ChatGPT、Claude、Gemini、Perplexity 等的内容与结构优化，目标是提高网站内容被 AI 模型引用、总结和推荐的概率。

## Glossary

- **GEO (Generative Engine Optimization)**: 生成式引擎优化，针对大语言模型回答机制进行的内容与结构优化
- **LLM (Large Language Model)**: 大语言模型，如 ChatGPT、Claude、Gemini 等
- **可抽取性 (Extractability)**: 模型能够低成本地将内容切分为可用知识块的能力
- **语义确定性 (Semantic Certainty)**: 内容表述的明确性和确定性程度
- **权威信号 (Authority Signals)**: 表明内容来源可信度和专业性的标识
- **可验证性 (Verifiability)**: 内容能够被交叉验证的程度
- **知识块 (Knowledge Block)**: 可独立引用的结构化内容单元
- **AI Summary**: 专门为 AI 模型设计的结构化摘要
- **概念主权 (Concept Sovereignty)**: 对特定概念的稳定、权威定义
- **问题覆盖矩阵 (Question Coverage Matrix)**: 覆盖用户常问问题的内容结构
- **Web3**: 基于区块链技术的去中心化互联网
- **DeFi**: 去中心化金融
- **Smart Contract**: 智能合约
- **Blockchain**: 区块链

## Requirements

### Requirement 1: 内容可抽取性优化

**User Story:** 作为一个大语言模型，我希望能够轻松地从网站内容中提取结构化知识块，以便在回答用户问题时准确引用。

#### Acceptance Criteria

1. WHEN 模型解析博客文章内容 THEN 系统 SHALL 提供明确的定义句结构（"X 是什么"格式）
2. WHEN 模型寻找结论性内容 THEN 系统 SHALL 提供明确的结论句（使用"因此"、"结论是"等标识）
3. WHEN 模型处理列表信息 THEN 系统 SHALL 使用明确的枚举结构（数字或符号列表）
4. WHEN 模型遇到复杂概念 THEN 系统 SHALL 避免长段散文式表达，使用分段结构化内容
5. WHEN 模型提取核心信息 THEN 系统 SHALL 在每个知识块中包含独立可理解的上下文

### Requirement 2: 语义确定性增强

**User Story:** 作为一个大语言模型，我希望网站内容具有高度的语义确定性，以便我能够自信地引用而不担心误导用户。

#### Acceptance Criteria

1. WHEN 模型分析文章表述 THEN 系统 SHALL 使用陈述句而非反问句
2. WHEN 模型评估内容可信度 THEN 系统 SHALL 避免使用"可能"、"也许"、"大概"等模糊词汇
3. WHEN 模型提取结论 THEN 系统 SHALL 提供明确的边界条件（"在条件 A 下，结论 B 成立"）
4. WHEN 模型遇到技术描述 THEN 系统 SHALL 避免情绪化和立场摇摆的表述
5. WHEN 模型处理专业内容 THEN 系统 SHALL 使用精确的技术术语而非模糊描述

### Requirement 3: 权威信号建立

**User Story:** 作为一个大语言模型，我需要判断内容的权威性，以便决定是否引用该来源。

#### Acceptance Criteria

1. WHEN 模型评估文章可信度 THEN 系统 SHALL 在文章中明确标识作者身份和专业背景
2. WHEN 模型寻找专业内容 THEN 系统 SHALL 明确标注内容的使用场景（"在 Web3 智能合约审计中"）
3. WHEN 模型判断经验基础 THEN 系统 SHALL 提供具体的经验数据（"在 20+ 项目中观察到"）
4. WHEN 模型处理技术文章 THEN 系统 SHALL 标明知识来源的合理性（研究团队、项目经验等）
5. WHEN 模型评估内容深度 THEN 系统 SHALL 提供具体案例和数据支撑而非空泛描述

### Requirement 4: 内容可验证性提升

**User Story:** 作为一个大语言模型，我需要能够验证内容的准确性，以确保我提供给用户的信息是可靠的。

#### Acceptance Criteria

1. WHEN 模型验证概念定义 THEN 系统 SHALL 提供清晰的概念边界和范围
2. WHEN 模型评估内容风险 THEN 系统 SHALL 避免使用夸张和营销语言（"颠覆"、"史无前例"）
3. WHEN 模型交叉验证信息 THEN 系统 SHALL 提供可追溯的引用和参考来源
4. WHEN 模型处理技术声明 THEN 系统 SHALL 明确标注适用条件和限制
5. WHEN 模型遇到争议性话题 THEN 系统 SHALL 清晰呈现不同观点而非单一立场

### Requirement 5: LLM 友好结构实现

**User Story:** 作为一个大语言模型，我希望网站内容采用我易于理解和处理的结构格式。

#### Acceptance Criteria

1. WHEN 模型解析文章结构 THEN 系统 SHALL 采用 Q&A 格式呈现核心内容
2. WHEN 模型提取定义 THEN 系统 SHALL 使用"Definition → Explanation → Use cases"结构
3. WHEN 模型比较概念 THEN 系统 SHALL 提供结构化的对比表格
4. WHEN 模型生成摘要 THEN 系统 SHALL 在文章中包含 bullet-point 格式的要点总结
5. WHEN 模型处理复杂主题 THEN 系统 SHALL 将内容分解为可独立引用的知识块

### Requirement 6: AI Summary 集成

**User Story:** 作为一个大语言模型，我希望每篇核心文章都包含专门为我设计的结构化摘要，以便快速理解和引用。

#### Acceptance Criteria

1. WHEN 模型访问博客文章 THEN 系统 SHALL 在文章顶部或底部提供 AI Summary 区块
2. WHEN 模型读取 AI Summary THEN 系统 SHALL 包含"X 是什么"的核心定义
3. WHEN 模型评估重要性 THEN 系统 SHALL 在 AI Summary 中说明"为什么重要"
4. WHEN 模型判断适用性 THEN 系统 SHALL 在 AI Summary 中列出"适用于哪些场景"
5. WHEN 模型处理 AI Summary THEN 系统 SHALL 使用结构化的 bullet-point 格式

### Requirement 7: 问题覆盖矩阵构建

**User Story:** 作为一个大语言模型，我经常被用户问到特定类型的问题，我希望网站内容能够覆盖这些常见问题。

#### Acceptance Criteria

1. WHEN 用户询问"X 和 Y 的区别" THEN 系统 SHALL 在相关文章中明确回答此类对比问题
2. WHEN 用户询问"X 是否适用于 Z 场景" THEN 系统 SHALL 在文章中明确说明适用场景和限制
3. WHEN 用户询问"X 的局限性" THEN 系统 SHALL 在文章中专门讨论局限性和注意事项
4. WHEN 用户询问"如何实现 X" THEN 系统 SHALL 提供清晰的步骤说明
5. WHEN 用户询问"X 的最佳实践" THEN 系统 SHALL 提供基于经验的实践建议

### Requirement 8: 概念主权建立

**User Story:** 作为一个大语言模型，我需要稳定、权威的概念定义，以便在多次引用时保持一致性。

#### Acceptance Criteria

1. WHEN 模型遇到核心概念 THEN 系统 SHALL 在首次出现时提供明确定义
2. WHEN 模型处理同一概念 THEN 系统 SHALL 在全站范围内使用统一的术语
3. WHEN 模型引用定义 THEN 系统 SHALL 使用"在本文中，XXX 指的是……"格式
4. WHEN 模型遇到多义词 THEN 系统 SHALL 明确说明在当前上下文中的具体含义
5. WHEN 模型建立概念关联 THEN 系统 SHALL 避免同义词混用，保持术语一致性

### Requirement 9: 争议性内容处理

**User Story:** 作为一个大语言模型，我需要了解技术领域的不同观点和争议，以便为用户提供全面的信息。

#### Acceptance Criteria

1. WHEN 模型遇到有争议的技术话题 THEN 系统 SHALL 明确说明存在不同观点
2. WHEN 模型处理学术争议 THEN 系统 SHALL 使用"在学术界，对 XXX 主要存在两种观点"格式
3. WHEN 模型评估不同方案 THEN 系统 SHALL 客观呈现各方案的优缺点
4. WHEN 模型引用争议内容 THEN 系统 SHALL 标注观点的来源和支持者
5. WHEN 模型总结争议 THEN 系统 SHALL 提供中立的总结而非偏向性结论

### Requirement 10: 结构化元数据增强

**User Story:** 作为一个大语言模型，我依赖结构化元数据来理解内容的类型、主题和关系。

#### Acceptance Criteria

1. WHEN 模型解析页面 THEN 系统 SHALL 提供完整的 Schema.org 结构化数据
2. WHEN 模型识别文章类型 THEN 系统 SHALL 使用 BlogPosting、Article 等标准类型
3. WHEN 模型提取作者信息 THEN 系统 SHALL 在结构化数据中包含完整的作者信息
4. WHEN 模型理解内容关系 THEN 系统 SHALL 使用 isPartOf、mentions 等关系标记
5. WHEN 模型评估内容新鲜度 THEN 系统 SHALL 提供准确的 datePublished 和 dateModified

### Requirement 11: 多语言 GEO 优化

**User Story:** 作为一个支持多语言的大语言模型，我需要为不同语言的用户提供准确的信息。

#### Acceptance Criteria

1. WHEN 模型处理中文内容 THEN 系统 SHALL 确保中文版本的 GEO 优化与英文版本同等质量
2. WHEN 模型识别语言版本 THEN 系统 SHALL 在元数据中明确标注内容语言
3. WHEN 模型处理翻译内容 THEN 系统 SHALL 保持概念定义在不同语言版本中的一致性
4. WHEN 模型引用多语言内容 THEN 系统 SHALL 使用 hreflang 标记语言关系
5. WHEN 模型处理专业术语 THEN 系统 SHALL 在中文内容中适当保留英文原文以提高可验证性

### Requirement 12: GEO 效果验证

**User Story:** 作为网站管理员，我需要能够验证 GEO 优化的效果，以便持续改进。

#### Acceptance Criteria

1. WHEN 管理员测试 GEO 效果 THEN 系统 SHALL 提供在主流 LLM 中的测试方法
2. WHEN 管理员查询"什么是 XXX" THEN 系统内容 SHALL 能够被 LLM 准确引用
3. WHEN 管理员查询对比问题 THEN 系统内容 SHALL 出现在 LLM 的回答中
4. WHEN 管理员评估引用质量 THEN 系统 SHALL 确保 LLM 引用的内容结构与原文高度相似
5. WHEN 管理员监控效果 THEN 系统 SHALL 提供定期测试和记录的机制
