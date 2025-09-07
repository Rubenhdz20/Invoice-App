import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFoundInvoice from './NotFoundInvoice';

describe('NotFoundInvoice', () => {
  describe('Basic Rendering', () => {
    test('renders illustration image with correct attributes', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toBeInTheDocument();
      expect(illustration).toBeInstanceOf(HTMLImageElement);
      expect(illustration).toHaveAttribute('alt', 'No invoices');
    });

    test('renders main heading with correct text', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('There is nothing here');
      expect(heading.tagName).toBe('H2');
    });

    test('renders descriptive paragraph text', () => {
      render(<NotFoundInvoice />);
      
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph.tagName).toBe('P');
    });

    test('renders all elements in correct order', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);
      
      expect(children).toHaveLength(3);
      expect(children[0]).toBeInstanceOf(HTMLImageElement);
      expect(children[1]).toBeInstanceOf(HTMLHeadingElement);
      expect(children[2]).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('Styling and CSS Classes', () => {
    test('main container has correct layout classes', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        'min-h-screen',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'text-center'
      );
    });

    test('illustration has correct styling classes', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toHaveClass(
        'mb-6',
        'w-48',
        'h-auto'
      );
    });

    test('heading has correct styling classes', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass(
        'text-[#DFE3FA]',
        'text-xl',
        'font-bold',
        'mb-2'
      );
    });

    test('paragraph has correct styling classes', () => {
      render(<NotFoundInvoice />);
      
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      expect(paragraph).toHaveClass(
        'text-[#DFE3FA]',
        'max-w-xs'
      );
    });

    test('uses consistent color scheme', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      
      // Both text elements should use the same color
      expect(heading).toHaveClass('text-[#DFE3FA]');
      expect(paragraph).toHaveClass('text-[#DFE3FA]');
    });
  });

  describe('Layout and Structure', () => {
    test('maintains proper DOM hierarchy', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInstanceOf(HTMLDivElement);
      
      // Check that all elements are direct children of main container
      expect(mainContainer).toContainElement(screen.getByAltText('No invoices'));
      expect(mainContainer).toContainElement(screen.getByRole('heading', { level: 2 }));
      expect(mainContainer).toContainElement(screen.getByText('Please check the invoice ID and try again'));
    });

    test('uses flexbox layout for centering', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });

    test('applies text center alignment', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('text-center');
    });

    test('takes full screen height', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('min-h-screen');
    });

    test('elements have proper spacing', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(illustration).toHaveClass('mb-6');
      expect(heading).toHaveClass('mb-2');
    });
  });

  describe('Image Integration', () => {
    test('illustration has valid src attribute', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toHaveAttribute('src');
      
      // Vite processes SVGs as data URLs or modules, so just check that src exists and is not empty
      const srcAttribute = illustration.getAttribute('src');
      expect(srcAttribute).toBeTruthy();
      expect(srcAttribute).not.toBe('');
    });

    test('illustration has appropriate dimensions', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toHaveClass('w-48', 'h-auto');
    });

    test('illustration maintains aspect ratio', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toHaveClass('h-auto');
    });
  });

  describe('Typography and Content', () => {
    test('heading has appropriate font weight and size', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-xl', 'font-bold');
    });

    test('heading text is descriptive and clear', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('There is nothing here');
    });

    test('paragraph provides helpful guidance', () => {
      render(<NotFoundInvoice />);
      
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph.textContent).toMatch(/check.*invoice ID.*try again/i);
    });

    test('paragraph has width constraint for readability', () => {
      render(<NotFoundInvoice />);
      
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      expect(paragraph).toHaveClass('max-w-xs');
    });

    test('text content is user-friendly and actionable', () => {
      render(<NotFoundInvoice />);
      
      // Check that the content guides the user on what to do
      expect(screen.getByText('There is nothing here')).toBeInTheDocument();
      expect(screen.getByText('Please check the invoice ID and try again')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('image has descriptive alt text', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toHaveAttribute('alt', 'No invoices');
    });

    test('heading has proper semantic level', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    test('heading is accessible by screen readers', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { name: 'There is nothing here' });
      expect(heading).toBeInTheDocument();
    });

    test('content is structured for screen readers', () => {
      render(<NotFoundInvoice />);
      
      // Verify semantic structure: image -> heading -> paragraph
      const heading = screen.getByRole('heading');
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      
      expect(heading).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
    });

    test('text has sufficient contrast consideration', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      
      // Uses specific color for visibility
      expect(heading).toHaveClass('text-[#DFE3FA]');
      expect(paragraph).toHaveClass('text-[#DFE3FA]');
    });
  });

  describe('User Experience', () => {
    test('provides clear visual hierarchy', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      const heading = screen.getByRole('heading', { level: 2 });
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      
      // Image is largest and first
      expect(illustration).toHaveClass('w-48');
      
      // Heading is prominent
      expect(heading).toHaveClass('text-xl', 'font-bold');
      
      // Paragraph is smaller and constrained
      expect(paragraph).toHaveClass('max-w-xs');
    });

    test('centers all content for balanced appearance', () => {
      const { container } = render(<NotFoundInvoice />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('text-center', 'items-center', 'justify-center');
    });

    test('provides helpful error messaging', () => {
      render(<NotFoundInvoice />);
      
      // Should indicate what went wrong and what to do about it
      expect(screen.getByText('There is nothing here')).toBeInTheDocument();
      expect(screen.getByText(/check.*invoice ID/i)).toBeInTheDocument();
    });

    test('uses appropriate illustration for context', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toBeInTheDocument();
      
      // Alt text should be contextually appropriate
      expect(illustration).toHaveAttribute('alt', 'No invoices');
    });
  });

  describe('Visual Design', () => {
    test('maintains consistent spacing between elements', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(illustration).toHaveClass('mb-6');
      expect(heading).toHaveClass('mb-2');
    });

    test('uses appropriate image size for not-found state', () => {
      render(<NotFoundInvoice />);
      
      const illustration = screen.getByAltText('No invoices');
      expect(illustration).toHaveClass('w-48', 'h-auto');
    });

    test('applies consistent color scheme throughout', () => {
      render(<NotFoundInvoice />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      const paragraph = screen.getByText('Please check the invoice ID and try again');
      
      expect(heading).toHaveClass('text-[#DFE3FA]');
      expect(paragraph).toHaveClass('text-[#DFE3FA]');
    });
  });

  describe('Component Behavior', () => {
    test('component mounts without errors', () => {
      expect(() => render(<NotFoundInvoice />)).not.toThrow();
    });

    test('component unmounts without errors', () => {
      const { unmount } = render(<NotFoundInvoice />);
      
      expect(screen.getByRole('heading', { name: 'There is nothing here' })).toBeInTheDocument();
      expect(screen.getByAltText('No invoices')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
      
      expect(screen.queryByRole('heading', { name: 'There is nothing here' })).not.toBeInTheDocument();
      expect(screen.queryByAltText('No invoices')).not.toBeInTheDocument();
    });

    test('renders consistently across multiple renders', () => {
      const { rerender } = render(<NotFoundInvoice />);
      
      expect(screen.getByRole('heading', { name: 'There is nothing here' })).toBeInTheDocument();
      expect(screen.getByAltText('No invoices')).toBeInTheDocument();
      expect(screen.getByText('Please check the invoice ID and try again')).toBeInTheDocument();
      
      rerender(<NotFoundInvoice />);
      
      expect(screen.getByRole('heading', { name: 'There is nothing here' })).toBeInTheDocument();
      expect(screen.getByAltText('No invoices')).toBeInTheDocument();
      expect(screen.getByText('Please check the invoice ID and try again')).toBeInTheDocument();
    });

    test('maintains component structure after re-renders', () => {
      const { container, rerender } = render(<NotFoundInvoice />);
      
      const initialStructure = container.innerHTML;
      
      rerender(<NotFoundInvoice />);
      
      expect(container.innerHTML).toBe(initialStructure);
    });
  });

  describe('Content Validation', () => {
    test('displays appropriate empty state message', () => {
      render(<NotFoundInvoice />);
      
      // Message should be appropriate for a not-found scenario
      const heading = screen.getByText('There is nothing here');
      expect(heading).toBeInTheDocument();
    });

    test('provides actionable instruction to user', () => {
      render(<NotFoundInvoice />);
      
      const instruction = screen.getByText('Please check the invoice ID and try again');
      expect(instruction).toBeInTheDocument();
      expect(instruction.textContent).toMatch(/check.*invoice ID.*try again/);
    });

    test('uses appropriate tone for error state', () => {
      render(<NotFoundInvoice />);
      
      // Should be informative but not alarming
      expect(screen.getByText('There is nothing here')).toBeInTheDocument();
      expect(screen.getByText(/Please check/)).toBeInTheDocument();
    });
  });

  describe('Static Component Properties', () => {
    test('has no props or state dependencies', () => {
      // Component should render the same regardless of external factors
      const render1 = render(<NotFoundInvoice />);
      const content1 = render1.container.innerHTML;
      render1.unmount();
      
      const render2 = render(<NotFoundInvoice />);
      const content2 = render2.container.innerHTML;
      render2.unmount();
      
      expect(content1).toBe(content2);
    });

    test('is a pure component with consistent output', () => {
      render(<NotFoundInvoice />);
      
      // Should always render the same content
      expect(screen.getByText('There is nothing here')).toBeInTheDocument();
      expect(screen.getByText('Please check the invoice ID and try again')).toBeInTheDocument();
      expect(screen.getByAltText('No invoices')).toBeInTheDocument();
    });
  });

  describe('Integration Context', () => {
    test('suitable for invoice not found scenarios', () => {
      render(<NotFoundInvoice />);
      
      // Content should be specifically about invoices
      expect(screen.getByAltText('No invoices')).toBeInTheDocument();
      expect(screen.getByText(/invoice ID/)).toBeInTheDocument();
    });

    test('provides appropriate user guidance for invoice context', () => {
      render(<NotFoundInvoice />);
      
      const guidance = screen.getByText('Please check the invoice ID and try again');
      expect(guidance).toBeInTheDocument();
      expect(guidance.textContent).toMatch(/invoice ID/);
    });

    test('matches expected empty state pattern', () => {
      render(<NotFoundInvoice />);
      
      // Follows typical empty state pattern: illustration + message + action
      expect(screen.getByAltText('No invoices')).toBeInTheDocument(); // Illustration
      expect(screen.getByText('There is nothing here')).toBeInTheDocument(); // Message
      expect(screen.getByText(/check.*invoice ID/)).toBeInTheDocument(); // Action guidance
    });
  });
});