'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConceptAuthority } from '@/types/geo';
import { BookOpen, ExternalLink } from 'lucide-react';

interface ConceptMarkerProps {
  /** The concept text to display */
  concept: string;
  
  /** Authority information for the concept */
  authority: ConceptAuthority;
  
  /** Optional custom styling */
  className?: string;
  
  /** Whether to show the tooltip on hover (default: true) */
  showTooltip?: boolean;
}

/**
 * Concept Marker Component
 * 
 * Highlights core concepts with authority signals and provides definitions on hover.
 * Includes Schema.org DefinedTerm markup for enhanced discoverability by LLMs.
 * 
 * Features:
 * - Visual highlighting of technical terms
 * - Hover tooltip with definition and context
 * - Authority signals (source type, evidence)
 * - Link to first definition
 * - Responsive design with mobile and desktop support
 * - Dark mode support
 * - Schema.org structured data for GEO optimization
 * 
 * Requirements: 8.1, 8.3
 * 
 * @param concept - The concept text to display
 * @param authority - Authority information including definition, source, and context
 * @param className - Optional custom CSS classes
 * @param showTooltip - Whether to show tooltip on hover (default: true)
 */
export default function ConceptMarker({
  concept,
  authority,
  className = '',
  showTooltip = true,
}: ConceptMarkerProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const markerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate tooltip position to avoid overflow
  useEffect(() => {
    if (isTooltipVisible && markerRef.current && tooltipRef.current) {
      const markerRect = markerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if tooltip would overflow at the top
      if (markerRect.top - tooltipRect.height < 20) {
        setTooltipPosition('bottom');
      } else {
        setTooltipPosition('top');
      }
    }
  }, [isTooltipVisible]);

  // Get source type badge color
  const getSourceColor = (type: ConceptAuthority['source']['type']) => {
    switch (type) {
      case 'research':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'experience':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'academic':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get source type label
  const getSourceLabel = (type: ConceptAuthority['source']['type']) => {
    switch (type) {
      case 'research':
        return 'Research';
      case 'experience':
        return 'Experience';
      case 'academic':
        return 'Academic';
      default:
        return 'Source';
    }
  };

  return (
    <span
      ref={markerRef}
      className={`concept-marker relative inline-block ${className}`}
      itemScope
      itemType="https://schema.org/DefinedTerm"
      onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onFocus={() => showTooltip && setIsTooltipVisible(true)}
      onBlur={() => setIsTooltipVisible(false)}
      tabIndex={0}
      role="term"
      aria-describedby={`tooltip-${concept.replace(/\s+/g, '-')}`}
    >
      {/* Highlighted Concept Text */}
      <span
        className="concept-text px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border-b-2 border-blue-500/30 text-foreground font-medium cursor-help transition-all hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 hover:border-blue-500/50"
        itemProp="name"
      >
        {concept}
      </span>

      {/* Hidden metadata for Schema.org */}
      <meta itemProp="description" content={authority.definition} />
      <meta itemProp="inDefinedTermSet" content={authority.context} />

      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${concept.replace(/\s+/g, '-')}`}
          className={`concept-tooltip absolute left-1/2 -translate-x-1/2 z-50 w-80 max-w-[90vw] pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200 ${
            tooltipPosition === 'top' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          }`}
          role="tooltip"
        >
          <div className="fusion-glass rounded-xl p-4 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-background shadow-2xl shadow-blue-500/10">
            {/* Tooltip Arrow */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-blue-500/20 rotate-45 ${
                tooltipPosition === 'top'
                  ? 'bottom-[-6px] border-b border-r'
                  : 'top-[-6px] border-t border-l'
              }`}
            />

            {/* Header */}
            <div className="flex items-start gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <BookOpen size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground mb-1 break-words">
                  {authority.concept}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded border ${getSourceColor(authority.source.type)}`}>
                    {getSourceLabel(authority.source.type)}
                  </span>
                  {authority.source.evidence && (
                    <span className="text-xs text-muted-foreground">
                      {authority.source.evidence}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Definition */}
            <div className="mb-3">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {authority.definition}
              </p>
            </div>

            {/* Context */}
            {authority.context && (
              <div className="mb-3 p-2 rounded-lg bg-foreground/5">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Context:</span> {authority.context}
                </p>
              </div>
            )}

            {/* Source Description */}
            {authority.source.description && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground">
                  {authority.source.description}
                </p>
              </div>
            )}

            {/* Link to First Definition */}
            {authority.firstMentionedIn && (
              <div className="pt-3 border-t border-foreground/10">
                <a
                  href={authority.firstMentionedIn}
                  className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>View full definition</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}

/**
 * Concept Marker Inline Component
 * 
 * A simplified version for inline use within text content.
 * Automatically wraps the concept text without requiring explicit children.
 */
export function ConceptMarkerInline({
  authority,
  className,
  showTooltip = true,
}: Omit<ConceptMarkerProps, 'concept'>) {
  return (
    <ConceptMarker
      concept={authority.concept}
      authority={authority}
      className={className}
      showTooltip={showTooltip}
    />
  );
}
