/**
 * ConceptMarker Component Tests
 * 
 * Unit tests for the ConceptMarker component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConceptMarker, { ConceptMarkerInline } from '@/components/Blog/ConceptMarker';
import { ConceptAuthority } from '@/types/geo';

describe('ConceptMarker', () => {
  const mockAuthority: ConceptAuthority = {
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

  describe('Rendering', () => {
    it('should render the concept text', () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      expect(screen.getByText('Web3')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ConceptMarker 
          concept="Web3" 
          authority={mockAuthority} 
          className="custom-class"
        />
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should have proper semantic HTML structure', () => {
      const { container } = render(
        <ConceptMarker concept="Web3" authority={mockAuthority} />
      );
      const marker = container.querySelector('[itemScope]');
      expect(marker).toHaveAttribute('itemType', 'https://schema.org/DefinedTerm');
      expect(marker).toHaveAttribute('role', 'term');
    });
  });

  describe('Schema.org Markup', () => {
    it('should include Schema.org DefinedTerm markup', () => {
      const { container } = render(
        <ConceptMarker concept="Web3" authority={mockAuthority} />
      );
      
      const marker = container.querySelector('[itemScope]');
      expect(marker).toHaveAttribute('itemType', 'https://schema.org/DefinedTerm');
    });

    it('should include definition in meta tag', () => {
      const { container } = render(
        <ConceptMarker concept="Web3" authority={mockAuthority} />
      );
      
      const definitionMeta = container.querySelector('meta[itemProp="description"]');
      expect(definitionMeta).toHaveAttribute('content', mockAuthority.definition);
    });

    it('should include context in meta tag', () => {
      const { container } = render(
        <ConceptMarker concept="Web3" authority={mockAuthority} />
      );
      
      const contextMeta = container.querySelector('meta[itemProp="inDefinedTermSet"]');
      expect(contextMeta).toHaveAttribute('content', mockAuthority.context);
    });
  });

  describe('Tooltip Behavior', () => {
    it('should not show tooltip by default', () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should show tooltip on mouse enter', async () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(marker);
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should show tooltip on focus', async () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      
      const marker = screen.getByRole('term');
      fireEvent.focus(marker);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on blur', async () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      
      const marker = screen.getByRole('term');
      fireEvent.focus(marker);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      fireEvent.blur(marker);
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should not show tooltip when showTooltip is false', () => {
      render(
        <ConceptMarker 
          concept="Web3" 
          authority={mockAuthority} 
          showTooltip={false}
        />
      );
      
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Content', () => {
    beforeEach(async () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should display concept name in tooltip', () => {
      // The concept name appears in the tooltip header
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent(mockAuthority.concept);
    });

    it('should display definition in tooltip', () => {
      expect(screen.getByText(mockAuthority.definition)).toBeInTheDocument();
    });

    it('should display context in tooltip', () => {
      expect(screen.getByText(/Context:/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockAuthority.context))).toBeInTheDocument();
    });

    it('should display source description in tooltip', () => {
      expect(screen.getByText(mockAuthority.source.description)).toBeInTheDocument();
    });

    it('should display evidence when provided', () => {
      expect(screen.getByText(mockAuthority.source.evidence!)).toBeInTheDocument();
    });

    it('should display link to first definition', () => {
      const link = screen.getByText('View full definition').closest('a');
      expect(link).toHaveAttribute('href', mockAuthority.firstMentionedIn);
    });
  });

  describe('Source Type Badges', () => {
    it('should display Research badge for research source', async () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByText('Research')).toBeInTheDocument();
      });
    });

    it('should display Experience badge for experience source', async () => {
      const experienceAuthority = {
        ...mockAuthority,
        source: { ...mockAuthority.source, type: 'experience' as const }
      };
      
      render(<ConceptMarker concept="Web3" authority={experienceAuthority} />);
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByText('Experience')).toBeInTheDocument();
      });
    });

    it('should display Academic badge for academic source', async () => {
      const academicAuthority = {
        ...mockAuthority,
        source: { ...mockAuthority.source, type: 'academic' as const }
      };
      
      render(<ConceptMarker concept="Web3" authority={academicAuthority} />);
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByText('Academic')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have tabIndex for keyboard navigation', () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      const marker = screen.getByRole('term');
      expect(marker).toHaveAttribute('tabIndex', '0');
    });

    it('should have aria-describedby linking to tooltip', () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      const marker = screen.getByRole('term');
      expect(marker).toHaveAttribute('aria-describedby');
    });

    it('should have proper role attribute', () => {
      render(<ConceptMarker concept="Web3" authority={mockAuthority} />);
      expect(screen.getByRole('term')).toBeInTheDocument();
    });
  });

  describe('ConceptMarkerInline', () => {
    it('should render using concept from authority', () => {
      render(<ConceptMarkerInline authority={mockAuthority} />);
      expect(screen.getByText('Web3')).toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
      render(<ConceptMarkerInline authority={mockAuthority} />);
      
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should respect showTooltip prop', () => {
      render(<ConceptMarkerInline authority={mockAuthority} showTooltip={false} />);
      
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle authority without evidence', async () => {
      const authorityWithoutEvidence = {
        ...mockAuthority,
        source: {
          type: 'research' as const,
          description: 'Based on research'
        }
      };
      
      render(<ConceptMarker concept="Web3" authority={authorityWithoutEvidence} />);
      const marker = screen.getByRole('term');
      fireEvent.mouseEnter(marker);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Should not crash and should still show other content
      expect(screen.getByText('Based on research')).toBeInTheDocument();
    });

    it('should handle long concept names', () => {
      const longConcept = 'Very Long Technical Concept Name That Might Wrap';
      render(
        <ConceptMarker 
          concept={longConcept} 
          authority={{ ...mockAuthority, concept: longConcept }} 
        />
      );
      expect(screen.getByText(longConcept)).toBeInTheDocument();
    });

    it('should handle concepts with special characters', () => {
      const specialConcept = 'Web3.0 (去中心化)';
      render(
        <ConceptMarker 
          concept={specialConcept} 
          authority={{ ...mockAuthority, concept: specialConcept }} 
        />
      );
      expect(screen.getByText(specialConcept)).toBeInTheDocument();
    });
  });
});
