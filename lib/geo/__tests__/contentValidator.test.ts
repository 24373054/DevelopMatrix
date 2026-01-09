/**
 * Unit Tests for Content Validator
 * 
 * Tests basic functionality of the ContentValidator class
 */

import { ContentValidator, validateContent } from '../contentValidator';
import type { ContentQualityReport } from '@/types/geo';

describe('ContentValidator', () => {
  let validator: ContentValidator;

  beforeEach(() => {
    validator = new ContentValidator();
  });

  describe('Paragraph Length Checking', () => {
    it('should detect paragraphs exceeding 300 characters', () => {
      const longParagraph = '<p>' + 'a'.repeat(350) + '</p>';
      const report = validator.validate('test-1', longParagraph);

      const lengthIssues = report.issues.filter(i => i.type === 'paragraph_length');
      expect(lengthIssues.length).toBeGreaterThan(0);
      expect(report.metrics.paragraphLengthOk).toBe(false);
    });

    it('should pass paragraphs within 300 characters', () => {
      const shortParagraph = '<p>This is a short paragraph with less than 300 characters.</p>';
      const report = validator.validate('test-2', shortParagraph);

      const lengthIssues = report.issues.filter(i => i.type === 'paragraph_length');
      expect(lengthIssues.length).toBe(0);
      expect(report.metrics.paragraphLengthOk).toBe(true);
    });

    it('should check multiple paragraphs', () => {
      const content = `
        <p>Short paragraph.</p>
        <p>${'a'.repeat(350)}</p>
        <p>Another short one.</p>
      `;
      const report = validator.validate('test-3', content);

      const lengthIssues = report.issues.filter(i => i.type === 'paragraph_length');
      expect(lengthIssues.length).toBe(1);
    });
  });

  describe('Rhetorical Question Detection', () => {
    it('should detect Chinese rhetorical questions', () => {
      const content = '<p>这是一个好主意吗？</p>';
      const report = validator.validate('test-4', content);

      const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
      expect(rhetoricalIssues.length).toBeGreaterThan(0);
    });

    it('should detect English rhetorical questions', () => {
      const content = '<p>Why would anyone do this?</p>';
      const report = validator.validate('test-5', content);

      const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
      expect(rhetoricalIssues.length).toBeGreaterThan(0);
    });

    it('should not flag questions in Q&A sections', () => {
      const content = `
        <section class="qa-section">
          <h2>Q&A</h2>
          <p>What is blockchain?</p>
        </section>
      `;
      const report = validator.validate('test-6', content);

      // Questions in Q&A sections should be allowed
      const rhetoricalIssues = report.issues.filter(i => i.type === 'rhetorical_question');
      expect(rhetoricalIssues.length).toBe(0);
    });
  });

  describe('Vague Term Detection', () => {
    it('should detect Chinese vague terms', () => {
      const content = '<p>这可能是一个好方案。</p>';
      const report = validator.validate('test-7', content);

      const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
      expect(vagueIssues.length).toBeGreaterThan(0);
      expect(report.metrics.avoidsVagueTerms).toBe(false);
    });

    it('should detect English vague terms', () => {
      const content = '<p>This might be a good solution.</p>';
      const report = validator.validate('test-8', content);

      const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
      expect(vagueIssues.length).toBeGreaterThan(0);
      expect(report.metrics.avoidsVagueTerms).toBe(false);
    });

    it('should detect multiple vague terms', () => {
      const content = '<p>这也许可能大概是个好主意。</p>';
      const report = validator.validate('test-9', content);

      const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
      expect(vagueIssues.length).toBeGreaterThanOrEqual(2);
    });

    it('should pass content without vague terms', () => {
      const content = '<p>This is a definitive statement.</p>';
      const report = validator.validate('test-10', content);

      const vagueIssues = report.issues.filter(i => i.type === 'vague_term');
      expect(vagueIssues.length).toBe(0);
      expect(report.metrics.avoidsVagueTerms).toBe(true);
    });
  });

  describe('Hyperbole Detection', () => {
    it('should detect Chinese hyperbolic terms', () => {
      const content = '<p>这是一个颠覆性的革命性技术。</p>';
      const report = validator.validate('test-11', content);

      const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
      expect(hyperboleIssues.length).toBeGreaterThan(0);
      expect(report.metrics.avoidsHyperbole).toBe(false);
    });

    it('should detect English hyperbolic terms', () => {
      const content = '<p>This is a revolutionary and groundbreaking solution.</p>';
      const report = validator.validate('test-12', content);

      const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
      expect(hyperboleIssues.length).toBeGreaterThan(0);
      expect(report.metrics.avoidsHyperbole).toBe(false);
    });

    it('should pass content without hyperbole', () => {
      const content = '<p>This is an effective and well-tested solution.</p>';
      const report = validator.validate('test-13', content);

      const hyperboleIssues = report.issues.filter(i => i.type === 'hyperbole');
      expect(hyperboleIssues.length).toBe(0);
      expect(report.metrics.avoidsHyperbole).toBe(true);
    });
  });

  describe('Overall Quality Score', () => {
    it('should calculate a high score for good content', () => {
      const goodContent = `
        <p>智能合约是指运行在区块链上的自动执行程序。</p>
        <ul>
          <li>自动执行</li>
          <li>不可篡改</li>
        </ul>
        <p>因此，智能合约提供了可信的执行环境。</p>
      `;
      const report = validator.validate('test-14', goodContent, true, true);

      expect(report.overallScore).toBeGreaterThan(80);
    });

    it('should calculate a lower score for poor content', () => {
      const poorContent = `
        <p>${'a'.repeat(350)}</p>
        <p>这可能也许大概是个颠覆性的革命性方案吗？</p>
      `;
      const report = validator.validate('test-15', poorContent, false, false);

      expect(report.overallScore).toBeLessThan(70);
    });
  });

  describe('Recommendations', () => {
    it('should provide recommendations for missing features', () => {
      const content = '<p>Some basic content.</p>';
      const report = validator.validate('test-16', content, false, false);

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations.some(r => r.includes('AI Summary'))).toBe(true);
      expect(report.recommendations.some(r => r.includes('Q&A'))).toBe(true);
    });

    it('should provide recommendations for quality issues', () => {
      const content = '<p>这可能是个好主意吗？</p>';
      const report = validator.validate('test-17', content);

      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Convenience Function', () => {
    it('should work with validateContent function', () => {
      const content = '<p>Test content.</p>';
      const report = validateContent('test-18', content);

      expect(report).toBeDefined();
      expect(report.articleId).toBe('test-18');
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const report = validator.validate('test-19', '');

      expect(report).toBeDefined();
      expect(report.issues).toBeDefined();
      expect(Array.isArray(report.issues)).toBe(true);
    });

    it('should handle content with only whitespace', () => {
      const report = validator.validate('test-20', '   \n\n   ');

      expect(report).toBeDefined();
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle content without HTML tags', () => {
      const report = validator.validate('test-21', 'Plain text content');

      expect(report).toBeDefined();
      expect(Array.isArray(report.issues)).toBe(true);
    });
  });
});
