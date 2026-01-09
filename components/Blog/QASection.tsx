'use client';

import React, { useState, useMemo } from 'react';
import { QAPair } from '@/types/geo';
import { 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Filter,
  BookOpen,
  GitCompare,
  Target,
  AlertTriangle
} from 'lucide-react';

interface QASectionProps {
  qaPairs: QAPair[];
  title?: string;
  subtitle?: string;
}

/**
 * Q&A Section Component
 * 
 * Displays a collapsible Q&A section optimized for both users and AI models.
 * Includes Schema.org Question/Answer markup for enhanced discoverability by LLMs.
 * 
 * Features:
 * - Collapsible Q&A items with smooth animations
 * - Search functionality to filter questions
 * - Category filtering (definition, comparison, application, limitation)
 * - Responsive design with mobile and desktop layouts
 * - Dark mode support
 * - Schema.org structured data for GEO optimization
 * 
 * @param qaPairs - Array of Q&A pairs with questions, answers, categories, and related concepts
 * @param title - Optional custom title (defaults to "Frequently Asked Questions")
 * @param subtitle - Optional subtitle
 */
export default function QASection({ 
  qaPairs, 
  title = "Frequently Asked Questions",
  subtitle = "Common questions and detailed answers"
}: QASectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Graceful degradation: if no Q&A pairs provided, don't render anything
  if (!qaPairs || qaPairs.length === 0) {
    return null;
  }

  // Toggle expand/collapse for a specific Q&A item
  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Expand all items
  const expandAll = () => {
    setExpandedItems(new Set(qaPairs.map((_, index) => index)));
  };

  // Collapse all items
  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  // Filter Q&A pairs based on search query and selected category
  const filteredQAPairs = useMemo(() => {
    return qaPairs.filter(qa => {
      const matchesSearch = searchQuery === '' || 
        qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || qa.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [qaPairs, searchQuery, selectedCategory]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'definition':
        return <BookOpen size={14} />;
      case 'comparison':
        return <GitCompare size={14} />;
      case 'application':
        return <Target size={14} />;
      case 'limitation':
        return <AlertTriangle size={14} />;
      default:
        return <MessageCircle size={14} />;
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'definition':
        return 'Definition';
      case 'comparison':
        return 'Comparison';
      case 'application':
        return 'Application';
      case 'limitation':
        return 'Limitation';
      default:
        return 'General';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'definition':
        return 'text-blue-500 bg-blue-500/10';
      case 'comparison':
        return 'text-purple-500 bg-purple-500/10';
      case 'application':
        return 'text-cyan-500 bg-cyan-500/10';
      case 'limitation':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Count Q&A pairs by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: qaPairs.length,
      definition: 0,
      comparison: 0,
      application: 0,
      limitation: 0
    };
    
    qaPairs.forEach(qa => {
      counts[qa.category] = (counts[qa.category] || 0) + 1;
    });
    
    return counts;
  }, [qaPairs]);

  return (
    <section
      className="qa-section fusion-glass rounded-2xl p-6 md:p-8 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 mb-12 relative overflow-hidden group"
      itemScope
      itemType="https://schema.org/FAQPage"
      aria-label="Q&A Section"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Expand/Collapse All Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
            aria-label="Expand all questions"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors"
            aria-label="Collapse all questions"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4 relative">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 border border-foreground/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            aria-label="Search questions"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-muted-foreground" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
            }`}
          >
            All ({categoryCounts.all})
          </button>
          {['definition', 'comparison', 'application', 'limitation'].map(category => (
            categoryCounts[category] > 0 && (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedCategory === category
                    ? getCategoryColor(category) + ' shadow-lg'
                    : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
                }`}
              >
                {getCategoryIcon(category)}
                {getCategoryLabel(category)} ({categoryCounts[category]})
              </button>
            )
          ))}
        </div>
      </div>

      {/* Q&A Items */}
      <div className="space-y-3 relative">
        {filteredQAPairs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No questions found matching your search.</p>
          </div>
        ) : (
          filteredQAPairs.map((qa, index) => {
            const isExpanded = expandedItems.has(index);
            
            return (
              <div
                key={index}
                className="qa-item fusion-glass rounded-xl border border-foreground/5 overflow-hidden transition-all hover:border-emerald-500/30"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 md:px-6 py-4 flex items-start gap-3 text-left hover:bg-foreground/5 transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`answer-${index}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(qa.category)} flex items-center gap-1`}>
                        {getCategoryIcon(qa.category)}
                        {getCategoryLabel(qa.category)}
                      </span>
                    </div>
                    <h3 
                      className="text-base md:text-lg font-semibold text-foreground"
                      itemProp="name"
                    >
                      {qa.question}
                    </h3>
                  </div>
                  <div className="shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-emerald-500" />
                    ) : (
                      <ChevronDown size={20} className="text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                {isExpanded && (
                  <div
                    id={`answer-${index}`}
                    className="px-4 md:px-6 pb-4 animate-in slide-in-from-top-2 duration-200"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <div className="pl-0 md:pl-3 border-l-2 border-emerald-500/20 ml-0 md:ml-3">
                      <p 
                        className="text-foreground/90 leading-relaxed pl-4"
                        itemProp="text"
                      >
                        {qa.answer}
                      </p>
                      
                      {/* Related Concepts */}
                      {qa.relatedConcepts && qa.relatedConcepts.length > 0 && (
                        <div className="mt-4 pl-4">
                          <p className="text-xs text-muted-foreground mb-2">Related concepts:</p>
                          <div className="flex flex-wrap gap-2">
                            {qa.relatedConcepts.map((concept, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded bg-foreground/5 text-muted-foreground"
                              >
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mt-4 text-center text-sm text-muted-foreground relative">
          Showing {filteredQAPairs.length} of {qaPairs.length} questions
        </div>
      )}
    </section>
  );
}
