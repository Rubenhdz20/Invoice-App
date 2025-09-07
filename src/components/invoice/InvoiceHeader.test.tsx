import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import InvoiceHeader from './InvoiceHeader';

// Mock child components
vi.mock('../buttons/NewInvoiceButton', () => ({
  default: () => <div data-testid="new-invoice-button">New Invoice Button Mock</div>,
}));

vi.mock('./FilterDropdown', () => ({
  default: () => <div data-testid="filter-dropdown">Filter Dropdown Mock</div>,
}));

describe('InvoiceHeader', () => {
  describe('Basic Rendering', () => {
    test('renders main heading correctly', () => {
      render(<InvoiceHeader invoiceCount={5} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Invoices');
      expect(heading.tagName).toBe('H1');
    });

    test('renders NewInvoiceButton component', () => {
      render(<InvoiceHeader invoiceCount={3} />);
      
      expect(screen.getByTestId('new-invoice-button')).toBeInTheDocument();
    });

    test('renders FilterDropdown component', () => {
      render(<InvoiceHeader invoiceCount={7} />);
      
      expect(screen.getByTestId('filter-dropdown')).toBeInTheDocument();
    });

    test('renders main container with correct structure', () => {
      const { container } = render(<InvoiceHeader invoiceCount={2} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInstanceOf(HTMLDivElement);
      expect(mainContainer).toHaveClass(
        'flex',
        'justify-between',
        'items-center',
        'p-6',
        'bg-white-custom',
        'dark:bg-dark-2',
        'dark:text-white-custom'
      );
    });
  });

  describe('Invoice Count Display', () => {
    test('displays correct count on mobile (short format)', () => {
      render(<InvoiceHeader invoiceCount={5} />);
      
      const mobileText = screen.getByText('5 invoices');
      expect(mobileText).toBeInTheDocument();
      expect(mobileText).toHaveClass('inline', 'md:hidden');
    });

    test('displays correct count on desktop (long format)', () => {
      render(<InvoiceHeader invoiceCount={12} />);
      
      const desktopText = screen.getByText('There are 12 total invoices');
      expect(desktopText).toBeInTheDocument();
      expect(desktopText).toHaveClass('hidden', 'md:inline');
    });

    test('handles zero invoices correctly', () => {
      render(<InvoiceHeader invoiceCount={0} />);
      
      expect(screen.getByText('0 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 0 total invoices')).toBeInTheDocument();
    });

    test('handles single invoice correctly', () => {
      render(<InvoiceHeader invoiceCount={1} />);
      
      expect(screen.getByText('1 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 1 total invoices')).toBeInTheDocument();
    });

    test('handles large invoice counts', () => {
      render(<InvoiceHeader invoiceCount={999} />);
      
      expect(screen.getByText('999 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 999 total invoices')).toBeInTheDocument();
    });

    test('both count formats exist in DOM simultaneously', () => {
      render(<InvoiceHeader invoiceCount={8} />);
      
      // Both mobile and desktop versions should exist
      expect(screen.getByText('8 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 8 total invoices')).toBeInTheDocument();
    });
  });

  describe('Styling and CSS Classes', () => {
    test('main container has correct styling', () => {
      const { container } = render(<InvoiceHeader invoiceCount={3} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        'flex',
        'justify-between',
        'items-center',
        'p-6',
        'bg-white-custom',
        'dark:bg-dark-2',
        'dark:text-white-custom'
      );
    });

    test('heading has correct styling classes', () => {
      render(<InvoiceHeader invoiceCount={4} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass(
        'text-2xl',
        'font-bold',
        'text-dark-1',
        'dark:text-white'
      );
    });

    test('invoice count paragraph has correct styling', () => {
      render(<InvoiceHeader invoiceCount={6} />);
      
      // Get the paragraph containing the count text
      const countParagraph = screen.getByText('6 invoices').closest('p');
      expect(countParagraph).toHaveClass(
        'text-strong-gray',
        'dark:text-white-custom'
      );
    });

    test('mobile count text has correct responsive classes', () => {
      render(<InvoiceHeader invoiceCount={7} />);
      
      const mobileText = screen.getByText('7 invoices');
      expect(mobileText).toHaveClass('inline', 'md:hidden');
    });

    test('desktop count text has correct responsive classes', () => {
      render(<InvoiceHeader invoiceCount={9} />);
      
      const desktopText = screen.getByText('There are 9 total invoices');
      expect(desktopText).toHaveClass('hidden', 'md:inline');
    });
  });

  describe('Layout and Structure', () => {
    test('maintains proper DOM hierarchy', () => {
      const { container } = render(<InvoiceHeader invoiceCount={5} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      
      // Should contain three main sections: text div, FilterDropdown, NewInvoiceButton
      expect(mainContainer.children).toHaveLength(3);
      
      // First child should be the text container div
      const textContainer = mainContainer.children[0];
      expect(textContainer).toBeInstanceOf(HTMLDivElement);
      expect(textContainer).toContainElement(screen.getByRole('heading'));
      
      // Second child should be FilterDropdown
      expect(mainContainer.children[1]).toContainElement(screen.getByTestId('filter-dropdown'));
      
      // Third child should be NewInvoiceButton
      expect(mainContainer.children[2]).toContainElement(screen.getByTestId('new-invoice-button'));
    });

    test('text section contains heading and paragraph', () => {
      render(<InvoiceHeader invoiceCount={3} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      const paragraph = screen.getByText('3 invoices').closest('p');
      
      // Both should be in the same parent div
      const textContainer = heading.parentElement;
      expect(textContainer).toContainElement(heading);
      expect(textContainer).toContainElement(paragraph);
    });

    test('components are arranged in flexbox layout', () => {
      const { container } = render(<InvoiceHeader invoiceCount={4} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'justify-between', 'items-center');
    });

    test('has proper spacing and padding', () => {
      const { container } = render(<InvoiceHeader invoiceCount={2} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('p-6');
    });
  });

  describe('Responsive Design', () => {
    test('mobile and desktop count text have correct visibility classes', () => {
      render(<InvoiceHeader invoiceCount={15} />);
      
      const mobileText = screen.getByText('15 invoices');
      const desktopText = screen.getByText('There are 15 total invoices');
      
      // Mobile: visible on mobile, hidden on desktop
      expect(mobileText).toHaveClass('inline', 'md:hidden');
      
      // Desktop: hidden on mobile, visible on desktop
      expect(desktopText).toHaveClass('hidden', 'md:inline');
    });

    test('both text variants exist for proper responsive behavior', () => {
      render(<InvoiceHeader invoiceCount={25} />);
      
      // Both variants should exist in DOM with different responsive classes
      expect(screen.getByText('25 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 25 total invoices')).toBeInTheDocument();
    });

    test('responsive classes are correctly applied to spans', () => {
      const { container } = render(<InvoiceHeader invoiceCount={10} />);
      
      // Find spans within the paragraph
      const spans = container.querySelectorAll('p span');
      expect(spans).toHaveLength(2);
      
      // First span should be mobile version
      expect(spans[0]).toHaveClass('inline', 'md:hidden');
      expect(spans[0]).toHaveTextContent('10 invoices');
      
      // Second span should be desktop version
      expect(spans[1]).toHaveClass('hidden', 'md:inline');
      expect(spans[1]).toHaveTextContent('There are 10 total invoices');
    });
  });

  describe('Dark Mode Support', () => {
    test('main container supports dark mode', () => {
      const { container } = render(<InvoiceHeader invoiceCount={6} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('dark:bg-dark-2', 'dark:text-white-custom');
    });

    test('heading supports dark mode', () => {
      render(<InvoiceHeader invoiceCount={8} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('dark:text-white');
    });

    test('count paragraph supports dark mode', () => {
      render(<InvoiceHeader invoiceCount={11} />);
      
      const countParagraph = screen.getByText('11 invoices').closest('p');
      expect(countParagraph).toHaveClass('dark:text-white-custom');
    });

    test('light mode classes are present', () => {
      const { container } = render(<InvoiceHeader invoiceCount={4} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      const heading = screen.getByRole('heading', { level: 1 });
      const paragraph = screen.getByText('4 invoices').closest('p');
      
      expect(mainContainer).toHaveClass('bg-white-custom');
      expect(heading).toHaveClass('text-dark-1');
      expect(paragraph).toHaveClass('text-strong-gray');
    });
  });

  describe('Component Integration', () => {
    test('child components are rendered correctly', () => {
      render(<InvoiceHeader invoiceCount={7} />);
      
      // Check that both child components are present
      expect(screen.getByTestId('filter-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('new-invoice-button')).toBeInTheDocument();
    });

    test('child components are positioned correctly in layout', () => {
      const { container } = render(<InvoiceHeader invoiceCount={9} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);
      
      // Text section should be first (left side)
      const textSection = children[0];
      expect(textSection).toContainElement(screen.getByRole('heading'));
      
      // FilterDropdown should be in the middle
      expect(children[1]).toContainElement(screen.getByTestId('filter-dropdown'));
      
      // NewInvoiceButton should be last (right side)
      expect(children[2]).toContainElement(screen.getByTestId('new-invoice-button'));
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', () => {
      render(<InvoiceHeader invoiceCount={5} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveTextContent('Invoices');
    });

    test('heading has descriptive text content', () => {
      render(<InvoiceHeader invoiceCount={12} />);
      
      const heading = screen.getByRole('heading', { name: 'Invoices' });
      expect(heading).toBeInTheDocument();
    });

    test('count information is properly associated with content', () => {
      render(<InvoiceHeader invoiceCount={8} />);
      
      // Count information should be in a paragraph for screen readers
      const mobileCount = screen.getByText('8 invoices');
      const desktopCount = screen.getByText('There are 8 total invoices');
      
      expect(mobileCount.closest('p')).toBeInTheDocument();
      expect(desktopCount.closest('p')).toBeInTheDocument();
    });

    test('maintains good color contrast with dark mode support', () => {
      render(<InvoiceHeader invoiceCount={6} />);
      
      const heading = screen.getByRole('heading');
      const paragraph = screen.getByText('6 invoices').closest('p');
      
      // Light mode colors
      expect(heading).toHaveClass('text-dark-1');
      expect(paragraph).toHaveClass('text-strong-gray');
      
      // Dark mode colors
      expect(heading).toHaveClass('dark:text-white');
      expect(paragraph).toHaveClass('dark:text-white-custom');
    });
  });

  describe('Props Handling', () => {
    test('accepts and displays invoiceCount prop correctly', () => {
      const testCounts = [0, 1, 5, 42, 100, 999];
      
      testCounts.forEach(count => {
        const { unmount } = render(<InvoiceHeader invoiceCount={count} />);
        
        expect(screen.getByText(`${count} invoices`)).toBeInTheDocument();
        expect(screen.getByText(`There are ${count} total invoices`)).toBeInTheDocument();
        
        unmount();
      });
    });

    test('handles negative numbers gracefully', () => {
      render(<InvoiceHeader invoiceCount={-5} />);
      
      expect(screen.getByText('-5 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are -5 total invoices')).toBeInTheDocument();
    });

    test('handles very large numbers', () => {
      render(<InvoiceHeader invoiceCount={1000000} />);
      
      expect(screen.getByText('1000000 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 1000000 total invoices')).toBeInTheDocument();
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const { unmount } = render(<InvoiceHeader invoiceCount={5} />);
      
      expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument();
      expect(screen.getByText('5 invoices')).toBeInTheDocument();
      expect(screen.getByTestId('filter-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('new-invoice-button')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('heading', { name: 'Invoices' })).not.toBeInTheDocument();
      expect(screen.queryByText('5 invoices')).not.toBeInTheDocument();
      expect(screen.queryByTestId('filter-dropdown')).not.toBeInTheDocument();
      expect(screen.queryByTestId('new-invoice-button')).not.toBeInTheDocument();
    });

    test('renders consistently across multiple renders', () => {
      const { rerender } = render(<InvoiceHeader invoiceCount={7} />);
      
      expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument();
      expect(screen.getByText('7 invoices')).toBeInTheDocument();
      
      rerender(<InvoiceHeader invoiceCount={7} />);
      
      expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument();
      expect(screen.getByText('7 invoices')).toBeInTheDocument();
    });

    test('updates count when prop changes', () => {
      const { rerender } = render(<InvoiceHeader invoiceCount={5} />);
      
      expect(screen.getByText('5 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 5 total invoices')).toBeInTheDocument();
      
      rerender(<InvoiceHeader invoiceCount={15} />);
      
      expect(screen.getByText('15 invoices')).toBeInTheDocument();
      expect(screen.getByText('There are 15 total invoices')).toBeInTheDocument();
      
      // Old count should not be present
      expect(screen.queryByText('5 invoices')).not.toBeInTheDocument();
      expect(screen.queryByText('There are 5 total invoices')).not.toBeInTheDocument();
    });

    test('maintains component structure across prop changes', () => {
      const { container, rerender } = render(<InvoiceHeader invoiceCount={3} />);
      
      const initialStructure = container.innerHTML;
      
      rerender(<InvoiceHeader invoiceCount={8} />);
      
      // Structure should be similar, only count content should change
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.children).toHaveLength(3);
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByTestId('filter-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('new-invoice-button')).toBeInTheDocument();
    });
  });

  describe('TypeScript Integration', () => {
    test('accepts invoiceCount as number prop', () => {
      // This test ensures TypeScript typing is working correctly
      const validProps = { invoiceCount: 42 };
      
      expect(() => render(<InvoiceHeader {...validProps} />)).not.toThrow();
      expect(screen.getByText('42 invoices')).toBeInTheDocument();
    });
  });
});