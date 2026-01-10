# GEO 优化实施任务列表

## 任务概述

本任务列表将 GEO 优化设计转化为可执行的开发任务。任务按照依赖关系组织，确保每个步骤都建立在前一步的基础上。

标记说明：
- `[x]` - 已完成的任务
- `[ ]` - 待完成的核心任务
- `[ ]*` - 可选任务（主要是测试相关）

---

## Phase 1: 基础设施搭建

- [x] 1. 设置项目结构和类型定义
  - ✅ 已创建 `lib/geo/` 目录
  - ✅ 已创建 `types/geo.ts` 并定义所有核心类型
  - ✅ 已定义 `AISummary`, `KnowledgeBlock`, `QAPair`, `ConceptAuthority` 等接口
  - ✅ 已定义 `GEOArticle`, `TerminologyEntry`, `EnhancedBlogPosting` 等数据模型
  - _Requirements: 所有需求的基础_

- [x] 2. 实现术语词典系统
  - 创建 `lib/geo/terminology.ts` 实现术语词典管理
  - 创建 `data/terminology.json` 存储术语定义
  - 实现术语查询、验证和一致性检查功能
  - 添加 Web3、DeFi、区块链等核心概念的初始定义
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 2.1 编写术语词典的属性测试
  - **Property 28: First-mention definition**
  - **Property 29: Terminology consistency**
  - **Property 30: Definition sentence format**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.5**

- [x] 3. 实现 Knowledge Block Parser
  - 创建 `lib/geo/knowledgeBlockParser.ts`
  - 实现 HTML 内容解析功能
  - 实现定义句识别（"X 是什么"、"X 指的是"等模式）
  - 实现结论句识别（"因此"、"结论是"等标识）
  - 实现列表和表格结构识别
  - 实现知识块分类（definition, explanation, comparison, example, conclusion）
  - _Requirements: 1.1, 1.2, 1.3, 5.5_

- [x] 3.1 编写 Knowledge Block Parser 的属性测试
  - **Property 1: Definition sentence presence**
  - **Property 2: Conclusion marker presence**
  - **Property 3: List structure formatting**
  - **Property 17: Knowledge block decomposition**
  - **Validates: Requirements 1.1, 1.2, 1.3, 5.5**

- [x] 4. 实现内容质量验证器
  - 创建 `lib/geo/contentValidator.ts`
  - 实现段落长度检查（不超过 300 字符）
  - 实现反问句检测
  - 实现模糊词汇检测（"可能"、"也许"、"大概"）
  - 实现夸张词汇检测（"颠覆"、"史无前例"）
  - _Requirements: 1.4, 2.1, 2.2, 4.2_

- [x] 4.1 编写内容质量验证器的属性测试
  - **Property 4: Paragraph length constraint**
  - **Property 5: Declarative sentence usage**
  - **Property 6: Vague term avoidance**
  - **Property 11: Hyperbole avoidance**
  - **Validates: Requirements 1.4, 2.1, 2.2, 4.2**



## Phase 2: AI Summary 系统

- [x] 5. 为现有博客文章创建 AI Summary 数据
  - 在 `messages/zh.json` 和 `messages/en.json` 中为每篇博客文章添加 `aiSummary` 字段
  - 为现有的 4 篇文章创建 AI Summary 内容：
    - web3-security-trends-2025
    - smart-contract-audit-guide
    - defi-risk-management
    - benign-arbitrage-theory
  - 确保包含 `whatIs`, `whyImportant`, `useCases`, `keyTakeaways` 字段
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. 实现 AI Summary 组件
  - 创建 `components/Blog/AISummary.tsx`
  - 实现结构化的 AI Summary 展示
  - 添加 Schema.org DefinedTerm 标记
  - 实现响应式设计和暗色模式支持
  - 添加优雅的降级处理（当 AI Summary 缺失时）
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.1 编写 AI Summary 组件的单元测试
  - 测试所有字段正确渲染
  - 测试缺失字段的降级处理
  - 测试响应式布局
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.2 编写 AI Summary 的属性测试
  - **Property 18: AI Summary component presence**
  - **Property 19: AI Summary whatIs field**
  - **Property 20: AI Summary whyImportant field**
  - **Property 21: AI Summary useCases field**
  - **Property 22: AI Summary structured format**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 7. 集成 AI Summary 到博客文章页面
  - 修改 `app/[locale]/blog/[slug]/page.tsx`
  - 在文章顶部（Featured Image 之后）添加 AI Summary 组件
  - 确保 AI Summary 在目录（TOC）之前显示
  - 添加视觉分隔和样式优化
  - _Requirements: 6.1_


