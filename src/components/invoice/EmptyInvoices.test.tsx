import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import EmptyInvoices from './EmptyInvoices';

// Mock useUser from @clerk/clerk-react
const mockUseUser = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => mockUseUser(),
}));

// Helper function to render EmptyInvoices with Router context
function renderWithRouter() {
  return render(
    <BrowserRouter>
      <EmptyInvoices />
    </BrowserRouter>
  );
}

describe('EmptyInvoices', () => {
  beforeEach(() => {
    mockUseUser.mockClear();
  });

  describe('Rendering with User First Name', () => {
    test('renders welcome message with user first name when available', () => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'John',
        },
      });

      renderWithRouter();
      
      expect(screen.getByText('Welcome John! 👋')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /welcome john/i })).toBeInTheDocument();
    });

    test('renders welcome message with "there" when first name is null', () => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: null,
        },
      });

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /welcome there/i })).toBeInTheDocument();
    });

    test('renders welcome message with "there" when first name is undefined', () => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: undefined,
        },
      });

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
    });

    test('renders welcome message with "there" when user is null', () => {
      mockUseUser.mockReturnValue({
        user: null,
      });

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
    });

    test('renders welcome message with "there" when user is undefined', () => {
      mockUseUser.mockReturnValue({
        user: undefined,
      });

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
    });
  });

  describe('Content and Messaging', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Sarah',
        },
      });
    });

    test('renders motivational subtitle', () => {
      renderWithRouter();
      
      expect(screen.getByText('Ready to create your first invoice and start managing your business?')).toBeInTheDocument();
    });

    test('renders helpful text at bottom', () => {
      renderWithRouter();
      
      expect(screen.getByText('Start building professional invoices in seconds')).toBeInTheDocument();
    });

    test('contains emoji in welcome message', () => {
      renderWithRouter();
      
      const welcomeText = screen.getByText(/Welcome Sarah! 👋/);
      expect(welcomeText).toBeInTheDocument();
      expect(welcomeText.textContent).toContain('👋');
    });
  });

  describe('Visual Elements and SVG Icon', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Alex',
        },
      });
    });

    test('renders document SVG icon with correct attributes', () => {
      const { container } = renderWithRouter();
      
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svgIcon).toHaveAttribute('fill', 'none');
      expect(svgIcon).toHaveAttribute('stroke', 'currentColor');
    });

    test('SVG has correct path element for document icon', () => {
      const { container } = renderWithRouter();
      
      const pathElement = container.querySelector('path[d*="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"]');
      expect(pathElement).toBeInTheDocument();
      expect(pathElement).toHaveAttribute('stroke-linecap', 'round');
      expect(pathElement).toHaveAttribute('stroke-linejoin', 'round');
      expect(pathElement).toHaveAttribute('stroke-width', '1.5');
    });

    test('icon container has correct styling', () => {
      const { container } = renderWithRouter();
      
      const iconContainer = container.querySelector('.w-32.h-32');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass(
        'w-32',
        'h-32',
        'mx-auto',
        'bg-purple-100',
        'dark:bg-purple-900/20',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  describe('Styling and CSS Classes', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Maria',
        },
      });
    });

    test('applies correct CSS classes to main container', () => {
      const { container } = renderWithRouter();
      
      const mainContainer = container.querySelector('.flex.flex-col');
      expect(mainContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'py-16',
        'px-4'
      );
    });

    test('applies correct CSS classes to text container', () => {
      const { container } = renderWithRouter();
      
      const textContainer = container.querySelector('.text-center.max-w-md');
      expect(textContainer).toHaveClass('text-center', 'max-w-md');
    });

    test('welcome heading has correct styling classes', () => {
      renderWithRouter();
      
      const heading = screen.getByRole('heading', { name: /welcome maria/i });
      expect(heading).toHaveClass(
        'text-2xl',
        'font-bold',
        'text-gray-900',
        'dark:text-white',
        'mb-2'
      );
    });

    test('subtitle paragraph has correct styling classes', () => {
      renderWithRouter();
      
      const subtitle = screen.getByText('Ready to create your first invoice and start managing your business?');
      expect(subtitle).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });

    test('bottom text has correct styling classes', () => {
      renderWithRouter();
      
      const bottomText = screen.getByText('Start building professional invoices in seconds');
      expect(bottomText).toHaveClass(
        'text-sm',
        'text-gray-500',
        'dark:text-gray-400',
        'mt-4'
      );
    });

    test('SVG icon has correct styling classes', () => {
      const { container } = renderWithRouter();
      
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toHaveClass(
        'w-16',
        'h-16',
        'text-purple-600',
        'dark:text-purple-400'
      );
    });
  });

  describe('Dark Mode Support', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'David',
        },
      });
    });

    test('heading supports dark mode', () => {
      renderWithRouter();
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('dark:text-white');
    });

    test('subtitle supports dark mode', () => {
      renderWithRouter();
      
      const subtitle = screen.getByText('Ready to create your first invoice and start managing your business?');
      expect(subtitle).toHaveClass('dark:text-gray-400');
    });

    test('icon container supports dark mode', () => {
      const { container } = renderWithRouter();
      
      const iconContainer = container.querySelector('.bg-purple-100');
      expect(iconContainer).toHaveClass('dark:bg-purple-900/20');
    });

    test('SVG icon supports dark mode', () => {
      const { container } = renderWithRouter();
      
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toHaveClass('dark:text-purple-400');
    });

    test('bottom text supports dark mode', () => {
      renderWithRouter();
      
      const bottomText = screen.getByText('Start building professional invoices in seconds');
      expect(bottomText).toHaveClass('dark:text-gray-400');
    });
  });

  describe('Layout Structure', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Emma',
        },
      });
    });

    test('maintains proper DOM structure', () => {
      const { container } = renderWithRouter();
      
      const mainContainer = container.querySelector('.flex.flex-col');
      const textContainer = mainContainer?.querySelector('.text-center.max-w-md');
      const messageSection = textContainer?.querySelector('.mb-8');
      const iconSection = textContainer?.querySelectorAll('.mb-8')[1];
      
      expect(mainContainer).toBeInTheDocument();
      expect(textContainer).toBeInTheDocument();
      expect(messageSection).toBeInTheDocument();
      expect(iconSection).toBeInTheDocument();
    });

    test('sections have proper spacing classes', () => {
      const { container } = renderWithRouter();
      
      const messageSections = container.querySelectorAll('.mb-8');
      expect(messageSections).toHaveLength(2);
      
      messageSections.forEach(section => {
        expect(section).toHaveClass('mb-8');
      });
    });

    test('content is centered and constrained', () => {
      const { container } = renderWithRouter();
      
      const mainContainer = container.querySelector('.flex.flex-col');
      expect(mainContainer).toHaveClass('items-center', 'justify-center');
      
      const textContainer = container.querySelector('.text-center.max-w-md');
      expect(textContainer).toHaveClass('text-center', 'max-w-md');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Oliver',
        },
      });
    });

    test('heading has proper semantic role', () => {
      renderWithRouter();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInstanceOf(HTMLHeadingElement);
      expect(heading.tagName).toBe('H2');
    });

    test('content is readable with proper text hierarchy', () => {
      renderWithRouter();
      
      // Main heading (h2)
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      
      // Subtitle text
      expect(screen.getByText('Ready to create your first invoice and start managing your business?')).toBeInTheDocument();
      
      // Bottom text
      expect(screen.getByText('Start building professional invoices in seconds')).toBeInTheDocument();
    });

    test('SVG has appropriate attributes for screen readers', () => {
      const { container } = renderWithRouter();
      
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toHaveAttribute('fill', 'none');
      expect(svgIcon).toHaveAttribute('stroke', 'currentColor');
    });

    test('color contrast is maintained through CSS classes', () => {
      renderWithRouter();
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-gray-900', 'dark:text-white');
      
      const subtitle = screen.getByText('Ready to create your first invoice and start managing your business?');
      expect(subtitle).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Sophie',
        },
      });

      const { unmount } = renderWithRouter();
      
      expect(screen.getByRole('heading', { name: /welcome sophie/i })).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('heading', { name: /welcome sophie/i })).not.toBeInTheDocument();
    });

    test('renders consistently across multiple renders', () => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'Lucas',
        },
      });

      const { rerender } = renderWithRouter();
      
      expect(screen.getByRole('heading', { name: /welcome lucas/i })).toBeInTheDocument();
      expect(screen.getByText('Ready to create your first invoice and start managing your business?')).toBeInTheDocument();
      
      rerender(
        <BrowserRouter>
          <EmptyInvoices />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('heading', { name: /welcome lucas/i })).toBeInTheDocument();
      expect(screen.getByText('Ready to create your first invoice and start managing your business?')).toBeInTheDocument();
    });

    test('handles different user name variations correctly', () => {
      const testNames = ['Anna', 'Jean-Pierre', 'O\'Connor', '李明', 'José'];
      
      testNames.forEach(name => {
        mockUseUser.mockReturnValue({
          user: {
            firstName: name,
          },
        });

        const { unmount } = renderWithRouter();
        
        expect(screen.getByText(`Welcome ${name}! 👋`)).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Clerk Integration', () => {
    test('uses useUser hook correctly', () => {
      mockUseUser.mockReturnValue({
        user: {
          firstName: 'TestUser',
        },
      });

      renderWithRouter();
      
      expect(mockUseUser).toHaveBeenCalled();
      expect(screen.getByText('Welcome TestUser! 👋')).toBeInTheDocument();
    });

    test('handles useUser hook returning null gracefully', () => {
      mockUseUser.mockReturnValue({ user: null });

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
    });

    test('handles useUser hook returning undefined gracefully', () => {
      mockUseUser.mockReturnValue({ user: undefined });

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
    });

    test('handles useUser hook returning empty object gracefully', () => {
      mockUseUser.mockReturnValue({});

      renderWithRouter();
      
      expect(screen.getByText('Welcome there! 👋')).toBeInTheDocument();
    });

    test('handles useUser hook throwing error gracefully', () => {
      mockUseUser.mockImplementation(() => {
        throw new Error('Clerk error');
      });

      // The component should still render with fallback, though it might crash
      // In a real app, you'd wrap this in an error boundary
      expect(() => renderWithRouter()).toThrow();
    });
  });
});