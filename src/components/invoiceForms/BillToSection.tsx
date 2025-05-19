import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from '../../pages/invoices/EditInvoice'

interface Props {
  register: UseFormRegister<InvoiceFormValues>
  errors: FieldErrors<InvoiceFormValues>
}

const BillToSection = ({ register, errors }: Props) => {
    return (
        <>
            <section className="space-y-2">
                <h2 className="mb-6 text-sm text-[#7C5DFA] font-bold uppercase">Bill To</h2>
                <div>
                    <label 
                        className={`block mb-1 text-sm font-medium ${
                            errors.clientName ? "text-red-500" : "text-gray-400"
                        }`}
                    >
                        Client’s Name
                    </label>
                    <input
                        {...register('clientName', { required: true })}
                        className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] 
                        ${errors.clientName 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                        }`}
                    />
                </div>
                <div>
                    <label className={`block mb-1 text-sm font-medium ${
                            errors.clientEmail ? "text-red-500" : "text-gray-400"
                        }`}
                    >
                        Client’s Email
                    </label>
                    <input
                        {...register('clientEmail', { required: true })}
                        className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] 
                        ${errors.clientEmail
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                        }`}
                    />
                </div>
                <div>
                    <label className={`block mb-1 text-sm font-medium ${
                            errors.clientAddress ? "text-red-500" : "text-gray-400"
                        }`}
                    > 
                        Street Address
                    </label>
                    <input
                        {...register('clientAddress.street', { required: true })}
                        className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] 
                        ${errors.clientAddress 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                        }`}
                    />
                </div>
                <div className="flex mt-6 space-x-2">
                    <div>
                        <label className={`block mb-1 text-sm font-medium ${
                            errors.clientAddress?.city ? "text-red-500" : "text-gray-400"
                        }`}>
                            City
                        </label>
                        <input 
                            {...register('clientAddress.city', {required: true})} 
                            className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA] 
                            ${errors.clientAddress?.city 
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block mb-1 text-sm font-medium ${
                            errors.clientAddress?.postCode ? "text-red-500" : "text-gray-400"
                            }`}
                        >
                            Post Code
                        </label>
                        <input 
                            {...register('clientAddress.postCode', {required: true})} 
                            className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                            ${errors.clientAddress?.postCode 
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                            }`}
                        />
                    </div>
                </div>
                <div>
                    <label className={`block mb-1 text-sm font-medium ${
                        errors.clientAddress?.country ? "text-red-500" : "text-gray-400"
                        }`}>
                            Country
                    </label>
                    <input
                        {...register('clientAddress.country', { required: true })}
                        className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                        ${errors.clientAddress?.country 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                        }`}
                    />
                </div>  
            </section>
        </>
    )
};

export default BillToSection;