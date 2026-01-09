import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QASection from '@/components/Blog/QASection';
import { QAPair } from '@/types/geo';

describe('QASection Component', () => {
  const mockQAPairs: QAPair[] = [
    {
      question: 'What is Web3?',
      answer: 'Web3 is the next generation of the internet built on blockchain technology.',
      category: 'definition',
      relatedConcepts: ['blockchain', 'decentralization']
    },
    {
      question: 'How does Web3 differ from Web2?',
      answer: 'Web3 is decentralized while Web2 is centralized.',
      category: 'comparison',
      relatedConcepts: ['Web2', 'centralization']
    },
    {
      question: 'What are the use cases of Web3?',
      answer: 'Web3 can be used for DeFi, NFTs, and decentralized applications.',
      category: 'application',
      relatedConcepts: ['DeFi', 'NFT', 'dApp']
    },
    {
      question: 'What are the limitations of Web3?',
      answer: 'Web3 faces scalability issues and high transaction costs.',
      category: 'limitation',
      relatedConcepts: ['scalability', 'gas fees']
    }
  ];

  it('should render Q&A section with all questions', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('What is Web3?')).toBeInTheDocument();
    expect(screen.getByText('How does Web3 differ from Web2?')).toBeInTheDocument();
  });

  it('should not render when qaPairs is empty', () => {
    const { container } = render(<QASection qaPairs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should expand and collapse Q&A items', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    const firstQuestion = screen.getByText('What is Web3?');
    const questionButton = firstQuestion.closest('button');
    
    // Initially collapsed - answer should not be visible
    expect(screen.queryByText('Web3 is the next generation of the internet built on blockchain technology.')).not.toBeInTheDocument();
    
    // Click to expand
    if (questionButton) {
      fireEvent.click(questionButton);
    }
    
    // Answer should now be visible
    expect(screen.getByText('Web3 is the next generation of the internet built on blockchain technology.')).toBeInTheDocument();
    
    // Click to collapse
    if (questionButton) {
      fireEvent.click(questionButton);
    }
    
    // Answer should be hidden again
    expect(screen.queryByText('Web3 is the next generation of the internet built on blockchain technology.')).not.toBeInTheDocument();
  });

  it('should filter questions by search query', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    const searchInput = screen.getByPlaceholderText('Search questions...');
    
    // Search for "Web3"
    fireEvent.change(searchInput, { target: { value: 'Web3' } });
    
    // Should show questions containing "Web3"
    expect(screen.getByText('What is Web3?')).toBeInTheDocument();
    expect(screen.getByText('How does Web3 differ from Web2?')).toBeInTheDocument();
    expect(screen.getByText('What are the use cases of Web3?')).toBeInTheDocument();
    expect(screen.getByText('What are the limitations of Web3?')).toBeInTheDocument();
    
    // Search for "limitation"
    fireEvent.change(searchInput, { target: { value: 'limitation' } });
    
    // Should only show the limitation question
    expect(screen.queryByText('What is Web3?')).not.toBeInTheDocument();
    expect(screen.getByText('What are the limitations of Web3?')).toBeInTheDocument();
  });

  it('should filter questions by category', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    // Click on "Definition" category filter - use getAllByText and click the button (second occurrence)
    const definitionButtons = screen.getAllByText(/Definition \(1\)/);
    fireEvent.click(definitionButtons[0]);
    
    // Should only show definition questions
    expect(screen.getByText('What is Web3?')).toBeInTheDocument();
    expect(screen.queryByText('How does Web3 differ from Web2?')).not.toBeInTheDocument();
    
    // Click on "Comparison" category filter
    const comparisonButtons = screen.getAllByText(/Comparison \(1\)/);
    fireEvent.click(comparisonButtons[0]);
    
    // Should only show comparison questions
    expect(screen.queryByText('What is Web3?')).not.toBeInTheDocument();
    expect(screen.getByText('How does Web3 differ from Web2?')).toBeInTheDocument();
  });

  it('should expand all questions when "Expand All" is clicked', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    const expandAllButton = screen.getByText('Expand All');
    fireEvent.click(expandAllButton);
    
    // All answers should be visible
    expect(screen.getByText('Web3 is the next generation of the internet built on blockchain technology.')).toBeInTheDocument();
    expect(screen.getByText('Web3 is decentralized while Web2 is centralized.')).toBeInTheDocument();
    expect(screen.getByText('Web3 can be used for DeFi, NFTs, and decentralized applications.')).toBeInTheDocument();
    expect(screen.getByText('Web3 faces scalability issues and high transaction costs.')).toBeInTheDocument();
  });

  it('should collapse all questions when "Collapse All" is clicked', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    // First expand all
    const expandAllButton = screen.getByText('Expand All');
    fireEvent.click(expandAllButton);
    
    // Then collapse all
    const collapseAllButton = screen.getByText('Collapse All');
    fireEvent.click(collapseAllButton);
    
    // All answers should be hidden
    expect(screen.queryByText('Web3 is the next generation of the internet built on blockchain technology.')).not.toBeInTheDocument();
    expect(screen.queryByText('Web3 is decentralized while Web2 is centralized.')).not.toBeInTheDocument();
  });

  it('should display related concepts when answer is expanded', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    const firstQuestion = screen.getByText('What is Web3?');
    const questionButton = firstQuestion.closest('button');
    
    // Expand the question
    if (questionButton) {
      fireEvent.click(questionButton);
    }
    
    // Related concepts should be visible
    expect(screen.getByText('blockchain')).toBeInTheDocument();
    expect(screen.getByText('decentralization')).toBeInTheDocument();
  });

  it('should show "No questions found" message when search has no results', () => {
    render(<QASection qaPairs={mockQAPairs} />);
    
    const searchInput = screen.getByPlaceholderText('Search questions...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent query' } });
    
    expect(screen.getByText('No questions found matching your search.')).toBeInTheDocument();
  });

  it('should display custom title and subtitle', () => {
    const customTitle = 'Custom Q&A Title';
    const customSubtitle = 'Custom subtitle text';
    
    render(
      <QASection 
        qaPairs={mockQAPairs} 
        title={customTitle}
        subtitle={customSubtitle}
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customSubtitle)).toBeInTheDocument();
  });

  it('should have proper Schema.org markup', () => {
    const { container } = render(<QASection qaPairs={mockQAPairs} />);
    
    // Check for FAQPage schema
    const faqSection = container.querySelector('[itemtype="https://schema.org/FAQPage"]');
    expect(faqSection).toBeInTheDocument();
    
    // Check for Question schema
    const questions = container.querySelectorAll('[itemtype="https://schema.org/Question"]');
    expect(questions.length).toBe(mockQAPairs.length);
  });
});