## Phase 3: Q&A 生成系统

- [x] 8. 实现 Q&A Generator
  - 创建 `lib/geo/qaGenerator.ts`
  - 实现从文章内容自动生成 Q&A 的逻辑
  - 实现问题分类（definition, comparison, application, limitation）
  - 生成"什么是 X"、"X 和 Y 的区别"、"X 适用于哪些场景"、"X 的局限性"等问题
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9. 为现有文章生成 Q&A 内容
  - ✅ 为 4 篇现有博客文章创建 Q&A 数据
  - ✅ 添加到 `messages/zh.json` 和 `messages/en.json` 的文章数据中
  - ✅ 确保覆盖定义、对比、应用、局限性等问题类型
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 10. 创建 Q&A 组件
  - 创建 `components/Blog/QASection.tsx`
  - 实现可折叠的 Q&A 展示
  - 添加 Schema.org Question/Answer 标记
  - 实现搜索和过滤功能
  - _Requirements: 5.1, 7.1, 7.2, 7.3_

- [x] 10.1 编写 Q&A 系统的属性测试
  - **Property 13: Q&A component presence**
  - **Property 23: Comparison question coverage**
  - **Property 24: Application scenario coverage**
  - **Property 25: Limitation discussion coverage**
  - **Property 26: Implementation steps presence**
  - **Property 27: Best practices section**
  - **Validates: Requirements 5.1, 7.1, 7.2, 7.3, 7.4, 7.5**

- [x] 11. 集成 Q&A 到博客文章页面
  - 修改 `app/[locale]/blog/[slug]/page.tsx`
  - 在文章内容之后、作者信息之前添加 Q&A 组件
  - 确保 Q&A 正确渲染并支持交互
  - _Requirements: 5.1, 7.1_



## Phase 4: 结构化数据增强

- [x] 12. 增强 Schema.org 结构化数据
  - 创建 `lib/geo/schemaGenerator.ts`
  - 扩展现有的 BlogPosting schema（当前在 `app/[locale]/blog/[slug]/page.tsx`）
  - 添加 `about` 字段（DefinedTerm 数组）
  - 添加 `teaches` 字段（知识点列表）
  - 添加 `mentions` 字段（提及的技术、工具）
  - 添加 `isPartOf` 字段（文章系列）
  - 添加 `mainEntity` 字段（Q&A 结构）
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 12.1 编写结构化数据的属性测试
  - **Property 31: Schema.org JSON-LD presence**
  - **Property 32: BlogPosting type usage**
  - **Property 33: Author structured data completeness**
  - **Property 34: Relationship markup presence**
  - **Property 35: Date fields presence**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [x] 13. 更新博客文章页面的结构化数据
  - 修改 `app/[locale]/blog/[slug]/page.tsx` 中的 JSON-LD 生成
  - 集成增强的 Schema.org 数据
  - 添加 Q&A 结构到 mainEntity
  - 添加作者完整信息（包括专业背景）
  - 确保日期格式符合 ISO 8601
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. 实现 Schema.org 验证工具
  - 创建 `scripts/validate-schema.ts`
  - 实现 JSON-LD 格式验证
  - 实现必需字段检查
  - 生成验证报告
  - 集成到构建流程
  - _Requirements: 10.1_


