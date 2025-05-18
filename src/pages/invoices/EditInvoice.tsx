import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { useInvoiceStore, Invoice } from "../../store/InvoiceStore";
import { formatCurrency } from "../../utils/formatCurrency";
import BillFromSection from "../../components/invoiceForms/BillFromSection";
import GoBackButton from "../../components/buttons/GoBackButton";

// We don’t edit id or status here, but we want status as a selectable field.
export type InvoiceFormValues = Omit<Invoice, 'id' | 'total' | 'status'>
& { status: Invoice['status'] };


const EditInvoice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const invoices = useInvoiceStore((s) => s.invoices);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
    const invoice = invoices.find((inv) => inv.id === id);

    const {
        register,
        control, 
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InvoiceFormValues>({
        defaultValues: invoice && {
            createdAt: invoice.createdAt,
            paymentDue: invoice.paymentDue,
            description: invoice.description,
            paymentTerms: invoice.paymentTerms,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            senderAddress: invoice.senderAddress,
            clientAddress: invoice.clientAddress,
            items: invoice.items,
            status: invoice.status
        }
    });

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

    useEffect(() => {
        if (invoice) reset(invoice)
    }, [invoice, reset])
    
    if (!invoice) {
        return (
            <div>
                <GoBackButton/>
                <p className="text-white p-6">Invoice not found</p>;
            </div>
        )
    }

    const onSubmit = (data: InvoiceFormValues) => {
        // Build a new items array where each item gets its computed total
        const itemsWithTotals = data.items.map(item => ({
            ...item,
            total: item.quantity * item.price,
        }));

        // Now compute the invoice total
        const invoiceTotal = itemsWithTotals.reduce((sum, i) => sum + i.total, 0);

        // Merge & save
        updateInvoice({
            ...invoice,
            ...data,
            items: itemsWithTotals,
            total: invoiceTotal,
        });
        navigate(`/invoice/${invoice.id}`);
        console.log("Invoice updated:", { ...invoice, ...data, items: itemsWithTotals, total: invoiceTotal });
    }
    

    return(
        <>
            <form id="edit-invoice-form" onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-6 pb-20 space-y-6 bg-[#141625]">
                <GoBackButton/>
                <h1 className="text-2xl font-bold text-white">Edit <span className="text-[#777F98]">#</span>{invoice.id}</h1>
                <BillFromSection control={control} errors={errors} />
                {/* // Bill TO Section  */}
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
                {/* Date & Terms Section */}
                <section className="space-y-2">
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Invoice Date</label>
                        <input
                            type="date"
                            {...register('createdAt', { required: true })}
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Payment Due</label>
                        <input
                            type="date"
                            {...register('paymentDue', { required: true })}
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                    <div>
                    <label className="block mt-6 mb-1 text-gray-400 text-sm">Payment Terms</label>
                        <select
                            {...register('paymentTerms', { valueAsNumber: true })}
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
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
                {/* Item List */}
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
                                            className="w-24 px-2 py-2 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
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
                                            className="w-28 px-2 py-2 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                                        />
                                    </div>
                                    {/* Total (read-only) */}
                                    <div>
                                        <label className="block text-gray-400 text-sm">Total</label>
                                        <input
                                            readOnly
                                            value={formatCurrency(total)}
                                            className="w-28 p-2 bg-[#1E2139] rounded text-white cursor-default"
                                        />
                                    </div>
                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className=" cursor-pointer"
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
                        onClick={() => append({ name: "", quantity: 1, price: 0 })}
                        className="w-full px-6 py-3 text-md bg-[#1E2139] text-white font-bold rounded-full cursor-pointer border-2 border-transparent hover:bg-white hover:text-[#7E88C3] transition"
                    >
                        + Add New Item
                    </button>
                </section>
            </form>
            {/* Footer Buttons */}
            <div className=" flex justify-center items-center px-6 py-4 space-x-4 bg-[#1E2139]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-16 h-12 text-white bg-[#252945] rounded-3xl cursor-pointer hover:bg-white hover:text-[#7E88C3] transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-invoice-form"
                        className="w-36 h-12 text-white bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition"
                    >
                        Save Changes
                    </button>
            </div>
        </>
    )
}

export default EditInvoice;