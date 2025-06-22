import React from "react";
import { Control, Controller, FieldErrors } from 'react-hook-form'
// Update the import path below to the correct location of InvoiceFormValues if needed
import { InvoiceFormValues } from "../../pages/forms/CreateInvoice"; 

interface Props {
  control: Control<InvoiceFormValues>
  errors: FieldErrors<InvoiceFormValues>
}

const BillFromSection = ({ control, errors }: Props) => {
    return (
        <>
            <section className="space-y-2">
                <h2 className="mb-6 text-sm text-strong-purple font-bold uppercase">Bill From</h2>
                <Controller
                    control={control}
                    name="senderAddress.street"
                    defaultValue=""
                    rules={{ required: "Street is required" }}
                    render={({ field }) => (
                        <div>
                            <label className={`block mb-1 text-purple dark:text-gray-400 text-sm font-medium
                                ${errors.senderAddress?.street ? "text-red-500" : "text-gray-400"}
                            `}>
                                Street Address
                            </label>
                            <input
                                {...field}
                                className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50
                                ${errors.senderAddress?.street 
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                    : "dark:border-transparent focus:border-purple focus:ring-purple/40"
                                }`}
                            />
                        </div>
                    )}
                />
                <div className="mt-6 grid md:grid-cols-3 md:gap-4 space-y-6 md:space-y-0">
                    <Controller
                        control={control}
                        name="senderAddress.city"
                        defaultValue=""
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                            <div className="mt-6 space-x-2">
                                <div>
                                    <label className={`block mb-1 text-purple dark:text-gray-400 text-sm font-medium
                                        ${errors.senderAddress?.city ? "text-red-500" : "text-gray-400"}`}
                                    >
                                        City
                                    </label>
                                    <input
                                        {...field}
                                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50
                                        ${errors.senderAddress?.street 
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"}`
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
                        render={({ field }) => (
                        <div className="mt-6 space-x-2"> 
                            <div>
                                <label className={`block mb-1 text-purple dark:text-gray-400 text-sm font-medium
                                        ${errors.senderAddress?.postCode ? "text-red-500" : "text-gray-400"}`}
                                    >
                                    Post Code
                                </label>
                                <input
                                        {...field}
                                        className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50
                                        ${errors.senderAddress?.postCode
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                            : "dark:border-transparent focus:border-purple focus:ring-purple/40"}`
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
                        render={({ field }) => (
                        <div className="mt-6 space-x-2"> 
                            <div>
                                <label className={`block mb-1 text-purple dark:text-gray-400 text-sm font-medium
                                        ${errors.senderAddress?.country ? "text-red-500" : "text-gray-400"}`}
                                    >
                                    Country
                                </label>
                                <input
                                    {...field}
                                    className={`w-full px-6 py-5 text-md dark:bg-strong-blue dark:text-white font-bold rounded border-2 border-light-gray dark:focus:border-[#252945] focus:ring-2 dark:focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50
                                    ${errors.senderAddress?.country
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "dark:border-transparent focus:border-purple focus:ring-purple/40"}`
                                    }
                                />
                            </div>
                        </div>
                        )}
                    />
                </div>
            </section>
        </>        
    )
}

export default BillFromSection;