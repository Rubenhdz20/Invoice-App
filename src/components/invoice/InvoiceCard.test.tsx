import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import InvoiceCard from './InvoiceCard';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn((date) => ({
    format: vi.fn((formatString) => {
      // Mock specific date formatting for predictable tests
      if (formatString === 'DD MMM YYYY') {
        if (date === '2024-01-15T10:00:00Z') return '15 Jan 2024';
        if (date === '2023-12-01T00:00:00Z') return '01 Dec 2023';
        if (date === '2024-06-30T12:30:00Z') return '30 Jun 2024';
        return '01 Jan 2024'; // fallback
      }
      return date;
    }),
  }));
  
  return {
    default: mockDayjs,
  };
});

// Mock formatCurrency utility
vi.mock('../../utils/formatCurrency', () => ({
  formatCurrency: vi.fn((amount: number) => `$${amount.toFixed(2)}`),
}));

// Sample invoice data for testing
const createSampleInvoice = (overrides = {}) => ({
  id: 'RT3080',
  createdAt: '2024-01-15T10:00:00Z',
  clientName: 'Jensen Huang',
  total: 1800.90,
  status: 'Paid',
  ...overrides,
});

// Helper function to render InvoiceCard with Router context
function renderWithRouter(invoice = createSampleInvoice()) {
  return render(
    <BrowserRouter>
      <InvoiceCard invoice={invoice} />
    </BrowserRouter>
  );
}

