import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useInvoiceStore, Invoice } from "../../context/InvoiceStore";
import { formatCurrency } from "../../utils/formatCurrency";
import GoBackButton from "../../components/buttons/GoBackButton";

// We don’t edit id or status here, but we want status as a selectable field.
type InvoiceFormValues = Omit<Invoice, 'id' | 'total' | 'status'>
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

    useEffect(() => {
        if (invoice) {
          reset({
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
          });
        }
    }, [invoice, reset]);
    
    if (!invoice) {
        return (
            <div>
                <GoBackButton/>
                <p className="text-white p-6">Invoice not found</p>;
            </div>
        )
    }

    const onSubmit = (data: InvoiceFormValues) => {
        // Recalculate the invoice’s total from the line items:
        const total = data.items.reduce((sum, item) => sum + Number(item.total), 0);
        // Merge the edited form data back onto the original invoice object,
        // including the newly computed total, then tell Zustand to update it
        updateInvoice({ ...invoice, ...data, total });
        navigate(`/invoice/${invoice.id}`);
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-6 space-y-6 bg-[#141625]">
            <GoBackButton/>
            <h1 className="text-2xl font-bold text-white">Edit <span className="text-[#777F98]">#</span>{invoice.id}</h1>
            {/* // Bill FROM Section  */}
            <section className="space-y-2">
                <h2 className="mb-6 text-sm text-[#7C5DFA] font-bold uppercase">Bill From</h2>
                <label className="block mb-1 text-gray-400 text-sm">Street Address</label>
                <input 
                    type="text" 
                    {...register('senderAddress.street', {required: true})} 
                    placeholder="Street Address" 
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
                <div className="flex mt-6 space-x-2">
                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">City</label>
                        <input 
                            {...register('senderAddress.city', {required: true})} 
                            placeholder="City"
                            className="px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">Post Code</label>
                        <input 
                            {...register('senderAddress.postCode', {required: true})} 
                            placeholder="Post Code"
                            className="px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                </div>
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Country</label>
                <input
                    {...register('senderAddress.country', { required: true })}
                    placeholder="Country"
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
            </section>
            {/* // Bill TO Section  */}
            <section className="space-y-2">
                <h2 className="mb-6 text-sm text-[#7C5DFA] font-bold uppercase">Bill To</h2>
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Client’s Name</label>
                <input
                    {...register('clientName', { required: true })}
                    placeholder="Client’s Name"
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Client’s Email</label>
                <input
                    {...register('clientEmail', { required: true })}
                    placeholder="Client’s Email"
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Street Address</label>
                <input
                    {...register('clientAddress.street', { required: true })}
                    placeholder="Street Address"
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
                <div className="flex mt-6 space-x-2">
                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">City</label>
                        <input 
                            {...register('senderAddress.city', {required: true})} 
                            placeholder="City"
                            className="px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">Post Code</label>
                        <input 
                            {...register('senderAddress.postCode', {required: true})} 
                            placeholder="Post Code"
                            className="px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                </div>
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Country</label>
                <input
                    {...register('senderAddress.country', { required: true })}
                    placeholder="Country"
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
            </section>
            {/* Date & Terms Section */}
            <section className="space-y-2">
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Invoice Date</label>
                <input
                    type="date"
                    {...register('createdAt', { required: true })}
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
                <label className="block mt-6 mb-1 text-gray-400 text-sm">Payment Due</label>
                <input
                    type="date"
                    {...register('paymentDue', { required: true })}
                    className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                />
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
                <label className="block mb-1 text-gray-400 text-sm">Project / Description</label>
                <input
                    {...register('description', { required: true })}
                    placeholder="e.g. Website redesign"
                    className="w-full p-2 bg-[#1E2139] rounded text-white"
                />
            </section>
            {/* Item List */}
            <section className="space-y-4">
                <h2 className="text-gray-400 text-lg font-semibold">Item List</h2>
                {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-6 gap-2 items-end">
                    <div className="col-span-2">
                        <label className="block text-gray-400 text-sm">Item Name</label>
                        <input
                            {...register(`items.${index}.name` as const, { required: true })}
                            className="w-full p-2 bg-[#1E2139] rounded text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm">Qty.</label>
                        <input
                            type="number"
                            {...register(`items.${index}.quantity` as const, { valueAsNumber: true, required: true })}
                            className="w-full p-2 bg-[#1E2139] rounded text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.price` as const, { valueAsNumber: true, required: true })}
                            className="w-full p-2 bg-[#1E2139] rounded text-white"
                        />
                    </div>
                    <div className="col-span-1 flex flex-col">
                        <label className="block text-gray-400 text-sm">Total</label>
                        <p className="p-2 bg-[#1E2139] rounded text-gray-400">
                            {formatCurrency(fields[index].quantity * fields[index].price)}
                        </p>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-400"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                ))}
                <button
                    type="button"
                    onClick={() => append({ name: '', quantity: 1, price: 0, total: 0 })}
                    className="w-full p-3 bg-[#252945] text-[#DFE3FA] font-bold rounded"
                >
                + Add New Item
                </button>
            </section>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-[#252945] text-white rounded-3xl"
                >
                Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-[#7C5DFA] text-white rounded-3xl"
                >
                Save Changes
                </button>
            </div>
        </form>
    )
}

export default EditInvoice;