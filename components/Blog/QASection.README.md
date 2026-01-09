# QASection Component

A collapsible Q&A section component optimized for both users and AI models (GEO optimization).

## Features

- ✅ Collapsible Q&A items with smooth animations
- ✅ Search functionality to filter questions
- ✅ Category filtering (definition, comparison, application, limitation)
- ✅ Responsive design with mobile and desktop layouts
- ✅ Dark mode support
- ✅ Schema.org Question/Answer markup for enhanced LLM discoverability
- ✅ Expand/Collapse all functionality
- ✅ Related concepts display

## Usage

### Basic Usage

```tsx
import QASection from '@/components/Blog/QASection';
import { QAPair } from '@/types/geo';

const qaPairs: QAPair[] = [
  {
    question: 'What is Web3?',
    answer: 'Web3 is the next generation of the internet built on blockchain technology.',
    category: 'definition',
    relatedConcepts: ['blockchain', 'decentralization']
  },
  // ... more Q&A pairs
];

export default function ArticlePage() {
  return (
    <div>
      <QASection qaPairs={qaPairs} />
    </div>
  );
}
```

### With Custom Title and Subtitle

```tsx
<QASection 
  qaPairs={qaPairs}
  title="Common Questions"
  subtitle="Everything you need to know"
/>
```

### Integration in Blog Article Page

```tsx
// In app/[locale]/blog/[slug]/page.tsx
import QASection from '@/components/Blog/QASection';

export default async function BlogArticlePage({ params }) {
  const t = await getTranslations({ locale, namespace: `blog.articles.${slug}` });
  
  return (
    <article>
      {/* Article content */}
      
      {/* Q&A Section - placed after article content, before author bio */}
      <QASection qaPairs={t.raw('qaPairs')} />
      
      {/* Author bio and CTA */}
    </article>
  );
}
```

## Data Structure

Q&A pairs should follow the `QAPair` interface defined in `types/geo.ts`:

```typescript
interface QAPair {
  question: string;           // The question being asked
  answer: string;             // The answer to the question
  category: 'definition' | 'comparison' | 'application' | 'limitation';
  relatedConcepts: string[];  // Related concepts mentioned in this Q&A
}
```

### Example in messages/zh.json

```json
{
  "blog": {
    "articles": {
      "article-slug": {
        "qaPairs": [
          {
            "question": "什么是 Web3？",
            "answer": "Web3 是基于区块链技术的下一代互联网。",
            "category": "definition",
            "relatedConcepts": ["区块链", "去中心化"]
          },
          {
            "question": "Web3 和 Web2 有什么区别？",
            "answer": "Web3 是去中心化的，而 Web2 是中心化的。",
            "category": "comparison",
            "relatedConcepts": ["Web2", "中心化"]
          }
        ]
      }
    }
  }
}
```

## Categories

The component supports four question categories, each with its own icon and color:

- **definition** (blue): "What is X?" type questions
- **comparison** (purple): "X vs Y" comparison questions
- **application** (cyan): "When to use X?" application questions
- **limitation** (orange): "What are the limitations of X?" questions

## GEO Optimization

The component includes Schema.org structured data markup:

- `FAQPage` schema for the entire section
- `Question` schema for each Q&A item
- `Answer` schema for each answer

This markup helps Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity better understand and reference the content.

## Styling

The component uses Tailwind CSS classes and follows the same design patterns as the AISummary component:

- Fusion glass effect with gradient backgrounds
- Hover animations and transitions
- Responsive breakpoints for mobile/desktop
- Dark mode support via Tailwind's dark mode classes

## Testing

The component includes comprehensive unit tests in `__tests__/components/QASection.test.tsx`:

- Rendering tests
- Expand/collapse functionality
- Search filtering
- Category filtering
- Schema.org markup validation

Run tests with:

```bash
npm test -- __tests__/components/QASection.test.tsx
```

## Requirements Satisfied

This component satisfies the following GEO optimization requirements:

- **Requirement 5.1**: LLM-friendly Q&A format
- **Requirement 7.1**: Comparison question coverage
- **Requirement 7.2**: Application scenario coverage
- **Requirement 7.3**: Limitation discussion coverage

## Next Steps

To complete the Q&A integration:

1. ✅ Component created (`components/Blog/QASection.tsx`)
2. ✅ Unit tests written and passing
3. ⏳ Integrate into blog article page (`app/[locale]/blog/[slug]/page.tsx`)
4. ⏳ Add Q&A data to existing articles in `messages/zh.json` and `messages/en.json`
5. ⏳ Property-based tests (optional, Task 10.1)