## Phase 5: 权威信号和可验证性

- [x] 15. 增强作者信息系统
  - 扩展 `messages/zh.json` 和 `messages/en.json` 中的作者信息
  - 添加 `expertise` 字段（专业领域数组）
  - 添加 `credentials` 字段（学术/专业资质）
  - 添加 `projects` 字段（项目经验，包含数量）
  - 为 Seal Wax 和其他作者完善信息
  - _Requirements: 3.1, 3.3, 3.4_

- [x] 15.1 编写权威信号的属性测试
  - **Property 7: Author information completeness**
  - **Property 8: Context specification**
  - **Property 9: Quantified experience evidence**
  - **Property 10: Knowledge source attribution**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [ ] 16. 实现概念权威标记组件
  - 创建 `components/Blog/ConceptMarker.tsx`
  - 实现核心概念的高亮和标记
  - 添加悬浮提示显示定义
  - 添加 Schema.org DefinedTerm 标记
  - _Requirements: 8.1, 8.3_

- [x] 17. 添加引用和参考来源支持
  - 在文章数据结构中添加 `citations` 字段
  - 创建 `components/Blog/Citations.tsx` 组件
  - 实现引用列表展示
  - 添加外部链接和参考文献
  - _Requirements: 4.3_

- [x] 17.1 编写可验证性的属性测试
  - **Property 12: Citation presence**
  - **Validates: Requirements 4.3**


## Phase 6: 内容结构优化

- [x] 18. 重构现有博客文章内容
  - 优化 4 篇文章的结构（web3-security-trends-2025, smart-contract-audit-guide, defi-risk-management, benign-arbitrage-theory）
  - 添加明确的定义句（"在本文中，XXX 指的是……"）
  - 添加明确的结论句（使用"因此"、"结论是"）
  - 确保段落长度不超过 300 字符
  - 将长段落拆分为结构化的知识块
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 19. 优化列表和表格结构
  - 检查所有文章的列表格式
  - 确保使用 `<ul>` 或 `<ol>` 标签
  - 为对比内容添加表格结构
  - 优化要点总结的 bullet-point 格式
  - _Requirements: 1.3, 5.3, 5.4_

- [ ]* 19.1 编写 LLM 友好结构的属性测试
  - **Property 14: Definition block structure**
  - **Property 15: Comparison table usage**
  - **Property 16: Bullet-point summary presence**
  - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 20. 添加使用场景和上下文标注
  - 在技术文章中添加"在 Web3 智能合约审计中"等场景描述
  - 在概念首次出现时添加上下文说明
  - 确保每个技术术语都有明确的使用场景
  - _Requirements: 3.2_

- [x] 21. 实现步骤说明和最佳实践部分
  - 为 how-to 类文章添加有序步骤列表
  - 为技术指南添加"最佳实践"部分
  - 使用清晰的标题和子标题
  - _Requirements: 7.4, 7.5_


## Phase 7: 多语言 GEO 优化

- [x] 22. 确保中英文版本的 GEO 特性对等
  - 检查所有中文文章是否有对应的英文版本
  - 确保两个版本都有 AI Summary
  - 确保两个版本都有 Q&A
  - 确保知识块数量相当
  - _Requirements: 11.1_

- [ ]* 22.1 编写多语言对等性的属性测试
  - **Property 36: Feature parity across languages**
  - **Validates: Requirements 11.1**

- [x] 23. 增强语言元数据
  - 确保所有页面有正确的 `lang` 属性（当前在 `app/[locale]/layout.tsx`）
  - 在结构化数据中添加 `inLanguage` 字段
  - 验证语言代码符合 BCP 47 标准
  - _Requirements: 11.2_

- [ ]* 23.1 编写语言元数据的属性测试
  - **Property 37: Language metadata presence**
  - **Validates: Requirements 11.2**

- [x] 24. 实现术语翻译一致性
  - 创建中英文术语对照表
  - 确保概念定义在两种语言中语义等价
  - 在中文文章中首次出现专业术语时添加英文原文
  - 例如："智能合约（Smart Contract）"
  - _Requirements: 11.3, 11.5_

