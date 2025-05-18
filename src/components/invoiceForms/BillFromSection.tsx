import React from "react";
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { InvoiceFormValues } from '../../pages/invoices/EditInvoice'

interface Props {
  control: Control<InvoiceFormValues>
  errors: FieldErrors<InvoiceFormValues>
}

const BillFromSection = ({ control, errors }: Props) => {
    return (
        <>
            <section className="space-y-2">
                <h2 className="mb-6 text-sm text-[#7C5DFA] font-bold uppercase">Bill From</h2>
                <Controller
                    control={control}
                    name="senderAddress.street"
                    defaultValue=""
                    rules={{ required: "Street is required" }}
                    render={({ field, fieldState }) => (
                        <div>
                            <label className={`block mb-1 text-gray-400 text-sm
                                ${errors.senderAddress?.street ? "text-red-500" : "text-gray-400"}
                            `}>
                                Street Address
                            </label>
                            <input
                                {...field}
                                className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                                ${errors.senderAddress?.street 
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                    : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"
                                }`}
                            />
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="senderAddress.city"
                    defaultValue=""
                    rules={{ required: "City is required" }}
                    render={({ field, fieldState }) => (
                        <div className="mt-6 space-x-2">
                            <div>
                                <label className={`block mb-1 text-gray-400 text-sm 
                                    ${errors.senderAddress?.city ? "text-red-500" : "text-gray-400"}`}
                                >
                                    City
                                </label>
                                <input
                                    {...field}
                                    className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                                    ${errors.senderAddress?.street 
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"}`
                                    }
                                />
                            </div>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="senderAddress.postCode"
                    defaultValue=""
                    rules={{ required: "Post code is required" }}
                    render={({ field, fieldState }) => (
                    <div className="mt-6 space-x-2"> 
                        <div>
                            <label className={`block mb-1 text-gray-400 text-sm 
                                    ${errors.senderAddress?.postCode ? "text-red-500" : "text-gray-400"}`}
                                >
                                Post Code
                            </label>
                            <input
                                    {...field}
                                    className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                                    ${errors.senderAddress?.postCode
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"}`
                                    }
                                />
                        </div>
                    </div>
                    )}
                />
                <Controller
                    control={control}
                    name="senderAddress.country"
                    defaultValue=""
                    rules={{ required: "Country is required" }}
                    render={({ field, fieldState }) => (
                    <div className="mt-6 space-x-2"> 
                        <div>
                            <label className={`block mb-1 text-gray-400 text-sm 
                                    ${errors.senderAddress?.country ? "text-red-500" : "text-gray-400"}`}
                                >
                                Country
                            </label>
                            <input
                                {...field}
                                className={`w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]
                                ${errors.senderAddress?.country
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                    : "border-transparent focus:border-[#7C5DFA] focus:ring-[#7C5DFA]/40"}`
                                }
                            />
                        </div>
                    </div>
                    )}
                />
            </section>
        </>        
    )
}

export default BillFromSection;