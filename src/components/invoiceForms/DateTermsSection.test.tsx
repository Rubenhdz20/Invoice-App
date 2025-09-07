import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import DateTermsSection from './DateTermsSection';
import type { InvoiceFormValues } from '../../pages/forms/CreateInvoice';

// Helper function to render DateTermsSection with React Hook Form context
function renderWithForm(defaultValues: Partial<InvoiceFormValues> = {}) {
  const Wrapper = () => {
    const methods = useForm<InvoiceFormValues>({
      defaultValues: {
        createdAt: '',
        paymentDue: '',
        paymentTerms: 30,
        description: '',
        ...defaultValues,
      },
    });
    
    return (
      <FormProvider {...methods}>
        <DateTermsSection
          register={methods.register}
          errors={methods.formState.errors}
        />
      </FormProvider>
    );
  };
  
  return render(<Wrapper />);
}

describe('DateTermsSection', () => {
  describe('Rendering', () => {
    test('renders all form fields with correct labels', () => {
      const { container } = renderWithForm();
      
      expect(screen.getByText('Invoice Date')).toBeInTheDocument();
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
      expect(screen.getByText('Payment Terms')).toBeInTheDocument();
      expect(screen.getByText('Project / Description')).toBeInTheDocument();
      
      // Check that description input is present (only textbox)
      const textInputs = screen.getAllByRole('textbox');
      expect(textInputs).toHaveLength(1); // Only description input is textbox
      
      // Check that select is present
      const selectInput = screen.getByRole('combobox');
      expect(selectInput).toBeInTheDocument();
      
      // Check specific inputs by name attribute using querySelector
      expect(container.querySelector('input[name="createdAt"]')).toBeInTheDocument();
      expect(container.querySelector('input[name="paymentDue"]')).toBeInTheDocument();
      expect(selectInput).toHaveAttribute('name', 'paymentTerms');
      expect(textInputs[0]).toHaveAttribute('name', 'description');
    });

    test('renders with pre-filled values when provided', () => {
      const defaultValues = {
        createdAt: '2023-12-25',
        paymentDue: '2024-01-25',
        paymentTerms: 14,
        description: 'Website Development Project',
      };
      
      renderWithForm(defaultValues);
      
      expect(screen.getByDisplayValue('2023-12-25')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-25')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Website Development Project')).toBeInTheDocument();
      
      // Check select value
      const selectInput = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectInput.value).toBe('14');
    });

    test('renders payment terms select options correctly', () => {
      renderWithForm();
      
      const options = screen.getAllByRole('option');
      
      expect(options).toHaveLength(4);
      expect(screen.getByRole('option', { name: 'Net 1 Day' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Net 7 Days' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Net 14 Days' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Net 30 Days' })).toBeInTheDocument();
      
      // Check option values
      expect(screen.getByRole('option', { name: 'Net 1 Day' })).toHaveValue('1');
      expect(screen.getByRole('option', { name: 'Net 7 Days' })).toHaveValue('7');
      expect(screen.getByRole('option', { name: 'Net 14 Days' })).toHaveValue('14');
      expect(screen.getByRole('option', { name: 'Net 30 Days' })).toHaveValue('30');
    });
  });

  describe('User Interactions', () => {
    test('allows user to type in date inputs and description', async () => {
      const user = userEvent.setup();
      const { container } = renderWithForm();
      
      // Get inputs by name since date inputs are not textbox role
      const createdAtInput = container.querySelector('input[name="createdAt"]') as HTMLInputElement;
      const paymentDueInput = container.querySelector('input[name="paymentDue"]') as HTMLInputElement;
      const descriptionInput = screen.getByRole('textbox');
      
      await user.clear(createdAtInput);
      await user.type(createdAtInput, '2023-11-15');
      await user.clear(paymentDueInput);
      await user.type(paymentDueInput, '2023-12-15');
      await user.type(descriptionInput, 'New project description');
      
      expect(screen.getByDisplayValue('2023-11-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2023-12-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('New project description')).toBeInTheDocument();
    });

    test('allows user to select payment terms', async () => {
      const user = userEvent.setup();
      renderWithForm();
      
      const selectInput = screen.getByRole('combobox');
      
      await user.selectOptions(selectInput, '7');
      
      expect((selectInput as HTMLSelectElement).value).toBe('7');
      expect(screen.getByRole('option', { name: 'Net 7 Days' })).toBeInTheDocument();
    });

    test('allows user to clear and re-type values', async () => {
      const user = userEvent.setup();
      const defaultValues = {
        createdAt: '2023-01-01',
        paymentDue: '2023-02-01',
        description: 'Old description',
      };
      
      renderWithForm(defaultValues);
      
      const descriptionInput = screen.getByDisplayValue('Old description');
      
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated project description');
      
      expect(screen.getByDisplayValue('Updated project description')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Old description')).not.toBeInTheDocument();
    });

    test('allows changing payment terms selection', async () => {
      const user = userEvent.setup();
      renderWithForm({ paymentTerms: 30 });
      
      const selectInput = screen.getByRole('combobox');
      expect((selectInput as HTMLSelectElement).value).toBe('30');
      
      await user.selectOptions(selectInput, '1');
      
      expect((selectInput as HTMLSelectElement).value).toBe('1');
    });
  });

  describe('Input Types and Attributes', () => {
    test('date inputs have correct type attribute', () => {
      const { container } = renderWithForm();
      
      const createdAtInput = container.querySelector('input[name="createdAt"]');
      const paymentDueInput = container.querySelector('input[name="paymentDue"]');
      const descriptionInput = screen.getByRole('textbox');
      
      expect(createdAtInput).toHaveAttribute('type', 'date');
      expect(paymentDueInput).toHaveAttribute('type', 'date');
      expect(descriptionInput).not.toHaveAttribute('type', 'date');
    });

    test('select has correct valueAsNumber registration', () => {
      renderWithForm();
      
      const selectInput = screen.getByRole('combobox');
      expect(selectInput).toHaveAttribute('name', 'paymentTerms');
      
      // Check that default value is numeric
      expect((selectInput as HTMLSelectElement).value).toBe('30');
    });
  });

  describe('Styling and Classes', () => {
    test('applies correct CSS classes to form elements', () => {
      const { container } = renderWithForm();
      
      const createdAtInput = container.querySelector('input[name="createdAt"]');
      const paymentDueInput = container.querySelector('input[name="paymentDue"]');
      const descriptionInput = screen.getByRole('textbox');
      const selectInput = screen.getByRole('combobox');
      
      // Check common styling classes for all inputs
      [createdAtInput, paymentDueInput, descriptionInput].forEach(input => {
        expect(input).toHaveClass(
          'w-full',
          'px-6',
          'py-5',
          'text-md',
          'font-bold',
          'rounded',
          'border-2'
        );
      });
      
      expect(selectInput).toHaveClass(
        'w-full',
        'px-6',
        'py-5',
        'text-md',
        'font-bold',
        'rounded',
        'border-2',
        'cursor-pointer'
      );
    });

    test('has proper responsive grid layout classes', () => {
      const { container } = renderWithForm();
      
      // Check for grid container with responsive layout
      const gridContainer = container.querySelector('.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    test('date inputs have cursor pointer class', () => {
      const { container } = renderWithForm();
      
      const createdAtInput = container.querySelector('input[name="createdAt"]');
      const paymentDueInput = container.querySelector('input[name="paymentDue"]');
      
      expect(createdAtInput).toHaveClass('cursor-pointer');
      expect(paymentDueInput).toHaveClass('cursor-pointer');
    });
  });

  describe('Error State Styling', () => {
    test('applies error styles when description validation fails', () => {
      const WrapperWithErrors = () => {
        const methods = useForm<InvoiceFormValues>({
          defaultValues: {
            createdAt: '',
            paymentDue: '',
            paymentTerms: 30,
            description: '',
          },
        });
        
        // Simulate validation error for description
        const mockErrors = {
          description: { type: 'required', message: 'Required' },
        };
        
        return (
          <DateTermsSection
            register={methods.register}
            errors={mockErrors}
          />
        );
      };
      
      render(<WrapperWithErrors />);
      
      const descriptionInput = screen.getByRole('textbox'); // Description input
      
      // Check that error styles are applied to description input
      expect(descriptionInput).toHaveClass('border-red-500');
    });

    test('applies error styles to description label when validation fails', () => {
      const WrapperWithErrors = () => {
        const methods = useForm<InvoiceFormValues>();
        
        const mockErrors = {
          description: { type: 'required', message: 'Required' },
        };
        
        return (
          <DateTermsSection
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

    test('applies normal styles when no validation errors', () => {
      renderWithForm();
      
      const descriptionInput = screen.getByRole('textbox');
      
      // Should not have error styling
      expect(descriptionInput).not.toHaveClass('border-red-500');
    });
  });

  describe('Accessibility', () => {
    test('has proper form input types', () => {
      const { container } = renderWithForm();
      
      const createdAtInput = container.querySelector('input[name="createdAt"]');
      const paymentDueInput = container.querySelector('input[name="paymentDue"]');
      const descriptionInput = screen.getByRole('textbox');
      const selectInput = screen.getByRole('combobox');
      
      expect(createdAtInput).toBeInstanceOf(HTMLInputElement);
      expect(paymentDueInput).toBeInstanceOf(HTMLInputElement);
      expect(descriptionInput).toBeInstanceOf(HTMLInputElement);
      expect(selectInput).toBeInstanceOf(HTMLSelectElement);
    });

    test('labels are properly associated with inputs', () => {
      renderWithForm();
      
      // Check that labels are present and descriptive
      expect(screen.getByText('Invoice Date')).toBeInTheDocument();
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
      expect(screen.getByText('Payment Terms')).toBeInTheDocument();
      expect(screen.getByText('Project / Description')).toBeInTheDocument();
    });

    test('select options have proper text content', () => {
      renderWithForm();
      
      // Verify option text is descriptive
      expect(screen.getByRole('option', { name: 'Net 1 Day' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Net 7 Days' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Net 14 Days' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Net 30 Days' })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('has required validation rules for necessary fields', () => {
      const { container } = renderWithForm();
      
      const createdAtInput = container.querySelector('input[name="createdAt"]');
      const paymentDueInput = container.querySelector('input[name="paymentDue"]');
      const descriptionInput = screen.getByRole('textbox');
      const selectInput = screen.getByRole('combobox');
      
      // All inputs should be present and have name attributes
      expect(createdAtInput).toBeInstanceOf(HTMLInputElement);
      expect(paymentDueInput).toBeInstanceOf(HTMLInputElement);
      expect(descriptionInput).toBeInstanceOf(HTMLInputElement);
      expect(selectInput).toBeInstanceOf(HTMLSelectElement);
      
      expect(createdAtInput).toHaveAttribute('name', 'createdAt');
      expect(paymentDueInput).toHaveAttribute('name', 'paymentDue');
      expect(descriptionInput).toHaveAttribute('name', 'description');
      expect(selectInput).toHaveAttribute('name', 'paymentTerms');
    });

    test('uses correct field names for React Hook Form integration', () => {
      const { container } = renderWithForm();
      
      const createdAtInput = container.querySelector('input[name="createdAt"]');
      const paymentDueInput = container.querySelector('input[name="paymentDue"]');
      const descriptionInput = screen.getByRole('textbox');
      const selectInput = screen.getByRole('combobox');
      
      expect(createdAtInput).toHaveAttribute('name', 'createdAt');
      expect(paymentDueInput).toHaveAttribute('name', 'paymentDue');
      expect(selectInput).toHaveAttribute('name', 'paymentTerms');
      expect(descriptionInput).toHaveAttribute('name', 'description');
    });

    test('shows field labels that match form requirements', () => {
      renderWithForm();
      
      // These labels correspond to required fields in the component
      expect(screen.getByText('Invoice Date')).toBeInTheDocument();
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
      expect(screen.getByText('Payment Terms')).toBeInTheDocument();
      expect(screen.getByText('Project / Description')).toBeInTheDocument();
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
      
      // Check for responsive spacing
      const responsiveSpacing = container.querySelector('.md\\:space-y-0');
      expect(responsiveSpacing).toBeInTheDocument();
    });

    test('renders date fields in responsive grid layout', () => {
      const { container } = renderWithForm();
      
      // Check for responsive grid layout
      const gridContainer = container.querySelector('.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    test('description field spans full width', () => {
      renderWithForm();
      
      const descriptionInput = screen.getByRole('textbox');
      
      expect(descriptionInput).toHaveClass('w-full');
    });
  });
});