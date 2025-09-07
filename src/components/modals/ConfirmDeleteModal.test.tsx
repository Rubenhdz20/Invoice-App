import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// Sample props for testing
const createDefaultProps = (overrides = {}) => ({
  invoiceId: 'RT3080',
  isOpen: true,
  onCancel: vi.fn(),
  onConfirm: vi.fn(),
  ...overrides,
});

describe('ConfirmDeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    test('renders modal when isOpen is true', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });

    test('does not render modal when isOpen is false', () => {
      const props = createDefaultProps({ isOpen: false });
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });

    test('returns null when modal is closed', () => {
      const props = createDefaultProps({ isOpen: false });
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      expect(container.firstChild).toBeNull();
    });

    test('modal appears and disappears based on isOpen prop changes', () => {
      const props = createDefaultProps({ isOpen: false });
      const { rerender } = render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
      
      rerender(<ConfirmDeleteModal {...{ ...props, isOpen: true }} />);
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      
      rerender(<ConfirmDeleteModal {...{ ...props, isOpen: false }} />);
      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    test('renders modal heading correctly', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Confirm Deletion');
      expect(heading.tagName).toBe('H2');
    });

    test('renders confirmation message with invoice ID', () => {
      const props = createDefaultProps({ invoiceId: 'XM9141' });
      render(<ConfirmDeleteModal {...props} />);
      
      const message = screen.getByText(/Are you sure you want to delete invoice/);
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Are you sure you want to delete invoice $XM9141? This action cannot be undone.');
    });

    test('displays different invoice IDs correctly', () => {
      const testCases = ['RT3080', 'FV2353', 'XM9141', 'TY9141'];
      
      testCases.forEach(invoiceId => {
        const props = createDefaultProps({ invoiceId });
        const { unmount } = render(<ConfirmDeleteModal {...props} />);
        
        expect(screen.getByText(new RegExp(`invoice \\$${invoiceId}`))).toBeInTheDocument();
        
        unmount();
      });
    });

    test('renders cancel button with correct text', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent('Cancel');
    });

    test('renders delete button with correct text', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent('Delete');
    });

    test('renders both action buttons', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('Modal Structure and Layout', () => {
    test('has correct modal overlay structure', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass(
        'fixed',
        'flex',
        'items-center',
        'justify-center',
        'inset-0',
        'bg-black/50',
        'z-50'
      );
    });

    test('has correct modal content structure', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const modalContent = container.querySelector('.w-11\\/12');
      expect(modalContent).toHaveClass(
        'w-11/12',
        'max-w-md',
        'h-56',
        'flex',
        'flex-col',
        'p-6',
        'bg-white',
        'dark:bg-strong-blue',
        'rounded-lg'
      );
    });

    test('maintains proper DOM hierarchy', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      const modalContent = overlay.firstChild as HTMLElement;
      
      expect(modalContent).toContainElement(screen.getByRole('heading'));
      expect(modalContent).toContainElement(screen.getByText(/Are you sure/));
      expect(modalContent).toContainElement(screen.getByRole('button', { name: /cancel/i }));
      expect(modalContent).toContainElement(screen.getByRole('button', { name: /delete/i }));
    });

    test('action buttons are in correct container', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const buttonContainer = container.querySelector('.flex.justify-end');
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('flex', 'justify-end', 'mt-6', 'space-x-4');
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(buttonContainer).toContainElement(button);
      });
    });
  });

  describe('Styling and CSS Classes', () => {
    test('heading has correct styling', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass(
        'dark:text-white',
        'text-2xl',
        'font-bold'
      );
    });

    test('confirmation message has correct styling', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const message = screen.getByText(/Are you sure/);
      expect(message).toHaveClass(
        'mt-2',
        'mb-6',
        'text-strong-gray',
        'dark:text-light-gray'
      );
    });

    test('cancel button has correct styling', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveClass(
        'px-4',
        'py-2',
        'rounded-3xl',
        'bg-cancel-gray',
        'dark:bg-light-blue',
        'dark:hover:bg-[#3B3F5A]',
        'text-purple',
        'dark:text-white',
        'cursor-pointer'
      );
    });

    test('delete button has correct styling', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveClass(
        'px-5',
        'py-2',
        'bg-orange',
        'hover:bg-salmon',
        'text-white',
        'rounded-3xl',
        'cursor-pointer'
      );
    });

    test('modal has correct z-index for proper layering', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass('z-50');
    });

    test('overlay has semi-transparent background', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass('bg-black/50');
    });
  });

  describe('Dark Mode Support', () => {
    test('modal content supports dark mode', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const modalContent = container.querySelector('.bg-white');
      expect(modalContent).toHaveClass('dark:bg-strong-blue');
    });

    test('heading supports dark mode', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('dark:text-white');
    });

    test('message supports dark mode', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const message = screen.getByText(/Are you sure/);
      expect(message).toHaveClass('dark:text-light-gray');
    });

    test('cancel button supports dark mode', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveClass('dark:bg-light-blue', 'dark:hover:bg-[#3B3F5A]', 'dark:text-white');
    });

    test('maintains light mode classes', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const modalContent = container.querySelector('.bg-white');
      const message = screen.getByText(/Are you sure/);
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      expect(modalContent).toHaveClass('bg-white');
      expect(message).toHaveClass('text-strong-gray');
      expect(cancelButton).toHaveClass('bg-cancel-gray', 'text-purple');
    });
  });

  describe('User Interactions', () => {
    test('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(props.onCancel).toHaveBeenCalledTimes(1);
      expect(props.onConfirm).not.toHaveBeenCalled();
    });

    test('calls onConfirm when delete button is clicked', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      expect(props.onConfirm).toHaveBeenCalledTimes(1);
      expect(props.onCancel).not.toHaveBeenCalled();
    });

    test('handles multiple clicks on cancel button', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      await user.click(cancelButton);
      await user.click(cancelButton);
      await user.click(cancelButton);
      
      expect(props.onCancel).toHaveBeenCalledTimes(3);
    });

    test('handles multiple clicks on delete button', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      await user.click(deleteButton);
      await user.click(deleteButton);
      
      expect(props.onConfirm).toHaveBeenCalledTimes(2);
    });

    test('handles rapid alternating clicks between buttons', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      await user.click(cancelButton);
      await user.click(deleteButton);
      await user.click(cancelButton);
      
      expect(props.onCancel).toHaveBeenCalledTimes(2);
      expect(props.onConfirm).toHaveBeenCalledTimes(1);
    });

    test('uses fireEvent for direct event testing', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      fireEvent.click(cancelButton);
      expect(props.onCancel).toHaveBeenCalledTimes(1);
      
      fireEvent.click(deleteButton);
      expect(props.onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Interactions', () => {
    test('cancel button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.focus();
      
      expect(cancelButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(props.onCancel).toHaveBeenCalledTimes(1);
    });

    test('delete button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.focus();
      
      expect(deleteButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(props.onConfirm).toHaveBeenCalledTimes(1);
    });

    test('supports tab navigation between buttons', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      cancelButton.focus();
      expect(cancelButton).toHaveFocus();
      
      await user.keyboard('{Tab}');
      expect(deleteButton).toHaveFocus();
    });

    test('space key activates focused button', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.focus();
      
      await user.keyboard(' ');
      expect(props.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('heading has proper semantic level', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    test('buttons have proper roles and text', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    test('modal has descriptive content for screen readers', () => {
      const props = createDefaultProps({ invoiceId: 'TEST123' });
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete invoice \$TEST123/)).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    });

    test('buttons are properly labeled for screen readers', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      
      // Button elements have implicit type="button" in React, so we test they are buttons
      expect(cancelButton.tagName).toBe('BUTTON');
      expect(deleteButton.tagName).toBe('BUTTON');
    });

    test('has good color contrast for text elements', () => {
      const props = createDefaultProps();
      render(<ConfirmDeleteModal {...props} />);
      
      const heading = screen.getByRole('heading');
      const message = screen.getByText(/Are you sure/);
      
      // Light mode contrast
      expect(message).toHaveClass('text-strong-gray');
      
      // Dark mode contrast
      expect(heading).toHaveClass('dark:text-white');
      expect(message).toHaveClass('dark:text-light-gray');
    });
  });

  describe('Props Handling', () => {
    test('displays different invoice IDs correctly', () => {
      const testIds = ['RT3080', 'XM9141', 'FV2353', 'TY9141', 'ABC123'];
      
      testIds.forEach(invoiceId => {
        const props = createDefaultProps({ invoiceId });
        const { unmount } = render(<ConfirmDeleteModal {...props} />);
        
        expect(screen.getByText(new RegExp(`invoice \\$${invoiceId}`))).toBeInTheDocument();
        
        unmount();
      });
    });

    test('handles special characters in invoice ID', () => {
      const props = createDefaultProps({ invoiceId: 'INV-123_TEST' });
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText(/invoice \$INV-123_TEST/)).toBeInTheDocument();
    });

    test('handles empty invoice ID', () => {
      const props = createDefaultProps({ invoiceId: '' });
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText(/invoice \$/)).toBeInTheDocument();
    });

    test('callback functions are called correctly', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      const onConfirm = vi.fn();
      const props = createDefaultProps({ onCancel, onConfirm });
      
      render(<ConfirmDeleteModal {...props} />);
      
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const props = createDefaultProps();
      const { unmount } = render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });

    test('renders consistently across multiple renders', () => {
      const props = createDefaultProps();
      const { rerender } = render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      
      rerender(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    test('maintains state between re-renders', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { rerender } = render(<ConfirmDeleteModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(props.onCancel).toHaveBeenCalledTimes(1);
      
      rerender(<ConfirmDeleteModal {...props} />);
      
      // Should still be clickable after re-render
      const newCancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(newCancelButton);
      
      expect(props.onCancel).toHaveBeenCalledTimes(2);
    });

    test('updates content when props change', () => {
      const props = createDefaultProps({ invoiceId: 'OLD123' });
      const { rerender } = render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText(/invoice \$OLD123/)).toBeInTheDocument();
      
      rerender(<ConfirmDeleteModal {...{ ...props, invoiceId: 'NEW456' }} />);
      
      expect(screen.getByText(/invoice \$NEW456/)).toBeInTheDocument();
      expect(screen.queryByText(/invoice \$OLD123/)).not.toBeInTheDocument();
    });
  });

  describe('Modal Overlay Behavior', () => {
    test('overlay covers full screen', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass('fixed', 'inset-0');
    });

    test('modal content is centered in overlay', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
    });

    test('modal content has appropriate sizing constraints', () => {
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const modalContent = container.querySelector('.w-11\\/12');
      expect(modalContent).toHaveClass('w-11/12', 'max-w-md', 'h-56');
    });

    test('clicking overlay does not trigger callbacks', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<ConfirmDeleteModal {...props} />);
      
      const overlay = container.firstChild as HTMLElement;
      await user.click(overlay);
      
      // Should not call either callback when clicking overlay
      expect(props.onCancel).not.toHaveBeenCalled();
      expect(props.onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles undefined callback props gracefully', () => {
      const props = {
        invoiceId: 'TEST123',
        isOpen: true,
        onCancel: undefined as unknown as () => void,
        onConfirm: undefined as unknown as () => void,
      };
      
      expect(() => render(<ConfirmDeleteModal {...props} />)).not.toThrow();
    });

    test('handles very long invoice IDs', () => {
      const longInvoiceId = 'VERY_LONG_INVOICE_ID_THAT_MIGHT_BREAK_LAYOUT_123456789';
      const props = createDefaultProps({ invoiceId: longInvoiceId });
      
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText(new RegExp(`invoice \\$${longInvoiceId}`))).toBeInTheDocument();
    });

    test('handles rapid show/hide operations', () => {
      const props = createDefaultProps({ isOpen: false });
      const { rerender } = render(<ConfirmDeleteModal {...props} />);
      
      // Rapid show/hide
      for (let i = 0; i < 5; i++) {
        rerender(<ConfirmDeleteModal {...{ ...props, isOpen: true }} />);
        expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
        
        rerender(<ConfirmDeleteModal {...{ ...props, isOpen: false }} />);
        expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
      }
    });
  });
});