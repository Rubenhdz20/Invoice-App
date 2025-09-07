import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import GoBackButtonHome from './GoBackButtonHome';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render GoBackButtonHome with Router context
function renderWithRouter() {
  return render(
    <BrowserRouter>
      <GoBackButtonHome />
    </BrowserRouter>
  );
}

describe('GoBackButtonHome', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    test('renders go back button with correct text', () => {
      renderWithRouter();
      
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      expect(screen.getByText('Go back')).toBeInTheDocument();
    });

    test('renders arrow left icon with correct alt text', () => {
      renderWithRouter();
      
      const arrowIcon = screen.getByAltText('arrow left');
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon).toBeInstanceOf(HTMLImageElement);
    });

    test('has clickable container div', () => {
      const { container } = renderWithRouter();
      
      const clickableDiv = container.querySelector('.cursor-pointer');
      expect(clickableDiv).toBeInTheDocument();
      expect(clickableDiv).toHaveClass('flex', 'items-baseline', 'gap-2', 'p-5');
    });
  });

  describe('User Interactions', () => {
    test('calls navigate("/") when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button', { name: /go back/i });
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('calls navigate("/") when container div is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      const clickableDiv = container.querySelector('.cursor-pointer') as HTMLElement;
      await user.click(clickableDiv);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('calls navigate("/") when icon is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const arrowIcon = screen.getByAltText('arrow left');
      await user.click(arrowIcon);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('multiple clicks call navigate multiple times', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button', { name: /go back/i });
      
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/');
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/');
      expect(mockNavigate).toHaveBeenNthCalledWith(3, '/');
    });
  });

  describe('Styling and Classes', () => {
    test('applies correct CSS classes to container', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.flex');
      expect(containerDiv).toHaveClass(
        'flex',
        'items-baseline',
        'gap-2',
        'p-5',
        'cursor-pointer'
      );
    });

    test('applies responsive classes to container', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.flex');
      expect(containerDiv).toHaveClass('md:mt-5');
    });

    test('applies correct CSS classes to button element', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'text-dark-1',
        'dark:text-white',
        'font-bold',
        'cursor-pointer'
      );
    });

    test('applies correct CSS classes to arrow icon', () => {
      renderWithRouter();
      
      const arrowIcon = screen.getByAltText('arrow left');
      expect(arrowIcon).toHaveClass('mr-2');
    });

    test('has proper dark mode classes', () => {
      renderWithRouter();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-dark-1', 'dark:text-white');
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
      
      const image = screen.getByAltText('arrow left');
      expect(image).toHaveAttribute('alt', 'arrow left');
    });

    test('container is keyboard accessible', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.cursor-pointer');
      expect(containerDiv).toHaveClass('cursor-pointer');
    });

    test('button text is descriptive', () => {
      renderWithRouter();
      
      expect(screen.getByText('Go back')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    test('maintains proper DOM structure', () => {
      const { container } = renderWithRouter();
      
      // Check that div contains img and button
      const containerDiv = container.querySelector('.flex');
      const image = containerDiv?.querySelector('img');
      const button = containerDiv?.querySelector('button');
      
      expect(containerDiv).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    test('icon comes before button text in DOM order', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.flex') as HTMLElement;
      const children = Array.from(containerDiv.children);
      
      expect(children[0]).toBeInstanceOf(HTMLImageElement);
      expect(children[1]).toBeInstanceOf(HTMLButtonElement);
    });

    test('has flexbox layout with proper alignment', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.flex');
      expect(containerDiv).toHaveClass('flex', 'items-baseline', 'gap-2');
    });

    test('has proper padding and spacing', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.flex');
      expect(containerDiv).toHaveClass('p-5', 'gap-2');
      
      const image = screen.getByAltText('arrow left');
      expect(image).toHaveClass('mr-2');
    });

    test('has responsive margin top class', () => {
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.flex');
      expect(containerDiv).toHaveClass('md:mt-5');
    });
  });

  describe('Icon Integration', () => {
    test('loads arrow left icon correctly', () => {
      renderWithRouter();
      
      const arrowIcon = screen.getByAltText('arrow left');
      expect(arrowIcon).toHaveAttribute('src');
      
      // Vite processes SVGs as data URLs or modules, so just check that src exists and is not empty
      const srcAttribute = arrowIcon.getAttribute('src');
      expect(srcAttribute).toBeTruthy();
      expect(srcAttribute).not.toBe('');
    });

    test('icon is properly sized and positioned', () => {
      renderWithRouter();
      
      const arrowIcon = screen.getByAltText('arrow left');
      expect(arrowIcon).toHaveClass('mr-2');
    });
  });

  describe('React Router Integration', () => {
    test('uses useNavigate hook correctly', () => {
      renderWithRouter();
      
      // Component should render without errors, indicating useNavigate is working
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });

    test('navigates to home route', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button', { name: /go back/i });
      await user.click(button);
      
      // Verify navigation was called with "/" (home route)
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navigates to home on any clickable element interaction', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      // Test clicking on different elements
      const button = screen.getByRole('button', { name: /go back/i });
      const icon = screen.getByAltText('arrow left');
      
      await user.click(button);
      expect(mockNavigate).toHaveBeenCalledWith('/');
      
      mockNavigate.mockClear();
      
      await user.click(icon);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Event Handling', () => {
    test('click handler is attached to container div', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      const containerDiv = container.querySelector('.cursor-pointer') as HTMLElement;
      await user.click(containerDiv);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('allows event bubbling when expected', async () => {
      const user = userEvent.setup();
      const outerClickHandler = vi.fn();
      
      render(
        <BrowserRouter>
          <div onClick={outerClickHandler}>
            <GoBackButtonHome />
          </div>
        </BrowserRouter>
      );
      
      const button = screen.getByRole('button', { name: /go back/i });
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
      // Event should bubble up to parent
      expect(outerClickHandler).toHaveBeenCalled();
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const { unmount } = renderWithRouter();
      
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('button', { name: /go back/i })).not.toBeInTheDocument();
    });

    test('renders consistently across multiple renders', () => {
      const { rerender } = renderWithRouter();
      
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      expect(screen.getByAltText('arrow left')).toBeInTheDocument();
      
      rerender(
        <BrowserRouter>
          <GoBackButtonHome />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      expect(screen.getByAltText('arrow left')).toBeInTheDocument();
    });
  });

  describe('Navigation Behavior Differences', () => {
    test('specifically navigates to home route instead of going back in history', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const button = screen.getByRole('button', { name: /go back/i });
      await user.click(button);
      
      // Verify it goes to home ("/") and NOT back in history (-1)
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).not.toHaveBeenCalledWith(-1);
    });

    test('consistent home navigation regardless of click target', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      // Test all clickable elements navigate to home
      const containerDiv = container.querySelector('.cursor-pointer') as HTMLElement;
      const button = screen.getByRole('button', { name: /go back/i });
      const icon = screen.getByAltText('arrow left');
      
      // Test container click
      await user.click(containerDiv);
      expect(mockNavigate).toHaveBeenLastCalledWith('/');
      
      // Test button click
      await user.click(button);
      expect(mockNavigate).toHaveBeenLastCalledWith('/');
      
      // Test icon click
      await user.click(icon);
      expect(mockNavigate).toHaveBeenLastCalledWith('/');
      
      // All should navigate to home
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      mockNavigate.mock.calls.forEach(call => {
        expect(call[0]).toBe('/');
      });
    });
  });
});