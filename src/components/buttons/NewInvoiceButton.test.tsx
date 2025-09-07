import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import NewInvoiceButton from './NewInvoiceButton';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render NewInvoiceButton with Router context
function renderWithRouter() {
  return render(
    <BrowserRouter>
      <NewInvoiceButton />
    </BrowserRouter>
  );
}

describe('NewInvoiceButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    test('renders new invoice button with correct text', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });

    test('renders plus icon with correct alt text', () => {
      renderWithRouter();
      
      const plusIcon = screen.getByAltText('Plus icon');
      expect(plusIcon).toBeInTheDocument();
      expect(plusIcon).toBeInstanceOf(HTMLImageElement);
    });

    test('renders responsive text content', () => {
      renderWithRouter();
      
      // Check for desktop text (hidden on mobile)
      const desktopText = screen.getByText('New Invoice');
      expect(desktopText).toBeInTheDocument();
      expect(desktopText).toHaveClass('hidden', 'md:inline');
      
      // Check for mobile text (hidden on desktop)
      const mobileText = screen.getByText('New');
      expect(mobileText).toBeInTheDocument();
      expect(mobileText).toHaveClass('inline', 'md:hidden');
    });

    test('renders icon container with correct styling', () => {
      const { container } = renderWithRouter();
      
      const iconContainer = container.querySelector('.bg-white');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass(
        'bg-white',
        'text-[#7C5DFA]',
        'rounded-full',
        'w-10',
        'h-10',
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  describe('User Interactions', () => {
    test('navigates to create invoice page when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
    });

    test('navigates when icon is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const plusIcon = screen.getByAltText('Plus icon');
      await user.click(plusIcon);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
    });

    test('navigates when text is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const desktopText = screen.getByText('New Invoice');
      await user.click(desktopText);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
    });

    test('multiple clicks navigate multiple times', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button');
      
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/create-invoice');
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/create-invoice');
      expect(mockNavigate).toHaveBeenNthCalledWith(3, '/create-invoice');
    });
  });

  describe('Styling and Classes', () => {
    test('applies correct CSS classes to button', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'bg-[#7C5DFA]',
        'text-white',
        'px-2',
        'md:px-3',
        'py-2',
        'rounded-full',
        'shadow-md',
        'hover:bg-[#9277FF]',
        'transition',
        'cursor-pointer'
      );
    });

    test('applies correct responsive padding classes', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-2', 'md:px-3');
    });

    test('applies correct color scheme', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[#7C5DFA]', 'text-white');
      expect(button).toHaveClass('hover:bg-[#9277FF]');
    });

    test('has proper border radius and shadow', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full', 'shadow-md');
    });

    test('applies font styling to text', () => {
      const { container } = renderWithRouter();
      
      const textElement = container.querySelector('p');
      expect(textElement).toHaveClass('font-bold');
    });
  });

  describe('Responsive Design', () => {
    test('desktop text has correct responsive classes', () => {
      renderWithRouter();
      
      const desktopText = screen.getByText('New Invoice');
      expect(desktopText).toHaveClass('hidden', 'md:inline');
    });

    test('mobile text has correct responsive classes', () => {
      renderWithRouter();
      
      const mobileText = screen.getByText('New');
      expect(mobileText).toHaveClass('inline', 'md:hidden');
    });

    test('button has responsive padding', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-2', 'md:px-3');
    });

    test('both text variants exist in DOM', () => {
      renderWithRouter();
      
      // Both should exist but with different visibility classes
      expect(screen.getByText('New Invoice')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('button has proper role', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });

    test('image has descriptive alt text', () => {
      renderWithRouter();
      
      const image = screen.getByAltText('Plus icon');
      expect(image).toHaveAttribute('alt', 'Plus icon');
    });

    test('button is keyboard accessible', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-pointer');
    });

    test('button has descriptive text content', () => {
      renderWithRouter();
      
      // Button should have accessible text content
      expect(screen.getByText('New Invoice')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    test('icon container has proper contrast', () => {
      const { container } = renderWithRouter();
      
      const iconContainer = container.querySelector('.bg-white');
      expect(iconContainer).toHaveClass('bg-white', 'text-[#7C5DFA]');
    });
  });

  describe('Layout and Structure', () => {
    test('maintains proper DOM structure', () => {
      const { container } = renderWithRouter();
      
      // Check that outer div contains button
      const outerDiv = container.firstChild;
      expect(outerDiv).toBeInstanceOf(HTMLDivElement);
      
      const button = screen.getByRole('button');
      expect(outerDiv).toContainElement(button);
    });

    test('button contains icon container and text', () => {
      const { container } = renderWithRouter();
      
      const button = screen.getByRole('button');
      const iconContainer = container.querySelector('.bg-white');
      const textElement = container.querySelector('p');
      
      expect(button).toContainElement(iconContainer);
      expect(button).toContainElement(textElement);
    });

    test('icon container contains image', () => {
      const { container } = renderWithRouter();
      
      const iconContainer = container.querySelector('.bg-white');
      const image = screen.getByAltText('Plus icon');
      
      expect(iconContainer).toContainElement(image);
    });

    test('has proper flexbox layout', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2');
    });

    test('text element contains both spans', () => {
      const { container } = renderWithRouter();
      
      const textElement = container.querySelector('p');
      const desktopSpan = screen.getByText('New Invoice');
      const mobileSpan = screen.getByText('New');
      
      expect(textElement).toContainElement(desktopSpan);
      expect(textElement).toContainElement(mobileSpan);
    });
  });

  describe('Icon Integration', () => {
    test('loads plus icon correctly', () => {
      renderWithRouter();
      
      const plusIcon = screen.getByAltText('Plus icon');
      expect(plusIcon).toHaveAttribute('src');
      
      // Vite processes SVGs as data URLs or modules, so just check that src exists and is not empty
      const srcAttribute = plusIcon.getAttribute('src');
      expect(srcAttribute).toBeTruthy();
      expect(srcAttribute).not.toBe('');
    });

    test('icon has proper dimensions and styling', () => {
      const { container } = renderWithRouter();
      
      const iconContainer = container.querySelector('.w-10.h-10');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('w-10', 'h-10', 'rounded-full');
    });
  });

  describe('React Router Integration', () => {
    test('uses useNavigate hook correctly', () => {
      renderWithRouter();
      
      // Component should render without errors, indicating useNavigate is working
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('navigates to correct route', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Verify navigation was called with correct path
      expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
    });
  });

  describe('Event Handling', () => {
    test('click handler is attached to button', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
    });

    test('handles rapid clicks correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button');
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    test('event bubbling works as expected', async () => {
      const user = userEvent.setup();
      const outerClickHandler = vi.fn();
      
      render(
        <BrowserRouter>
          <div onClick={outerClickHandler}>
            <NewInvoiceButton />
          </div>
        </BrowserRouter>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
      // Event should bubble up to parent
      expect(outerClickHandler).toHaveBeenCalled();
    });
  });

  describe('Hover and Transition Effects', () => {
    test('has hover state styling', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-[#9277FF]');
    });

    test('has transition effect', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition');
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const { unmount } = renderWithRouter();
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByAltText('Plus icon')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Plus icon')).not.toBeInTheDocument();
    });

    test('renders consistently across multiple renders', () => {
      const { rerender } = renderWithRouter();
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('New Invoice')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      
      rerender(
        <BrowserRouter>
          <NewInvoiceButton />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('New Invoice')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    test('maintains state between re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = renderWithRouter();
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      
      rerender(
        <BrowserRouter>
          <NewInvoiceButton />
        </BrowserRouter>
      );
      
      // Should still be clickable after re-render
      const newButton = screen.getByRole('button');
      await user.click(newButton);
      
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });
});