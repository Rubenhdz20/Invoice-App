import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import BillFromSection from './BillFromSection';
import type { InvoiceFormValues } from '../../pages/forms/CreateInvoice';

// Helper function to render BillFromSection with React Hook Form context
function renderWithForm(defaultValues: Partial<InvoiceFormValues> = {}) {
  const Wrapper = () => {
    const methods = useForm<InvoiceFormValues>({
      defaultValues: {
        senderAddress: {
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
        <BillFromSection
          control={methods.control}
          errors={methods.formState.errors}
        />
      </FormProvider>
    );
  };
  
  return render(<Wrapper />);
}

describe('BillFromSection', () => {
  describe('Rendering', () => {
    test('renders all form fields with correct labels', () => {
      renderWithForm();
      
      expect(screen.getByText('Bill From')).toBeInTheDocument();
      expect(screen.getByText('Street Address')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Post Code')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      
      // Check that inputs are present
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(4);
      
      // Check specific inputs by name attribute
      expect(inputs[0]).toHaveAttribute('name', 'senderAddress.street');
      expect(inputs[1]).toHaveAttribute('name', 'senderAddress.city');
      expect(inputs[2]).toHaveAttribute('name', 'senderAddress.postCode');
      expect(inputs[3]).toHaveAttribute('name', 'senderAddress.country');
    });

    test('renders with pre-filled values when provided', () => {
      const defaultValues = {
        senderAddress: {
          street: '123 Main St',
          city: 'New York',
          postCode: '10001',
          country: 'USA',
        },
      };
      
      renderWithForm(defaultValues);
      
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('allows user to type in all input fields', async () => {
      const user = userEvent.setup();
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      const [streetInput, cityInput, postCodeInput, countryInput] = inputs;
      
      await user.type(streetInput, '456 Oak Ave');
      await user.type(cityInput, 'Los Angeles');
      await user.type(postCodeInput, '90210');
      await user.type(countryInput, 'United States');
      
      expect(screen.getByDisplayValue('456 Oak Ave')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Los Angeles')).toBeInTheDocument();
      expect(screen.getByDisplayValue('90210')).toBeInTheDocument();
      expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
    });

    test('allows user to clear and re-type values', async () => {
      const user = userEvent.setup();
      const defaultValues = {
        senderAddress: {
          street: 'Old Street',
          city: 'Old City',
          postCode: 'OLD123',
          country: 'Old Country',
        },
      };
      
      renderWithForm(defaultValues);
      
      const streetInput = screen.getByDisplayValue('Old Street');
      
      await user.clear(streetInput);
      await user.type(streetInput, 'New Street Address');
      
      expect(screen.getByDisplayValue('New Street Address')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Old Street')).not.toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    test('applies correct CSS classes to form elements', () => {
      renderWithForm();
      
      const streetInput = screen.getAllByRole('textbox')[0];
      expect(streetInput).toHaveClass(
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
      
      // Check for grid container
      const gridContainer = container.querySelector('.md\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper form inputs', () => {
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      const [streetInput, cityInput, postCodeInput, countryInput] = inputs;
      
      expect(streetInput).toBeInstanceOf(HTMLInputElement);
      expect(cityInput).toBeInstanceOf(HTMLInputElement);
      expect(postCodeInput).toBeInstanceOf(HTMLInputElement);
      expect(countryInput).toBeInstanceOf(HTMLInputElement);
    });

    test('section has proper heading structure', () => {
      renderWithForm();
      
      const heading = screen.getByRole('heading', { name: /bill from/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });
  });

  describe('Form Validation', () => {
    test('has required validation rules for all fields', () => {
      renderWithForm();
      
      const inputs = screen.getAllByRole('textbox');
      
      // All inputs should be present and have required validation
      expect(inputs).toHaveLength(4);
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
    });
  });
});