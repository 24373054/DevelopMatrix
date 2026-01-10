'use client';

import { ExternalLink, BookOpen, FileText, Globe, Book } from 'lucide-react';
import type { Citation } from '@/types/geo';

interface CitationsProps {
  citations: Citation[];
  title?: string;
  subtitle?: string;
}

/**
 * Citations Component
 * 
 * Displays a list of references and citations for a blog article.
 * Supports multiple citation types (articles, papers, documentation, books, websites).
 * Provides structured data for better SEO and LLM understanding.
 * 
 * @param citations - Array of citation objects
 * @param title - Section title (default: "References & Citations")
 * @param subtitle - Section subtitle (optional)
 */
export default function Citations({ 
  citations, 
  title = 'References & Citations',
  subtitle 
}: CitationsProps) {
  if (!citations || !Array.isArray(citations) || citations.length === 0) {
    return null;
  }

  // Get icon based on citation type
  const getCitationIcon = (type: Citation['type']) => {
    switch (type) {
      case 'article':
        return <FileText size={20} className="text-blue-500" />;
      case 'paper':
        return <BookOpen size={20} className="text-purple-500" />;
      case 'documentation':
        return <FileText size={20} className="text-green-500" />;
      case 'book':
        return <Book size={20} className="text-orange-500" />;
      case 'website':
        return <Globe size={20} className="text-cyan-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
    }
  };

  // Format authors list
  const formatAuthors = (authors?: string[]) => {
    if (!authors || !Array.isArray(authors) || authors.length === 0) return null;
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} et al.`;
  };

  return (
    <section 
      className="mt-16 fusion-glass rounded-2xl p-8 border border-foreground/5 relative overflow-hidden"
      itemScope
      itemType="https://schema.org/ItemList"
      aria-label="Article Citations and References"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2" itemProp="name">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* Citations List */}
      <div className="relative space-y-4">
        {citations.map((citation, index) => (
          <div
            key={citation.id}
            className="group p-4 rounded-xl bg-background/50 border border-foreground/5 hover:border-foreground/10 hover:bg-background/80 transition-all duration-300"
            itemScope
            itemType="https://schema.org/CreativeWork"
            itemProp="itemListElement"
          >
            <meta itemProp="position" content={String(index + 1)} />
            
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="shrink-0 mt-1">
                {getCitationIcon(citation.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-blue-500 transition-colors">
                  {citation.url ? (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:underline"
                      itemProp="url"
                    >
                      <span itemProp="name">{citation.title}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span itemProp="name">{citation.title}</span>
                  )}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                  {/* Authors */}
                  {citation.authors && citation.authors.length > 0 && (
                    <span itemProp="author" itemScope itemType="https://schema.org/Person">
                      <meta itemProp="name" content={citation.authors.join(', ')} />
                      {formatAuthors(citation.authors)}
                    </span>
                  )}

                  {/* Publisher */}
                  {citation.publisher && (
                    <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                      <meta itemProp="name" content={citation.publisher} />
                      {citation.publisher}
                    </span>
                  )}

                  {/* Date */}
                  {citation.publishedDate && (
                    <time itemProp="datePublished" dateTime={citation.publishedDate}>
                      {citation.publishedDate}
                    </time>
                  )}

                  {/* Type badge */}
                  <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-xs font-medium capitalize">
                    {citation.type}
                  </span>
                </div>

                {/* Notes */}
                {citation.notes && (
                  <p className="text-sm text-muted-foreground italic" itemProp="description">
                    {citation.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Citation count */}
      <div className="relative mt-6 pt-6 border-t border-foreground/5">
        <p className="text-xs text-muted-foreground text-center">
          {citations.length} {citations.length === 1 ? 'reference' : 'references'} cited
        </p>
      </div>
    </section>
  );
}
