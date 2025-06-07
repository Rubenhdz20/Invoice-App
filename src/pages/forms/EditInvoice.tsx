import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useInvoiceStore, Invoice } from "../../store/InvoiceStore";
import GoBackButton from "../../components/buttons/GoBackButton";
import BillFromSection from "../../components/invoiceForms/BillFromSection";
import BillToSection from "../../components/invoiceForms/BillToSection";
import DateTermsSection from "../../components/invoiceForms/DateTermsSection";
import ItemsSection from "../../components/invoiceForms/ItemsSection";


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
            <form id="edit-invoice-form" onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-6 pb-20 space-y-6 dark:bg-dark-2">
                <GoBackButton/>
                <h1 className="text-2xl font-bold dark:text-white">Edit <span className="text-[#777F98]">#</span>{invoice.id}</h1>
                <BillFromSection control={control} errors={errors} />
                <BillToSection register={register} errors={errors} />
                <DateTermsSection register={register} errors={errors} />
                <ItemsSection control={control} register={register} errors={errors} />
            </form>
            <footer className="flex justify-center items-center px-6 py-4 space-x-4 bg-white-custom dark:bg-strong-blue">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-16 h-12 text-purple dark:text-white bg-card-gray dark:bg-light-blue rounded-3xl hover:bg-light-gray dark:hover:bg-white hover:text-[#7E88C3] cursor-pointer transition"
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
            </footer>
        </>
    )
}

export default EditInvoice;