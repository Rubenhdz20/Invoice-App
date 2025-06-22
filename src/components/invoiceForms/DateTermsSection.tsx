import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from "../../pages/forms/CreateInvoice"; 

interface Props {
  register: UseFormRegister<InvoiceFormValues>
  errors: FieldErrors<InvoiceFormValues>
}

const DateTermsSection = ({ register, errors }: Props) => {
    return (
        <>
            <section className="space-y-2">
                <div className="mt-6 grid md:grid-cols-2 md:gap-4 space-y-6 md:space-y-0">
                    <div>
                        <label className="block mb-1 mt-6 text-purple text-sm font-medium dark:text-gray-400">Invoice Date</label>
                        <input
                            type="date"
                            {...register('createdAt', { required: true })}
                            className="w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:border-transparent dark:focus:border-[#252945]  dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 mt-6 text-purple text-sm font-medium dark:text-gray-400">Payment Due</label>
                        <input
                            type="date"
                            {...register('paymentDue', { required: true })}
                            className="w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:border-transparent dark:focus:border-[#252945]  dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 cursor-pointer"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 mt-6 text-purple text-sm font-medium dark:text-gray-400">Payment Terms</label>
                    <select
                        {...register('paymentTerms', { valueAsNumber: true })}
                        className="w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:border-transparent dark:focus:border-[#252945] dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 cursor-pointer"
                    >
                        <option value={1}>Net 1 Day</option>
                        <option value={7}>Net 7 Days</option>
                        <option value={14}>Net 14 Days</option>
                        <option value={30}>Net 30 Days</option>
                    </select>
                </div>
                <div>
                    <label className={`block mb-1 mt-6 text-purple text-sm font-medium dark:text-gray-400 ${
                        errors.description ? "text-red-500" : "text-gray-400"
                        }`}>
                            Project / Description
                    </label>
                    <input
                        {...register('description', { required: true })}
                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 
                        ${errors.description
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                        }`}
                    />
                </div>
            </section>
        </>
    )
};


export default DateTermsSection;