- [ ]* 24.1 编写术语翻译的属性测试
  - **Property 38: Terminology translation consistency**
  - **Property 40: English term preservation in Chinese**
  - **Validates: Requirements 11.3, 11.5**

- [x] 25. 优化 hreflang 标记
  - 检查所有页面的 hreflang 链接（当前在 metadata 中）
  - 确保中英文版本互相链接
  - 添加 x-default 标记
  - 验证 URL 格式正确
  - _Requirements: 11.4_

- [ ]* 25.1 编写 hreflang 的属性测试
  - **Property 39: Hreflang link presence**
  - **Validates: Requirements 11.4**


## Phase 8: 构建时验证和工具

- [x] 26. 实现 GEO 质量检查工具
  - 创建 `scripts/geo-check.ts`
  - 检查所有文章是否有 AI Summary
  - 检查术语使用的一致性
  - 检查段落长度
  - 检查模糊词汇和夸张词汇
  - 生成质量报告
  - _Requirements: 所有需求_

- [x] 27. 实现多语言对等性检查工具
  - 创建 `scripts/check-multilingual-parity.ts`
  - 比较中英文版本的 GEO 特性
  - 检查 AI Summary 是否都存在
  - 检查知识块数量差异
  - 生成差异报告
  - _Requirements: 11.1_

- [x] 28. 集成验证到构建流程
  - 修改 `package.json` 添加验证脚本
  - 在 `npm run build` 前运行 GEO 检查
  - 设置质量门槛（如 AI Summary 覆盖率 > 90%）
  - _Requirements: 所有需求_

- [x] 29. 创建内容创作辅助工具
  - 创建 `scripts/create-article.ts` 脚本
  - 提供文章模板生成
  - 自动生成基础的 AI Summary 结构
  - 提供术语词典查询
  - 实时验证 GEO 规范
  - _Requirements: 所有需求_


## Phase 9: 测试和验证

- [ ]* 30. 设置属性测试框架
  - 安装 fast-check 依赖
  - 配置 Jest 支持属性测试
  - 创建测试数据生成器（`__tests__/generators/`）
  - 实现 `articleGenerator`, `aiSummaryGenerator` 等
  - _Requirements: 所有需求_

- [ ]* 31. 实现所有属性测试
  - 创建 `__tests__/properties/` 目录
  - 实现 40 个正确性属性的测试
  - 确保每个测试运行至少 100 次迭代
  - 为每个测试添加明确的注释标注属性编号
  - _Requirements: 所有需求_

- [ ]* 32. 编写单元测试
  - 测试 AI Summary 组件
  - 测试 Knowledge Block Parser
  - 测试 Q&A Generator
  - 测试术语词典
  - 测试内容验证器
  - 目标覆盖率 > 80%
  - _Requirements: 所有需求_

- [ ]* 33. 实现集成测试
  - 使用 Playwright 测试完整的文章页面
  - 验证 AI Summary 正确渲染
  - 验证 Q&A 正确展示
  - 验证结构化数据正确嵌入
  - 验证多语言切换
  - _Requirements: 所有需求_

- [ ]* 34. Checkpoint - 确保所有测试通过
  - 运行所有单元测试
  - 运行所有属性测试
  - 运行所有集成测试
  - 修复所有失败的测试
  - 确保测试覆盖率达标
  - 如有问题，询问用户


## Phase 10: 样式和用户体验优化

- [ ] 35. 设计 AI Summary 的视觉样式
  - 创建独特的视觉设计区分 AI Summary
  - 使用渐变背景和图标
  - 确保与网站整体风格一致
  - 支持暗色模式
  - 添加动画效果（可选）
  - _Requirements: 6.1_

- [ ] 36. 优化 Q&A 组件的交互
  - 实现平滑的展开/折叠动画
  - 添加搜索高亮
  - 实现键盘导航
  - 优化移动端体验
  - _Requirements: 5.1_