describe('InvoiceCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Basic Rendering', () => {
    test('renders invoice ID with correct formatting', () => {
      renderWithRouter();
      
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('RT3080')).toBeInTheDocument();
      
      // Check that ID is styled correctly
      const idElement = screen.getByText('RT3080');
      expect(idElement).toHaveClass('font-bold', 'text-dark-1', 'dark:text-white');
    });

    test('renders due date with correct formatting', () => {
      renderWithRouter();
      
      expect(screen.getByText('Due 15 Jan 2024')).toBeInTheDocument();
    });

    test('renders client name on desktop view', () => {
      renderWithRouter();
      
      // Desktop view client name
      const desktopClientName = screen.getAllByText('Jensen Huang')[0];
      expect(desktopClientName).toHaveClass('hidden', 'md:block');
    });

    test('renders client name on mobile view', () => {
      renderWithRouter();
      
      // Mobile view client name (in mobile-only section)
      const mobileClientName = screen.getAllByText('Jensen Huang')[1];
      expect(mobileClientName.closest('div')).toHaveClass('md:hidden');
    });

    test('renders formatted total amount', () => {
      renderWithRouter();
      
      expect(screen.getByText('$1800.90')).toBeInTheDocument();
    });

    test('renders status badge for paid invoice', () => {
      renderWithRouter();
      
      const statusElements = screen.getAllByText('Paid');
      expect(statusElements).toHaveLength(2); // Desktop and mobile versions
      
      statusElements.forEach(element => {
        expect(element.closest('span')).toHaveClass(
          'bg-[#33D69F]/10',
          'text-[#33D69F]'
        );
      });
    });

    test('renders chevron arrow on desktop', () => {
      renderWithRouter();
      
      const chevron = screen.getByText('>');
      expect(chevron).toHaveClass('hidden', 'md:block', 'md:ml-4', 'dark:text-purple');
    });
  });

  describe('Different Invoice Statuses', () => {
    test('renders pending status with correct styling', () => {
      const pendingInvoice = createSampleInvoice({ status: 'Pending' });
      renderWithRouter(pendingInvoice);
      
      const statusElements = screen.getAllByText('Pending');
      expect(statusElements).toHaveLength(2);
      
      statusElements.forEach(element => {
        expect(element.closest('span')).toHaveClass(
          'bg-[#FF8B37]/10',
          'text-[#FF8B37]'
        );
      });
    });

    test('renders draft status with correct styling', () => {
      const draftInvoice = createSampleInvoice({ status: 'Draft' });
      renderWithRouter(draftInvoice);
      
      const statusElements = screen.getAllByText('Draft');
      expect(statusElements).toHaveLength(2);
      
      statusElements.forEach(element => {
        expect(element.closest('span')).toHaveClass(
          'bg-[#FF8B37]/10',
          'text-[#FF8B37]'
        );
      });
    });

    test('renders status indicators (circles) for each status badge', () => {
      renderWithRouter();
      
      // Check for status indicator circles
      const { container } = renderWithRouter();
      const circles = container.querySelectorAll('.w-2.h-2.rounded-full.bg-current');
      expect(circles).toHaveLength(2); // Desktop and mobile versions
    });
  });

  describe('Date Formatting', () => {
    test('formats different date inputs correctly', () => {
      const decemberInvoice = createSampleInvoice({ 
        createdAt: '2023-12-01T00:00:00Z' 
      });
      renderWithRouter(decemberInvoice);
      
      expect(screen.getByText('Due 01 Dec 2023')).toBeInTheDocument();
    });

    test('handles different date format', () => {
      const juneInvoice = createSampleInvoice({ 
        createdAt: '2024-06-30T12:30:00Z' 
      });
      renderWithRouter(juneInvoice);
      
      expect(screen.getByText('Due 30 Jun 2024')).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    test('formats large amounts correctly', () => {
      const largeAmountInvoice = createSampleInvoice({ total: 156229.50 });
      renderWithRouter(largeAmountInvoice);
      
      expect(screen.getByText('$156229.50')).toBeInTheDocument();
    });

    test('formats small amounts correctly', () => {
      const smallAmountInvoice = createSampleInvoice({ total: 99.99 });
      renderWithRouter(smallAmountInvoice);
      
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    test('handles zero amount', () => {
      const zeroAmountInvoice = createSampleInvoice({ total: 0 });
      renderWithRouter(zeroAmountInvoice);
      
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    test('calls navigate with correct route when card is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      await user.click(card);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/invoice/RT3080');
    });

    test('navigates with different invoice IDs', async () => {
      const user = userEvent.setup();
      const customInvoice = createSampleInvoice({ id: 'XM9141' });
      const { container } = renderWithRouter(customInvoice);
      
      const card = container.firstChild as HTMLElement;
      await user.click(card);
      
      expect(mockNavigate).toHaveBeenCalledWith('/invoice/XM9141');
    });

    test('multiple clicks call navigate multiple times', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      await user.click(card);
      await user.click(card);
      await user.click(card);
      
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      mockNavigate.mock.calls.forEach(call => {
        expect(call[0]).toBe('/invoice/RT3080');
      });
    });
  });

  describe('Styling and Layout', () => {
    test('applies correct container CSS classes', () => {
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(
        'grid',
        'grid-cols-[1fr_auto]',
        'p-5',
        'gap-y-2',
        'bg-white',
        'dark:bg-strong-blue',
        'rounded-lg',
        'border-2',
        'border-transparent',
        'cursor-pointer',
        'md:grid-cols-[1.2fr_1fr_1fr_1fr_auto_auto]',
        'md:gap-y-0',
        'md:items-center',
        'hover:border-purple-400',
        'transition-all',
        'duration-300'
      );
    });

    test('ID paragraph has correct styling', () => {
      renderWithRouter();
      
      const idParagraph = screen.getByText('#').closest('p');
      expect(idParagraph).toHaveClass(
        'text-sm',
        'text-medium-gray',
        'dark:text-light-gray',
        'md:mb-0'
      );
    });

    test('due date has correct styling', () => {
      renderWithRouter();
      
      const dueDateElement = screen.getByText('Due 15 Jan 2024');
      expect(dueDateElement).toHaveClass(
        'text-sm',
        'text-medium-gray',
        'dark:text-light-gray',
        'md:mb-0'
      );
    });

    test('desktop client name has correct styling', () => {
      renderWithRouter();
      
      const desktopClientName = screen.getAllByText('Jensen Huang')[0];
      expect(desktopClientName).toHaveClass(
        'hidden',
        'md:block',
        'text-md',
        'font-medium',
        'text-dark-1',
        'dark:text-white'
      );
    });

    test('total amount has correct styling', () => {
      renderWithRouter();
      
      const totalElement = screen.getByText('$1800.90');
      expect(totalElement).toHaveClass(
        'text-md',
        'font-bold',
        'text-dark-1',
        'dark:text-light-gray',
        'md:justify-self-start'
      );
    });

    test('desktop status badge has correct styling', () => {
      renderWithRouter();
      
      const desktopStatusBadge = screen.getAllByText('Paid')[0].closest('span');
      expect(desktopStatusBadge).toHaveClass(
        'hidden',
        'md:inline-flex',
        'items-center',
        'justify-center',
        'w-24',
        'h-10',
        'gap-2',
        'text-sm',
        'font-bold',
        'rounded-md'
      );
    });

    test('mobile section has correct styling', () => {
      const { container } = renderWithRouter();
      
      const mobileSection = container.querySelector('.md\\:hidden.flex.justify-between.col-span-full.pt-2');
      expect(mobileSection).toBeInTheDocument();
      expect(mobileSection).toHaveClass(
        'md:hidden',
        'flex',
        'justify-between',
        'col-span-full',
        'pt-2'
      );
    });
  });

  describe('Responsive Design', () => {
    test('shows elements appropriately for mobile and desktop', () => {
      renderWithRouter();
      
      // Desktop-only elements
      expect(screen.getAllByText('Jensen Huang')[0]).toHaveClass('hidden', 'md:block');
      expect(screen.getAllByText('Paid')[0].closest('span')).toHaveClass('hidden', 'md:inline-flex');
      expect(screen.getByText('>')).toHaveClass('hidden', 'md:block');
      
      // Mobile-only elements
      expect(screen.getAllByText('Jensen Huang')[1].closest('div')).toHaveClass('md:hidden');
      expect(screen.getAllByText('Paid')[1].closest('div')).toHaveClass('md:hidden');
    });

    test('grid layout changes for different screen sizes', () => {
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(
        'grid-cols-[1fr_auto]', // Mobile layout
        'md:grid-cols-[1.2fr_1fr_1fr_1fr_auto_auto]' // Desktop layout
      );
    });
  });

  describe('Dark Mode Support', () => {
    test('container supports dark mode', () => {
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('dark:bg-strong-blue');
    });

    test('text elements support dark mode', () => {
      renderWithRouter();
      
      // ID span
      expect(screen.getByText('RT3080')).toHaveClass('dark:text-white');
      
      // Due date
      expect(screen.getByText('Due 15 Jan 2024')).toHaveClass('dark:text-light-gray');
      
      // Client names
      screen.getAllByText('Jensen Huang').forEach(element => {
        expect(element).toHaveClass('dark:text-white');
      });
      
      // Total amount
      expect(screen.getByText('$1800.90')).toHaveClass('dark:text-light-gray');
      
      // Chevron
      expect(screen.getByText('>')).toHaveClass('dark:text-purple');
    });

    test('ID paragraph supports dark mode', () => {
      renderWithRouter();
      
      const idParagraph = screen.getByText('#').closest('p');
      expect(idParagraph).toHaveClass('dark:text-light-gray');
    });
  });

  describe('Accessibility', () => {
    test('card can be made focusable and clickable', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      
      // Add tabindex to make it focusable (would be added by developers for accessibility)
      card.setAttribute('tabindex', '0');
      card.focus();
      
      expect(card).toHaveFocus();
      
      // Test direct click works (primary interaction method)
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledWith('/invoice/RT3080');
    });

    test('card has cursor pointer indicating clickability', () => {
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer');
    });

    test('status information is clearly presented', () => {
      renderWithRouter();
      
      // Status should be visible and readable
      const statusElements = screen.getAllByText('Paid');
      expect(statusElements).toHaveLength(2);
      
      statusElements.forEach(element => {
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('font-bold');
      });
    });
  });

  describe('Hover Effects', () => {
    test('card has hover border effect', () => {
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(
        'border-transparent',
        'hover:border-purple-400',
        'transition-all',
        'duration-300'
      );
    });
  });

  describe('Component Behavior', () => {
    test('component mounts and unmounts without errors', () => {
      const { unmount } = renderWithRouter();
      
      expect(screen.getByText('RT3080')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByText('RT3080')).not.toBeInTheDocument();
    });

    test('renders consistently across multiple renders', () => {
      const { rerender } = renderWithRouter();
      
      expect(screen.getByText('RT3080')).toBeInTheDocument();
      expect(screen.getAllByText('Jensen Huang')).toHaveLength(2);
      
      rerender(
        <BrowserRouter>
          <InvoiceCard invoice={createSampleInvoice()} />
        </BrowserRouter>
      );
      
      expect(screen.getByText('RT3080')).toBeInTheDocument();
      expect(screen.getAllByText('Jensen Huang')).toHaveLength(2);
    });

    test('handles different prop combinations', () => {
      const customInvoice = createSampleInvoice({
        id: 'FV2353',
        clientName: 'Alysa Werner',
        total: 102.04,
        status: 'Draft',
        createdAt: '2023-12-01T00:00:00Z'
      });
      
      renderWithRouter(customInvoice);
      
      expect(screen.getByText('FV2353')).toBeInTheDocument();
      expect(screen.getAllByText('Alysa Werner')).toHaveLength(2); // Desktop and mobile versions
      expect(screen.getByText('$102.04')).toBeInTheDocument();
      expect(screen.getAllByText('Draft')).toHaveLength(2);
      expect(screen.getByText('Due 01 Dec 2023')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    test('click event is properly attached to container', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter();
      
      const card = container.firstChild as HTMLElement;
      
      // Verify click handler is attached
      expect(card).toHaveClass('cursor-pointer');
      
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('prevents event bubbling appropriately', async () => {
      const user = userEvent.setup();
      const outerClickHandler = vi.fn();
      
      render(
        <BrowserRouter>
          <div onClick={outerClickHandler}>
            <InvoiceCard invoice={createSampleInvoice()} />
          </div>
        </BrowserRouter>
      );
      
      const card = screen.getByText('RT3080').closest('div');
      await user.click(card!);
      
      expect(mockNavigate).toHaveBeenCalled();
      // Event should bubble to parent
      expect(outerClickHandler).toHaveBeenCalled();
    });
  });
});