import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useInvoiceStore, Invoice } from "../../store/InvoiceStore";
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

    const watchedItems = useWatch({
        control,
        name: "items",          // watch the entire array once
        defaultValue: fields,   // initial values come from your fields
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
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-6 pb-20 space-y-6 bg-[#141625]">
                <GoBackButton/>
                <h1 className="text-2xl font-bold text-white">Edit <span className="text-[#777F98]">#</span>{invoice.id}</h1>
                {/* // Bill FROM Section  */}
                <section className="space-y-2">
                    <h2 className="mb-6 text-sm text-[#7C5DFA] font-bold uppercase">Bill From</h2>
                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">Street Address</label>
                        <input 
                            type="text" 
                            {...register('senderAddress.street', {required: true})} 
                            placeholder="Street Address" 
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
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
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Country</label>
                        <input
                            {...register('senderAddress.country', { required: true })}
                            placeholder="Country"
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                </section>
                {/* // Bill TO Section  */}
                <section className="space-y-2">
                    <h2 className="mb-6 text-sm text-[#7C5DFA] font-bold uppercase">Bill To</h2>
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Client’s Name</label>
                        <input
                            {...register('clientName', { required: true })}
                            placeholder="Client’s Name"
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Client’s Email</label>
                        <input
                            {...register('clientEmail', { required: true })}
                            placeholder="Client’s Email"
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Street Address</label>
                        <input
                            {...register('clientAddress.street', { required: true })}
                            placeholder="Street Address"
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
                        />
                    </div>
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
                    <div>
                        <label className="block mt-6 mb-1 text-gray-400 text-sm">Country</label>
                        <input
                            {...register('senderAddress.country', { required: true })}
                            placeholder="Country"
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
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
                        <label className="block mb-1 text-gray-400 text-sm">Project / Description</label>
                        <input
                            {...register('description', { required: true })}
                            placeholder="e.g. Website redesign"
                            className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
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
                                <label className="block mb-2 text-sm text-gray-400">Item Name</label>
                                <input
                                {...register(`items.${index}.name` as const, { required: true })}
                                className="w-full px-6 py-5 text-md bg-[#1E2139] text-white font-bold rounded border-2 border-transparent focus:border-[#252945] focus:ring-2 focus:ring-[#252945]/50 outline-none transition focus:placeholder-opacity-50 caret-[#7C5DFA]"
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
                                        type="text"
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
                        className="w-36 h-12 text-white bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition"
                    >
                        Save Changes
                    </button>
                </div>
        </div>
    )
}

export default EditInvoice;