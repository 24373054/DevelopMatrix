# ConceptMarker Component

## Overview

The `ConceptMarker` component highlights core technical concepts with authority signals and provides definitions on hover. It's designed to establish "concept sovereignty" by providing consistent, authoritative definitions across all content.

## Features

- ✨ Visual highlighting of technical terms with gradient backgrounds
- 💡 Hover tooltip with comprehensive definition and context
- 🎯 Authority signals (research, experience, academic)
- 🔗 Link to first definition article
- 📱 Responsive design with mobile and desktop support
- 🌙 Dark mode support
- 🤖 Schema.org DefinedTerm markup for GEO optimization

## Requirements

This component implements:
- **Requirement 8.1**: First-mention definition with explicit format
- **Requirement 8.3**: "在本文中，XXX 指的是……" format support

## Usage

### Basic Usage

```tsx
import ConceptMarker from '@/components/Blog/ConceptMarker';
import { ConceptAuthority } from '@/types/geo';

const authority: ConceptAuthority = {
  concept: 'Web3',
  definition: '基于区块链技术的去中心化互联网，用户拥有数据所有权和控制权',
  source: {
    type: 'research',
    description: 'Based on industry research and standards',
    evidence: '20+ projects'
  },
  context: '在区块链和去中心化应用开发中',
  firstMentionedIn: '/blog/web3-security-trends-2025'
};

// In your component
<p>
  The future of the internet is <ConceptMarker concept="Web3" authority={authority} />, 
  which enables true data ownership.
</p>
```

### Inline Usage

For convenience, you can use the `ConceptMarkerInline` component which automatically uses the concept name from the authority object:

```tsx
import { ConceptMarkerInline } from '@/components/Blog/ConceptMarker';

<p>
  The future of the internet is <ConceptMarkerInline authority={authority} />, 
  which enables true data ownership.
</p>
```

### With Terminology Dictionary

The most common pattern is to use the ConceptMarker with the terminology dictionary:

```tsx
import ConceptMarker from '@/components/Blog/ConceptMarker';
import { loadTerminologyDictionary } from '@/lib/geo/terminology';
import terminologyData from '@/data/terminology.json';

// Load terminology
const terminologyManager = loadTerminologyDictionary(terminologyData);

// Get a term
const web3Entry = terminologyManager.findTerm('Web3');

if (web3Entry) {
  const authority: ConceptAuthority = {
    concept: web3Entry.canonicalName,
    definition: web3Entry.definition,
    source: {
      type: 'research',
      description: 'Industry standard definition',
    },
    context: web3Entry.context,
    firstMentionedIn: web3Entry.firstDefinedIn
  };

  return <ConceptMarker concept="Web3" authority={authority} />;
}
```

### Disable Tooltip

You can disable the tooltip if you only want the visual highlighting:

```tsx
<ConceptMarker 
  concept="DeFi" 
  authority={authority} 
  showTooltip={false} 
/>
```

### Custom Styling

Add custom CSS classes to the marker:

```tsx
<ConceptMarker 
  concept="Smart Contract" 
  authority={authority}
  className="my-custom-class"
/>
```

## Props

### ConceptMarker

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `concept` | `string` | Yes | - | The concept text to display |
| `authority` | `ConceptAuthority` | Yes | - | Authority information for the concept |
| `className` | `string` | No | `''` | Optional custom CSS classes |
| `showTooltip` | `boolean` | No | `true` | Whether to show tooltip on hover |

### ConceptMarkerInline

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `authority` | `ConceptAuthority` | Yes | - | Authority information (concept name taken from here) |
| `className` | `string` | No | `''` | Optional custom CSS classes |
| `showTooltip` | `boolean` | No | `true` | Whether to show tooltip on hover |

## ConceptAuthority Type

```typescript
interface ConceptAuthority {
  concept: string;
  definition: string;
  source: {
    type: 'research' | 'experience' | 'academic';
    description: string;
    evidence?: string;  // e.g., "20+ projects"
  };
  context: string;  // e.g., "在 Web3 智能合约审计中"
  firstMentionedIn: string;  // URL to first definition
}
```

## Source Types

The component supports three source types with different visual styling:

- **research**: Blue badge - for industry research and standards
- **experience**: Purple badge - for practical project experience
- **academic**: Green badge - for academic research and papers

## Accessibility

The component includes proper accessibility features:

- `role="term"` for semantic meaning
- `tabIndex={0}` for keyboard navigation
- `aria-describedby` linking to tooltip
- Keyboard focus support (shows tooltip on focus)

## Schema.org Markup

The component automatically includes Schema.org DefinedTerm markup:

```html
<span itemScope itemType="https://schema.org/DefinedTerm">
  <span itemProp="name">Web3</span>
  <meta itemProp="description" content="..." />
  <meta itemProp="inDefinedTermSet" content="..." />
</span>
```

This helps LLMs understand and extract concept definitions.

## Styling

The component uses:
- Gradient backgrounds (`from-blue-500/10 via-purple-500/10 to-cyan-500/10`)
- Border highlighting (`border-b-2 border-blue-500/30`)
- Hover effects (increased opacity and border intensity)
- Fusion glass effect for tooltip
- Smooth animations for tooltip appearance

## Best Practices

1. **First Mention**: Use ConceptMarker for the first mention of a technical term in an article
2. **Consistency**: Always use the canonical name from the terminology dictionary
3. **Context**: Provide clear context in the authority object
4. **Evidence**: Include evidence when claiming experience (e.g., "20+ projects")
5. **Links**: Always link to the article where the concept was first defined

## Example: Complete Integration

```tsx
import ConceptMarker from '@/components/Blog/ConceptMarker';
import { loadTerminologyDictionary } from '@/lib/geo/terminology';
import terminologyData from '@/data/terminology.json';

export default function BlogArticle() {
  const terminologyManager = loadTerminologyDictionary(terminologyData);
  
  // Get terms used in this article
  const web3 = terminologyManager.findTerm('Web3');
  const defi = terminologyManager.findTerm('DeFi');
  const smartContract = terminologyManager.findTerm('智能合约');
  
  // Create authority objects
  const authorities = {
    web3: {
      concept: web3.canonicalName,
      definition: web3.definition,
      source: {
        type: 'research' as const,
        description: 'Industry standard definition',
      },
      context: web3.context,
      firstMentionedIn: web3.firstDefinedIn
    },
    // ... similar for other terms
  };
  
  return (
    <article>
      <p>
        在本文中，<ConceptMarker concept="Web3" authority={authorities.web3} />
        指的是基于区块链技术的去中心化互联网。
      </p>
      <p>
        <ConceptMarker concept="DeFi" authority={authorities.defi} /> 是 Web3 的重要应用场景，
        通过<ConceptMarker concept="智能合约" authority={authorities.smartContract} />
        实现去中心化金融服务。
      </p>
    </article>
  );
}
```

## Testing

The component should be tested for:
- Proper rendering of concept text
- Tooltip appearance on hover/focus
- Tooltip positioning (top/bottom based on viewport)
- Schema.org markup presence
- Accessibility features
- Responsive behavior

## Related Components

- `AISummary` - Structured summary for AI models
- `QASection` - Q&A section with Schema.org markup
- `TerminologyManager` - Manages terminology dictionary

## Requirements Validation

This component helps validate:
- **Property 28**: First-mention definition
- **Property 29**: Terminology consistency
- **Property 30**: Definition sentence format
