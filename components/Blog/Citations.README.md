# Citations Component

## Overview

The `Citations` component displays a list of references and citations for blog articles. It provides a structured, visually appealing way to present external sources, academic papers, documentation, and other references that support the article's content.

## Features

- **Multiple Citation Types**: Supports articles, papers, documentation, books, websites, and other types
- **Rich Metadata**: Displays authors, publishers, publication dates, and additional notes
- **External Links**: Clickable citations with external link indicators
- **Structured Data**: Includes Schema.org markup for better SEO and LLM understanding
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: Seamlessly integrates with the site's theme
- **Visual Icons**: Type-specific icons for easy identification

## Usage

### Basic Usage

```tsx
import Citations from '@/components/Blog/Citations';
import type { Citation } from '@/types/geo';

const citations: Citation[] = [
  {
    id: 'cite-1',
    title: 'Smart Contract Security Best Practices',
    url: 'https://consensys.github.io/smart-contract-best-practices/',
    authors: ['ConsenSys Diligence'],
    publisher: 'ConsenSys',
    type: 'documentation',
    notes: 'Comprehensive guide to smart contract security'
  }
];

<Citations citations={citations} />
```

### With Custom Titles

```tsx
<Citations 
  citations={citations}
  title="参考文献与引用"
  subtitle="本文引用的外部资源和参考文献"
/>
```

## Citation Type

The `Citation` interface includes the following fields:

```typescript
interface Citation {
  id: string;              // Unique identifier
  title: string;           // Title of the cited work
  url?: string;            // URL to the cited work (optional)
  authors?: string[];      // Author(s) of the cited work (optional)
  publishedDate?: string;  // Publication date (optional)
  publisher?: string;      // Publisher or source (optional)
  type: 'article' | 'paper' | 'documentation' | 'book' | 'website' | 'other';
  notes?: string;          // Additional notes (optional)
}
```

## Citation Types and Icons

- **article**: Blue FileText icon - For blog posts and articles
- **paper**: Purple BookOpen icon - For academic papers and research
- **documentation**: Green FileText icon - For technical documentation
- **book**: Orange Book icon - For books and publications
- **website**: Cyan Globe icon - For general websites
- **other**: Gray FileText icon - For other types of references

## Integration in Blog Articles

Citations are automatically displayed in blog article pages when the `citations` field is present in the article data:

```json
{
  "articles": {
    "article-slug": {
      "title": "Article Title",
      "content": "...",
      "citations": [
        {
          "id": "cite-1",
          "title": "Reference Title",
          "url": "https://example.com",
          "type": "article"
        }
      ]
    }
  }
}
```

## Styling

The component uses:
- Fusion glass effect for the container
- Gradient backgrounds for visual appeal
- Hover effects for interactive elements
- Responsive spacing and typography
- Consistent with the site's design system

## Accessibility

- Semantic HTML with proper ARIA labels
- Schema.org structured data for better machine readability
- Keyboard navigation support
- Screen reader friendly

## SEO Benefits

- **Structured Data**: Uses Schema.org ItemList and CreativeWork types
- **External Links**: Properly marked with rel="noopener noreferrer"
- **Rich Metadata**: Includes author, publisher, and date information
- **LLM Friendly**: Clear structure helps AI models understand references

## Example Output

The component renders a visually appealing list of citations with:
- Type-specific icons
- Clickable titles (when URL is provided)
- Author and publisher information
- Publication dates
- Type badges
- Optional notes
- Citation count at the bottom

## Requirements Validation

This component satisfies **Requirement 4.3** from the GEO optimization requirements:

> WHEN 模型交叉验证信息 THEN 系统 SHALL 提供可追溯的引用和参考来源

By providing structured, traceable citations, the component enhances content verifiability and authority signals for both human readers and AI models.
