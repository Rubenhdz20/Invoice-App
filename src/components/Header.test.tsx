
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import Header from './Header';

// Mock Clerk's UserButton
vi.mock('@clerk/clerk-react', () => ({
  UserButton: ({ afterSignOutUrl, appearance }: { 
    afterSignOutUrl: string; 
    appearance: { elements: { userButtonAvatarBox: string } } 
  }) => (
    <div 
      data-testid="user-button" 
      data-after-sign-out-url={afterSignOutUrl}
      data-avatar-class={appearance?.elements?.userButtonAvatarBox}
    >
      User Button Mock
    </div>
  ),
}));

// Mock asset imports
vi.mock('../assets/logoapp.svg', () => ({
  default: 'mocked-logo.svg',
}));

vi.mock('../assets/Rectangle.svg', () => ({
  default: 'mocked-separator.svg',
}));

vi.mock('../assets/image-avatar.jpg', () => ({
  default: 'mocked-avatar.jpg',
}));

vi.mock('../assets/icon-moon.svg', () => ({
  default: 'mocked-moon.svg',
}));

vi.mock('../assets/icon-sun.svg', () => ({
  default: 'mocked-sun.svg',
}));

// Sample props for testing
const createDefaultProps = (overrides = {}) => ({
  onToggleTheme: vi.fn(),
  current: 'light' as const,
  ...overrides,
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders header element with correct role', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
    });

    test('renders app logo with correct alt text', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const logo = screen.getByAltText('Invoice App Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toBeInstanceOf(HTMLImageElement);
      expect(logo).toHaveAttribute('src', 'mocked-logo.svg');
    });

    test('renders theme toggle button', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      expect(themeButton).toBeInTheDocument();
      expect(themeButton).toHaveClass('p-2', 'cursor-pointer');
    });

    test('renders bar separator with correct alt text', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const separator = screen.getByAltText('Bar separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toBeInstanceOf(HTMLImageElement);
      expect(separator).toHaveAttribute('src', 'mocked-separator.svg');
    });

    test('renders UserButton component', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const userButton = screen.getByTestId('user-button');
      expect(userButton).toBeInTheDocument();
    });
  });

  describe('Theme Toggle Functionality', () => {
    test('displays moon icon when current theme is light', () => {
      const props = createDefaultProps({ current: 'light' });
      const { container } = render(<Header {...props} />);
      
      const moonIcon = container.querySelector('img[src="mocked-moon.svg"]');
      expect(moonIcon).toBeInTheDocument();
      
      // Sun icon should not be present
      const sunIcon = container.querySelector('img[src="mocked-sun.svg"]');
      expect(sunIcon).not.toBeInTheDocument();
    });

    test('displays sun icon when current theme is dark', () => {
      const props = createDefaultProps({ current: 'dark' });
      const { container } = render(<Header {...props} />);
      
      const sunIcon = container.querySelector('img[src="mocked-sun.svg"]');
      expect(sunIcon).toBeInTheDocument();
      
      // Moon icon should not be present
      const moonIcon = container.querySelector('img[src="mocked-moon.svg"]');
      expect(moonIcon).not.toBeInTheDocument();
    });

    test('calls onToggleTheme when theme button is clicked', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      await user.click(themeButton);
      
      expect(props.onToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('handles multiple clicks on theme toggle button', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      
      await user.click(themeButton);
      await user.click(themeButton);
      await user.click(themeButton);
      
      expect(props.onToggleTheme).toHaveBeenCalledTimes(3);
    });

    test('theme icon changes when current prop changes', () => {
      const props = createDefaultProps({ current: 'light' });
      const { container, rerender } = render(<Header {...props} />);
      
      // Initially should show moon (light theme)
      expect(container.querySelector('img[src="mocked-moon.svg"]')).toBeInTheDocument();
      
      // Change to dark theme
      rerender(<Header {...{ ...props, current: 'dark' }} />);
      
      // Should now show sun (dark theme)
      expect(container.querySelector('img[src="mocked-sun.svg"]')).toBeInTheDocument();
      expect(container.querySelector('img[src="mocked-moon.svg"]')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    test('header has correct base layout classes', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass(
        'flex',
        'justify-between',
        'items-center',
        'bg-strong-blue'
      );
    });

    test('header has correct responsive classes', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass(
        'lg:flex-col',
        'lg:justify-between',
        'lg:items-center',
        'lg:w-20',
        'lg:h-screen'
      );
    });

    test('logo container structure', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const logoContainer = container.querySelector('div');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toContainElement(screen.getByAltText('Invoice App Logo'));
    });

    test('controls container has correct layout classes', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const controlsContainer = container.querySelector('.flex.items-center.gap-4');
      expect(controlsContainer).toHaveClass(
        'flex',
        'items-center',
        'gap-4',
        'mr-5',
        'lg:flex-col',
        'lg:gap-2',
        'lg:mr-0'
      );
    });

    test('separator container has correct responsive classes', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const separatorContainer = container.querySelector('.lg\\:flex.lg\\:flex-row');
      expect(separatorContainer).toHaveClass('lg:flex', 'lg:flex-row', 'lg:items-center');
    });

    test('theme button has correct styling', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      expect(themeButton).toHaveClass('p-2', 'cursor-pointer');
    });
  });

  describe('UserButton Integration', () => {
    test('UserButton receives correct afterSignOutUrl prop', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const userButton = screen.getByTestId('user-button');
      expect(userButton).toHaveAttribute('data-after-sign-out-url', '/sign-in');
    });

    test('UserButton receives correct appearance configuration', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const userButton = screen.getByTestId('user-button');
      expect(userButton).toHaveAttribute('data-avatar-class', 'w-8 h-8');
    });

    test('UserButton is positioned in controls container', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const controlsContainer = container.querySelector('.flex.items-center.gap-4');
      const userButton = screen.getByTestId('user-button');
      
      expect(controlsContainer).toContainElement(userButton);
    });
  });

  describe('Asset Loading', () => {
    test('all images have valid src attributes', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(img => {
        const src = img.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).not.toBe('');
      });
    });

    test('logo loads correctly', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const logo = screen.getByAltText('Invoice App Logo');
      expect(logo).toHaveAttribute('src', 'mocked-logo.svg');
    });

    test('separator loads correctly', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const separator = screen.getByAltText('Bar separator');
      expect(separator).toHaveAttribute('src', 'mocked-separator.svg');
    });

    test('theme icons load correctly', () => {
      const props = createDefaultProps({ current: 'light' });
      const { container, rerender } = render(<Header {...props} />);
      
      // Light theme should show moon
      const moonIcon = container.querySelector('img[src="mocked-moon.svg"]');
      expect(moonIcon).toBeInTheDocument();
      
      // Switch to dark theme
      rerender(<Header {...{ ...props, current: 'dark' }} />);
      
      // Dark theme should show sun
      const sunIcon = container.querySelector('img[src="mocked-sun.svg"]');
      expect(sunIcon).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('header layout changes for large screens', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      
      // Should have responsive classes for large screens
      expect(header).toHaveClass(
        'lg:flex-col',
        'lg:w-20',
        'lg:h-screen'
      );
    });

    test('controls container changes layout for large screens', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const controlsContainer = container.querySelector('.flex.items-center.gap-4');
      expect(controlsContainer).toHaveClass(
        'lg:flex-col',
        'lg:gap-2',
        'lg:mr-0'
      );
    });

    test('maintains mobile-first approach', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      
      // Base classes (mobile-first)
      expect(header).toHaveClass('flex', 'justify-between', 'items-center');
    });
  });

  describe('Keyboard Navigation', () => {
    test('theme toggle button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      themeButton.focus();
      
      expect(themeButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(props.onToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('theme button responds to space key', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      themeButton.focus();
      
      await user.keyboard(' ');
      expect(props.onToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('header elements are in logical tab order', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      
      // Theme button should be focusable
      themeButton.focus();
      expect(themeButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('header has semantic landmark role', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    test('theme button has implicit button role', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      expect(themeButton).toBeInstanceOf(HTMLButtonElement);
    });

    test('images have descriptive alt text', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      expect(screen.getByAltText('Invoice App Logo')).toBeInTheDocument();
      expect(screen.getByAltText('Bar separator')).toBeInTheDocument();
    });

    test('theme icons are accessible but do not have alt text', () => {
      const props = createDefaultProps({ current: 'light' });
      const { container } = render(<Header {...props} />);
      
      // Theme icons are decorative and inside buttons, so they don't need alt text
      const moonIcon = container.querySelector('img[src="mocked-moon.svg"]');
      expect(moonIcon).not.toHaveAttribute('alt');
    });

    test('maintains good semantic structure', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      const button = screen.getByRole('button');
      const images = screen.getAllByRole('img');
      
      expect(header).toContainElement(button);
      images.forEach(img => {
        expect(header).toContainElement(img);
      });
    });
  });

  describe('Props Handling', () => {
    test('handles different theme values correctly', () => {
      const lightProps = createDefaultProps({ current: 'light' });
      const darkProps = createDefaultProps({ current: 'dark' });
      
      // Test light theme
      const { container: lightContainer, unmount: unmountLight } = render(<Header {...lightProps} />);
      expect(lightContainer.querySelector('img[src="mocked-moon.svg"]')).toBeInTheDocument();
      unmountLight();
      
      // Test dark theme
      const { container: darkContainer } = render(<Header {...darkProps} />);
      expect(darkContainer.querySelector('img[src="mocked-sun.svg"]')).toBeInTheDocument();
    });

    test('onToggleTheme callback is called correctly', async () => {
      const user = userEvent.setup();
      const onToggleTheme = vi.fn();
      const props = createDefaultProps({ onToggleTheme });
      
      render(<Header {...props} />);
      
      const themeButton = screen.getByRole('button');
      await user.click(themeButton);
      
      expect(onToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('handles theme prop changes reactively', () => {
      const props = createDefaultProps({ current: 'light' });
      const { container, rerender } = render(<Header {...props} />);
      
      // Initially light theme
      expect(container.querySelector('img[src="mocked-moon.svg"]')).toBeInTheDocument();
      
      // Change to dark theme
      rerender(<Header {...{ ...props, current: 'dark' }} />);
      expect(container.querySelector('img[src="mocked-sun.svg"]')).toBeInTheDocument();
      
      // Change back to light theme
      rerender(<Header {...{ ...props, current: 'light' }} />);
      expect(container.querySelector('img[src="mocked-moon.svg"]')).toBeInTheDocument();
    });

    test('children prop is accepted but not used', () => {
      const props = createDefaultProps({ 
        children: <div data-testid="child">Child Content</div> 
      });
      
      render(<Header {...props} />);
      
      // Children are not rendered as the component doesn't use them
      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const props = createDefaultProps();
      const { unmount } = render(<Header {...props} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByAltText('Invoice App Logo')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });

    test('renders consistently across multiple renders', () => {
      const props = createDefaultProps();
      const { rerender } = render(<Header {...props} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Header {...props} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('maintains functionality across re-renders', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { rerender } = render(<Header {...props} />);
      
      // Test functionality before re-render
      await user.click(screen.getByRole('button'));
      expect(props.onToggleTheme).toHaveBeenCalledTimes(1);
      
      rerender(<Header {...props} />);
      
      // Test functionality after re-render
      await user.click(screen.getByRole('button'));
      expect(props.onToggleTheme).toHaveBeenCalledTimes(2);
    });

    test('handles rapid theme switching', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps({ current: 'light' });
      const { rerender } = render(<Header {...props} />);
      
      // Rapid theme switches
      rerender(<Header {...{ ...props, current: 'dark' }} />);
      rerender(<Header {...{ ...props, current: 'light' }} />);
      rerender(<Header {...{ ...props, current: 'dark' }} />);
      
      // Should still be functional
      await user.click(screen.getByRole('button'));
      expect(props.onToggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration', () => {
    test('all components render together correctly', () => {
      const props = createDefaultProps();
      render(<Header {...props} />);
      
      // Check all main components are present
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByAltText('Invoice App Logo')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByAltText('Bar separator')).toBeInTheDocument();
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });

    test('components are positioned correctly relative to each other', () => {
      const props = createDefaultProps();
      const { container } = render(<Header {...props} />);
      
      const header = screen.getByRole('banner');
      const children = Array.from(header.children);
      
      expect(children).toHaveLength(2);
      
      // First child should contain logo
      expect(children[0]).toContainElement(screen.getByAltText('Invoice App Logo'));
      
      // Second child should contain controls
      expect(children[1]).toContainElement(screen.getByRole('button'));
      expect(children[1]).toContainElement(screen.getByTestId('user-button'));
    });

    test('theme state affects correct elements', () => {
      const props = createDefaultProps({ current: 'dark' });
      const { container } = render(<Header {...props} />);
      
      // Only the theme icon should change based on theme
      expect(container.querySelector('img[src="mocked-sun.svg"]')).toBeInTheDocument();
      
      // Other elements should remain unchanged
      expect(screen.getByAltText('Invoice App Logo')).toHaveAttribute('src', 'mocked-logo.svg');
      expect(screen.getByAltText('Bar separator')).toHaveAttribute('src', 'mocked-separator.svg');
    });
  });

  describe('TypeScript Interface Compliance', () => {
    test('accepts required props correctly', () => {
      const props = {
        onToggleTheme: vi.fn(),
        current: 'light' as const,
      };
      
      expect(() => render(<Header {...props} />)).not.toThrow();
    });

    test('accepts optional children prop', () => {
      const props = {
        onToggleTheme: vi.fn(),
        current: 'dark' as const,
        children: <span>Optional children</span>,
      };
      
      render(<Header {...props} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('theme prop accepts only valid values', () => {
      const lightProps = createDefaultProps({ current: 'light' });
      const darkProps = createDefaultProps({ current: 'dark' });
      
      expect(() => render(<Header {...lightProps} />)).not.toThrow();
      expect(() => render(<Header {...darkProps} />)).not.toThrow();
    });
  });
});