- [ ] 37. 实现概念高亮和工具提示
  - 为核心概念添加视觉高亮
  - 实现悬浮显示定义的工具提示
  - 添加点击跳转到术语词典的功能
  - 优化性能，避免过多的 DOM 操作
  - _Requirements: 8.1, 8.3_

- [ ] 38. 优化页面加载性能
  - 实现 AI Summary 的懒加载
  - 优化知识块解析的性能
  - 使用 Next.js 的静态生成
  - 优化图片和资源加载
  - 测试 Lighthouse 性能评分
  - _Requirements: 所有需求_


## Phase 11: 文档和培训

- [ ] 39. 编写 GEO 优化指南
  - 创建 `docs/GEO-GUIDE.md`
  - 说明 GEO 的概念和重要性
  - 提供内容创作的最佳实践
  - 提供示例和模板
  - 说明如何使用验证工具
  - _Requirements: 所有需求_

- [ ] 40. 创建术语词典文档
  - 创建 `docs/TERMINOLOGY.md`
  - 列出所有核心概念及其定义
  - 说明术语使用规范
  - 提供中英文对照
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ] 41. 编写开发者文档
  - 创建 `docs/GEO-DEVELOPMENT.md`
  - 说明 GEO 系统的架构
  - 说明如何添加新的 GEO 特性
  - 说明如何运行测试
  - 提供 API 文档
  - _Requirements: 所有需求_

## Phase 12: 效果验证和优化

- [ ] 42. 实施 LLM 引用测试
  - 创建测试问题列表
  - 在 ChatGPT 中测试关键问题
  - 在 Claude 中测试关键问题
  - 在 Perplexity 中测试关键问题
  - 记录引用情况和准确性
  - _Requirements: 12.2, 12.3, 12.4_

- [ ] 43. 收集和分析反馈
  - 记录 LLM 引用的案例
  - 分析引用的内容结构
  - 识别优化机会
  - 调整内容和结构
  - _Requirements: 12.4, 12.5_

- [ ] 44. 迭代优化
  - 根据测试结果优化 AI Summary
  - 优化知识块结构
  - 优化 Q&A 内容
  - 优化术语定义
  - 重新测试验证效果
  - _Requirements: 所有需求_

- [ ] 45. Final Checkpoint - 确保所有功能正常
  - 验证所有 GEO 特性已实现
  - 验证所有测试通过
  - 验证文档完整
  - 验证性能达标
  - 进行最终的 LLM 引用测试
  - 如有问题，询问用户

---

## 任务执行说明

1. **按顺序执行**: 任务按照依赖关系组织，建议按顺序执行
2. **可选任务**: 标记为 `*` 的任务是可选的，主要是测试相关，可以根据时间和资源决定是否实施
3. **Checkpoint**: 在关键节点设置了 checkpoint，确保质量
4. **迭代开发**: 可以先完成核心功能，再逐步添加优化和测试
5. **持续验证**: 每完成一个阶段，都应该进行验证和测试

## 预估工作量

- **Phase 1-2**: 基础设施和 AI Summary (3-4 天)
- **Phase 3-4**: Q&A 和结构化数据 (2-3 天)
- **Phase 5-6**: 权威信号和内容优化 (3-4 天)
- **Phase 7**: 多语言优化 (2 天)
- **Phase 8-9**: 工具和测试 (3-4 天)
- **Phase 10-11**: 样式和文档 (2 天)
- **Phase 12**: 验证和优化 (持续进行)

**总计**: 约 15-20 个工作日（不包括可选的测试任务）

## 成功标准

- ✅ 所有核心文章都有 AI Summary
- ✅ 所有核心文章都有 Q&A
- ✅ 结构化数据完整且有效
- ✅ 术语使用一致
- ✅ 中英文版本对等
- ✅ 所有属性测试通过
- ✅ 在主流 LLM 中能够被准确引用
