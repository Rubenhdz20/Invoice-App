import React from 'react'
import { Control, useFieldArray, useWatch, UseFormRegister, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from '../../pages/forms/EditInvoice'
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
                <h2 className="text-[#777F98] text-lg font-bold">Item List</h2>
                {fields.map((field, index) => {
                    const { quantity = 0, price = 0 } = watchedItems[index] ?? {};
                    const total = quantity * price;

                    return (
                        <div key={field.id} className="flex flex-col gap-2">
                            {/* Item Name */}
                            <div className="mb-6">
                                <label className={`block mb-1 mt-6 text-purple text-sm font-medium dark:text-gray-400 ${
                                    errors.items?.[index]?.name ? "text-red-500" : "text-gray-400"
                                    }`}>
                                        Item Name
                                </label>
                                <input
                                    {...register(`items.${index}.name` as const, { required: true })}
                                    className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 
                                    ${errors.items?.[index]?.name
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                                    }`}
                                />
                            </div>

                            {/* Qty, Price, Total, Remove */}
                            <div className="flex items-center justify-center space-x-4">
                                {/* Qty */}
                                <div>
                                    <label className="block text-purple text-sm font-medium dark:text-gray-400">Qty.</label>
                                    <input
                                        type="number"
                                        {...register(`items.${index}.quantity` as const, {
                                        valueAsNumber: true,
                                        required: true,
                                        })}
                                        className="w-24 px-4 py-2 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:border-transparent dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50"
                                    />
                                </div>
                                {/* Price */}
                                <div>
                                    <label className="block text-purple text-sm font-medium dark:text-gray-400">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.price` as const, {
                                        valueAsNumber: true,
                                        required: true,
                                        })}
                                        className="w-24 px-4 py-2 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:border-transparent dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50"
                                    />
                                </div>
                                {/* Price */}
                                <div>
                                    <label className="block text-purple text-sm font-medium dark:text-gray-400">Total</label>
                                    <input
                                        readOnly
                                        value={formatCurrency(total)}
                                        className="w-24 px-4 py-2 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:border-transparent dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50"
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
                    className="w-full px-6 py-3 text-md bg-cancel-gray dark:bg-strong-blue text-purple dark:text-white font-bold rounded-full cursor-pointer border-2 border-transparent hover:bg-light-gray dark:hover:bg-white hover:text-[#7E88C3] transition"
                >
                    + Add New Item
                </button>
            </section>
        </>
    )
};


export default ItemsSection;