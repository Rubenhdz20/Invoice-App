import React from 'react'
import { Control, useFieldArray, useWatch, UseFormRegister, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from '../../pages/invoices/EditInvoice'
import { formatCurrency } from '../../utils/formatCurrency'

interface Props {
  control: Control<InvoiceFormValues>
  register: UseFormRegister<InvoiceFormValues>
  errors: FieldErrors<InvoiceFormValues>
}

const ItemsSection = ({ control, register, errors }: Props) => {
    // Reads the current items array from form values.
    // Provides fields, an array of { id, name, quantity, … } for rendering.
    // Gives you append() to add a blank row, and remove(index) to delete one.
    // Why: so your user can add or delete invoice line-items on the fly, with full form integration.

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchedItems = useWatch({
        control,
        name: "items",          // watch the entire array once
        defaultValue: fields,   // initial values come from your fields
    });


    return (
        <>
            <section className="space-y-4">
                <h2 className="text-gray-400 text-lg font-semibold">Item List</h2>
                {fields.map((field, index) => {
                    const { quantity = 0, price = 0 } = watchedItems[index] ?? {};
                    const total = quantity * price;

                    return (
                        <div key={field.id} className="flex flex-col gap-2">
                            {/* Item Name */}
                            <div className="mb-6">
                                <label className={`block mb-1 text-sm font-medium ${
                                    errors.items?.[index]?.name ? "text-red-500" : "text-gray-400"
                                    }`}>
                                        Item Name
                                </label>
                                <input
                                    {...register(`items.${index}.name` as const, { required: true })}
                                    className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                                    ${errors.items?.[index]?.name
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                                    }`}
                                />
                            </div>

                            {/* Qty, Price, Total, Remove */}
                            <div className="flex items-center justify-center space-x-4">
                                {/* Qty */}
                                <div>
                                    <label className="block text-gray-400 text-sm">Qty.</label>
                                    <input
                                        type="number"
                                        {...register(`items.${index}.quantity` as const, {
                                        valueAsNumber: true,
                                        required: true,
                                        })}
                                        className="w-24 px-4 py-2 text-md bg-[#1E2139] text-white font-bold roundedborder-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA"
                                    />
                                </div>
                                {/* Price */}
                                <div>
                                    <label className="block text-gray-400 text-sm">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.price` as const, {
                                        valueAsNumber: true,
                                        required: true,
                                        })}
                                        className="w-28 px-4 py-2 text-md bg-[#1E2139] text-white font-bold roundedborder-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA"
                                    />
                                </div>
                                    {/* Total (read-only) */}
                                <div>
                                    <label className="block text-gray-400 text-sm">Total</label>
                                    <input
                                        readOnly
                                        value={formatCurrency(total)}
                                        className="w-28 p-2 bg-[#1E2139] rounded text-white border-transparent focus:border-[#252945] focus:ring-2 focus:ring[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                                    />
                                </div>
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="cursor-pointer"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    );
                })}
                {/* Add new item */}
                <button
                    type="button"
                    onClick={() => append({ name: "", quantity: 1, price: 0, total: 0 })}
                    className="w-full px-6 py-3 text-md bg-[#1E2139] text-white font-bold rounded-full cursor-pointer border-2 border-transparent hover:bg-white hover:text-[#7E88C3] transition"
                >
                    + Add New Item
                </button>
            </section>
        </>
    )
};


export default ItemsSection;