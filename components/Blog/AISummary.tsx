'use client';

import React from 'react';
import { AISummary as AISummaryType } from '@/types/geo';
import { Sparkles, Lightbulb, Target, CheckCircle2 } from 'lucide-react';

interface AISummaryProps {
  summary: AISummaryType;
}

/**
 * AI Summary Component
 * 
 * Displays a structured summary designed specifically for AI models and users.
 * Includes Schema.org DefinedTerm markup for enhanced discoverability by LLMs.
 * 
 * Features:
 * - Responsive design with mobile and desktop layouts
 * - Dark mode support
 * - Graceful degradation when summary is missing
 * - Schema.org structured data for GEO optimization
 * 
 * @param summary - The AI summary data containing whatIs, whyImportant, useCases, and keyTakeaways
 */
export default function AISummary({ summary }: AISummaryProps) {
  // Graceful degradation: if no summary provided, don't render anything
  if (!summary) {
    return null;
  }

  return (
    <section
      className="ai-summary fusion-glass rounded-2xl p-6 md:p-8 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 mb-12 relative overflow-hidden group"
      itemScope
      itemType="https://schema.org/DefinedTerm"
      aria-label="AI Summary"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            AI Summary
          </h2>
          <p className="text-xs text-muted-foreground">
            Optimized for AI understanding and quick reference
          </p>
        </div>
      </div>

      {/* Summary Content */}
      <div className="space-y-6 relative">
        {/* What Is */}
        {summary.whatIs && (
          <div className="summary-section">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                <Lightbulb size={16} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-2">
                  What is it?
                </h3>
                <p
                  className="text-foreground leading-relaxed"
                  itemProp="description"
                >
                  {summary.whatIs}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Why Important */}
        {summary.whyImportant && (
          <div className="summary-section">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-1">
                <Target size={16} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-purple-500 uppercase tracking-wider mb-2">
                  Why Important?
                </h3>
                <p className="text-foreground leading-relaxed">
                  {summary.whyImportant}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Use Cases */}
        {summary.useCases && summary.useCases.length > 0 && (
          <div className="summary-section">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={16} className="text-cyan-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-3">
                  Use Cases
                </h3>
                <ul className="space-y-2">
                  {summary.useCases.map((useCase, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-foreground"
                    >
                      <span className="text-cyan-500 mt-1 shrink-0">•</span>
                      <span className="leading-relaxed">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
          <div className="summary-section">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {summary.keyTakeaways.map((takeaway, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-foreground"
                    >
                      <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                      <span className="leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden metadata for Schema.org */}
      <meta itemProp="inDefinedTermSet" content="GEO Optimized Content" />
    </section>
  );
}
