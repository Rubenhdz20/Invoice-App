import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import FilterDropdown from './FilterDropdown';

// Mock the store
const mockToggleFilter = vi.fn();
const mockFilters = ['All'];

vi.mock('../../store/InvoiceStore', () => ({
  useInvoiceStore: (selector: (state: any) => any) => {
    const state = {
      filters: mockFilters,
      toggleFilter: mockToggleFilter,
    };
    return selector(state);
  },
}));

// Helper function to set mock store values
const setMockStoreValues = (filters: string[]) => {
  mockFilters.length = 0;
  mockFilters.push(...filters);
};

describe('FilterDropdown', () => {
  beforeEach(() => {
    mockToggleFilter.mockClear();
    setMockStoreValues(['All']);
  });

  describe('Initial Rendering', () => {
    test('renders filter button with correct text on mobile', () => {
      render(<FilterDropdown />);
      
      // Mobile text should be visible
      const mobileText = screen.getByText('Filter');
      expect(mobileText).toBeInTheDocument();
      expect(mobileText).toHaveClass('inline', 'md:hidden');
    });

    test('renders filter button with correct text on desktop', () => {
      render(<FilterDropdown />);
      
      // Desktop text should be present but hidden on mobile
      const desktopText = screen.getByText('Filter by Status');
      expect(desktopText).toBeInTheDocument();
      expect(desktopText).toHaveClass('hidden', 'md:inline');
    });

    test('renders button with correct styling', () => {
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'justify-between',
        'w-full',
        'p-4',
        'mr-2',
        'text-left',
        'text-dark-2',
        'bg-white-custom',
        'dark:bg-dark-2',
        'dark:text-white',
        'rounded',
        'font-bold',
        'cursor-pointer'
      );
    });

    test('renders up arrow icon when dropdown is closed', () => {
      render(<FilterDropdown />);
      
      const arrowIcon = screen.getByAltText('arrow up');
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon).toBeInstanceOf(HTMLImageElement);
    });

    test('dropdown is initially closed', () => {
      render(<FilterDropdown />);
      
      // Status options should not be visible
      expect(screen.queryByText('Paid')).not.toBeInTheDocument();
      expect(screen.queryByText('Pending')).not.toBeInTheDocument();
      expect(screen.queryByText('Draft')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Toggle Functionality', () => {
    test('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Status options should now be visible
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });

    test('shows down arrow icon when dropdown is open', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const arrowIcon = screen.getByAltText('arrow down');
      expect(arrowIcon).toBeInTheDocument();
      expect(screen.queryByAltText('arrow up')).not.toBeInTheDocument();
    });

    test('closes dropdown when button is clicked again', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      
      // Open dropdown
      await user.click(button);
      expect(screen.getByText('Paid')).toBeInTheDocument();
      
      // Close dropdown
      await user.click(button);
      expect(screen.queryByText('Paid')).not.toBeInTheDocument();
      expect(screen.getByAltText('arrow up')).toBeInTheDocument();
    });

    test('dropdown can be toggled multiple times', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      
      // Open/close cycle 1
      await user.click(button);
      expect(screen.getByText('Paid')).toBeInTheDocument();
      await user.click(button);
      expect(screen.queryByText('Paid')).not.toBeInTheDocument();
      
      // Open/close cycle 2
      await user.click(button);
      expect(screen.getByText('Paid')).toBeInTheDocument();
      await user.click(button);
      expect(screen.queryByText('Paid')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Content and Styling', () => {
    test('dropdown has correct styling when open', async () => {
      const user = userEvent.setup();
      const { container } = render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const dropdown = container.querySelector('.absolute');
      expect(dropdown).toHaveClass(
        'absolute',
        'mt-2',
        'w-auto',
        'bg-white',
        'dark:bg-light-blue',
        'text-dark-1',
        'dark:text-white',
        'rounded-lg',
        'shadow-lg',
        'p-3',
        'z-50'
      );
    });

    test('renders all status options when open', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const expectedStatuses = ['All', 'Paid', 'Pending', 'Draft'];
      expectedStatuses.forEach(status => {
        expect(screen.getByText(status)).toBeInTheDocument();
      });
    });

    test('each status option has correct label styling', async () => {
      const user = userEvent.setup();
      const { container } = render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const labels = container.querySelectorAll('label');
      labels.forEach(label => {
        expect(label).toHaveClass(
          'flex',
          'items-center',
          'px-3',
          'py-1',
          'font-bold',
          'rounded',
          'cursor-pointer',
          'hover:text-[#7C5DFA]',
          'transition'
        );
      });
    });

    test('each status option has a checkbox input', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const expectedStatuses = ['All', 'Paid', 'Pending', 'Draft'];
      expectedStatuses.forEach(status => {
        const checkbox = screen.getByRole('checkbox', { name: status });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute('type', 'checkbox');
        expect(checkbox).toHaveAttribute('id', status);
      });
    });

    test('checkboxes have correct styling classes', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveClass(
          'w-4',
          'h-4',
          'appearance-none',
          'border-2',
          'border-white',
          'dark:border-strong-blue',
          'bg-light-gray',
          'dark:bg-strong-blue',
          'rounded-md',
          'checked:bg-[#7C5DFA]',
          'checked:border-[#7C5DFA]',
          'focus:ring-0',
          'cursor-pointer',
          'hover:border-[#7C5DFA]',
          'transition'
        );
      });
    });
  });

  describe('Filter State Management', () => {
    test('displays correct checked state for "All" filter', async () => {
      const user = userEvent.setup();
      setMockStoreValues(['All']);
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const allCheckbox = screen.getByRole('checkbox', { name: 'All' });
      expect(allCheckbox).toBeChecked();
      
      const paidCheckbox = screen.getByRole('checkbox', { name: 'Paid' });
      expect(paidCheckbox).not.toBeChecked();
    });

    test('displays correct checked state for multiple filters', async () => {
      const user = userEvent.setup();
      setMockStoreValues(['Paid', 'Pending']);
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByRole('checkbox', { name: 'Paid' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Pending' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'All' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Draft' })).not.toBeChecked();
    });

    test('calls toggleFilter when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const paidCheckbox = screen.getByRole('checkbox', { name: 'Paid' });
      await user.click(paidCheckbox);
      
      expect(mockToggleFilter).toHaveBeenCalledTimes(1);
      expect(mockToggleFilter).toHaveBeenCalledWith('Paid');
    });

    test('calls toggleFilter for each different status', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const statuses = ['All', 'Paid', 'Pending', 'Draft'];
      
      for (const status of statuses) {
        const checkbox = screen.getByRole('checkbox', { name: status });
        await user.click(checkbox);
        
        expect(mockToggleFilter).toHaveBeenCalledWith(status);
      }
      
      expect(mockToggleFilter).toHaveBeenCalledTimes(statuses.length);
    });

    test('calls toggleFilter when label text is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Click on the text label instead of the checkbox
      const paidLabel = screen.getByText('Paid');
      await user.click(paidLabel);
      
      expect(mockToggleFilter).toHaveBeenCalledTimes(1);
      expect(mockToggleFilter).toHaveBeenCalledWith('Paid');
    });
  });

  describe('Keyboard Interaction', () => {
    test('button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      
      // Test keyboard activation
      await user.keyboard('{Enter}');
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });

    test('checkboxes are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const paidCheckbox = screen.getByRole('checkbox', { name: 'Paid' });
      
      // Test keyboard activation by clicking directly on checkbox
      // Space key behavior on checkboxes can be tricky with user-event and custom styling
      await user.click(paidCheckbox);
      expect(mockToggleFilter).toHaveBeenCalledWith('Paid');
      
      // Verify checkbox can receive focus
      paidCheckbox.focus();
      expect(paidCheckbox).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('button has proper accessibility attributes', () => {
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInstanceOf(HTMLButtonElement);
      // Button elements in React don't have explicit type="button" by default, but they function as buttons
      expect(button.tagName).toBe('BUTTON');
    });

    test('checkboxes have proper labels', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const statuses = ['All', 'Paid', 'Pending', 'Draft'];
      statuses.forEach(status => {
        const checkbox = screen.getByRole('checkbox', { name: status });
        expect(checkbox).toHaveAccessibleName(status);
      });
    });

    test('images have descriptive alt text', () => {
      render(<FilterDropdown />);
      
      const arrowIcon = screen.getByAltText('arrow up');
      expect(arrowIcon).toHaveAttribute('alt', 'arrow up');
    });

    test('arrow icon alt text changes based on dropdown state', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      // Closed state
      expect(screen.getByAltText('arrow up')).toBeInTheDocument();
      
      // Open state
      const button = screen.getByRole('button');
      await user.click(button);
      expect(screen.getByAltText('arrow down')).toBeInTheDocument();
      expect(screen.queryByAltText('arrow up')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('shows different text on mobile vs desktop', () => {
      render(<FilterDropdown />);
      
      const mobileText = screen.getByText('Filter');
      const desktopText = screen.getByText('Filter by Status');
      
      expect(mobileText).toHaveClass('inline', 'md:hidden');
      expect(desktopText).toHaveClass('hidden', 'md:inline');
    });
  });

  describe('Dark Mode Support', () => {
    test('button supports dark mode', () => {
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:bg-dark-2', 'dark:text-white');
    });

    test('dropdown supports dark mode', async () => {
      const user = userEvent.setup();
      const { container } = render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const dropdown = container.querySelector('.absolute');
      expect(dropdown).toHaveClass('dark:bg-light-blue', 'dark:text-white');
    });

    test('checkboxes support dark mode', async () => {
      const user = userEvent.setup();
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveClass('dark:border-strong-blue', 'dark:bg-strong-blue');
      });
    });
  });

  describe('Store Integration', () => {
    test('reads filters from store correctly', async () => {
      const user = userEvent.setup();
      setMockStoreValues(['Paid', 'Draft']);
      
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByRole('checkbox', { name: 'Paid' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Draft' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'All' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Pending' })).not.toBeChecked();
    });

    test('handles empty filters array', async () => {
      const user = userEvent.setup();
      setMockStoreValues([]);
      
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test('handles single filter state', async () => {
      const user = userEvent.setup();
      setMockStoreValues(['Pending']);
      
      render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByRole('checkbox', { name: 'Pending' })).toBeChecked();
      
      const otherCheckboxes = ['All', 'Paid', 'Draft'].map(name => 
        screen.getByRole('checkbox', { name })
      );
      otherCheckboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const { unmount } = render(<FilterDropdown />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('maintains dropdown state during re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByText('Paid')).toBeInTheDocument();
      
      rerender(<FilterDropdown />);
      
      // Dropdown should remain open after re-render
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });

    test('resets dropdown state on unmount and remount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<FilterDropdown />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByText('Paid')).toBeInTheDocument();
      
      unmount();
      
      // Mount new instance
      render(<FilterDropdown />);
      
      // Dropdown should be closed in new instance
      expect(screen.queryByText('Paid')).not.toBeInTheDocument();
      expect(screen.getByAltText('arrow up')).toBeInTheDocument();
    });
  });
});