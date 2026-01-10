#!/usr/bin/env tsx
/**
 * Article Creation Assistant Tool
 * 
 * Interactive tool to help content creators write GEO-optimized articles.
 * Provides templates, terminology lookup, and real-time GEO validation.
 * 
 * Usage:
 *   npm run create-article
 *   npm run create-article -- --id my-article --locale zh
 *   npm run create-article -- --template technical-guide
 * 
 * Requirements: All requirements from the GEO optimization spec
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { ContentValidator } from '../lib/geo/contentValidator';
import { TerminologyManager, loadTerminologyDictionary } from '../lib/geo/terminology';
import type {
  TerminologyDictionary,
  TerminologyEntry,
  AISummary,
  QAPair,
} from '../types/geo';

// ============================================================================
// Configuration
// ============================================================================

interface ArticleTemplate {
  name: string;
  description: string;
  structure: string[];
  aiSummaryTemplate: Partial<AISummary>;
  qaTemplate: QAPair[];
}

interface CreateOptions {
  id?: string;
  locale?: 'zh' | 'en';
  template?: string;
  interactive?: boolean;
}

interface ArticleData {
  id: string;
  locale: 'zh' | 'en';
  title: string;
  description: string;
  content: string;
  aiSummary: AISummary;
  qaPairs: QAPair[];
  author: string;
  authorBio: string;
  category: string;
  keywords: string[];
  datePublished: string;
}


// ============================================================================
// Article Templates
// ============================================================================

const TEMPLATES: Record<string, ArticleTemplate> = {
  'technical-guide': {
    name: 'Technical Guide',
    description: 'Step-by-step technical guide with best practices',
    structure: [
      '## 概述',
      '## 核心概念',
      '### [概念1]定义',
      '在本文中，[概念1]指的是...',
      '## 实施步骤',
      '1. 步骤一',
      '2. 步骤二',
      '3. 步骤三',
      '## 最佳实践',
      '## 常见问题',
      '## 局限性与注意事项',
      '## 结论',
      '因此，我们可以得出结论：...',
    ],
    aiSummaryTemplate: {
      whatIs: '[技术/方法]是...',
      whyImportant: '这项技术重要是因为...',
      useCases: ['场景1', '场景2', '场景3'],
      keyTakeaways: ['要点1', '要点2', '要点3'],
    },
    qaTemplate: [
      {
        question: '什么是[技术名称]？',
        answer: '[技术名称]是...',
        category: 'definition',
        relatedConcepts: [],
      },
      {
        question: '[技术名称]适用于哪些场景？',
        answer: '主要适用于...',
        category: 'application',
        relatedConcepts: [],
      },
      {
        question: '[技术名称]有哪些局限性？',
        answer: '主要局限性包括...',
        category: 'limitation',
        relatedConcepts: [],
      },
    ],
  },
  'concept-explanation': {
    name: 'Concept Explanation',
    description: 'In-depth explanation of a technical concept',
    structure: [
      '## 什么是[概念名称]',
      '在本文中，[概念名称]指的是...',
      '## 为什么重要',
      '## 工作原理',
      '## 与相关概念的对比',
      '| 特性 | [概念A] | [概念B] |',
      '|------|---------|---------|',
      '| 特性1 | ... | ... |',
      '## 实际应用案例',
      '## 优势与劣势',
      '### 优势',
      '### 劣势',
      '## 结论',
      '综上所述，[概念名称]...',
    ],
    aiSummaryTemplate: {
      whatIs: '[概念]是...',
      whyImportant: '理解这个概念重要是因为...',
      useCases: ['应用场景1', '应用场景2'],
      keyTakeaways: ['核心要点1', '核心要点2'],
    },
    qaTemplate: [
      {
        question: '什么是[概念名称]？',
        answer: '[概念名称]是...',
        category: 'definition',
        relatedConcepts: [],
      },
      {
        question: '[概念A]和[概念B]有什么区别？',
        answer: '主要区别在于...',
        category: 'comparison',
        relatedConcepts: [],
      },
    ],
  },
  'security-analysis': {
    name: 'Security Analysis',
    description: 'Security analysis and risk assessment',
    structure: [
      '## 安全威胁概述',
      '## 常见漏洞类型',
      '### 漏洞1：[名称]',
      '在[使用场景]中，[漏洞名称]指的是...',
      '### 漏洞2：[名称]',
      '## 攻击向量分析',
      '## 防护措施',
      '1. 措施一',
      '2. 措施二',
      '3. 措施三',
      '## 审计检查清单',
      '- [ ] 检查项1',
      '- [ ] 检查项2',
      '## 案例研究',
      '## 最佳实践建议',
      '## 结论',
      '因此，为了确保安全...',
    ],
    aiSummaryTemplate: {
      whatIs: '本文分析了[安全问题]...',
      whyImportant: '这些安全问题重要是因为...',
      useCases: ['适用于智能合约审计', '适用于DeFi协议安全'],
      keyTakeaways: ['关键发现1', '关键发现2', '关键发现3'],
    },
    qaTemplate: [
      {
        question: '什么是[安全威胁]？',
        answer: '[安全威胁]是...',
        category: 'definition',
        relatedConcepts: [],
      },
      {
        question: '如何防护[安全威胁]？',
        answer: '主要防护措施包括...',
        category: 'application',
        relatedConcepts: [],
      },
      {
        question: '[安全措施]有哪些局限性？',
        answer: '局限性包括...',
        category: 'limitation',
        relatedConcepts: [],
      },
    ],
  },
  'trend-analysis': {
    name: 'Trend Analysis',
    description: 'Industry trend analysis and predictions',
    structure: [
      '## 行业现状',
      '## 主要趋势',
      '### 趋势1：[名称]',
      '### 趋势2：[名称]',
      '### 趋势3：[名称]',
      '## 驱动因素',
      '## 影响分析',
      '## 机遇与挑战',
      '### 机遇',
      '### 挑战',
      '## 未来展望',
      '## 结论',
      '综上所述，行业发展趋势表明...',
    ],
    aiSummaryTemplate: {
      whatIs: '本文分析了[行业/领域]的发展趋势...',
      whyImportant: '了解这些趋势重要是因为...',
      useCases: ['适用于投资决策', '适用于技术选型'],
      keyTakeaways: ['趋势1', '趋势2', '趋势3'],
    },
    qaTemplate: [
      {
        question: '[行业]的主要趋势是什么？',
        answer: '主要趋势包括...',
        category: 'definition',
        relatedConcepts: [],
      },
      {
        question: '这些趋势对[相关方]有什么影响？',
        answer: '主要影响包括...',
        category: 'application',
        relatedConcepts: [],
      },
    ],
  },
};


// ============================================================================
// Interactive CLI
// ============================================================================

class ArticleCreator {
  private rl: readline.Interface;
  private terminologyManager: TerminologyManager | null = null;
  private validator: ContentValidator;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.validator = new ContentValidator();
    this.loadTerminology();
  }

  private loadTerminology(): void {
    const terminologyPath = path.join(process.cwd(), 'data', 'terminology.json');
    if (fs.existsSync(terminologyPath)) {
      try {
        const data = fs.readFileSync(terminologyPath, 'utf-8');
        const dictionary = JSON.parse(data) as TerminologyDictionary;
        this.terminologyManager = loadTerminologyDictionary(dictionary);
        console.log('✅ Terminology dictionary loaded\n');
      } catch (error) {
        console.warn('⚠️  Failed to load terminology dictionary\n');
      }
    }
  }

  async prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async selectTemplate(): Promise<ArticleTemplate> {
    console.log('📝 Available Templates:\n');
    const templateKeys = Object.keys(TEMPLATES);
    templateKeys.forEach((key, index) => {
      const template = TEMPLATES[key];
      console.log(`${index + 1}. ${template.name}`);
      console.log(`   ${template.description}\n`);
    });

    const choice = await this.prompt('Select template (1-4): ');
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < templateKeys.length) {
      return TEMPLATES[templateKeys[index]];
    }

    console.log('Invalid choice, using default template\n');
    return TEMPLATES['technical-guide'];
  }

  async createArticle(options: CreateOptions = {}): Promise<ArticleData> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('           GEO-Optimized Article Creation Assistant            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Step 1: Basic Information
    console.log('📋 Step 1: Basic Information\n');
    
    const id = options.id || await this.prompt('Article ID (e.g., web3-security-guide): ');
    const locale = options.locale || (await this.prompt('Language (zh/en) [zh]: ') || 'zh') as 'zh' | 'en';
    const title = await this.prompt('Article Title: ');
    const description = await this.prompt('Short Description: ');
    const category = await this.prompt('Category (e.g., security, defi, web3): ');
    const keywordsInput = await this.prompt('Keywords (comma-separated): ');
    const keywords = keywordsInput.split(',').map(k => k.trim());

    console.log('');

    // Step 2: Select Template
    console.log('📝 Step 2: Select Template\n');
    const template = options.template 
      ? TEMPLATES[options.template] || await this.selectTemplate()
      : await this.selectTemplate();

    console.log(`✅ Using template: ${template.name}\n`);

    // Step 3: AI Summary
    console.log('🤖 Step 3: AI Summary\n');
    console.log('The AI Summary helps LLMs quickly understand your article.\n');

    const whatIs = await this.prompt('What is it? (Core definition): ');
    const whyImportant = await this.prompt('Why important? (Significance): ');
    const useCasesInput = await this.prompt('Use cases (comma-separated): ');
    const useCases = useCasesInput.split(',').map(u => u.trim());
    const keyTakeawaysInput = await this.prompt('Key takeaways (comma-separated): ');
    const keyTakeaways = keyTakeawaysInput.split(',').map(k => k.trim());

    const aiSummary: AISummary = {
      whatIs,
      whyImportant,
      useCases,
      keyTakeaways,
    };

    console.log('');

    // Step 4: Content Structure
    console.log('📄 Step 4: Content Structure\n');
    console.log('Template structure:');
    template.structure.forEach(line => console.log(`  ${line}`));
    console.log('');

    const useTemplate = await this.prompt('Use this structure? (y/n) [y]: ');
    const content = useTemplate.toLowerCase() !== 'n' 
      ? template.structure.join('\n\n')
      : await this.prompt('Enter custom content structure: ');

    console.log('');

    // Step 5: Q&A Pairs
    console.log('❓ Step 5: Q&A Coverage\n');
    console.log('Q&A helps LLMs answer common questions about your topic.\n');

    const qaPairs: QAPair[] = [];
    const addQA = await this.prompt('Add Q&A pairs? (y/n) [y]: ');

    if (addQA.toLowerCase() !== 'n') {
      let addMore = true;
      while (addMore) {
        const question = await this.prompt('Question: ');
        const answer = await this.prompt('Answer: ');
        const categoryInput = await this.prompt('Category (definition/comparison/application/limitation): ');
        
        qaPairs.push({
          question,
          answer,
          category: categoryInput as QAPair['category'] || 'definition',
          relatedConcepts: [],
        });

        const more = await this.prompt('Add another Q&A? (y/n) [n]: ');
        addMore = more.toLowerCase() === 'y';
      }
    }

    console.log('');

    // Step 6: Author Information
    console.log('👤 Step 6: Author Information\n');
    const author = await this.prompt('Author name [Seal Wax]: ') || 'Seal Wax';
    const authorBio = await this.prompt('Author bio (optional): ') || 
      '刻熵科技创始人，专注于 Web3 安全与智能合约开发';

    console.log('');

    // Create article data
    const articleData: ArticleData = {
      id,
      locale,
      title,
      description,
      content,
      aiSummary,
      qaPairs,
      author,
      authorBio,
      category,
      keywords,
      datePublished: new Date().toISOString().split('T')[0],
    };

    return articleData;
  }

  async validateArticle(articleData: ArticleData): Promise<void> {
    console.log('🔍 Step 7: GEO Validation\n');
    console.log('Running GEO quality checks...\n');

    // Validate content
    const report = this.validator.validate(
      articleData.id,
      articleData.content,
      true, // has AI Summary
      articleData.qaPairs.length > 0,
      false // citations will be added in content
    );

    console.log(`Overall Score: ${report.overallScore}/100\n`);

    // Show metrics
    console.log('Metrics:');
    console.log(`  ✓ AI Summary: ${report.metrics.hasAISummary ? 'Yes' : 'No'}`);
    console.log(`  ✓ Q&A Coverage: ${report.metrics.hasQACoverage ? 'Yes' : 'No'}`);
    console.log(`  ✓ Definitions: ${report.metrics.hasDefinitions ? 'Yes' : 'No'}`);
    console.log(`  ✓ Conclusions: ${report.metrics.hasConclusions ? 'Yes' : 'No'}`);
    console.log('');

    // Show issues
    if (report.issues.length > 0) {
      console.log(`⚠️  Found ${report.issues.length} issue(s):\n`);
      report.issues.slice(0, 5).forEach((issue, idx) => {
        console.log(`${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
        console.log(`   ${issue.message}\n`);
      });
    }

    // Show recommendations
    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:\n');
      report.recommendations.forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec}`);
      });
      console.log('');
    }

    // Check terminology
    if (this.terminologyManager) {
      const conflicts = this.terminologyManager.validateTerminologyConsistency(
        articleData.content,
        articleData.locale
      );

      if (conflicts.length > 0) {
        console.log(`⚠️  Found ${conflicts.length} terminology issue(s):\n`);
        conflicts.slice(0, 3).forEach((conflict, idx) => {
          console.log(`${idx + 1}. ${conflict.term}: ${conflict.articleDefinition}`);
        });
        console.log('');
      }
    }
  }

  async saveArticle(articleData: ArticleData): Promise<void> {
    console.log('💾 Step 8: Save Article\n');

    // Prepare article entry for messages file
    const articleEntry = {
      title: articleData.title,
      description: articleData.description,
      content: articleData.content,
      aiSummary: articleData.aiSummary,
      qaPairs: articleData.qaPairs,
      author: articleData.author,
      authorBio: articleData.authorBio,
      category: articleData.category,
      keywords: articleData.keywords,
      datePublished: articleData.datePublished,
      image: `/blog-images/${articleData.id}-hero.webp`,
    };

    // Load existing messages
    const messagesPath = path.join(
      process.cwd(),
      'messages',
      `${articleData.locale}.json`
    );

    let messages: any = {};
    if (fs.existsSync(messagesPath)) {
      const data = fs.readFileSync(messagesPath, 'utf-8');
      messages = JSON.parse(data);
    }

    // Ensure blog.articles structure exists
    if (!messages.blog) {
      messages.blog = {};
    }
    if (!messages.blog.articles) {
      messages.blog.articles = {};
    }

    // Add article
    messages.blog.articles[articleData.id] = articleEntry;

    // Save messages file
    fs.writeFileSync(
      messagesPath,
      JSON.stringify(messages, null, 2),
      'utf-8'
    );

    console.log(`✅ Article saved to ${messagesPath}`);
    console.log(`   Article ID: ${articleData.id}\n`);

    // Generate markdown template file
    const templatePath = path.join(
      process.cwd(),
      'content',
      `${articleData.id}.md`
    );

    const markdownContent = this.generateMarkdownTemplate(articleData);
    
    // Create content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), 'content');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    fs.writeFileSync(templatePath, markdownContent, 'utf-8');
    console.log(`✅ Markdown template saved to ${templatePath}\n`);
  }

  generateMarkdownTemplate(articleData: ArticleData): string {
    let md = `---
id: ${articleData.id}
title: ${articleData.title}
description: ${articleData.description}
author: ${articleData.author}
category: ${articleData.category}
keywords: ${articleData.keywords.join(', ')}
datePublished: ${articleData.datePublished}
locale: ${articleData.locale}
---

# ${articleData.title}

## AI Summary

**What is it?**
${articleData.aiSummary.whatIs}

**Why Important?**
${articleData.aiSummary.whyImportant}

**Use Cases:**
${articleData.aiSummary.useCases.map(u => `- ${u}`).join('\n')}

**Key Takeaways:**
${articleData.aiSummary.keyTakeaways.map(k => `- ${k}`).join('\n')}

---

## Content

${articleData.content}

---

## Q&A

${articleData.qaPairs.map(qa => `
### ${qa.question}

${qa.answer}

*Category: ${qa.category}*
`).join('\n')}

---

## GEO Optimization Checklist

- [ ] Add clear definition sentences (使用 "X 是指..." 格式)
- [ ] Add explicit conclusion markers (使用 "因此"、"结论是")
- [ ] Use proper list structures (<ul> or <ol>)
- [ ] Keep paragraphs under 300 characters
- [ ] Avoid vague terms (可能、也许、大概)
- [ ] Avoid hyperbolic language (颠覆、革命性)
- [ ] Add citations and references
- [ ] Include comparison tables where appropriate
- [ ] Add context markers (在...中)
- [ ] Use canonical terminology from dictionary

---

## Notes

- Remember to create hero image: \`/blog-images/${articleData.id}-hero.webp\`
- Run \`npm run geo-check -- --article ${articleData.id}\` to validate
- Check terminology consistency with \`npm run validate-terminology\`
`;

    return md;
  }

  async showTerminologyHelp(): Promise<void> {
    if (!this.terminologyManager) {
      console.log('⚠️  Terminology dictionary not available\n');
      return;
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    Terminology Dictionary                      ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const entries = this.terminologyManager.getAllEntries();
    console.log(`Total terms: ${entries.length}\n`);

    // Group by category
    const categories = ['web3', 'blockchain', 'defi', 'security'] as const;
    
    for (const category of categories) {
      const categoryTerms = this.terminologyManager.getTermsByCategory(category);
      if (categoryTerms.length > 0) {
        console.log(`\n📚 ${category.toUpperCase()}\n`);
        categoryTerms.forEach(term => {
          console.log(`  • ${term.canonicalName}`);
          console.log(`    ${term.definition.substring(0, 80)}...`);
          if (term.translation) {
            console.log(`    EN: ${term.translation.en}`);
          }
          console.log('');
        });
      }
    }

    console.log('\n💡 Usage Tips:');
    console.log('  - Always use canonical names (not aliases)');
    console.log('  - Add definitions on first mention');
    console.log('  - Include English terms in Chinese articles');
    console.log('  - Check related terms for context\n');
  }

  async searchTerm(query: string): Promise<void> {
    if (!this.terminologyManager) {
      console.log('⚠️  Terminology dictionary not available\n');
      return;
    }

    const term = this.terminologyManager.findTerm(query);
    
    if (!term) {
      console.log(`❌ Term not found: ${query}\n`);
      console.log('💡 Try searching for:');
      const allTerms = this.terminologyManager.getAllEntries();
      const suggestions = allTerms
        .filter(t => 
          t.canonicalName.toLowerCase().includes(query.toLowerCase()) ||
          t.aliases.some(a => a.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5);
      
      suggestions.forEach(s => console.log(`  - ${s.canonicalName}`));
      console.log('');
      return;
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`  ${term.canonicalName}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`📖 Definition:`);
    console.log(`   ${term.definition}\n`);

    if (term.translation) {
      console.log(`🌐 Translation:`);
      console.log(`   EN: ${term.translation.en}`);
      console.log(`   ZH: ${term.translation.zh}\n`);
    }

    console.log(`📂 Category: ${term.category}`);
    console.log(`🔗 Context: ${term.context}\n`);

    if (term.aliases.length > 0) {
      console.log(`⚠️  Aliases (avoid using):`);
      term.aliases.forEach(alias => console.log(`   - ${alias}`));
      console.log('');
    }

    if (term.relatedTerms.length > 0) {
      console.log(`🔗 Related Terms:`);
      term.relatedTerms.forEach(related => console.log(`   - ${related}`));
      console.log('');
    }

    console.log(`📄 First defined in: ${term.firstDefinedIn}\n`);

    // Show formatted version for Chinese articles
    const formatted = this.terminologyManager.formatWithEnglish(term.canonicalName);
    if (formatted !== term.canonicalName) {
      console.log(`💡 Use in Chinese articles:`);
      console.log(`   ${formatted}\n`);
    }
  }

  close(): void {
    this.rl.close();
  }
}


// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  const options: CreateOptions = {
    interactive: true,
  };
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--id' && i + 1 < args.length) {
      options.id = args[++i];
    } else if (arg === '--locale' && i + 1 < args.length) {
      options.locale = args[++i] as 'zh' | 'en';
    } else if (arg === '--template' && i + 1 < args.length) {
      options.template = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg === '--list-templates') {
      listTemplates();
      process.exit(0);
    } else if (arg === '--terminology') {
      const creator = new ArticleCreator();
      await creator.showTerminologyHelp();
      creator.close();
      process.exit(0);
    } else if (arg === '--search' && i + 1 < args.length) {
      const query = args[++i];
      const creator = new ArticleCreator();
      await creator.searchTerm(query);
      creator.close();
      process.exit(0);
    }
  }
  
  const creator = new ArticleCreator();
  
  try {
    // Create article
    const articleData = await creator.createArticle(options);
    
    // Validate article
    await creator.validateArticle(articleData);
    
    // Ask to save
    const save = await creator.prompt('Save article? (y/n) [y]: ');
    if (save.toLowerCase() !== 'n') {
      await creator.saveArticle(articleData);
      
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('                    Article Created Successfully!               ');
      console.log('═══════════════════════════════════════════════════════════════\n');
      
      console.log('📝 Next Steps:\n');
      console.log(`1. Edit the markdown template: content/${articleData.id}.md`);
      console.log(`2. Create hero image: public/blog-images/${articleData.id}-hero.webp`);
      console.log(`3. Run validation: npm run geo-check -- --article ${articleData.id}`);
      console.log(`4. Check terminology: npm run validate-terminology`);
      console.log(`5. Preview in browser: npm run dev\n`);
    }
    
    creator.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating article:', error);
    creator.close();
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
GEO-Optimized Article Creation Assistant

Usage:
  npm run create-article [options]

Options:
  --id <article-id>       Article ID (e.g., web3-security-guide)
  --locale <zh|en>        Article language (default: zh)
  --template <name>       Template to use (see --list-templates)
  --list-templates        List available templates
  --terminology           Show terminology dictionary
  --search <term>         Search for a term in dictionary
  --help, -h              Show this help message

Interactive Mode:
  npm run create-article
  
  The tool will guide you through:
  1. Basic information (title, description, category)
  2. Template selection
  3. AI Summary creation
  4. Content structure
  5. Q&A pairs
  6. Author information
  7. GEO validation
  8. Save article

Examples:
  npm run create-article
  npm run create-article -- --id my-article --locale zh
  npm run create-article -- --template security-analysis
  npm run create-article -- --terminology
  npm run create-article -- --search "智能合约"

Features:
  ✓ Article templates for different content types
  ✓ AI Summary generation
  ✓ Q&A coverage builder
  ✓ Real-time GEO validation
  ✓ Terminology dictionary lookup
  ✓ Automatic structure generation
  ✓ Markdown template export
  `);
}

function listTemplates(): void {
  console.log('\n📝 Available Templates:\n');
  
  Object.entries(TEMPLATES).forEach(([key, template]) => {
    console.log(`${key}`);
    console.log(`  Name: ${template.name}`);
    console.log(`  Description: ${template.description}`);
    console.log(`  Structure: ${template.structure.length} sections\n`);
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

export { ArticleCreator, TEMPLATES, type CreateOptions, type ArticleData };

