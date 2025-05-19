import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from '../../pages/invoices/EditInvoice'

interface Props {
  register: UseFormRegister<InvoiceFormValues>
  errors: FieldErrors<InvoiceFormValues>
}

const DateTermsSection = ({ register, errors }: Props) => {
    return (
        <>
            <section className="space-y-2">
                <div>
                    <label className="block mt-6 mb-1 text-gray-400 text-sm">Invoice Date</label>
                    <input
                        type="date"
                        {...register('createdAt', { required: true })}
                        className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block mt-6 mb-1 text-gray-400 text-sm">Payment Due</label>
                    <input
                        type="date"
                        {...register('paymentDue', { required: true })}
                        className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block mt-6 mb-1 text-gray-400 text-sm">Payment Terms</label>
                    <select
                        {...register('paymentTerms', { valueAsNumber: true })}
                        className="w-full px-5 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] cursor-pointer"
                    >
                        <option value={1}>Net 1 Day</option>
                        <option value={7}>Net 7 Days</option>
                        <option value={14}>Net 14 Days</option>
                        <option value={30}>Net 30 Days</option>
                    </select>
                </div>
                <div>
                    <label className={`block mb-1 text-sm font-medium ${
                        errors.description ? "text-red-500" : "text-gray-400"
                        }`}>
                            Project / Description
                    </label>
                    <input
                        {...register('description', { required: true })}
                        className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] 
                        ${errors.description
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                        }`}
                    />
                </div>
            </section>
        </>
    )
};


export default DateTermsSection;