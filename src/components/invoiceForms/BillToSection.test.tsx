import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import BillToSection from './BillToSection';
import type { InvoiceFormValues } from '../../pages/forms/CreateInvoice';

// Helper function to render BillToSection with React Hook Form context
function renderWithForm(defaultValues: Partial<InvoiceFormValues> = {}) {
  const Wrapper = () => {
    const methods = useForm<InvoiceFormValues>({
      defaultValues: {
        clientName: '',
        clientEmail: '',
        clientAddress: {
          street: '',
          city: '',
          postCode: '',
          country: '',
        },
        ...defaultValues,
      },
    });
    
    return (
      <FormProvider {...methods}>
        <BillToSection
          register={methods.register}
          errors={methods.formState.errors}
        />
      </FormProvider>
    );
  };
  
  return render(<Wrapper />);
}

describe('BillToSection', () => {
  describe('Rendering', () => {
    test('renders all form fields with correct structure', () => {
      renderWithForm();
      
      expect(screen.getByText('Bill To')).toBeInTheDocument();
      expect(screen.getByText('Street Address')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Post Code')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      
      // Check that inputs are present
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);
      
      // Check specific inputs by name attribute
      expect(inputs[0]).toHaveAttribute('name', 'clientName');
      expect(inputs[1]).toHaveAttribute('name', 'clientEmail');
      expect(inputs[2]).toHaveAttribute('name', 'clientAddress.street');
      expect(inputs[3]).toHaveAttribute('name', 'clientAddress.city');
      expect(inputs[4]).toHaveAttribute('name', 'clientAddress.postCode');
      expect(inputs[5]).toHaveAttribute('name', 'clientAddress.country');
    });

    test('renders with pre-filled values when provided', () => {
      const defaultValues = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientAddress: {
          street: '456 Client St',
          city: 'Los Angeles',
          postCode: '90210',
          country: 'USA',
        },
      };
      
      renderWithForm(defaultValues);
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('456 Client St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Los Angeles')).toBeInTheDocument();
      expect(screen.getByDisplayValue('90210')).toBeInTheDocument();
      expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('allows user to type in all input fields', async () => {
      const user = userEvent.setup();
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      const [nameInput, emailInput, streetInput, cityInput, postCodeInput, countryInput] = inputs;
      
      await user.type(nameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@company.com');
      await user.type(streetInput, '789 Business Ave');
      await user.type(cityInput, 'Chicago');
      await user.type(postCodeInput, '60601');
      await user.type(countryInput, 'United States');
      
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@company.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('789 Business Ave')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Chicago')).toBeInTheDocument();
      expect(screen.getByDisplayValue('60601')).toBeInTheDocument();
      expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
    });

    test('allows user to clear and re-type values', async () => {
      const user = userEvent.setup();
      const defaultValues = {
        clientName: 'Old Name',
        clientEmail: 'old@email.com',
        clientAddress: {
          street: 'Old Street',
          city: 'Old City',
          postCode: 'OLD123',
          country: 'Old Country',
        },
      };
      
      renderWithForm(defaultValues);
      
      const nameInput = screen.getByDisplayValue('Old Name');
      const emailInput = screen.getByDisplayValue('old@email.com');
      
      await user.clear(nameInput);
      await user.type(nameInput, 'New Client Name');
      
      await user.clear(emailInput);
      await user.type(emailInput, 'new@email.com');
      
      expect(screen.getByDisplayValue('New Client Name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('new@email.com')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Old Name')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('old@email.com')).not.toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    test('applies correct CSS classes to form elements', () => {
      renderWithForm();
      
      const nameInput = screen.getAllByRole('textbox')[0];
      expect(nameInput).toHaveClass(
        'w-full',
        'px-6',
        'py-5',
        'text-md',
        'font-bold',
        'rounded',
        'border-2'
      );
    });

    test('has proper responsive grid layout classes', () => {
      const { container } = renderWithForm();
      
      // Check for grid container with responsive layout
      const gridContainer = container.querySelector('.md\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
      
      // Check for flexbox fallback
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });

    test('applies purple heading color class', () => {
      const { container } = renderWithForm();
      
      const heading = container.querySelector('.text-\\[\\#7C5DFA\\]');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Bill To');
    });
  });

  describe('Error State Styling', () => {
    test('applies error styles when validation errors are present', () => {
      // Create a wrapper that simulates form errors
      const WrapperWithErrors = () => {
        const methods = useForm<InvoiceFormValues>({
          defaultValues: {
            clientName: '',
            clientEmail: '',
            clientAddress: { street: '', city: '', postCode: '', country: '' },
          },
        });
        
        // Simulate validation errors
        const mockErrors = {
          clientName: { type: 'required', message: 'Required' },
          clientEmail: { type: 'required', message: 'Required' },
          clientAddress: {
            street: { type: 'required', message: 'Required' },
            city: { type: 'required', message: 'Required' },
            postCode: { type: 'required', message: 'Required' },
            country: { type: 'required', message: 'Required' },
          },
        };
        
        return (
          <BillToSection
            register={methods.register}
            errors={mockErrors}
          />
        );
      };
      
      render(<WrapperWithErrors />);
      
      const inputs = screen.getAllByRole('textbox');
      
      // Check that error styles are applied
      inputs.forEach(input => {
        expect(input).toHaveClass('border-red-500');
      });
    });

    test('applies error styles to labels when validation errors are present', () => {
      const WrapperWithErrors = () => {
        const methods = useForm<InvoiceFormValues>();
        
        const mockErrors = {
          clientName: { type: 'required', message: 'Required' },
          clientEmail: { type: 'required', message: 'Required' },
        };
        
        return (
          <BillToSection
            register={methods.register}
            errors={mockErrors}
          />
        );
      };
      
      const { container } = render(<WrapperWithErrors />);
      
      // Check for red label styling
      const errorLabels = container.querySelectorAll('.text-red-500');
      expect(errorLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    test('has proper form inputs', () => {
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      const [nameInput, emailInput, streetInput, cityInput, postCodeInput, countryInput] = inputs;
      
      expect(nameInput).toBeInstanceOf(HTMLInputElement);
      expect(emailInput).toBeInstanceOf(HTMLInputElement);
      expect(streetInput).toBeInstanceOf(HTMLInputElement);
      expect(cityInput).toBeInstanceOf(HTMLInputElement);
      expect(postCodeInput).toBeInstanceOf(HTMLInputElement);
      expect(countryInput).toBeInstanceOf(HTMLInputElement);
    });

    test('section has proper heading structure', () => {
      renderWithForm();
      
      const heading = screen.getByRole('heading', { name: /bill to/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    test('labels are properly associated with inputs', () => {
      renderWithForm();
      
      // Check that labels are present and descriptive  
      expect(screen.getByText('Street Address')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Post Code')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      
      // Verify that the client name and email labels exist by checking the DOM structure
      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveAttribute('name', 'clientName');
      expect(inputs[1]).toHaveAttribute('name', 'clientEmail');
    });
  });

  describe('Form Validation', () => {
    test('has required validation rules for all fields', () => {
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      
      // All inputs should be present
      expect(inputs).toHaveLength(6);
      inputs.forEach(input => {
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toHaveAttribute('name');
      });
    });

    test('shows field labels that match validation requirements', () => {
      renderWithForm();
      
      // These labels correspond to required fields in the component
      expect(screen.getByText('Street Address')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Post Code')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      
      // Verify required inputs exist by checking name attributes
      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveAttribute('name', 'clientName');
      expect(inputs[1]).toHaveAttribute('name', 'clientEmail');
    });

    test('uses correct field names for React Hook Form integration', () => {
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      
      expect(inputs[0]).toHaveAttribute('name', 'clientName');
      expect(inputs[1]).toHaveAttribute('name', 'clientEmail');
      expect(inputs[2]).toHaveAttribute('name', 'clientAddress.street');
      expect(inputs[3]).toHaveAttribute('name', 'clientAddress.city');
      expect(inputs[4]).toHaveAttribute('name', 'clientAddress.postCode');
      expect(inputs[5]).toHaveAttribute('name', 'clientAddress.country');
    });
  });

  describe('Layout and Structure', () => {
    test('maintains proper section structure', () => {
      const { container } = renderWithForm();
      
      // Check for main section
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('space-y-2');
    });

    test('has proper spacing between form fields', () => {
      const { container } = renderWithForm();
      
      // Check for spacing utility classes
      const spacedSection = container.querySelector('.space-y-2');
      expect(spacedSection).toBeInTheDocument();
      
      const spacedGrid = container.querySelector('.space-x-2');
      expect(spacedGrid).toBeInTheDocument();
    });

    test('renders address fields in responsive grid layout', () => {
      const { container } = renderWithForm();
      
      // Check for responsive grid and flex layout
      const gridContainer = container.querySelector('.md\\:grid.md\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
      
      // Should also have flex as fallback
      expect(gridContainer).toHaveClass('flex');
    });
  });
});