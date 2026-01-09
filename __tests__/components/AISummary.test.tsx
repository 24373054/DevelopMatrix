/**
 * Unit Tests for AI Summary Component
 * 
 * Tests cover:
 * - All fields render correctly
 * - Graceful degradation when fields are missing
 * - Responsive layout behavior
 * - Schema.org structured data
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AISummary from '@/components/Blog/AISummary';
import { AISummary as AISummaryType } from '@/types/geo';

describe('AISummary Component', () => {
  // Complete valid summary for testing
  const validSummary: AISummaryType = {
    whatIs: 'GEO is Generative Engine Optimization for AI models',
    whyImportant: 'It improves content discoverability in AI-powered search',
    useCases: [
      'Technical blog optimization',
      'Product documentation enhancement',
      'Knowledge base structuring',
    ],
    keyTakeaways: [
      'Structure content for AI extraction',
      'Use clear definitions and conclusions',
      'Implement Schema.org markup',
    ],
  };

  describe('Complete Summary Rendering', () => {
    it('should render all fields when complete summary is provided', () => {
      render(<AISummary summary={validSummary} />);

      // Check header
      expect(screen.getByText('AI Summary')).toBeInTheDocument();
      expect(
        screen.getByText('Optimized for AI understanding and quick reference')
      ).toBeInTheDocument();

      // Check whatIs section
      expect(screen.getByText('What is it?')).toBeInTheDocument();
      expect(
        screen.getByText('GEO is Generative Engine Optimization for AI models')
      ).toBeInTheDocument();

      // Check whyImportant section
      expect(screen.getByText('Why Important?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'It improves content discoverability in AI-powered search'
        )
      ).toBeInTheDocument();

      // Check useCases section
      expect(screen.getByText('Use Cases')).toBeInTheDocument();
      expect(screen.getByText('Technical blog optimization')).toBeInTheDocument();
      expect(
        screen.getByText('Product documentation enhancement')
      ).toBeInTheDocument();
      expect(screen.getByText('Knowledge base structuring')).toBeInTheDocument();

      // Check keyTakeaways section
      expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
      expect(
        screen.getByText('Structure content for AI extraction')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Use clear definitions and conclusions')
      ).toBeInTheDocument();
      expect(screen.getByText('Implement Schema.org markup')).toBeInTheDocument();
    });

    it('should render with correct semantic HTML structure', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      // Check for section element
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('ai-summary');

      // Check for proper heading hierarchy
      const h2 = screen.getByRole('heading', { level: 2, name: 'AI Summary' });
      expect(h2).toBeInTheDocument();

      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements).toHaveLength(4); // whatIs, whyImportant, useCases, keyTakeaways
    });

    it('should include Schema.org structured data attributes', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('itemScope');
      expect(section).toHaveAttribute(
        'itemType',
        'https://schema.org/DefinedTerm'
      );
      expect(section).toHaveAttribute('aria-label', 'AI Summary');

      // Check for description meta tag
      const descriptionMeta = container.querySelector('[itemprop="description"]');
      expect(descriptionMeta).toBeInTheDocument();
      expect(descriptionMeta).toHaveTextContent(validSummary.whatIs);

      // Check for inDefinedTermSet meta tag
      const termSetMeta = container.querySelector(
        '[itemprop="inDefinedTermSet"]'
      );
      expect(termSetMeta).toBeInTheDocument();
      expect(termSetMeta).toHaveAttribute('content', 'GEO Optimized Content');
    });
  });

  describe('Graceful Degradation - Missing Fields', () => {
    it('should not render anything when summary is null', () => {
      const { container } = render(<AISummary summary={null as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render anything when summary is undefined', () => {
      const { container } = render(<AISummary summary={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render without whatIs field', () => {
      const partialSummary: AISummaryType = {
        whatIs: '',
        whyImportant: 'This is important',
        useCases: ['Use case 1'],
        keyTakeaways: ['Takeaway 1'],
      };

      render(<AISummary summary={partialSummary} />);

      // Header should still render
      expect(screen.getByText('AI Summary')).toBeInTheDocument();

      // whatIs section should not render
      expect(screen.queryByText('What is it?')).not.toBeInTheDocument();

      // Other sections should render
      expect(screen.getByText('Why Important?')).toBeInTheDocument();
      expect(screen.getByText('Use Cases')).toBeInTheDocument();
      expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
    });

    it('should render without whyImportant field', () => {
      const partialSummary: AISummaryType = {
        whatIs: 'Definition here',
        whyImportant: '',
        useCases: ['Use case 1'],
        keyTakeaways: ['Takeaway 1'],
      };

      render(<AISummary summary={partialSummary} />);

      expect(screen.getByText('What is it?')).toBeInTheDocument();
      expect(screen.queryByText('Why Important?')).not.toBeInTheDocument();
      expect(screen.getByText('Use Cases')).toBeInTheDocument();
      expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
    });

    it('should render without useCases field', () => {
      const partialSummary: AISummaryType = {
        whatIs: 'Definition here',
        whyImportant: 'This is important',
        useCases: [],
        keyTakeaways: ['Takeaway 1'],
      };

      render(<AISummary summary={partialSummary} />);

      expect(screen.getByText('What is it?')).toBeInTheDocument();
      expect(screen.getByText('Why Important?')).toBeInTheDocument();
      expect(screen.queryByText('Use Cases')).not.toBeInTheDocument();
      expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
    });

    it('should render without keyTakeaways field', () => {
      const partialSummary: AISummaryType = {
        whatIs: 'Definition here',
        whyImportant: 'This is important',
        useCases: ['Use case 1'],
        keyTakeaways: [],
      };

      render(<AISummary summary={partialSummary} />);

      expect(screen.getByText('What is it?')).toBeInTheDocument();
      expect(screen.getByText('Why Important?')).toBeInTheDocument();
      expect(screen.getByText('Use Cases')).toBeInTheDocument();
      expect(screen.queryByText('Key Takeaways')).not.toBeInTheDocument();
    });

    it('should render with only whatIs field', () => {
      const minimalSummary: AISummaryType = {
        whatIs: 'Only definition provided',
        whyImportant: '',
        useCases: [],
        keyTakeaways: [],
      };

      render(<AISummary summary={minimalSummary} />);

      expect(screen.getByText('AI Summary')).toBeInTheDocument();
      expect(screen.getByText('What is it?')).toBeInTheDocument();
      expect(screen.getByText('Only definition provided')).toBeInTheDocument();

      // Other sections should not render
      expect(screen.queryByText('Why Important?')).not.toBeInTheDocument();
      expect(screen.queryByText('Use Cases')).not.toBeInTheDocument();
      expect(screen.queryByText('Key Takeaways')).not.toBeInTheDocument();
    });
  });

  describe('List Rendering', () => {
    it('should render all use cases as list items', () => {
      render(<AISummary summary={validSummary} />);

      const useCasesList = screen
        .getByText('Use Cases')
        .closest('.summary-section')
        ?.querySelector('ul');

      expect(useCasesList).toBeInTheDocument();
      expect(useCasesList?.children).toHaveLength(3);
    });

    it('should render all key takeaways as list items', () => {
      render(<AISummary summary={validSummary} />);

      const takeawaysList = screen
        .getByText('Key Takeaways')
        .closest('.summary-section')
        ?.querySelector('ul');

      expect(takeawaysList).toBeInTheDocument();
      expect(takeawaysList?.children).toHaveLength(3);
    });

    it('should handle single item in useCases array', () => {
      const singleUseCaseSummary: AISummaryType = {
        ...validSummary,
        useCases: ['Single use case'],
      };

      render(<AISummary summary={singleUseCaseSummary} />);

      expect(screen.getByText('Single use case')).toBeInTheDocument();
      const useCasesList = screen
        .getByText('Use Cases')
        .closest('.summary-section')
        ?.querySelector('ul');
      expect(useCasesList?.children).toHaveLength(1);
    });

    it('should handle single item in keyTakeaways array', () => {
      const singleTakeawaySummary: AISummaryType = {
        ...validSummary,
        keyTakeaways: ['Single takeaway'],
      };

      render(<AISummary summary={singleTakeawaySummary} />);

      expect(screen.getByText('Single takeaway')).toBeInTheDocument();
      const takeawaysList = screen
        .getByText('Key Takeaways')
        .closest('.summary-section')
        ?.querySelector('ul');
      expect(takeawaysList?.children).toHaveLength(1);
    });
  });

  describe('Responsive Layout', () => {
    it('should apply responsive padding classes', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('p-6');
      expect(section).toHaveClass('md:p-8');
    });

    it('should apply responsive text size classes to header', () => {
      render(<AISummary summary={validSummary} />);

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'AI Summary',
      });
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('md:text-2xl');
    });

    it('should have proper spacing classes for mobile and desktop', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('mb-12'); // Bottom margin
      expect(section).toHaveClass('rounded-2xl'); // Border radius
    });
  });

  describe('Visual Styling', () => {
    it('should apply gradient background classes', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-gradient-to-br');
      expect(section).toHaveClass('from-blue-500/5');
      expect(section).toHaveClass('via-purple-500/5');
      expect(section).toHaveClass('to-cyan-500/5');
    });

    it('should apply border styling', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('border');
      expect(section).toHaveClass('border-blue-500/20');
    });

    it('should include decorative background elements', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const decorativeElements = container.querySelectorAll(
        '.absolute.rounded-full.blur-3xl'
      );
      expect(decorativeElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should render section icons', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      // Check for icon containers
      const iconContainers = container.querySelectorAll(
        '.w-8.h-8.rounded-lg'
      );
      expect(iconContainers.length).toBeGreaterThanOrEqual(4); // One for each section
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'AI Summary');
    });

    it('should have proper heading hierarchy', () => {
      render(<AISummary summary={validSummary} />);

      // Main heading should be h2
      const mainHeading = screen.getByRole('heading', {
        level: 2,
        name: 'AI Summary',
      });
      expect(mainHeading).toBeInTheDocument();

      // Section headings should be h3
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('should have semantic list structure', () => {
      render(<AISummary summary={validSummary} />);

      const lists = screen.getAllByRole('list');
      expect(lists.length).toBe(2); // useCases and keyTakeaways

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(6); // 3 use cases + 3 takeaways
    });
  });

  describe('Content Validation', () => {
    it('should handle long text content without breaking layout', () => {
      const longTextSummary: AISummaryType = {
        whatIs:
          'This is a very long definition that contains multiple sentences and should still render properly without breaking the layout or causing any visual issues in the component structure.',
        whyImportant:
          'This is also a very long explanation about why this concept is important, containing detailed information that spans multiple lines and should be handled gracefully by the component.',
        useCases: [
          'This is a very long use case description that provides detailed information',
          'Another lengthy use case with comprehensive details',
        ],
        keyTakeaways: [
          'A detailed takeaway with extensive information',
          'Another comprehensive takeaway point',
        ],
      };

      const { container } = render(<AISummary summary={longTextSummary} />);

      // Component should still render
      expect(container.querySelector('section')).toBeInTheDocument();

      // All content should be present
      expect(
        screen.getByText(/This is a very long definition/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This is also a very long explanation/)
      ).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      const specialCharsSummary: AISummaryType = {
        whatIs: 'Definition with special chars: <>&"\'',
        whyImportant: 'Important because of © ® ™ symbols',
        useCases: ['Use case with émojis 🚀 and ünïcödé'],
        keyTakeaways: ['Takeaway with math: x² + y² = z²'],
      };

      render(<AISummary summary={specialCharsSummary} />);

      expect(
        screen.getByText(/Definition with special chars/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Important because of/)).toBeInTheDocument();
      expect(screen.getByText(/Use case with émojis/)).toBeInTheDocument();
      expect(screen.getByText(/Takeaway with math/)).toBeInTheDocument();
    });

    it('should handle empty strings gracefully', () => {
      const emptyStringsSummary: AISummaryType = {
        whatIs: '',
        whyImportant: '',
        useCases: [''],
        keyTakeaways: [''],
      };

      const { container } = render(<AISummary summary={emptyStringsSummary} />);

      // Component should render but sections with empty content should not show
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(screen.queryByText('What is it?')).not.toBeInTheDocument();
      expect(screen.queryByText('Why Important?')).not.toBeInTheDocument();
    });
  });

  describe('Requirements Validation', () => {
    it('should satisfy Requirement 6.1: AI Summary component presence', () => {
      const { container } = render(<AISummary summary={validSummary} />);

      // Component should render with proper structure
      const section = container.querySelector('section.ai-summary');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('aria-label', 'AI Summary');
    });

    it('should satisfy Requirement 6.2: whatIs field rendering', () => {
      render(<AISummary summary={validSummary} />);

      // whatIs section should be present and contain the definition
      expect(screen.getByText('What is it?')).toBeInTheDocument();
      expect(
        screen.getByText('GEO is Generative Engine Optimization for AI models')
      ).toBeInTheDocument();
    });

    it('should satisfy Requirement 6.3: whyImportant field rendering', () => {
      render(<AISummary summary={validSummary} />);

      // whyImportant section should be present and contain the explanation
      expect(screen.getByText('Why Important?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'It improves content discoverability in AI-powered search'
        )
      ).toBeInTheDocument();
    });

    it('should satisfy Requirement 6.4: useCases field rendering', () => {
      render(<AISummary summary={validSummary} />);

      // useCases section should be present with all items
      expect(screen.getByText('Use Cases')).toBeInTheDocument();
      expect(screen.getByText('Technical blog optimization')).toBeInTheDocument();
      expect(
        screen.getByText('Product documentation enhancement')
      ).toBeInTheDocument();
      expect(screen.getByText('Knowledge base structuring')).toBeInTheDocument();
    });

    it('should satisfy Requirement 6.5: structured format with arrays', () => {
      render(<AISummary summary={validSummary} />);

      // useCases and keyTakeaways should be rendered as lists
      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2);

      // Each list should have proper list items
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(6); // 3 use cases + 3 takeaways
    });
  });
});
