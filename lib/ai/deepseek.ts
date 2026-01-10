/**
 * DeepSeek AI Service
 * 
 * Provides AI-powered content generation using DeepSeek API
 */

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekService {
  private apiKey: string;
  private apiBase: string;

  constructor(apiKey?: string, apiBase?: string) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
    this.apiBase = apiBase || process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1';
    
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not found. Set DEEPSEEK_API_KEY environment variable.');
    }
  }

  async chat(messages: DeepSeekMessage[], options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}): Promise<string> {
    try {
      const response = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || 'deepseek-chat',
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        
        // Provide helpful error messages
        if (response.status === 401) {
          throw new Error(
            `Authentication failed. Please check your DeepSeek API key in .env.local\n` +
            `Get your API key from: https://platform.deepseek.com/api_keys\n` +
            `Error details: ${error}`
          );
        } else if (response.status === 429) {
          throw new Error(
            `Rate limit exceeded. Please wait a moment and try again.\n` +
            `Error details: ${error}`
          );
        } else {
          throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
        }
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        throw new Error(
          `Network error: Unable to connect to DeepSeek API.\n` +
          `Please check your internet connection.\n` +
          `Original error: ${error.message}`
        );
      }
      throw error;
    }
  }

  async generateOutline(title: string, locale: 'zh' | 'en', category: string): Promise<string> {
    const systemPrompt = locale === 'zh' 
      ? `你是一位专业的Web3和区块链技术作家。你的任务是为技术文章生成详细的大纲。

**重要：必须使用中文生成大纲！**

大纲应该：
1. 结构清晰，层次分明
2. 包含明确的定义句（使用"X是指..."格式）
3. 包含对比分析（如果适用）
4. 包含实际应用场景
5. 包含局限性讨论
6. 包含明确的结论
7. 符合GEO优化要求`
      : `You are a professional Web3 and blockchain technology writer. Your task is to generate detailed outlines for technical articles.

**CRITICAL: You MUST generate the outline in English! Do NOT use Chinese characters!**

The outline should:
1. Have clear structure and hierarchy
2. Include explicit definition sentences (using "X is defined as..." format)
3. Include comparative analysis (if applicable)
4. Include practical use cases
5. Include limitation discussions
6. Include clear conclusions
7. Follow GEO optimization requirements`;

    const userPrompt = locale === 'zh'
      ? `请为以下文章生成详细大纲：

标题：${title}
分类：${category}

要求：
- 包含6-10个主要章节
- 每个章节包含2-4个子章节
- 第一章节必须是概述和核心概念定义
- 必须包含"实际应用场景"章节
- 必须包含"局限性与注意事项"章节
- 最后章节必须是结论
- 使用Markdown格式
- 每个章节标题要具体明确`
      : `Please generate a detailed outline for the following article:

Title: ${title}
Category: ${category}

Requirements:
- Include 6-10 main sections
- Each section has 2-4 subsections
- First section must be overview and core concept definitions
- Must include "Practical Use Cases" section
- Must include "Limitations and Considerations" section
- Last section must be conclusion
- Use Markdown format
- Section titles should be specific and clear`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  }

  async generateSection(
    title: string,
    sectionTitle: string,
    outline: string,
    previousContent: string,
    locale: 'zh' | 'en',
    terminology: string[]
  ): Promise<string> {
    const systemPrompt = locale === 'zh'
      ? `你是一位专业的Web3和区块链技术作家。你正在撰写一篇技术文章的某个章节。

**重要：你必须使用中文撰写所有内容。**

GEO优化要求：
1. 使用明确的定义句（"在本文中，X指的是..."）
2. 段落不超过300字符
3. 使用陈述句，避免反问句
4. 避免模糊词汇（可能、也许、大概）
5. 避免夸张词汇（颠覆、革命性、史无前例、完美、最强、终极）
6. 使用结构化列表（<ul>或<ol>）
7. 包含明确的结论标识（"因此"、"综上所述"）
8. 使用规范术语，首次出现时添加英文原文

术语规范：${terminology.join(', ')}`
      : `You are a professional Web3 and blockchain technology writer. You are writing a section of a technical article.

**CRITICAL: You MUST write ALL content in English. Do NOT use Chinese characters.**

GEO optimization requirements:
1. Use explicit definition sentences ("In this article, X is defined as...")
2. Paragraphs should not exceed 300 characters
3. Use declarative sentences, avoid rhetorical questions
4. Avoid vague terms (maybe, perhaps, possibly, approximately)
5. Avoid hyperbolic terms (revolutionary, groundbreaking, unprecedented, perfect, ultimate)
6. Use structured lists (<ul> or <ol>)
7. Include clear conclusion markers ("therefore", "in conclusion")
8. Use canonical terminology only (e.g., "DeFi" not "Decentralized Finance", "NFT" not "Non-Fungible Token", "Ethereum" not "ETH")

Terminology standards: ${terminology.join(', ')}`;

    const userPrompt = locale === 'zh'
      ? `文章标题：${title}

完整大纲：
${outline}

当前章节：${sectionTitle}

之前的内容：
${previousContent || '（这是第一个章节）'}

请撰写"${sectionTitle}"章节的内容。

**重要：必须使用中文撰写！**

要求：
- 内容详实，深入浅出
- 严格遵守GEO优化要求
- 使用规范术语
- 包含具体例子和数据
- 如果是定义章节，使用"在本文中，X指的是..."格式
- 如果是结论章节，使用"因此"、"综上所述"等标识
- 使用HTML格式（<p>、<ul>、<ol>、<strong>等标签）
- 段落之间用空行分隔
- 避免使用夸张词汇：革命性、颠覆、史无前例、完美、最强、终极`
      : `Article title: ${title}

Full outline:
${outline}

Current section: ${sectionTitle}

Previous content:
${previousContent || '(This is the first section)'}

Please write the content for the "${sectionTitle}" section.

**CRITICAL: You MUST write in English! Do NOT use any Chinese characters!**

Requirements:
- Detailed and accessible content
- Strictly follow GEO optimization requirements
- Use canonical terminology ONLY (DeFi not "Decentralized Finance", NFT not "Non-Fungible Token", Ethereum not "ETH")
- Include specific examples and data
- If definition section, use "In this article, X is defined as..." format
- If conclusion section, use "therefore", "in conclusion" markers
- Use HTML format (<p>, <ul>, <ol>, <strong> tags)
- Separate paragraphs with blank lines
- Avoid vague terms: maybe, perhaps, possibly, approximately
- Avoid hyperbolic terms: revolutionary, groundbreaking, unprecedented, perfect, ultimate`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { max_tokens: 2000 });
  }

  async generateAISummary(
    title: string,
    content: string,
    locale: 'zh' | 'en'
  ): Promise<{
    whatIs: string;
    whyImportant: string;
    useCases: string[];
    keyTakeaways: string[];
  }> {
    const systemPrompt = locale === 'zh'
      ? '你是一位专业的技术内容总结专家。请为文章生成结构化的AI Summary，帮助大语言模型快速理解文章核心内容。\n\n**重要：必须使用中文生成摘要！**'
      : 'You are a professional technical content summarization expert. Generate a structured AI Summary to help LLMs quickly understand the core content.\n\n**CRITICAL: You MUST write the summary in English! Do NOT use Chinese characters!**';

    const userPrompt = locale === 'zh'
      ? `文章标题：${title}

文章内容：
${content.substring(0, 3000)}...

请生成AI Summary，包含以下四个部分（使用JSON格式）：
1. whatIs: 核心定义（1-2句话）
2. whyImportant: 为什么重要（1-2句话）
3. useCases: 适用场景（3-5个场景，数组格式）
4. keyTakeaways: 核心要点（3-5个要点，数组格式）

要求：
- 简洁明确
- 突出核心价值
- 面向LLM优化
- 返回纯JSON格式`
      : `Article title: ${title}

Article content:
${content.substring(0, 3000)}...

Generate AI Summary with the following four parts (in JSON format):
1. whatIs: Core definition (1-2 sentences)
2. whyImportant: Why it matters (1-2 sentences)
3. useCases: Use cases (3-5 scenarios, array format)
4. keyTakeaways: Key takeaways (3-5 points, array format)

Requirements:
- Concise and clear
- Highlight core value
- Optimized for LLMs
- Return pure JSON format`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI Summary JSON');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async generateQAPairs(
    title: string,
    content: string,
    locale: 'zh' | 'en'
  ): Promise<Array<{
    question: string;
    answer: string;
    category: 'definition' | 'comparison' | 'application' | 'limitation';
  }>> {
    const systemPrompt = locale === 'zh'
      ? '你是一位专业的技术问答专家。请为文章生成全面的Q&A，覆盖定义、对比、应用、局限性等方面。\n\n**重要：必须使用中文生成问答！**'
      : 'You are a professional technical Q&A expert. Generate comprehensive Q&A covering definition, comparison, application, and limitations.\n\n**CRITICAL: You MUST write Q&A in English! Do NOT use Chinese characters!**';

    const userPrompt = locale === 'zh'
      ? `文章标题：${title}

文章内容：
${content.substring(0, 3000)}...

请生成5-8个Q&A对，包含以下类型（使用JSON数组格式）：
1. definition: 定义类问题（"什么是X？"）
2. comparison: 对比类问题（"X和Y有什么区别？"）
3. application: 应用类问题（"X适用于哪些场景？"）
4. limitation: 局限性问题（"X有哪些局限性？"）

每个Q&A包含：
- question: 问题
- answer: 答案（2-3句话）
- category: 类型（definition/comparison/application/limitation）

返回纯JSON数组格式`
      : `Article title: ${title}

Article content:
${content.substring(0, 3000)}...

Generate 5-8 Q&A pairs with the following types (in JSON array format):
1. definition: Definition questions ("What is X?")
2. comparison: Comparison questions ("What's the difference between X and Y?")
3. application: Application questions ("What are the use cases for X?")
4. limitation: Limitation questions ("What are the limitations of X?")

Each Q&A includes:
- question: The question
- answer: The answer (2-3 sentences)
- category: Type (definition/comparison/application/limitation)

Return pure JSON array format`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Q&A JSON');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async improveContent(
    content: string,
    issues: string[],
    locale: 'zh' | 'en'
  ): Promise<string> {
    const systemPrompt = locale === 'zh'
      ? '你是一位专业的技术内容编辑。请根据GEO优化建议改进文章内容。'
      : 'You are a professional technical content editor. Improve article content based on GEO optimization suggestions.';

    const userPrompt = locale === 'zh'
      ? `原始内容：
${content}

需要改进的问题：
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

请改进内容，确保：
- 解决所有列出的问题
- 保持原有信息完整
- 符合GEO优化要求
- 返回改进后的HTML内容`
      : `Original content:
${content}

Issues to fix:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Please improve the content, ensuring:
- All listed issues are resolved
- Original information is preserved
- GEO optimization requirements are met
- Return improved HTML content`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  }
}
