import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ItemsSection from './ItemsSection';
import type { InvoiceFormValues } from '../../pages/forms/CreateInvoice';

// Small helper: mount ItemsSection with RHF and default values
function renderWithForm(defaultValues: Partial<InvoiceFormValues>) {
  const Wrapper = () => {
    const methods = useForm({ defaultValues });
    return (
      <FormProvider {...methods}>
        <ItemsSection
          control={methods.control}
          register={methods.register}
          errors={{}} // no validation errors for this test
        />
      </FormProvider>
    );
  };
  return render(<Wrapper />);
}

describe('ItemsSection', () => {
  test('shows formatted total and updates when qty/price change', async () => {
    const user = userEvent.setup();

    // ARRANGE: start with 1 line item: qty=2, price=100 → $200.00
    renderWithForm({ items: [{ name: 'Item A', quantity: 2, price: 100 }] });

    // ASSERT initial total is rendered (readOnly input)
    // We use getByDisplayValue because the label isn't associated to the input.
    // If there are multiple lines later, use getAllByDisplayValue + pick index.
    expect(screen.getByDisplayValue('$200.00')).toBeInTheDocument();

    // ACT: change Qty from 2 → 3
    const qtyInput = screen.getByDisplayValue('2');
    const priceInput = screen.getByDisplayValue('100');
    
    await user.clear(qtyInput);
    await user.type(qtyInput, '3');

    // ASSERT: total updates → $300.00
    expect(screen.getByDisplayValue('$300.00')).toBeInTheDocument();

    // ACT: change Price from 100 → 19.99 (keep qty=3)
    await user.clear(priceInput);
    await user.type(priceInput, '19.99');

    // ASSERT: total updates → 3 * 19.99 = $59.97
    expect(screen.getByDisplayValue('$59.97')).toBeInTheDocument();
  });
});