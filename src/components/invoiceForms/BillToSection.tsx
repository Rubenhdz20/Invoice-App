import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from "../../pages/forms/CreateInvoice"; 

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
                        className={`block mb-1 text-purple text-sm font-medium dark:text-gray-400  ${
                            errors.clientName ? "text-red-500" : "text-gray-400"
                        }`}
                    >
                        Client’s Name
                    </label>
                    <input
                        {...register('clientName', { required: true })}
                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 
                        ${errors.clientName 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                        }`}
                    />
                </div>
                <div>
                    <label className={`block mb-1 text-purple text-sm font-medium dark:text-gray-400 ${
                            errors.clientEmail ? "text-red-500" : "text-gray-400"
                        }`}
                    >
                        Client’s Email
                    </label>
                    <input
                        {...register('clientEmail', { required: true })}
                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 
                        ${errors.clientEmail
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                        }`}
                    />
                </div>
                <div>
                    <label className={`block mb-1 text-purple text-sm font-medium dark:text-gray-400 ${
                            errors.clientAddress ? "text-red-500" : "text-gray-400"
                        }`}
                    > 
                        Street Address
                    </label>
                    <input
                        {...register('clientAddress.street', { required: true })}
                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 
                        ${errors.clientAddress 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                        }`}
                    />
                </div>
                <div className="flex mt-6 space-x-2 md:grid md:grid-cols-3 md:gap-4 space-y-6 md:space-y-0">
                    <div>
                        <label className={`block mb-1 text-purple text-sm font-medium dark:text-gray-400 ${
                            errors.clientAddress?.city ? "text-red-500" : "text-gray-400"
                        }`}>
                            City
                        </label>
                        <input 
                            {...register('clientAddress.city', {required: true})} 
                            className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 
                            ${errors.clientAddress?.city 
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block mb-1 text-purple text-sm font-medium dark:text-gray-400 ${
                            errors.clientAddress?.postCode ? "text-red-500" : "text-gray-400"
                            }`}
                        >
                            Post Code
                        </label>
                        <input 
                            {...register('clientAddress.postCode', {required: true})} 
                            className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50
                            ${errors.clientAddress?.postCode 
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                            }`}
                        />
                    </div>
                     <div>
                    <label className={`block mb-1 text-purple text-sm font-medium dark:text-gray-400 ${
                        errors.clientAddress?.country ? "text-red-500" : "text-gray-400"
                        }`}>
                            Country
                    </label>
                    <input
                        {...register('clientAddress.country', { required: true })}
                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50
                        ${errors.clientAddress?.country 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                        }`}
                    />
                </div>  
                </div>
            </section>
        </>
    )
};

export default BillToSection;